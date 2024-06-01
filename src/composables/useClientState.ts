import { SIDE_BAR_VISIBILITY_KEY } from '@/constants';
import ClientStorage from '@/entities/ClientStorage';
import { ref } from 'vue';
import { useClientSettings } from './useClientSettings';

const isSideBarVisible = ref<boolean>(
  Boolean(ClientStorage.getItem(SIDE_BAR_VISIBILITY_KEY)),
);

export const useClientState = () => {
  const clientSettings = useClientSettings();

  return {
    toggleSideBar: (isOpened: boolean) => {
      isSideBarVisible.value = isOpened;
      clientSettings.saveSideBarVisibility(isOpened); //remember user's choice
    },
    isSideBarVisible,
  };
};
