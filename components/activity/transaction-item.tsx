import { Text } from '@/components/ui/text';
import Transaction from '@/model/transaction';
import Wallet from '@/model/wallet';
import withObservables from '@nozbe/with-observables';
import {
  Car,
  CreditCard,
  Home,
  ShoppingBag,
  Ticket,
  Utensils,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { format } from 'date-fns';

const CATEGORY_ICONS: Record<string, any> = {
  food: Utensils,
  shopping: ShoppingBag,
  transport: Car,
  housing: Home,
  utilities: Zap,
  entertainment: Ticket,
  default: ShoppingBag,
};

const CATEGORY_ICON_COLORS: Record<string, { bg: string; icon: string }> = {
  food: { bg: 'rgba(251, 146, 60, 0.12)', icon: '#f97316' },
  shopping: { bg: 'rgba(59, 130, 246, 0.12)', icon: '#3b82f6' },
  transport: { bg: 'rgba(168, 85, 247, 0.12)', icon: '#a855f7' },
  housing: { bg: 'rgba(16, 185, 129, 0.12)', icon: '#10b981' },
  utilities: { bg: 'rgba(234, 179, 8, 0.12)', icon: '#eab308' },
  entertainment: { bg: 'rgba(244, 63, 94, 0.12)', icon: '#f43f5e' },
  default: { bg: 'rgba(161, 161, 170, 0.12)', icon: '#a1a1aa' },
};

type TransactionItemProps = {
  transaction: Transaction;
  wallet: Wallet;
};

function TransactionItemComponent({ transaction, wallet }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const category = transaction.category?.toLowerCase() || 'default';
  const IconComp = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  const colors = CATEGORY_ICON_COLORS[category] || CATEGORY_ICON_COLORS.default;

  const formattedTime = (() => {
    try {
      return format(new Date(transaction.date), 'hh:mm a');
    } catch {
      return '';
    }
  })();

  return (
    <Pressable className="flex-row items-center justify-between py-3.5 px-5 active:opacity-70">
      <View className="flex-row items-center flex-1 mr-3">
        {/* Category Icon — rounded-md with tinted background */}
        <View
          className="w-11 h-11 rounded-md items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          <IconComp size={20} color={colors.icon} />
        </View>

        <View className="ml-3.5 flex-1">
          <Text className="text-[14px] font-bold text-foreground" numberOfLines={1}>
            {transaction.description || transaction.category}
          </Text>
          <View className="flex-row items-center mt-0.5 gap-1.5">
            <Text className="text-[11px] font-semibold text-muted-foreground capitalize">
              {transaction.category}
            </Text>
            {wallet?.name && (
              <>
                <View className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                <View className="flex-row items-center gap-0.5">
                  <CreditCard size={9} color="#a1a1aa" />
                  <Text className="text-[10px] font-medium text-muted-foreground/70">
                    {wallet.name}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`text-[14px] font-black tabular-nums ${isIncome ? 'text-emerald-600' : 'text-destructive'}`}
        >
          {isIncome ? '+' : '−'}₹{Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        {formattedTime ? (
          <Text className="text-[10px] font-medium text-muted-foreground/50 mt-0.5 tabular-nums">
            {formattedTime}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const enhance = withObservables(['transaction'], ({ transaction }) => ({
  transaction: transaction.observe(),
  wallet: transaction.account.observe(), 
}));

export const TransactionItem = enhance(TransactionItemComponent);
