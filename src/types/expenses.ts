export interface IExpense {
  id?: number;
  outcome: string;
  budget: number;
  wasted: number;
  balance: number;
}

export type ExpenseById = Record<string, IExpense>;

export type ExpenseAltered = Partial<IExpense>;
