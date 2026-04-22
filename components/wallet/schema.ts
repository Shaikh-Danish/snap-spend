import { WalletType } from '@/model/wallet';
import { z } from 'zod';

export const walletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(WalletType),
  balance: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Balance must be greater than or equal to 0"),
  walletId: z.string().min(1, "Wallet ID / Last 4 digits is required").max(4, "Max 4 digits allowed")
});

export type WalletFormValues = z.infer<typeof walletSchema>;
