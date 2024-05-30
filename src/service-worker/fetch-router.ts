import type { Method } from 'axios';
import { expenses as expensesEndpoint } from '../constants/endpoints';
import { createExpense, fetchExpenses, updateExpense } from './uri-controllers';
import { prependHTTPMethod } from './utils';

const controllerByURI = new Map([
  [prependHTTPMethod('post', expensesEndpoint), createExpense],
  [prependHTTPMethod('get', expensesEndpoint), fetchExpenses],
  [prependHTTPMethod('patch', expensesEndpoint), updateExpense],
]);

/** Intercept requests to a specific endpoint */
const mapToURIController = (event: FetchEvent) => {
  const url = new URL(event.request.url);
  const { method } = event.request;
  const controllerKey = prependHTTPMethod(method as Method, url.pathname);
  const shouldURIBeIntercepted =
    url.pathname.startsWith('/api') && !controllerByURI.has(controllerKey);

  if (shouldURIBeIntercepted && !import.meta.env.PROD) {
    console.warn(
      `URI doesn't intercepted in SW:\nURI "${url.pathname}"\nMethod "${method}"`,
    );
  }

  if (!controllerByURI.has(controllerKey)) {
    // skip unhandled requests
    return;
  }

  const uriController = controllerByURI.get(controllerKey);
  event.respondWith(
    uriController!(event).catch((err) => {
      console.error('WS endpoint controller error', err);
      return new Response(err.message, {
        headers: { 'Content-Type': 'application/json' },
        status: 400, // TODO err.name === 'ConstraintError' ? 400 : 500,
      });
    }),
  );
};

export default mapToURIController;
