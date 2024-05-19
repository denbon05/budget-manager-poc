import type { Dexie, EntityTable } from 'dexie';
import type { IExpenses } from '.';

export namespace Tables {
  export type Expenses = Dexie & {
    expenses: EntityTable<IExpenses, 'id'>;
  };
}
