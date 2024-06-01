<script setup lang="ts">
import NavBar from '@/components/nav-bar/NavBar.vue';
import SideBar from '@/components/side-bar/SideBar.vue';
import { useClientState } from './composables/useClientState';
import { ref } from 'vue';

const { isSideBarVisible, toggleSideBar } = useClientState();

const sideBarRef = ref<InstanceType<typeof SideBar>>();

const toggleSideBarVisibility = () => {
  toggleSideBar(!isSideBarVisible.value);
};

const createEarning = () => sideBarRef.value?.createEarning();
</script>

<template>
  <v-layout class="rounded rounded-md">
    <NavBar @toggleSideBarVisibility="toggleSideBarVisibility" />

    <SideBar ref="sideBarRef" />

    <v-main>
      <v-container>
        <RouterView @createEarning="createEarning" />
      </v-container>
    </v-main>
  </v-layout>
</template>
