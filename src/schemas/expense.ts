import {
  DEFAULT_BALANCE,
  DEFAULT_BUDGET,
  DEFAULT_OUTCOME,
  DEFAULT_WASTED,
} from '@/constants';
import type { IExpense } from '@/types';
import { number, object, string } from 'yup';

// '++id,name,budget,wasted,balance'
const expenseSchema = object<IExpense>({
  id: number(),
  name: string().default(DEFAULT_OUTCOME),
  budget: number().min(0).default(DEFAULT_BUDGET),
  wasted: number().min(0).default(DEFAULT_WASTED),
  balance: number().min(0).default(DEFAULT_BALANCE),
});

export { expenseSchema };
