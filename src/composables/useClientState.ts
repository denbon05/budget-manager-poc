import { SIDE_BAR_VISIBILITY_KEY } from '@/constants';
import ClientStorage from '@/entities/ClientStorage';
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const isSideBarVisible = ref<boolean>(false); // side bar is closed by default

export const useClientState = () => {
  const { lgAndUp } = useDisplay();
  watch(lgAndUp, (isLgAndUp) => {
    if (isLgAndUp) {
      // open side bar
      isSideBarVisible.value = true;
    }
  });

  return {
    toggleSideBar: (isOpened: boolean) => {
      isSideBarVisible.value = isOpened;
      ClientStorage.setItem(SIDE_BAR_VISIBILITY_KEY, isOpened); //remember user's choice
    },
    isSideBarVisible,
  };
};
