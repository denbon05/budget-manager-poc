import { INDEX_DB_VERSION } from '@/constants';
import type { Tables } from '@/types/indexed-db';
import Dexie from 'dexie';

const expensesDB = new Dexie('expenses') as Tables.Expenses;

expensesDB.version(INDEX_DB_VERSION).stores({
  expenses: '++id,name,budget,wasted,balance',
});

export { expensesDB };
