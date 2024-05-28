import type { IExpense } from '@/types';
import { number, object, string } from 'yup';

// '++id,name,budget,wasted,balance'
const expenseSchema = object<IExpense>({
  id: number(),
  name: string().required(),
  budget: number().required(),
  wasted: number().default(0),
  balance: number().required(),
});

export { expenseSchema };
