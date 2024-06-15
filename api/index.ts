// IN ORDER TO MAKE VITE WORK ON VERCEL, EVERYTHING SHOULD BE PLACED IN ONE FILE
// - import doesn't work only require with local modules
// 1. https://stackoverflow.com/a/73887330/15032782
// 2. https://github.com/orgs/vercel/discussions/1007#discussioncomment-5420164
import cors from '@fastify/cors';
import Fastify, { FastifyInstance } from 'fastify';
import { join } from 'path';

// constants - can't be imported outside the api directory
const SERVER_PORT = Number(process.env.PORT || 3005);
const API_VERSION = process.env.API_VERSION || 'v1';
const IS_PROD = process.env.NODE_ENV === 'production';

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
  app.post('/login', async (req, reply) => {
    reply.send('COOL!!!!');
  });
};

const useControllers = (app: FastifyInstance) => {
  const controllers = [useAuthEndpoints];
  controllers.forEach((useControllers) => useControllers(app));
};

// wrapping all up
const getServer = () => {
  const app = Fastify({
    logger: IS_PROD
      ? true
      : {
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
