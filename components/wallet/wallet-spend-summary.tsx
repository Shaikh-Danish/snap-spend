import {
  DateRange,
  DateRangePicker,
} from '@/components/activity/date-range-picker';
import { Text } from '@/components/ui/text';
import { database } from '@/model';
import Transaction from '@/model/transaction';
import Wallet from '@/model/wallet';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { Wallet as WalletIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { WALLET_TYPE_ICONS } from './constants';

type WalletSpendSummaryProps = {
  transactions: Transaction[];
  wallets: Wallet[];
};

type WalletSpendData = {
  wallet: Wallet;
  totalExpense: number;
  totalIncome: number;
  txCount: number;
};

function WalletSpendSummaryComponent({
  transactions,
  wallets,
}: WalletSpendSummaryProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const filteredTransactions = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return transactions;
    const start = startOfDay(dateRange.start);
    const end = endOfDay(dateRange.end);
    return transactions.filter(t => {
      const txDate = new Date(t.date);
      return isWithinInterval(txDate, { start, end });
    });
  }, [transactions, dateRange]);

  const walletSpendData = useMemo(() => {
    const walletMap = new Map<string, WalletSpendData>();

    // Init with all wallets
    wallets.forEach(w => {
      walletMap.set(w.id, {
        wallet: w,
        totalExpense: 0,
        totalIncome: 0,
        txCount: 0,
      });
    });

    // Aggregate transactions
    filteredTransactions.forEach(t => {
      const entry = walletMap.get(t.accountId);
      if (entry) {
        entry.txCount++;
        if (t.type === 'expense') {
          entry.totalExpense += Math.abs(t.amount);
        } else {
          entry.totalIncome += Math.abs(t.amount);
        }
      }
    });

    return Array.from(walletMap.values())
      .filter(d => d.txCount > 0 || d.wallet.balance > 0)
      .sort((a, b) => b.totalExpense - a.totalExpense);
  }, [filteredTransactions, wallets]);

  const grandTotalExpense = walletSpendData.reduce(
    (s, d) => s + d.totalExpense,
    0
  );
  const grandTotalIncome = walletSpendData.reduce(
    (s, d) => s + d.totalIncome,
    0
  );

  if (!wallets.length) return null;

  return (
    <View className="px-6 pb-10">
      {/* Header + Date Picker */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-[2px]">
          Spend by Wallets
        </Text>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </View>

      {/* Per-Wallet Breakdown */}
      <View className="bg-card/40 border border-border/30 rounded-md overflow-hidden">
        {walletSpendData.map((data, idx) => {
          const Icon =
            WALLET_TYPE_ICONS[data.wallet.type] || WalletIcon;
          const spendPercent =
            grandTotalExpense > 0
              ? (data.totalExpense / grandTotalExpense) * 100
              : 0;

          return (
            <View key={data.wallet.id}>
              <View className="px-5 py-4">
                {/* Wallet Row */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-9 h-9 rounded-md bg-muted/40 items-center justify-center">
                      <Icon size={18} className="text-foreground" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[14px] font-bold text-foreground"
                        numberOfLines={1}
                      >
                        {data.wallet.name}
                      </Text>
                      <Text className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {data.wallet.type.replace(/_/g, ' ')} •{' '}
                        {data.txCount} txn
                        {data.txCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[14px] font-black text-destructive tabular-nums">
                      −₹
                      {data.totalExpense.toLocaleString('en-IN', {
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                    {data.totalIncome > 0 && (
                      <Text className="text-[11px] font-bold text-emerald-600/70 tabular-nums mt-0.5">
                        +₹
                        {data.totalIncome.toLocaleString('en-IN', {
                          minimumFractionDigits: 0,
                        })}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Spend Bar */}
                {grandTotalExpense > 0 && (
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1 h-1.5 bg-muted/30 rounded-md overflow-hidden">
                      <View
                        className="h-full bg-destructive/40 rounded-md"
                        style={{ width: `${spendPercent}%` }}
                      />
                    </View>
                    <Text className="text-[9px] font-bold text-muted-foreground tabular-nums w-8 text-right">
                      {spendPercent.toFixed(0)}%
                    </Text>
                  </View>
                )}
              </View>

              {idx < walletSpendData.length - 1 && (
                <View className="h-px bg-border/30 mx-5" />
              )}
            </View>
          );
        })}

        {walletSpendData.length === 0 && (
          <View className="py-8 items-center">
            <Text className="text-[11px] text-muted-foreground italic">
              No transactions found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const enhance = withObservables([], () => ({
  transactions: database.collections
    .get<Transaction>('transactions')
    .query(Q.sortBy('date', Q.desc))
    .observe(),
  wallets: database.collections
    .get<Wallet>('wallets')
    .query()
    .observe(),
}));

export default enhance(WalletSpendSummaryComponent);
