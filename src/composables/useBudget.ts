import { fetchEarnings } from '@/api/earnings';
import { fetchExpenses } from '@/api/expenses';
import type { IEarning, IExpense } from '@/types';
import { sumBy } from 'lodash';
import { computed, ref } from 'vue';

const earnings = ref<IEarning[]>([]);
const expenses = ref<IExpense[]>([]);
// keep it as a global fetch - executed once
const fetchedEarningsPromise = fetchEarnings();
const fetchedExpensesPromise = fetchExpenses();
Promise.all([fetchedEarningsPromise, fetchedExpensesPromise])
  .then(([fetchedEarnings, fetchedExpenses]) => {
    earnings.value = fetchedEarnings;
    expenses.value = fetchedExpenses;
  })
  .catch((err) => {
    console.error('Failed to fetch', err);
  });

const cashflow = computed(() => {
  const totalIncome = sumBy<IEarning>(earnings.value, 'amount');
  const totalWasted = sumBy<IExpense>(expenses.value, 'wasted');
  const totalBudget = sumBy<IExpense>(expenses.value, 'budget');

  return {
    actual: totalIncome - totalWasted,
    planed: totalIncome - totalBudget,
  };
});

export const useBudget = () => {
  return {
    earnings,
    expenses,
    cashflow,
  };
};
