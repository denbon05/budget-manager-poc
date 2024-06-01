import { DEFAULT_OUTCOME } from '@/constants';
import z from 'zod';

// '++id,name,budget,wasted,balance'
export const NewExpense = z.object({
  outcome: z.string().default(DEFAULT_OUTCOME),
  budget: z.number().min(0),
  wasted: z.number().min(0),
  balance: z.number(),
});

export const CreatedExpense = NewExpense.extend({
  id: z.number().readonly(),
});
