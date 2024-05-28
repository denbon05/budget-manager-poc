import type { Dexie, EntityTable } from 'dexie';
import type { IExpense } from '.';

export namespace Tables {
  export type Expenses = Dexie & {
    expenses: EntityTable<IExpense, 'id'>;
  };
}
