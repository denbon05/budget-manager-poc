<script setup lang="ts">
import { useClientState } from '@/composables/useClientState';
import { RouteNames } from '@/types/router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { isSideBarVisible, toggleSideBar } = useClientState();

const route = useRoute();

const appBarIcon = computed(() =>
  route.name === RouteNames.Home ? 'mdi-account-cog' : 'mdi-home',
);
const routerLinkName = computed(() =>
  route.name === RouteNames.Home ? RouteNames.Profile : RouteNames.Home,
);

defineEmits<{
  (event: 'toggleSideBarVisibility'): void;
}>();
</script>

<template>
  <v-app-bar class="px-4 px-md-6 px-lg-8 px-xxl-10">
    <!-- <v-app-bar-title>{{ { appBarIcon, routerLinkName } }}</v-app-bar-title> -->
    <template #prepend>
      <v-btn
        @click="toggleSideBar(!isSideBarVisible)"
        icon="mdi-plus-circle-multiple"
        variant="flat"
      ></v-btn>
    </template>

    <template v-slot:append>
      <router-link
        :to="{
          name: routerLinkName,
        }"
        class="text-secondary"
      >
        <v-app-bar-nav-icon
          :icon="appBarIcon"
          variant="text"
        ></v-app-bar-nav-icon>
      </router-link>
    </template>
  </v-app-bar>
</template>
