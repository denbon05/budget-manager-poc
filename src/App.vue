<script setup lang="ts">
import NavBar from '@/components/nav-bar/NavBar.vue';
import SideBar from '@/components/side-bar/SideBar.vue';
</script>

<template>
  <v-layout class="rounded rounded-md">
    <NavBar />

    <SideBar />

    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
