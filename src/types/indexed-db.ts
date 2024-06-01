import type { Dexie, EntityTable } from 'dexie';
import type { IExpense } from '.';

export type IndexedDB = Dexie & {
  expenses: EntityTable<IExpense, 'id'>;
};
