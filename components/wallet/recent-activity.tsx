import { Text } from '@/components/ui/text';
import { database } from '@/model';
import Transaction from '@/model/transaction';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { format } from 'date-fns';
import { View } from 'react-native';
import { TransactionItem } from '../activity/transaction-item';

type RecentActivityProps = {
  transactions: Transaction[]
}

function RecentActivity({ transactions }: RecentActivityProps) {
  if (!transactions.length) return null;

  return (
    <View className="px-6 pb-32">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-[4px]">
          Recent Activity
        </Text>
        <Text className="text-[10px] font-semibold text-muted-foreground/50">
          Last {transactions.length} entries
        </Text>
      </View>
      <View className="bg-card/40 border border-border/30 rounded-md overflow-hidden">
        {transactions.map((tx, idx) => (
          <View key={tx.id}>
            <TransactionItem transaction={tx} />
            {idx < transactions.length - 1 && (
              <View className="h-px bg-border/30 mx-5" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const enhance = withObservables([], () => ({
  transactions: database.collections.get<Transaction>("transactions").query(
    Q.sortBy("date", Q.desc),
    Q.take(5)
  ).observe()
}))

export default enhance(RecentActivity)