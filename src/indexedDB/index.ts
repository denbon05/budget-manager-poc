import { INDEX_DB_VERSION } from '@/constants';
import type { IndexedDB } from '@/types/indexed-db';
import Dexie from 'dexie';

const indexedDB = new Dexie('budget') as IndexedDB;

indexedDB.version(INDEX_DB_VERSION).stores({
  expenses: '++id,outcome,budget,wasted,balance',
  earnings: '++id,income,amount',
});

export { indexedDB };
