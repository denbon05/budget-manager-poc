import { SIDE_BAR_VISIBILITY_KEY } from '@/constants';
import ClientStorage from '@/entities/ClientStorage';

export const useClientSettings = () => {
  return {
    saveSideBarVisibility: (value: boolean) => {
      ClientStorage.setItem(SIDE_BAR_VISIBILITY_KEY, value);
    },
  };
};
