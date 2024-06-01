export interface IEarning {
  id?: number;
  income: string;
  amount: number;
}

export type EarningAltered = Partial<IEarning>;
