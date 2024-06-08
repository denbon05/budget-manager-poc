<script setup lang="ts">
import { addEarning, deleteEarning, updateEarning } from '@/api/earnings';
import { useBudget } from '@/composables/useBudget';
import { useClientState } from '@/composables/useClientState';
import { DEBOUNCE_MS } from '@/constants';
import DelayedQueue from '@/entities/DelayedQueue';
import type { IEarning } from '@/types';
import type { SnackNotificationOpts } from '@/types/notifications';
import { debounce } from 'lodash';
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

const { mdAndUp, smAndUp } = useDisplay();
const { t } = useI18n();
const showSnackbar = inject<(opts: SnackNotificationOpts) => void>(
  'showSnackbar',
  () => null,
);

const { isSideBarVisible, toggleSideBar } = useClientState();

const { earnings } = useBudget();
const isAutofocusEnabled = ref(false);
const isManageModeEnabled = ref(false);

const createEarning = async () => {
  if (isManageModeEnabled.value) {
    // first exit from manage mode if enabled
    isManageModeEnabled.value = false;
  }

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
const debounceAlterEarning = debounce(alterEarning, DEBOUNCE_MS); // give space for typing

const removeEarning = async ({
  earning,
  index,
}: {
  earning: IEarning;
  index: number;
}) => {
  earnings.value.splice(index, 1);
  DelayedQueue.enqueue(() => {
    // fire delete request in callback
    earnings.value = earnings.value.filter(({ id }) => id !== earning.id);
    return deleteEarning(earning);
  });

  showSnackbar({
    text: t('notifications.deleted', { item: t('expense.name') }),
    closeText: t('actions.undo'),
    onCloseAction: () => {
      // dequeue if user clicked undo
      DelayedQueue.dequeueLast();
      // restore item in the same place
      earnings.value.splice(index, 0, earning);
    },
  });
};

const toggleManageMode = () => {
  isManageModeEnabled.value = !isManageModeEnabled.value;
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
    floating
    touchless
    @keydown.esc="isSideBarVisible = false"
  >
    <v-list-item :subtitle="$t('earnings.name')"></v-list-item>
    <v-divider></v-divider>
    <p class="d-flex justify-center mt-3" v-if="!earnings.length">
      {{ $t('earnings.empty') }}
    </p>
    <v-list density="compact" slim tile>
      <v-list-item
        v-for="(earning, index) of earnings"
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
            :disabled="isManageModeEnabled"
          ></v-text-field>
          <v-text-field
            v-if="!isManageModeEnabled"
            hide-details
            hide-spin-buttons
            type="number"
            variant="solo-filled"
            density="compact"
            v-model:model-value="earning.amount"
            @update:model-value="debounceAlterEarning(earning)"
            :disabled="isManageModeEnabled"
          ></v-text-field>

          <div v-else class="d-flex align-center item-actions">
            <v-btn
              variant="plain"
              class="mx-2"
              density="compact"
              icon="mdi-minus-circle-outline"
              v-tooltip:bottom="$t('actions.remove')"
              color="error"
              @click="removeEarning({ index, earning })"
            ></v-btn>
            <v-btn
              variant="plain"
              class="mx-2"
              density="compact"
              icon="mdi-calendar-sync-outline"
            ></v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <div id="earningsActions" class="d-flex flex-column">
      <v-btn
        @click="createEarning"
        append-icon="mdi-plus"
        class="my-1 px-2 d-flex justify-space-between"
        elevation="3"
        color="green"
      >
        {{ $t('earnings.add') }}
      </v-btn>
      <v-btn
        append-icon="mdi-tune-vertical"
        class="my-1 px-2 d-flex justify-space-between"
        density="comfortable"
        elevation="3"
        @click="toggleManageMode"
        :color="isManageModeEnabled ? 'cyan' : 'blue-grey'"
        :variant="isManageModeEnabled ? 'elevated' : 'tonal'"
      >
        <span class="text-body-2 text-uppercase">
          {{ $t('actions.manage') }}</span
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

.item-actions {
  height: 40px; // have to be the same as an input height
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
