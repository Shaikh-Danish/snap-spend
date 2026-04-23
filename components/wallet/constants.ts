import { WalletType } from '@/model/wallet';
import {
  Banknote,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  Lock,
  PiggyBank,
  TrendingUp,
  Wallet as WalletIcon
} from 'lucide-react-native';

export const WALLET_TYPE_ICONS: Record<WalletType, any> = {
  [WalletType.SAVINGS]: PiggyBank,
  [WalletType.CURRENT]: CircleDollarSign,
  [WalletType.CREDIT_CARD]: CreditCard,
  [WalletType.DEBIT_CARD]: CreditCard,
  [WalletType.MUTUAL_FUNDS]: TrendingUp,
  [WalletType.STOCKS]: TrendingUp,
  [WalletType.BONDS]: Briefcase,
  [WalletType.CASH]: Banknote,
  [WalletType.WALLET]: WalletIcon,
  [WalletType.FIXED_DEPOSIT]: Lock,
};
