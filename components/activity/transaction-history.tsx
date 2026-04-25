import { ActivityEmptyState } from '@/components/activity/activity-empty-state';
import { TransactionItem } from '@/components/activity/transaction-item';
import { Text } from '@/components/ui/text';
import { Transaction } from '@/model';
import { format } from 'date-fns';
import React from 'react';
import { View } from 'react-native';

type TransactionHistoryProps = {
  historyByDate: Record<string, Transaction[]>;
  isSearching: boolean;
};

function DayGroup({ dateKey, transactions }: { dateKey: string; transactions: Transaction[] }) {
  const date = new Date(dateKey);
  const dayNum = format(date, 'd');
  const dayName = format(date, 'EEE');
  const monthYear = format(date, 'MMM yyyy');

  const dayTotal = transactions.reduce(
    (sum, t) =>
      sum + (t.type === 'income' ? Math.abs(t.amount) : -Math.abs(t.amount)),
    0
  );

  return (
    <View className="mb-2">
      {/* Date Header */}
      <View className="flex-row items-center px-6 mb-1 py-2">
        <Text className="text-xl font-black text-foreground pr-2 tabular-nums">
          {dayNum}
        </Text>
        <View className="bg-muted/50 px-1.5 py-0.5 rounded-sm mr-2">
          <Text className="text-[10px] font-black text-muted-foreground uppercase">
            {dayName}
          </Text>
        </View>
        <Text className="text-[11px] font-medium text-muted-foreground/50 tracking-tight">
          {monthYear}
        </Text>
        <View className="flex-1" />
        <Text
          className={`text-[11px] font-bold tabular-nums ${dayTotal >= 0 ? 'text-emerald-600' : 'text-destructive/70'}`}
        >
          {dayTotal >= 0 ? '+' : '−'}₹
          {Math.abs(dayTotal).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
          })}
        </Text>
      </View>

      {/* Transaction Cards */}
      <View className="mx-5 rounded-md border border-border/30 bg-card/30 overflow-hidden">
        {transactions.map((t, idx) => (
          <View key={t.id}>
            <TransactionItem transaction={t} />
            {idx < transactions.length - 1 && (
              <View className="h-px bg-border/30 mx-5" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

export function TransactionHistory({
  historyByDate,
  isSearching,
}: TransactionHistoryProps) {
  const sortedDateKeys = Object.keys(historyByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  if (sortedDateKeys.length === 0) {
    return <ActivityEmptyState isSearching={isSearching} />;
  }

  return (
    <View className="pt-4">
      {sortedDateKeys.map(dateKey => (
        <DayGroup
          key={dateKey}
          dateKey={dateKey}
          transactions={historyByDate[dateKey]}
        />
      ))}
    </View>
  );
}
