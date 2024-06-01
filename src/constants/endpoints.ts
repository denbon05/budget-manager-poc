const API_VERSION = 'v1';

const buildEndpointVersioned = (endpoint: string) =>
  `/api/${API_VERSION}/${endpoint}`;

const expensesEndpoint = buildEndpointVersioned('expenses');
const earningsEndpoint = buildEndpointVersioned('earnings');

export { earningsEndpoint, expensesEndpoint };
