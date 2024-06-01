import { expensesEndpoint } from '@/constants/endpoints';
import type { ExpenseAltered, IExpense } from '@/types';
import { axios } from './init';

export const addExpense = async (expense: IExpense) => {
  const { data } = await axios.post<Required<Pick<IExpense, 'id'>>>(
    expensesEndpoint,
    expense,
  );

  return data.id;
};

export const updateExpense = async (expense: ExpenseAltered) => {
  console.log({ expense });
  await axios.patch(expensesEndpoint, expense);
  // TODO handle error statuses
};

export const fetchExpenses = async (): Promise<Required<IExpense[]>> => {
  const { data } = await axios.get<Required<IExpense[]>>(expensesEndpoint);
  return data;
};
