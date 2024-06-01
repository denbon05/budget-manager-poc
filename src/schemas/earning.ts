import { DEFAULT_EARNING_NAME } from '@/constants';
import z from 'zod';

// '++id,income,amount'
export const NewEarning = z.object({
  income: z.string().default(DEFAULT_EARNING_NAME),
  amount: z.number().min(0),
});

export const CreatedEarning = NewEarning.extend({
  id: z.number().readonly(),
});
