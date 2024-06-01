import { expensesDB } from '@/indexedDB';
import { CreatedExpense, NewExpense } from '@/schemas/expense';
import type { ExpenseAltered, IExpense } from '@/types';
import { readRequestBody } from './utils';

// Handlers designed for specific URIs within Service Worker

const defaultHeaders = { 'Content-Type': 'application/json' };

export const createExpense = async (event: FetchEvent) => {
  const expense = await readRequestBody<IExpense>(event.request);
  const validatedExpense: IExpense = NewExpense.parse(expense);
  console.log('createExpense validated', validatedExpense);
  console.log('createExpense expense', expense);
  const id = await expensesDB.expenses.add(expense!);

  return new Response(JSON.stringify({ id }), {
    headers: defaultHeaders,
  });
};

export const updateExpense = async (event: FetchEvent) => {
  const expense = await readRequestBody<ExpenseAltered>(event.request);
  const isUpdated = await expensesDB.expenses.update(expense.id, expense);
  console.log('updateExpense', isUpdated);
  return new Response();
};

export const fetchExpenses = async () => {
  const expenses = (await expensesDB.expenses.toArray()).map(
    (expense: IExpense) => CreatedExpense.parse(expense),
  );
  console.log('fetched expenses', expenses);
  return new Response(JSON.stringify(expenses), {
    headers: defaultHeaders,
  });
};
