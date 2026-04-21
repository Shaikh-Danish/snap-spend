import { DonutChart } from '@/components/activity/donut-chart';
import { Category, Transaction } from '@/model';
import React from 'react';
import { Text, View } from 'react-native';

type ActivitySummaryProps = {
  transactions: Transaction[];
  categories: Category[];
};

export const ActivitySummary = ({ transactions, categories }: ActivitySummaryProps) => {
  const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Group transactions by category
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => {
    const category = categories.find(c => c.name === name);
    return {
      name,
      value,
      color: category?.color || '#E5E7EB',
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <View>
      <View className="mb-10 items-center">
        <DonutChart 
          data={chartData} 
          centerValue={`₹${total.toLocaleString()}`}
          centerLabel="Spend"
        />
      </View>

      <View className="gap-6">
        {chartData.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-base font-bold text-foreground">
                {item.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-base font-bold text-foreground">
                ₹{item.value.toLocaleString()}
              </Text>
              <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                {((item.value / total) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
