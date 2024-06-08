<script setup lang="ts">
import { UNDO_DELAY_IN_SECONDS } from '@/constants';
import type { SnackNotificationOpts } from '@/types/notifications';

const isVisible = defineModel<boolean>();

// don't use destructuring due to reactivity loss
const props = defineProps<SnackNotificationOpts>();

const close = () => {
  if (props.onCloseAction) {
    props.onCloseAction();
  }
  isVisible.value = false;
};
</script>

<template>
  <v-snackbar
    :timeout="UNDO_DELAY_IN_SECONDS * 1000"
    :color="color"
    v-model="isVisible"
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn variant="text" @click="close"> {{ closeText }} </v-btn>
    </template>
  </v-snackbar>
</template>
