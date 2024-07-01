<script setup lang="ts">
import { refreshGoogleToken } from '@/api/auth';
// import { initGDriveAppFolder } from '@/api/google-drive';
</script>

<template>
  <v-btn @click="refreshGoogleToken">TEST</v-btn>
</template>
