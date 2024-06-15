export const API_VERSION = 'v1';
export const API_PROXIED_VERSION = 'v1';
export const LOCAL_SERVER_PORT = 3005;

// build endpoints' URIs for reusing them
const buildEndpointVersioned = (endpoint: string) =>
  `/api-proxied/${API_PROXIED_VERSION}/${endpoint}`;

const expensesEndpoint = buildEndpointVersioned('expenses');
const earningsEndpoint = buildEndpointVersioned('earnings');

export { earningsEndpoint, expensesEndpoint };
