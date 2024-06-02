import type { Method } from 'axios';
import { earningsEndpoint, expensesEndpoint } from '../constants/endpoints';
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from './controllers/expenses';
import {
  fetchEarnings,
  createEarning,
  updateEarning,
  deleteEarning,
} from './controllers/earnings';
import { prependHTTPMethod } from './utils';

/** Handlers designed for specific URIs within Service Worker */
const controllerByURI = new Map([
  // expenses
  [prependHTTPMethod('post', expensesEndpoint), createExpense],
  [prependHTTPMethod('get', expensesEndpoint), fetchExpenses],
  [prependHTTPMethod('patch', expensesEndpoint), updateExpense],
  [prependHTTPMethod('delete', expensesEndpoint), deleteExpense],
  // earnings
  [prependHTTPMethod('get', earningsEndpoint), fetchEarnings],
  [prependHTTPMethod('post', earningsEndpoint), createEarning],
  [prependHTTPMethod('patch', earningsEndpoint), updateEarning],
  [prependHTTPMethod('delete', earningsEndpoint), deleteEarning],
]);

/** Intercept requests to a specific endpoint */
const mapToURIController = (event: FetchEvent) => {
  const url = new URL(event.request.url);
  const { method } = event.request;
  const controllerKey = prependHTTPMethod(method as Method, url.pathname);
  const shouldURIBeIntercepted =
    url.pathname.startsWith('/api') && !controllerByURI.has(controllerKey);

  if (shouldURIBeIntercepted && !import.meta.env.PROD) {
    // show non-intercepted routes while developing
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
