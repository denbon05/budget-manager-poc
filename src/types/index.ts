export interface IExpense {
  id?: number;
  outcome: string;
  budget: number;
  wasted: number;
  balance: number;
}

export type ExpenseById = Record<string, IExpense>;

export type UpdateExpense<
  T extends keyof Omit<IExpense, 'id'> = keyof Omit<IExpense, 'id'>,
> = {
  key: T;
  value: IExpense[T];
  id?: number;
};
