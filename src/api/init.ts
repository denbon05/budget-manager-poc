import Axios from 'axios';

export const axios = Axios.create({ baseURL: new URL(import.meta.url).origin });
