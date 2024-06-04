<script setup lang="ts">
import type { CategoryGroupItem } from '@/types/profile-settings';
import { ref } from 'vue';

const { name, items } = defineProps<{
  name: string;
  items: CategoryGroupItem[];
}>();
</script>

<template>
  <v-list-group :value="name">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        prepend-icon="mdi-account-circle"
        :title="$t(`profile.${name}.title`)"
      ></v-list-item>
    </template>

    <!-- <v-list-item
      v-for="{ icon, key } in items"
      :key="`${name}-${key}`"
      :prepend-icon="icon"
      :title="title"
      :value="title"
    ></v-list-item> -->
  </v-list-group>
</template>
