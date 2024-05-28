import type { Method } from 'axios';
import { expenses as expensesEndpoint } from '../constants/endpoints';
import { createExpense, fetchExpenses } from './uri-controllers';
import { prependHTTPMethod } from './utils';

const controllerByURI = new Map([
  [prependHTTPMethod('post', expensesEndpoint), createExpense],
  [prependHTTPMethod('get', expensesEndpoint), fetchExpenses],
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
  uriController!(event);
};

export default mapToURIController;
