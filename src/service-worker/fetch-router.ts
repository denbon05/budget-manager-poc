import {
  ENDPOINT_HANDLER_DELAY_MS,
  ENDPOINT_HANDLER_FACTOR,
  ENDPOINT_HANDLER_MAX_ATTEMPTS,
} from '@/constants';
import { retry } from '@lifeomic/attempt';
import type { Method } from 'axios';
import { earningsEndpoint, expensesEndpoint } from '../constants/endpoints';
import {
  createEarning,
  deleteEarning,
  fetchEarnings,
  updateEarning,
} from './controllers/earnings';
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from './controllers/expenses';
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

/** Intercept requests and route to a specific endpoint handler */
const mapToURIController = (event: FetchEvent) => {
  const url = new URL(event.request.url);
  const { method } = event.request;
  const controllerKey = prependHTTPMethod(method as Method, url.pathname);
  const shouldURIBeIntercepted =
    url.pathname.startsWith('/api-proxied') &&
    !controllerByURI.has(controllerKey);

  if (shouldURIBeIntercepted && !import.meta.env.PROD) {
    // show non-intercepted routes while developing
    console.warn(
      `URI doesn't intercepted in SW: "${method}" "${url.pathname}"`,
    );
  }

  if (!controllerByURI.has(controllerKey)) {
    // Let the network handle these requests
    return;
  }

  // TODO refresh token if expire soon

  const handleInterceptedEndpoint = controllerByURI.get(controllerKey);
  event.respondWith(
    retry(() => handleInterceptedEndpoint!(event), {
      maxAttempts: ENDPOINT_HANDLER_MAX_ATTEMPTS,
      delay: ENDPOINT_HANDLER_DELAY_MS,
      factor: ENDPOINT_HANDLER_FACTOR,
      handleError: (ctx, err) => {
        console.warn(
          `${err.attemptNum} attempt to handle the request on path "${url.pathname}"`,
        );
      },
    }).catch((err) => {
      console.error('WS endpoint controller error', err);
      return new Response(err.message, {
        headers: { 'Content-Type': 'application/json' },
        status: 400, // TODO err.name === 'ConstraintError' ? 400 : 500,
      });
    }),
  );
};

export default mapToURIController;
