<script setup lang="ts">
import { addExpense, deleteExpense, updateExpense } from '@/api/expenses';
import { useBudget } from '@/composables/useBudget';
import { useClientState } from '@/composables/useClientState';
import {
  ATTEMPT_UPDATE_AMOUNT,
  ATTEMPT_UPDATE_FACTOR,
  DEFAULT_BALANCE,
  DEFAULT_BUDGET,
  DEFAULT_OUTCOME,
  DEFAULT_WASTED,
} from '@/constants';
import DelayedQueue from '@/entities/DelayedQueue';
import type { ExpenseAltered, IExpense } from '@/types';
import { retry } from '@lifeomic/attempt';
import { debounce } from 'lodash';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import { VDataTableVirtual } from 'vuetify/components';
import NumInputDialog from './NumInputDialog.vue';

const { t } = useI18n();
const { xs } = useDisplay();
const { isSideBarVisible: shouldActionBtnsBeHidden } = useClientState();
const { expenses } = useBudget();
const shouldAutofocus = ref(false);
const isInputDialogVisible = ref(false);
const isManageModeEnabled = ref(false);

// expenses table headers
const headers: VDataTableVirtual['headers'] = [
  {
    title: t('expense.outcome'),
    align: xs ? 'start' : 'end',
    key: 'outcome',
  },
  { title: t('expense.budget'), key: 'budget', align: 'end' },
  { title: t('expense.wasted'), key: 'wasted', align: 'end' },
  { title: t('expense.balance'), key: 'balance', align: 'end' },
];

const createExpense = async () => {
  const defaultExpense: IExpense = {
    outcome: DEFAULT_OUTCOME,
    balance: DEFAULT_BALANCE,
    budget: DEFAULT_BUDGET,
    wasted: DEFAULT_WASTED,
  };
  shouldAutofocus.value = true; // focus only on a new item
  try {
    defaultExpense.id = await addExpense(defaultExpense);
    expenses.value.push(defaultExpense);
    console.log('created expenses', expenses.value);
  } catch (err) {
    console.error('createExpense failed', err);
  }
};

// cached expenses for O(1) access and modification in place
const expenseById = computed(() =>
  expenses.value.reduce<Record<string, IExpense>>((acc, expense) => {
    if (!expense.id) {
      // the ID is mandatory for the proper functionality
      throw Error(`There is no ID for expense ${expense}`);
    }

    return { [expense.id]: expense, ...acc };
  }, {}),
);

// alter item directly without watchers
const update = async (expense: ExpenseAltered) => {
  console.log('update expense!!!', expense);
  if (!expense.id) return;

  const alteredExpense = expenseById.value[expense.id];
  if (!alteredExpense) {
    return;
  }

  // update specific property of the expense
  Object.assign(alteredExpense, {
    ...expense,
    // automatically compute balance
    balance:
      (expense.budget ?? alteredExpense.budget ?? 0) -
      (expense.wasted ?? alteredExpense.wasted ?? 0),
  });

  // update altered expense
  try {
    await retry(
      async () => {
        await updateExpense(alteredExpense);
      },
      { maxAttempts: ATTEMPT_UPDATE_AMOUNT, factor: ATTEMPT_UPDATE_FACTOR },
    );
  } catch (err) {
    console.error(`Failed to update the expense ${alteredExpense}`, err);
  }
};

const affectedExpense = reactive<IExpense>({
  outcome: '',
  balance: 0,
  budget: 0,
  wasted: 0,
});

const updateDebounced = debounce(update, 300);

const openInputDialog = ({ id }: Pick<IExpense, 'id'>) => {
  if (!id || isManageModeEnabled.value) return;

  if (!isInputDialogVisible.value) {
    Object.assign(affectedExpense, expenseById.value[id]);
    isInputDialogVisible.value = true;
  }
};

const expanded = ref<string[]>([]);

const toggleManageMode = () => {
  isManageModeEnabled.value = !isManageModeEnabled.value;
  // expand all in manage mode
  // @ts-ignore - actual values are numbers
  expanded.value = isManageModeEnabled.value
    ? expenses.value.map(({ id }) => id)
    : [];
};

const saveWasted = (value: number) => {
  affectedExpense.wasted = Number(affectedExpense.wasted) + value;
  return updateDebounced(affectedExpense);
};

