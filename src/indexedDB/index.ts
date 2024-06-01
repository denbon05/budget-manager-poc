import { INDEX_DB_VERSION } from '@/constants';
import type { IndexedDB } from '@/types/indexed-db';
import Dexie from 'dexie';

const expensesDB = new Dexie('budget') as IndexedDB;

expensesDB.version(INDEX_DB_VERSION).stores({
  expenses: '++id,name,budget,wasted,balance',
});

export { expensesDB };
