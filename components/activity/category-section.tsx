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
  totalSpend: number;
};

const CategorySectionComponent = ({ category, transactions, typeFilter, totalSpend }: CategorySectionProps) => {
  // Filter transactions based on the selected type
  const filteredTransactions = transactions.filter(
    (t) => typeFilter === 'all' || t.type === typeFilter
  );

  // We only show the section if it has transactions after filtering
  if (filteredTransactions.length === 0) return null;

  // Calculate total for this specific category and filtered type
  const total = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  const percentage = totalSpend > 0 ? (total / totalSpend) * 100 : 0;

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <View className="flex-row items-center gap-2">
            <View className="w-1 h-3 rounded-full" style={{ backgroundColor: category.color }} />
            <Text className="text-sm font-bold text-foreground">{category.name}</Text>
            <Text className="text-[10px] font-bold text-muted-foreground tabular-nums">• {percentage.toFixed(0)}%</Text>
        </View>
        <Text className="text-sm font-black text-foreground">
          ₹{total.toLocaleString('en-IN')}
        </Text>
      </View>
      
      {/* Visual Progress Bar */}
      <View className="h-1.5 w-full bg-muted/40 rounded-md overflow-hidden mt-1">
        <View 
            className="h-full rounded-md" 
            style={{ 
                backgroundColor: category.color,
                width: `${percentage}%`
            }} 
        />
      </View>
      
      <View className="flex-row items-center justify-between mt-1.5 px-1">
         <Text className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'Transaction' : 'Transactions'}
         </Text>
      </View>
    </View>
  );
};

// We export both the dumb component (for merged views) and the observed one
export const CategorySection = CategorySectionComponent;

export const ObservedCategorySection = withObservables(['category'], ({ category }) => ({
  category: category.observe(),
  transactions: category.transactions.observe(),
}))(CategorySectionComponent);
