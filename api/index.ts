// IN ORDER TO MAKE VITE WORK ON VERCEL WITH NODE SERVERLESS RUNTIME, EVERYTHING SHOULD BE PLACED IN ONE FILE
// - import doesn't work only require with local modules
// 1. https://stackoverflow.com/a/73887330/15032782
// 2. https://github.com/orgs/vercel/discussions/1007#discussioncomment-5420164
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { CloudantV1 } from '@ibm-cloud/cloudant';
import Fastify, { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import open from 'open';
import { join } from 'path';
import destroyer from 'server-destroy';
import { google } from 'googleapis';

// constants - can't be imported outside the api directory
const CONFIG_DIRPATH = join(__dirname, 'config');
const SERVER_PORT = Number(process.env.PORT || 3005);
const API_VERSION = process.env.API_VERSION || 'v1';
const IS_PROD = process.env.NODE_ENV === 'production';
const CLOUDANT_USERS_DB_NAME = 'users';

const appConfig = (() => {
  if (IS_PROD) {
    // TODO use Vercel env variables
    throw Error("PROD environment haven't configured");
  }

  const google = JSON.parse(
    readFileSync(
      join(CONFIG_DIRPATH, 'google-oauth2.local.keys.json'),
      'utf-8',
    ),
  );
  const cloudant = JSON.parse(
    readFileSync(join(CONFIG_DIRPATH, 'cloudant.local.json'), 'utf-8'),
  );

  return {
    google,
    cloudant,
  };
})();

// plugins
const registerPlugins = (app: FastifyInstance) => {
  app.register(cors, { origin: true, credentials: true });
  app.register(cookie, { secret: 'super-duper-secret-hash-value' });
};

// hooks
const addHooks = (app: FastifyInstance) => {
  app.addHook('onRoute', (routeOpts) => {
    // prepend prefix with versioned API to the each endpoint
    routeOpts.url = join('/api', `${API_VERSION}`, routeOpts.url);
  });
};

// storages
const cloudant = CloudantV1.newInstance({
  disableSslVerification: !IS_PROD,
  authenticator: new IamAuthenticator({
    disableSslVerification: !IS_PROD,
    apikey: appConfig.cloudant.apikey,
  }),
  serviceUrl: appConfig.cloudant.url,
});

// controllers
const useAuthEndpoints = (app: FastifyInstance) => {
  app
    .post('/login', async (req, reply) => {
      reply.send('COOL!!!!');
    })
    .get<{ Querystring: { code: string } }>('/login', (req, reply) => {
      app.log.info(req.query.code);
      reply.send('OK');
    });
};

// create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
// which should be downloaded from the Google Developers Console.
// const oAuth2Client = new OAuth2Client({
//   clientId: appConfig.google.web.client_id,
//   clientSecret: appConfig.google.web.client_secret,
//   redirectUri: appConfig.google.web.redirect_uris[0],
// });

const oAuth2Client = new google.auth.OAuth2({
  clientId: appConfig.google.web.client_id,
  clientSecret: appConfig.google.web.client_secret,
  redirectUri: appConfig.google.web.redirect_uris[0],
});

// Generate the url that will be used for the consent dialog.
const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  // include_granted_scopes: true,
  scope: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
});

const useGoogleAuthEndpoints = (app: FastifyInstance) => {
  app
    .post('/google/login', async (req, reply) => {
      app.log.info('GOOGLE AUTH');

      // const cp = await open(authorizeUrl, { wait: true });
      // app.log.info(`cp: ${JSON.stringify(cp, null, 2)}`);
      // cp.unref();
      reply.status(301);
      reply.redirect(authorizeUrl);
    })
    .get<{ Querystring: { code: string; scope: string } }>(
      '/google/oauth2callback',
      async (req, reply) => {
        app.log.info(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
        // Now that we have the code, use that to acquire tokens.
        const tokenResponse = await oAuth2Client.getToken(req.query.code);
        oAuth2Client.setCredentials(tokenResponse.tokens);
        app.log.info(
          `Tokens acquired ${JSON.stringify(tokenResponse, null, 2)}`,
        );

        const redirectURL = new URL(
          IS_PROD
            ? `${req.protocol}://${req.ip}/profile`
            : 'http://localhost:3000/profile',
        );
        // TODO save `refresh_token` for the further `access_token` refresh
        redirectURL.searchParams.set(
          'access_token',
          oAuth2Client.credentials.access_token!,
        );
        redirectURL.searchParams.set(
          'expiry_date',
          String(oAuth2Client.credentials.expiry_date),
        );
        redirectURL.searchParams.set(
          'token_type',
          String(oAuth2Client.credentials.token_type),
        );

        const ticket = await oAuth2Client.verifyIdToken({
          idToken: oAuth2Client.credentials.id_token!,
          audience: appConfig.google.web.client_id,
        });
        const payload = ticket.getPayload();
        app.log.info(`payload: ${JSON.stringify(payload)}`);
        // ? HOW TO VERIFY/CONFIRM THE USER LATER WHEN REFRESH TOKEN?
        // await cloudant.postDocument({
        //   db: CLOUDANT_USERS_DB_NAME,
        //   document: {
        //     email: payload?.email,
        //     refresh_token: oAuth2Client.credentials.refresh_token,
        //   },
        // });
        reply.redirect(redirectURL.toString());
      },
    )
    // TODO refresh google token
    .post<{ Body: { accessToken: string } }>(
      '/google/exchange-token',
      async (req, reply) => {
        const { accessToken } = req.body;

        try {
          const ticket = await oAuth2Client.verifyIdToken({
            idToken: accessToken, // ! probably wrong type
            audience: appConfig.google.web.client_id,
          });
          const payload = ticket.getPayload();

          if (!payload) {
            reply.status(404).send('The user is not found');
            return;
          }

          app.log.info(`payload: ${JSON.stringify(payload)}`);
          const userEmail = payload['email'];
          app.log.info(`userEmail: ${userEmail}`);

          const { tokens } = await oAuth2Client.getToken({
            code: accessToken,
            redirect_uri: appConfig.google.web.redirect_uris[0],
          });
          app.log.info(`tokens: ${tokens}`);

          reply.send(tokens); // TODO send only access token
        } catch (error) {
          reply.status(400).send({ error: 'Invalid ID token' });
        }
      },
    );
};

const useControllers = (app: FastifyInstance) => {
  const controllers = [useAuthEndpoints, useGoogleAuthEndpoints];
  controllers.forEach((useControllers) => useControllers(app));
};

// wrapping all up
const getServer = () => {
  const app = Fastify({
    trustProxy: true,
    logger: IS_PROD
      ? true
      : {
          // use 'pino-pretty' only during development
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        },
  });

  registerPlugins(app);
  addHooks(app);

  app.after(() => {
    // apply routes after all preparation are done
    useControllers(app);
  });

  return app;
};

const server = getServer();

// Run the server!
server.listen({ port: SERVER_PORT }, function (err) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
