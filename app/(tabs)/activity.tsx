import { ActivitySummary } from '@/components/activity/activity-summary';
import { Category, database, Transaction } from '@/model';
import withObservables from '@nozbe/with-observables';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ActivityScreenProps = {
    transactions: Transaction[];
    categories: Category[];
}

const ActivityScreenComponent = ({ transactions, categories }: ActivityScreenProps) => {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6 pt-10">
                    <ActivitySummary transactions={transactions} categories={categories} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default withObservables([], () => ({
    transactions: database.collections.get<Transaction>('transactions').query().observe(),
    categories: database.collections.get<Category>('categories').query().observe(),
}))(ActivityScreenComponent);