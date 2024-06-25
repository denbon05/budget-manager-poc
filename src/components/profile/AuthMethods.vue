<script setup lang="ts">
import { loginWithGoogleAccount } from '@/api/auth';
import { initGDriveAppFolder } from '@/api/google-drive';
import googleLogoPNG from '@/assets/images/Logo-google-icon-25x25.png';
import { user } from '@/composables/useUser';
import type { SnackNotificationOpts } from '@/types/notifications';
import { computed, inject } from 'vue';
import { useDisplay } from 'vuetify';

const { xs } = useDisplay();

const btnWidth = computed(() => (xs.value ? 200 : 250));

const showSnackbar = inject<(opts: SnackNotificationOpts) => void>(
  'showSnackbar',
  () => null,
);

// TODO error handling
const loginWithGoogle = async () => {
  try {
    await loginWithGoogleAccount();
    await initGDriveAppFolder();
  } catch (err) {
    console.error('GOOGLE AUTH ERR', err);
    showSnackbar({ text: 'GOOGLE AUTH ERR' });
    user.logOut();
  }
};
</script>

<template>
  <div class="d-flex flex-column">
    <v-list-item class="d-flex justify-center">
      <v-btn
        size="small"
        :width="btnWidth"
        variant="outlined"
        @click="loginWithGoogle"
      >
        <div class="w-100 d-flex justify-space-between align-center">
          <v-img
            width="16"
            :src="googleLogoPNG"
            alt="Google logo"
            class="mx-1"
          />
          <span>
            {{ $t('actions.auth.loginWithGoogle') }}
          </span>
        </div>
      </v-btn>
    </v-list-item>
  </div>
</template>
