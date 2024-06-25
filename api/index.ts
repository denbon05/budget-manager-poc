// IN ORDER TO MAKE VITE WORK ON VERCEL WITH NODE SERVERLESS RUNTIME, EVERYTHING SHOULD BE PLACED IN ONE FILE
// - import doesn't work only require with local modules
// 1. https://stackoverflow.com/a/73887330/15032782
// 2. https://github.com/orgs/vercel/discussions/1007#discussioncomment-5420164
import cors from '@fastify/cors';
import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { readFileSync } from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import open from 'open';
import { join } from 'path';

// constants - can't be imported outside the api directory
const CONFIG_DIRPATH = join(__dirname, 'config');
const SERVER_PORT = Number(process.env.PORT || 3005);
const API_VERSION = process.env.API_VERSION || 'v1';
const IS_PROD = process.env.NODE_ENV === 'production';

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
  app.register(cors);
};

// hooks
const addHooks = (app: FastifyInstance) => {
  app.addHook('onRoute', (routeOpts) => {
    // prepend prefix with versioned API to the each endpoint
    routeOpts.url = join('/api', `${API_VERSION}`, routeOpts.url);
  });
};

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
const oAuth2Client = new OAuth2Client({
  clientId: appConfig.google.web.client_id,
  clientSecret: appConfig.google.web.client_secret,
  redirectUri: appConfig.google.web.redirect_uris[0],
});

export interface IClient {
  response: FastifyReply;
  googleCredentials?: Credentials;
}

const useGoogleAuthEndpoints = (app: FastifyInstance) => {
  app
    .post('/google/login', async (req, reply) => {
      app.log.info('GOOGLE AUTH');
      // Generate the url that will be used for the consent dialog.
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/drive',
      });

      const cp = await open(authorizeUrl, { wait: false });
      cp.unref();
      reply.send('OK');
    })
    .get<{ Querystring: { code: string; scope: string } }>(
      '/google/oauth2callback',
      async (req, reply) => {
        // Now that we have the code, use that to acquire tokens.
        const tokenResponse = await oAuth2Client.getToken(req.query.code);
        oAuth2Client.setCredentials(tokenResponse.tokens);
        app.log.info(
          `Tokens acquired ${JSON.stringify(tokenResponse, null, 2)}`,
        );
        app.log.info(
          `oAuth2Client.credentials ${JSON.stringify(oAuth2Client.credentials, null, 2)}`,
        );

        if (oAuth2Client.credentials.access_token) {
          const tokenInfo = await oAuth2Client.getTokenInfo(
            oAuth2Client.credentials.access_token,
          );
          app.log.info(`tokenInfo ${JSON.stringify(tokenInfo, null, 2)}`);
        }

        app.log.info(`headers ${JSON.stringify(req.headers, null, 2)}`);
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
        reply.redirect(redirectURL.toString());
      },
    );
  // TODO refresh google token - cron job?
  // .post<{ Body: { idToken: string } }>(
  //   '/google/exchange-token',
  //   async (req, res) => {
  //     const { idToken } = req.body;

  //     try {
  //       const ticket = await oAuth2Client.verifyIdToken({
  //         idToken,
  //         audience: keys.web.client_id,
  //       });
  //       const payload = ticket.getPayload();
  //       app.log.info(`payload: ${JSON.stringify(payload)}`);
  //       const userid = payload['sub'];
  //       app.log.info(`userid: ${userid}`);

  //       const { tokens } = await oAuth2Client.getToken({
  //         code: idToken,
  //         redirect_uri: keys.web.redirect_uris[0],
  //       });
  //       app.log.info(`tokens: ${tokens}`);

  //       res.send(tokens);
  //     } catch (error) {
  //       res.status(400).send({ error: 'Invalid ID token' });
  //     }
  //   },
  // );
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
