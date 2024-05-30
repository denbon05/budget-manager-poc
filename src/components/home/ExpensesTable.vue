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
import type { IExpense, UpdateExpense } from '@/types';
import { retry } from '@lifeomic/attempt';
import { debounce } from 'lodash';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import type { VDataTableVirtual } from 'vuetify/components';

const { t } = useI18n();

const headers: VDataTableVirtual['headers'] = [
  {
    title: t('expense.outcome'),
    align: 'start',
    sortable: false,
    key: 'outcome',
  },
  { title: t('expense.budget'), key: 'budget', align: 'end' },
  { title: t('expense.wasted'), key: 'wasted', align: 'end' },
  { title: t('expense.balance'), key: 'balance', align: 'end' },
];

const { xs } = useDisplay();
const expenses = ref<IExpense[]>([]);
const shouldAutofocus = ref(false);

const createExpense = async () => {
  const defaultExpense: IExpense = {
    outcome: DEFAULT_OUTCOME,
    balance: DEFAULT_BALANCE,
    budget: DEFAULT_BUDGET,
    wasted: DEFAULT_WASTED,
  };
  shouldAutofocus.value = true; // focus only on new items
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

const update = async <T extends keyof Omit<IExpense, 'id'>>(
  expense: UpdateExpense<T>,
) => {
  if (!expense.id) return;

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

  const affectedExpense = expenseById.value[expense.id];
  if (affectedExpense) {
    // update specific property of the expense
    affectedExpense[expense.key] = expense.value;
  }
};
const updateDebounced = debounce(update, 300);
</script>

<template>
  <v-col>
    <v-data-table-virtual
      hide-default-footer
      density="compact"
      :no-data-text="$t('home.noExpensesText')"
      :mobile="xs"
      :headers="headers"
      :items="expenses"
      :sort-by="[{ key: 'outcome', order: 'asc' }]"
    >
      <template #item.outcome="{ item: { outcome, id } }">
        <v-text-field
          type="text"
          density="compact"
          variant="plain"
          min-width="200"
          :autofocus="shouldAutofocus"
          hide-details
          :model-value="outcome"
          @update:model-value="
            (value) => updateDebounced({ key: 'outcome', value, id })
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
            (value) => updateDebounced({ key: 'budget', value, id })
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
          @update:model-value="
            (value) => updateDebounced({ key: 'wasted', value, id })
          "
        >
        </v-text-field>
      </template>

      <template #item.balance="{ item: { balance, id } }">
        <v-text-field
          type="number"
          :min="0"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="balance"
          @update:model-value="
            (value) => updateDebounced({ key: 'balance', value, id })
          "
        >
        </v-text-field>
      </template>
    </v-data-table-virtual>

    <v-btn
      id="addExpenseBtn"
      icon="mdi-plus"
      variant="elevated"
      elevation="3"
      @click="createExpense"
    >
    </v-btn>
  </v-col>
</template>

<style scoped lang="scss">
#addExpenseBtn {
  position: fixed;
  bottom: 5dvh;
  right: 5dvw;
}
</style>
