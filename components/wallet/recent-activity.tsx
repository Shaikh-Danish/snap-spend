import { Text } from '@/components/ui/text';
import { database } from '@/model';
import Transaction from '@/model/transaction';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { View } from 'react-native';

type RecentActivityProps = {
  transactions: Transaction[]
}

function RecentActivity({ transactions }: RecentActivityProps) {
  if (!transactions.length) return null;

  return (
    <View className="px-6 pb-20">
      <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-[4px] mb-8">
        Recent Activity
      </Text>
      <View className="gap-8">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <View key={tx.id} className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="font-bold text-base text-foreground tracking-tight leading-5">
                  {tx.description}
                </Text>
                <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {tx.createdAt?.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View className="items-end">
                <Text className={`text-base font-black tracking-tighter ${isIncome ? 'text-primary' : 'text-foreground'}`}>
                  {isIncome ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                </Text>
                <View className={`w-4 h-0.5 mt-1.5 rounded-full ${isIncome ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const enhance = withObservables([], () => ({
  transactions: database.collections.get<Transaction>("transactions").query(Q.sortBy("created_at", Q.desc), Q.take(5))
}))

export default enhance(RecentActivity)