const removeExpense = (expense: IExpense) => {
  const id = DelayedQueue.enqueue(() => {
    expenses.value = expenses.value.filter(({ id }) => id !== expense.id);
    return deleteExpense(expense);
  });
  // TODO dequeue if user clicked undo
};
</script>

<template>
  <v-col>
    <NumInputDialog
      v-model:isDialogOpened="isInputDialogVisible"
      @update-value="saveWasted"
    >
      <template #title>{{ $t('expense.wasted') }}</template>
    </NumInputDialog>

    <v-data-table-virtual
      hide-default-footer
      density="compact"
      :no-data-text="$t('expense.cta')"
      :mobile="xs"
      :headers="headers"
      :items="expenses"
      :hover="isManageModeEnabled"
      :show-expand="isManageModeEnabled"
      :expand-on-click="isManageModeEnabled"
      :expanded="expanded"
    >
      <!-- <template #item.data-table-select="{ item }">
        <v-btn
          icon="mdi-minus-circle-outline"
          variant="plain"
          size="sm"
          @click="removeExpense(item)"
        ></v-btn>
      </template> -->

      <template #item.outcome="{ item: { outcome, id } }">
        <v-text-field
          type="text"
          density="compact"
          variant="plain"
          min-width="160"
          :autofocus="shouldAutofocus"
          hide-details
          :reverse="xs"
          :model-value="outcome"
          @update:model-value="
            (value) => updateDebounced({ outcome: value, id })
          "
          :readonly="isManageModeEnabled"
        >
        </v-text-field>
      </template>

      <template #item.budget="{ item: { budget, id } }">
        <v-text-field
          type="number"
          :min="0"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="budget"
          @update:model-value="
            (value) => updateDebounced({ budget: Number(value), id })
          "
          :readonly="isManageModeEnabled"
        >
        </v-text-field>
      </template>

      <template #item.wasted="{ item: { wasted, id } }">
        <v-text-field
          type="number"
          :min="0"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="wasted"
          @update:focused="openInputDialog({ id })"
          @update:model-value="
            (value) => updateDebounced({ wasted: Number(value), id })
          "
          :readonly="isManageModeEnabled"
        >
        </v-text-field>
      </template>

      <template #item.balance="{ item: { balance } }">
        <v-text-field
          type="number"
          :min="0"
          density="compact"
          variant="plain"
          hide-details
          reverse
          readonly
        >
          <!-- TODO change balance color depending on user threshold -->
          <b>{{ balance }}</b>
        </v-text-field>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex justify-end">
              <v-btn
                variant="plain"
                class="mx-2"
                size="sm"
                icon="mdi-minus-circle-outline"
                @click="removeExpense(item)"
              ></v-btn>
              <v-btn
                variant="plain"
                class="mx-2"
                size="sm"
                icon="mdi-calendar-sync-outline"
              ></v-btn>
            </div>
          </td>
        </tr>
      </template>

      <template #item.data-table-expand
        ><v-icon size="md" icon="mdi-tune-vertical-variant"></v-icon
      ></template>
    </v-data-table-virtual>

    <div
      v-if="!shouldActionBtnsBeHidden"
      id="expensesActions"
      class="d-flex flex-column"
    >
      <v-btn
        append-icon="mdi-plus"
        class="my-1 px-2 d-flex justify-space-between"
        elevation="3"
        @click="createExpense"
        color="yellow"
      >
        <span class="text-body-2 text-uppercase"> {{ $t('expense.add') }}</span>
      </v-btn>
      <v-btn
        :append-icon="
          isManageModeEnabled ? 'mdi-cog-stop-outline' : 'mdi-cog-play-outline'
        "
        class="my-1 px-2 d-flex justify-space-between"
        density="comfortable"
        elevation="3"
        @click="toggleManageMode"
        :color="isManageModeEnabled ? 'cyan' : 'blue-grey'"
      >
        <span class="text-body-2 text-uppercase">
          {{ $t('actions.manage') }}</span
        >
      </v-btn>
    </div>
  </v-col>
</template>

<style scoped lang="scss">
#expensesActions {
  position: fixed;
  bottom: 5dvh;
  right: 5dvw;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
