<script setup lang="ts">
import { ref } from 'vue';
// import CategoryGroup from './CategoryGroup.vue';
// preferences: start & end month time, currency

const opened = ref<string[]>([]);

// const categories = [
//   // {key: 'preferences', icon: ''}
// ];
</script>

<template>
  <v-list v-model:opened="opened"> </v-list>
</template>
