import { api } from './init';

export const loginWithGoogleAccount = async () => {
  // console.log('api', api.getUri());
  await api.post('/google/login');
};
