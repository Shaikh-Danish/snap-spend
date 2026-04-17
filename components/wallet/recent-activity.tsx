import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { database } from '@/model';
import Transaction from '@/model/transaction';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { ArrowRight, ShoppingCart } from 'lucide-react-native';
import { View } from 'react-native';

type RecentActivityProps = {
  transactions: Transaction[]
}

function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <View className="px-4 pb-12">
      <Text className="text-lg font-bold mb-4">Recent Activity</Text>
      <View className="gap-6">
        {transactions.map((tx) => {
          const TransactionIcon = tx.type === 'income' ? ArrowRight : ShoppingCart;
          return (
            <View key={tx.id} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <Avatar className="w-12 h-12 bg-secondary items-center justify-center" alt={tx.description}>
                  <AvatarFallback>
                    <Icon as={TransactionIcon} className="size-5 text-foreground" />
                  </AvatarFallback>
                </Avatar>
                <View>
                  <Text className="font-semibold text-base">{tx.description}</Text>
                  <Text className="text-xs text-muted-foreground">{tx.createdAt?.toLocaleDateString()}</Text>
                </View>
              </View>
              <Text className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-foreground'}`}>
                {tx.amount > 0 ? '+₹' : '₹'}{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
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