import { indexedDB } from '@/indexedDB';
import { CreatedExpense, NewExpense } from '@/schemas/expense';
import type { ExpenseAltered, IExpense } from '@/types';
import { readRequestBody } from '../utils';

const defaultHeaders = { 'Content-Type': 'application/json' };

export const createExpense = async (event: FetchEvent) => {
  const expense = await readRequestBody<IExpense>(event.request);
  const validatedExpense: IExpense = NewExpense.parse(expense);
  console.log('createExpense validated', validatedExpense);
  console.log('createExpense expense', expense);
  const id = await indexedDB.expenses.add(expense!);

  return new Response(JSON.stringify({ id }), {
    headers: defaultHeaders,
  });
};

export const updateExpense = async (event: FetchEvent) => {
  const expense = await readRequestBody<ExpenseAltered>(event.request);
  const isUpdated = await indexedDB.expenses.update(expense.id, expense);
  console.log('updateExpense', isUpdated);
  return new Response();
};

export const fetchExpenses = async () => {
  const expenses = (await indexedDB.expenses.toArray()).map(
    (expense: IExpense) => CreatedExpense.parse(expense),
  );
  console.log('fetched expenses', expenses);
  return new Response(JSON.stringify(expenses), {
    headers: defaultHeaders,
  });
};
