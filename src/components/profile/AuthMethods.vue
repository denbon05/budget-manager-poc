<script setup lang="ts">
import googleLogoPNG from '@/assets/images/Logo-google-icon-25x25.png';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const { xs } = useDisplay();

const btnSize = computed(() => (xs.value ? 'x-small' : 'small'));
const btnWidth = computed(() => (xs.value ? 200 : 250));
// TODO authentication
</script>

<template>
  <div class="d-flex flex-column">
    <v-list-item class="d-flex justify-center">
      <v-btn :size="btnSize" :width="btnWidth" variant="outlined">{{
        $t('actions.auth.loginOrCreateAccount')
      }}</v-btn>
    </v-list-item>
    <v-list-item class="d-flex justify-center">
      <v-btn :size="btnSize" :width="btnWidth" variant="outlined">
        <div class="w-100 d-flex justify-space-between align-center">
          <v-img
            width="18"
            :src="googleLogoPNG"
            alt="Google logo"
            class="mx-1"
          />
          <span>{{ $t('actions.auth.loginWithGoogle') }}</span>
        </div>
      </v-btn>
    </v-list-item>
  </div>
</template>
