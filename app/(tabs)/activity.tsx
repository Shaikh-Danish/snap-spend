import { ActivityEmptyState } from '@/components/activity/activity-empty-state';
import { TypeFilter } from '@/components/activity/activity-filter-dialog';
import { ActivityHeader } from '@/components/activity/activity-header';
import { ActivitySummary } from '@/components/activity/activity-summary';
import { CategorySection } from '@/components/activity/category-section';
import { Category, database, Transaction } from '@/model';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ActivityScreenProps = {
  transactions: Transaction[];
  categories: Category[];
};

const ActivityScreenComponent = ({
  transactions = [], // We keep this for the Summary chart
  categories = [],
}: ActivityScreenProps) => {
  const insets = useSafeAreaInsets();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('expense');

  // Filter transactions for the summary chart
  const filteredTransactions = transactions.filter(
    (t) => typeFilter === 'all' || t.type === typeFilter
  );

  console.log(filteredTransactions);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Math.max(insets.top, 10) }}
    >
      <ActivityHeader
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        <View className="px-6 py-6">
          {filteredTransactions.length > 0 ? (
            <>
              {/* Overall Summary Chart */}
              <ActivitySummary
                transactions={filteredTransactions}
                categories={categories}
              />

              {/* Category-wise Breakdown with individual transactions */}
              <View className="mt-8">
                {categories.map((category) => (
                  <CategorySection 
                    key={category.id} 
                    category={category} 
                    typeFilter={typeFilter}
                  />
                ))}
              </View>
            </>
          ) : (
            <ActivityEmptyState isSearching={false} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const enhance = withObservables([], () => ({
  // We fetch both so we can show the big chart AND individual sections
  transactions: database.collections.get<Transaction>('transactions').query(),
  categories: database.collections.get<Category>('categories').query(),
}));

export default enhance(ActivityScreenComponent);