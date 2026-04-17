import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import Wallet from '@/model/wallet';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type WalletCardsProps = {
  wallets: Wallet[];
  onAddPress: () => void;
};

const CARD_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-zinc-900',
  'bg-violet-600',
  'bg-rose-600'
];

export function WalletCards({ wallets, onAddPress }: WalletCardsProps) {
  return (
    <View className="mb-2 px-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold">All Accounts</Text>
        <Pressable onPress={onAddPress} className="flex-row items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
          <Icon as={Plus} className="size-4 text-foreground" />
          <Text className="text-xs font-semibold">Add</Text>
        </Pressable>
      </View>

      {!wallets?.length ? (
        <View className="bg-secondary/20 border border-dashed border-border rounded-3xl p-8 items-center justify-center">
          <View className="bg-secondary/40 w-16 h-16 rounded-full items-center justify-center mb-4">
            <Icon as={Plus} className="size-8 text-muted-foreground" />
          </View>
          <Text className="text-base font-bold text-foreground mb-1">No Accounts Yet</Text>
          <Text className="text-sm text-muted-foreground text-center mb-6">
            Add your first bank account, credit card, or wallet to start tracking.
          </Text>
          <Pressable
            onPress={onAddPress}
            className="bg-primary px-6 py-3 rounded-2xl active:opacity-80"
          >
            <Text className="text-white font-bold text-sm">Add Primary Account</Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-4">
          {wallets.map((wallet, index) => {
            const colorClass = CARD_COLORS[index % CARD_COLORS.length];
            return (
              <View key={wallet.id} className="flex-row items-center justify-between bg-card p-4 rounded-3xl border border-border">
                <View className="flex-row items-center gap-4">
                  <View className={`w-12 h-12 rounded-full items-center justify-center ${colorClass}`}>
                    <Text className="text-white font-extrabold text-xl">{wallet.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="text-base font-bold text-foreground">
                      {wallet.name}
                    </Text>
                    <Text className="text-xs font-medium text-muted-foreground uppercase mt-0.5">
                      {wallet.type.replace(/_/g, ' ')} {wallet.walletId ? `• ${wallet.walletId}` : ''}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-extrabold tracking-tight text-foreground">
                  ₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
