import { api } from './init';

export const login = async () => {
  const res = await api.post('login');
  console.log('login res', res);
};
