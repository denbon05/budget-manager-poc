import Guest from '@/entities/Guest';
import type { IPerson } from '@/types/account';
import { reactive } from 'vue';

// TODO
const user = reactive<IPerson>(new Guest());

export const useUser = () => {
  return user;
};
