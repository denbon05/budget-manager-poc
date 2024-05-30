import type { IExpense, UpdateExpense } from '@/types';
import Axios from 'axios';
import { expenses as expensesEndpoint } from '@/constants/endpoints';

const axios = Axios.create({ baseURL: new URL(import.meta.url).origin });

export const addExpense = async (expense: IExpense) => {
  const { data } = await axios.post<Required<Pick<IExpense, 'id'>>>(
    expensesEndpoint,
    expense,
  );
  console.log('res', data);

  return data.id;
};

export const updateExpense = async (expense: UpdateExpense) => {
  console.log({ expense });
  const res = await axios.patch(expensesEndpoint, expense);
  console.log('updateExpense res', res);
};

export const fetchExpenses = async (): Promise<Required<IExpense[]>> => {
  const { data } = await axios.get<Required<IExpense[]>>(expensesEndpoint);
  return data;
};
