import { Text } from '@/components/ui/text';
import { Category, Transaction } from '@/model';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { View } from 'react-native';
import { TransactionItem } from './transaction-item';

type CategorySectionProps = {
  category: Category;
  transactions: Transaction[];
  typeFilter: 'all' | 'expense' | 'income';
};

const CategorySectionComponent = ({ category, transactions, typeFilter }: CategorySectionProps) => {
  // Filter transactions based on the selected type
  const filteredTransactions = transactions.filter(
    (t) => typeFilter === 'all' || t.type === typeFilter
  );

  // We only show the section if it has transactions after filtering
  if (filteredTransactions.length === 0) return null;

  // Calculate total for this specific category and filtered type
  const total = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

  return (
    <View className="mb-8">
      {/* Category Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View className="flex-row items-center gap-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <Text className="text-lg font-black tracking-tight">{category.name}</Text>
          <View className="bg-secondary/30 px-2 py-0.5 rounded-lg">
            <Text className="text-[10px] font-bold text-muted-foreground">{filteredTransactions.length}</Text>
          </View>
        </View>
        <Text className="text-sm font-bold text-foreground">
          ₹{total.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* List of transactions for this category */}
      <View className="bg-card/50 border border-border/40 rounded-[28px] overflow-hidden shadow-sm">
        {filteredTransactions.map((t, idx) => (
          <View key={t.id}>
            <TransactionItem transaction={t} />
            {idx < filteredTransactions.length - 1 && (
              <View className="h-[1px] bg-border/20 mx-4" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// The magic happens here! 
// We observe the category AND its children transactions.
export const CategorySection = withObservables(['category'], ({ category }) => ({
  category: category.observe(),
  transactions: category.transactions.observe(),
}))(CategorySectionComponent);
