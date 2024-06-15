import { expensesEndpoint } from '@/constants/endpoints';
import type { ExpenseAltered, IExpense } from '@/types';
import { apiProxied } from './init';

export const addExpense = async (expense: IExpense) => {
  const { data } = await apiProxied.post<Required<Pick<IExpense, 'id'>>>(
    expensesEndpoint,
    expense,
  );

  return data.id;
};

export const updateExpense = async (expense: ExpenseAltered) => {
  console.log({ expense });
  await apiProxied.patch(expensesEndpoint, expense);
  // TODO handle error statuses
};

export const fetchExpenses = async (): Promise<Required<IExpense[]>> => {
  const { data } = await apiProxied.get<Required<IExpense[]>>(expensesEndpoint);
  return data;
};

export const deleteExpense = async (parm: Pick<IExpense, 'id'>) => {
  await apiProxied.delete(expensesEndpoint, { data: parm });
};
