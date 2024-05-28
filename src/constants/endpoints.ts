import { API_VERSION } from '.';

const buildEndpointVersioned = (endpoint: string) =>
  endpoint.replace(/(?<=api)/, `/${API_VERSION}`);

const expenses = buildEndpointVersioned('/api/expenses');

export { expenses };
