import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  note: z.string().optional(),
  type: z.enum(['expense', 'income']),
  date: z.date(),
  accountId: z.string().min(1, "Please select a wallet"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
