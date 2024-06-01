<script setup lang="ts">
import { addEarning, fetchEarnings } from '@/api/earnings';
import { useClientState } from '@/composables/useClientState';
import type { IEarning } from '@/types';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useDisplay } from 'vuetify';

const { mdAndUp } = useDisplay();

const { isSideBarVisible } = useClientState();

const earnings = ref<IEarning[]>([]);

const createEarning = async () => {
  const earning = { amount: 0, income: '' };
  try {
    const id = await addEarning(earning);
    earnings.value.push({ amount: 0, income: '', id });
  } catch (err) {
    console.log('Failed to create earning', err);
  }
};

watch(isSideBarVisible, async (isVisible) => {
  if (!isVisible) {
    return;
  }
  // fetch data only if side bar is visible

  try {
    earnings.value = await fetchEarnings();
    console.log('FETCHED earnings', earnings.value);
  } catch (err) {
    console.error('Failed to fetch earnings', err);
  }
});

watchEffect(async () => {
  console.log('watch effect', earnings.value);
});

onMounted(() => {
  console.log({ isSideBarVisible: isSideBarVisible.value });
});

defineExpose({
  createEarning,
});
</script>

<template>
  <v-navigation-drawer v-model="isSideBarVisible" :width="mdAndUp ? 450 : 300">
    <v-list-item :subtitle="$t('earnings.name')"></v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" slim tile>
      <v-list-item
        v-for="earning of earnings"
        :key="`earning-${earning.id}`"
        density="compact"
        variant="text"
        slim
        tile
      >
        <template #title>
          <v-text-field
            hide-details
            hide-spin-buttons
            type="number"
            variant="solo"
            density="compact"
            v-model:model-value="earning.amount"
          ></v-text-field>
        </template>
        <template #subtitle>
          <v-text-field
            hide-details
            hide-spin-buttons
            variant="solo"
            density="compact"
            :placeholder="$t('earnings.income')"
            v-model:model-value="earning.income"
          ></v-text-field>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss">
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
