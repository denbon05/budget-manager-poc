<script setup lang="ts">
import NavBar from '@/components/nav-bar/NavBar.vue';
import SideBar from '@/components/side-bar/SideBar.vue';
import { onBeforeUnmount, provide, reactive, ref } from 'vue';
import SnackNotification from './components/common/SnackNotification.vue';
import DelayedQueue from './entities/DelayedQueue';
import type { SnackNotificationOpts } from './types/notifications';
import { useUser } from './composables/useUser';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = useUser();

const isSnackBarVisible = ref(false);
const snackNotificationOpts = reactive<SnackNotificationOpts>({
  text: '',
});

const snack = ref<InstanceType<typeof SnackNotification>>();

// provide access to the notifications from the root component to all children
provide<(opts: SnackNotificationOpts) => void>('showSnackbar', (opts) => {
  Object.assign(snackNotificationOpts, opts);
  isSnackBarVisible.value = true;
});

onBeforeUnmount(async () => {
  // execute all delayed functions
  await DelayedQueue.executeAllNow();
});
</script>

<template>
  <v-layout class="rounded rounded-md">
    <SnackNotification
      ref="snack"
      v-model="isSnackBarVisible"
      :text="snackNotificationOpts.text"
      :color="snackNotificationOpts.color"
      :close-text="snackNotificationOpts.closeText"
      :on-close-action="snackNotificationOpts.onCloseAction"
    />

    <NavBar />

    <SideBar />

    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
