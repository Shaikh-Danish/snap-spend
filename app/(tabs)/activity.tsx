import { ActivityEmptyState } from '@/components/activity/activity-empty-state';
import { TypeFilter } from '@/components/activity/activity-filter-dialog';
import { ActivityHeader } from '@/components/activity/activity-header';
import { CategorySection } from '@/components/activity/category-section';
import {
  DateRange,
  DateRangePicker,
} from '@/components/activity/date-range-picker';
import { TransactionItem } from '@/components/activity/transaction-item';
import { Text } from '@/components/ui/text';
import { Category, database, Transaction } from '@/model';
import withObservables from '@nozbe/with-observables';
import { endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActivityScreenProps = {
  transactions: Transaction[];
  categories: Category[];
};

const ActivityScreenComponent = ({
  transactions = [],
  categories = [],
}: ActivityScreenProps) => {
  const insets = useSafeAreaInsets();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('expense');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter);

    // Date range filtering
    if (dateRange.start && dateRange.end) {
      const start = startOfDay(dateRange.start);
      const end = endOfDay(dateRange.end);
      list = list.filter(t => {
        const txDate = new Date(t.date);
        return isWithinInterval(txDate, { start, end });
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        t =>
          t.description?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query)
      );
    }

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, typeFilter, dateRange, searchQuery]);

  const totalFilteredSpend = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );
  }, [filteredTransactions]);

  const groupedByCategory = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const name = t.category || 'Uncategorized';
        if (!acc[name]) acc[name] = [];
        acc[name].push(t);
        return acc;
      },
      {} as Record<string, Transaction[]>
    );
  }, [filteredTransactions]);

  const sortedCategoryNames = useMemo(() => {
    return Object.keys(groupedByCategory).sort((a, b) => {
      const totalA = groupedByCategory[a].reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0
      );
      const totalB = groupedByCategory[b].reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0
      );
      return totalB - totalA;
    });
  }, [groupedByCategory]);

  const historyByDate = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const date = new Date(t.date);
        const dateStr = format(date, 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(t);
        return acc;
      },
      {} as Record<string, Transaction[]>
    );
  }, [filteredTransactions]);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 5) }}
    >
      <ActivityHeader
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* SUMMARY */}
        <View className="px-6 py-2">
          {/* <ActivitySummary
            transactions={filteredTransactions}
            categories={categories}
          /> */}

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
                      totalSpend={totalFilteredSpend}
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

        {/* STICKY FILTERS — Date range picker + Search */}
        <View className="px-6 py-3 bg-background border-y border-border/50">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center flex-1 bg-muted/30 rounded-md px-3 h-10 border border-border/30">
              <Search size={14} className="text-muted-foreground" />
              <TextInput
                placeholder="Search..."
                className="flex-1 ml-2 text-sm font-medium text-foreground"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#a1a1aa"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={14} className="text-muted-foreground" />
                </Pressable>
              )}
            </View>

            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </View>
        </View>

        {/* TRANSACTION HISTORY */}
        <View className="pt-4">
          {Object.keys(historyByDate).length > 0 ? (
            <View>
              {Object.keys(historyByDate)
                .sort((a, b) => b.localeCompare(a))
                .map(dateKey => {
                  const date = new Date(dateKey);
                  const dayNum = format(date, 'd');
                  const dayName = format(date, 'EEE');
                  const monthYear = format(date, 'MMM yyyy');

                  // Calculate daily total
                  const dayTotal = historyByDate[dateKey].reduce(
                    (sum, t) =>
                      sum +
                      (t.type === 'income'
                        ? Math.abs(t.amount)
                        : -Math.abs(t.amount)),
                    0
                  );

                  return (
                    <View key={dateKey} className="mb-2">
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
                        {historyByDate[dateKey].map((t, idx) => (
                          <View key={t.id}>
                            <TransactionItem transaction={t} />
                            {idx < historyByDate[dateKey].length - 1 && (
                              <View className="h-px bg-border/30 mx-5" />
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
            </View>
          ) : (
            <ActivityEmptyState isSearching={searchQuery.length > 0} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const enhance = withObservables([], () => ({
  transactions: database.collections
    .get<Transaction>('transactions')
    .query()
    .observe(),
  categories: database.collections
    .get<Category>('categories')
    .query()
    .observe(),
}));

export default enhance(ActivityScreenComponent);