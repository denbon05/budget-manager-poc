import { API_VERSION, LOCAL_SERVER_PORT } from '@/constants';
import Axios from 'axios';

export const apiProxied = Axios.create({
  baseURL: new URL(import.meta.url).origin,
});

export const api = Axios.create({
  baseURL: import.meta.env.PROD
    ? `/api/${API_VERSION}`
    : `${import.meta.url}:${LOCAL_SERVER_PORT}/api/${API_VERSION}`,
});
