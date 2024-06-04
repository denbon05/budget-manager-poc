<script setup lang="ts">
import { addEarning, updateEarning } from '@/api/earnings';
import { useBudget } from '@/composables/useBudget';
import { useClientState } from '@/composables/useClientState';
import type { IEarning } from '@/types';
import { debounce } from 'lodash';
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndUp } = useDisplay();

const { isSideBarVisible, toggleSideBar } = useClientState();

const { earnings } = useBudget();
const isAutofocusEnabled = ref(false);

const createEarning = async () => {
  const earning = { amount: 0, income: '' };
  isAutofocusEnabled.value = true; // focus text field on a new item
  try {
    const id = await addEarning(earning);
    earnings.value.push({ amount: 0, income: '', id });
  } catch (err) {
    console.log('Failed to create earning', err);
  }
};

// alter item directly without watchers
const alterEarning = async (earning: IEarning) => {
  try {
    await updateEarning({
      ...earning,
      amount: Number(earning.amount),
    });
  } catch (err) {
    console.error('updateEarning err', err);
  }
};
const debounceAlterEarning = debounce(alterEarning, 300); // give space for typing

const toggleRemoveMode = () => {
  //
};

const sideBarWidth = computed(() => {
  if (smAndUp.value) return 400;
  else if (mdAndUp.value) return 450;
  return 300;
});

watch(isSideBarVisible, async (isVisible) => {
  if (!isVisible) {
    return;
  }
  document.addEventListener(
    'keyup',
    ({ key }) => {
      if (key === 'Escape') toggleSideBar(false);
    },
    { once: true }, // redeclare each time sidebar is opened
  );
});
</script>

<template>
  <v-navigation-drawer
    v-model="isSideBarVisible"
    :width="sideBarWidth"
    @keydown.esc="isSideBarVisible = false"
  >
    <v-list-item :subtitle="$t('earnings.name')"></v-list-item>
    <v-divider></v-divider>
    <v-list density="compact" slim tile>
      <v-list-item
        v-for="earning of earnings"
        :key="`earning-${earning.id}`"
        density="compact"
        slim
        tile
      >
        <div class="d-flex flex-column flex-md-row">
          <v-text-field
            hide-details
            hide-spin-buttons
            variant="solo-filled"
            class="w-100 w-md-50"
            density="compact"
            :autofocus="isAutofocusEnabled"
            :placeholder="$t('earnings.income')"
            v-model:model-value="earning.income"
            @update:model-value="debounceAlterEarning(earning)"
          ></v-text-field>
          <v-text-field
            hide-details
            hide-spin-buttons
            type="number"
            variant="solo-filled"
            density="compact"
            v-model:model-value="earning.amount"
            @update:model-value="debounceAlterEarning(earning)"
          ></v-text-field>
        </div>
      </v-list-item>
    </v-list>

    <div id="earningsActions" class="d-flex flex-column">
      <v-btn
        @click="createEarning"
        append-icon="mdi-plus"
        elevation="3"
        class="my-1"
        color="green"
      >
        {{ $t('earnings.cta') }}
      </v-btn>
      <v-btn
        append-icon="mdi-minus-circle-multiple-outline"
        class="my-1 px-2"
        density="comfortable"
        elevation="3"
        @click="toggleRemoveMode"
        color="orange"
      >
        <span class="text-body-2 text-uppercase">
          {{ $t('actions.tune') }}</span
        >
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<style lang="scss">
#earningsActions {
  position: fixed;
  bottom: 5dvh;
  right: 5dvw;
  z-index: 100000 !important;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
