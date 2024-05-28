import { INDEX_DB_VERSION } from '@/constants';
import type { IExpense } from '@/types';
import type { Tables } from '@/types/indexed-db';
import { Dexie } from 'dexie';
import { ref } from 'vue';

const db = new Dexie('expenses') as Tables.Expenses;

const v = db.version(INDEX_DB_VERSION).stores({
  expenses: '++id,name,budget,wasted,balance',
});
// console.log('v', v);

const expenses = ref<IExpense[]>([]);

// TODO error handling
// TODO observe and update remote data on change

const addExpense = (expense: IExpense) =>
  db.expenses.add(expense).then((num) => console.log({ num }));

const fetchExpenses = () => db.expenses.toArray();

export const useExpenses = () => {
  fetchExpenses().then((items) => {
    expenses.value = items;
  });

  return {
    expenses,
    addExpense,
  };
};
