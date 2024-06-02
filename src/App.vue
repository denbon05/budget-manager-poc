<script setup lang="ts">
import NavBar from '@/components/nav-bar/NavBar.vue';
import SideBar from '@/components/side-bar/SideBar.vue';
</script>

<template>
  <v-layout class="rounded rounded-md">
    <NavBar />

    <SideBar />

    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-layout>
</template>
