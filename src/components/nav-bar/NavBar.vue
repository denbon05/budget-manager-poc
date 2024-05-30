<script setup lang="ts">
import { RouteNames } from '@/types/router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const appBarIcon = computed(() =>
  route.name === RouteNames.Home ? 'mdi-account' : 'mdi-home',
);
const routerLinkName = computed(() =>
  route.name === RouteNames.Home ? RouteNames.Profile : RouteNames.Home,
);
</script>

<template>
  <v-app-bar class="px-sm-4 px-md-6 px-lg-8 px-xxl-10">
    <!-- <v-app-bar-title>{{ { appBarIcon, routerLinkName } }}</v-app-bar-title> -->

    <template v-slot:append>
      <router-link
        :to="{
          name: routerLinkName,
        }"
        class="text-teal-darken-1"
      >
        <v-app-bar-nav-icon
          :icon="appBarIcon"
          variant="text"
        ></v-app-bar-nav-icon>
      </router-link>
    </template>
  </v-app-bar>
</template>
