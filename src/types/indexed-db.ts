import type { Dexie, EntityTable } from 'dexie';
import type { IEarning, IExpense } from '.';

export type IndexedDB = Dexie & {
  expenses: EntityTable<IExpense, 'id'>;
  earnings: EntityTable<IEarning, 'id'>;
};
