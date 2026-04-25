import { ActivityHeader } from '@/components/activity/activity-header';
import { ActivitySearchBar } from '@/components/activity/activity-search-bar';
import { CategoryBreakdown } from '@/components/activity/category-breakdown';
import { TransactionHistory } from '@/components/activity/transaction-history';
import { Category, database, Transaction } from '@/model';
import { useActivityFilters } from '@/hooks/use-activity-filters';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { ScrollView, View } from 'react-native';
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

  const {
    typeFilter,
    setTypeFilter,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    totalFilteredSpend,
    groupedByCategory,
    sortedCategoryNames,
    historyByDate,
  } = useActivityFilters(transactions);

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
        <CategoryBreakdown
          categories={categories}
          sortedCategoryNames={sortedCategoryNames}
          groupedByCategory={groupedByCategory}
          totalSpend={totalFilteredSpend}
        />

        <ActivitySearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <TransactionHistory
          historyByDate={historyByDate}
          isSearching={searchQuery.length > 0}
        />
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