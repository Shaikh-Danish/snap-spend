import { CategorySection } from '@/components/activity/category-section';
import { Text } from '@/components/ui/text';
import { Category, Transaction } from '@/model';
import React from 'react';
import { View } from 'react-native';

type CategoryBreakdownProps = {
  categories: Category[];
  sortedCategoryNames: string[];
  groupedByCategory: Record<string, Transaction[]>;
  totalSpend: number;
};

export function CategoryBreakdown({
  categories,
  sortedCategoryNames,
  groupedByCategory,
  totalSpend,
}: CategoryBreakdownProps) {
  return (
    <View className="px-6 py-2">
      <View className="mt-4 mb-2">
        <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4">
          Spending by Category
        </Text>

        {sortedCategoryNames.length > 0 ? (
          <View className="bg-card/50 p-4 rounded-md border border-border/50">
            {sortedCategoryNames.map(name => {
              const category = categories.find(c => c.name === name) ||
                ({ name, color: '#94a3b8' } as Category);
              return (
                <CategorySection
                  key={name}
                  category={category}
                  transactions={groupedByCategory[name]}
                  typeFilter="all"
                  totalSpend={totalSpend}
                />
              );
            })}
          </View>
        ) : (
          <View className="py-6 items-center bg-muted/30 rounded-md border border-dashed border-border">
            <Text className="text-[10px] text-muted-foreground italic">
              No data discovered
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
