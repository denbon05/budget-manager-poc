import type { IExpense } from '@/types';
import Axios from 'axios';
import { expenses as expensesEndpoint } from '@/constants/endpoints';

const axios = Axios.create({ baseURL: new URL(import.meta.url).origin });

export const addExpense = async (expense: IExpense) => {
  const res = await axios.post(expensesEndpoint, expense);
  console.log('res', res);

  return res;
};

export const fetchExpenses = async (): Promise<Required<IExpense>[]> => {
  const { data } = await axios.get(expensesEndpoint);
  return data;
};
