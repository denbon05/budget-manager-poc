import ClientStorage from '@/entities/ClientStorage';
import { LocalStorageKeys } from '@/types/storage';
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const isSideBarVisible = ref(false); // side bar is closed by default
const isDarkThemeEnabled = ref(
  ClientStorage.hasItem(LocalStorageKeys.IS_DARK_THEME_ENABLED),
);

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
      ClientStorage.setItem(LocalStorageKeys.SIDE_BAR_VISIBILITY, isOpened); // remember user's choice
    },
    toggleAppTheme: () => {
      isDarkThemeEnabled.value = !isDarkThemeEnabled.value;
      ClientStorage.setItem(
        LocalStorageKeys.IS_DARK_THEME_ENABLED,
        isDarkThemeEnabled.value,
      );
    },

    isSideBarVisible,
    isDarkThemeEnabled,
  };
};
