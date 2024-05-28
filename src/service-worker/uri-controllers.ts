import { expensesDB } from '@/indexedDB';
import { expenseSchema } from '@/schemas/expense';
import type { IExpense } from '@/types';
import { readRequestBody } from './utils';

export const createExpense = (event: FetchEvent) => {
  event.respondWith(
    (async () => {
      try {
        const expense = await readRequestBody<IExpense>(event.request);
        await expenseSchema.validate(expense);
        console.log('BODY: ???', expense);
        const id = await expensesDB.expenses.add(expense!);

        return new Response(JSON.stringify({ id }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('[SW] createExpense controller failed', err);
        return new Response(err.message, {
          headers: { 'Content-Type': 'application/json' },
          status: 400, // TODO err.name === 'ConstraintError' ? 400 : 500,
        });
      }
    })(),
  );
};

export const fetchExpenses = (event: FetchEvent) => {
  event.respondWith(
    (async () => {
      try {
        const expenses = await expensesDB.expenses.toArray();
        console.log('FETCHED expenses', expenses);
        return new Response(JSON.stringify(expenses), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('[SW] fetchExpenses controller failed', err);
        return new Response(err.message, {
          headers: { 'Content-Type': 'application/json' },
          status: 400, // TODO err.name === 'ConstraintError' ? 400 : 500,
        });
      }
    })(),
  );
};
