import ClientStorage from '@/entities/ClientStorage';
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const isSideBarVisible = ref(false); // side bar is closed by default
const isDarkThemeEnabled = ref(ClientStorage.hasItem('isDarkThemeEnabled'));

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
      ClientStorage.setItem('isSideBarVisible', isOpened); // remember user's choice
    },
    toggleAppTheme: () => {
      isDarkThemeEnabled.value = !isDarkThemeEnabled.value;
      ClientStorage.setItem('isDarkThemeEnabled', isDarkThemeEnabled.value);
    },

    isSideBarVisible,
    isDarkThemeEnabled,
  };
};
