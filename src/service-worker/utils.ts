import type { Method } from 'axios';

/** Helper function to read request body */
export const readRequestBody = async <T>(
  request: FetchEvent['request'],
): Promise<T> => {
  const contentType = request.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await request.json();
  } else {
    throw new Error(`Invalid content type: "${contentType}"`);
  }
};

export const prependHTTPMethod = (method: Method, endpoint: string) =>
  `${method.toLowerCase()}${endpoint}`;
