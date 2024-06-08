import { SIDE_BAR_VISIBILITY_KEY } from '@/constants';
import ClientStorage from '@/entities/ClientStorage';
import { ref } from 'vue';

const isSideBarVisible = ref<boolean>(false); // side bar is closed by default

export const useClientState = () => {
  return {
    toggleSideBar: (isOpened: boolean) => {
      isSideBarVisible.value = isOpened;
      ClientStorage.setItem(SIDE_BAR_VISIBILITY_KEY, isOpened); //remember user's choice
    },
    isSideBarVisible,
  };
};
