import ClientStorage from '@/entities/ClientStorage';
import { api } from './init';

export const loginWithGoogleAccount = async () => {
  // console.log('api', api.getUri());
  await api.post('/google/login');
};

export const refreshGoogleToken = async () => {
  // ! doesn't work
  await api.post('/google/exchange-token', {
    accessToken: ClientStorage.getItem('google')?.access_token,
  });
};
