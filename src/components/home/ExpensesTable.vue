<script setup lang="ts">
import { addExpense, fetchExpenses, updateExpense } from '@/api/expenses';
import {
  ATTEMPT_UPDATE_AMOUNT,
  ATTEMPT_UPDATE_FACTOR,
  DEFAULT_BALANCE,
  DEFAULT_BUDGET,
  DEFAULT_OUTCOME,
  DEFAULT_WASTED,
} from '@/constants';
import type { ExpenseAltered, IExpense } from '@/types';
import { retry } from '@lifeomic/attempt';
import { debounce } from 'lodash';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import type { VDataTableVirtual } from 'vuetify/components';
import NumInputDialog from './NumInputDialog.vue';
import { useClientState } from '@/composables/useClientState';

const { t } = useI18n();

const { isSideBarVisible: shouldAddBtnBeHidden } = useClientState();
const { xs } = useDisplay();
const expenses = ref<IExpense[]>([]);
const shouldAutofocus = ref(false);
const isInputDialogVisible = ref(false);

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

fetchExpenses()
  .then((fetchedExpenses) => {
    expenses.value = fetchedExpenses;
  })
  .catch(console.error);

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

const update = async (expense: ExpenseAltered) => {
  // update altered expense
  try {
    await retry(
      async () => {
        await updateExpense(expense);
      },
      { maxAttempts: ATTEMPT_UPDATE_AMOUNT, factor: ATTEMPT_UPDATE_FACTOR },
    );
  } catch (err) {
    console.error(`Failed to update the expense ${expense}`, err);
  }
};

const affectedExpense = reactive<IExpense>({
  outcome: '',
  balance: 0,
  budget: 0,
  wasted: 0,
});

const updateDebounced = async (expense: ExpenseAltered) => {
  console.log('updateDebounced!!!');
  if (!expense.id) return;

  const alteredExpense = expenseById.value[expense.id];
  if (alteredExpense) {
    // update specific property of the expense
    Object.assign(alteredExpense, {
      ...expense,
      // automatically compute balance
      balance:
        (expense.budget ?? alteredExpense.budget ?? 0) -
        (expense.wasted ?? alteredExpense.wasted ?? 0),
    });
  }

  // debounce - take into account user typing
  return debounce(update, 300)(alteredExpense);
};

const openInputDialog = ({
  isFocused,
  id,
}: {
  isFocused: boolean;
  id?: number;
}) => {
  if (!id) return;

  console.log('openInputDialog', { isFocused }, isInputDialogVisible.value);
  if (!isInputDialogVisible.value) {
    Object.assign(affectedExpense, expenseById.value[id]);
    isInputDialogVisible.value = true;
  }
};

const saveWasted = (value: number) => {
  affectedExpense.wasted = Number(affectedExpense.wasted) + value;
  return updateDebounced(affectedExpense);
};

defineExpose({
  createExpense,
});
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
      :no-data-text="$t('home.noExpensesText')"
      :mobile="xs"
      :headers="headers"
      :items="expenses"
    >
      <template #item.outcome="{ item: { outcome, id } }">
        <v-text-field
          type="text"
          density="compact"
          variant="plain"
          min-width="200"
          :autofocus="shouldAutofocus"
          hide-details
          :reverse="xs"
          :model-value="outcome"
          @update:model-value="
            (value) => updateDebounced({ outcome: value, id })
          "
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
          @update:focused="(isFocused) => openInputDialog({ isFocused, id })"
          @update:model-value="
            (value) => updateDebounced({ wasted: Number(value), id })
          "
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
    </v-data-table-virtual>
  </v-col>
</template>

<style scoped lang="scss">
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
