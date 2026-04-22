import { Text } from '@/components/ui/text';
import Wallet from '@/model/wallet';
import { Plus, Wallet as WalletIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type WalletCardsProps = {
  wallets: Wallet[];
  onAddPress: () => void;
};

export function WalletCards({ wallets, onAddPress }: WalletCardsProps) {
  return (
    <View className="mb-2 px-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-2xl font-bold text-foreground">Wallets</Text>
          <Text className="text-sm text-muted-foreground">Manage your money</Text>
        </View>
        <Pressable
          onPress={onAddPress}
          className="bg-muted w-10 h-10 items-center justify-center rounded-full active:opacity-70"
        >
          <Plus size={20} className="text-foreground" strokeWidth={2.5} />
        </Pressable>
      </View>

      {!wallets?.length ? (
        <View className="py-20 items-center justify-center">
          {/* Minimal Icon centered */}
          <View className="mb-6 opacity-20">
            <WalletIcon size={64} className="text-foreground" strokeWidth={1} />
          </View>

          <Text className="text-lg font-bold text-foreground text-center mb-2">
            No Wallets Added
          </Text>
          <Text className="text-sm text-muted-foreground text-center px-12 mb-10 leading-5">
            Add a bank account or cash wallet to start tracking your balances.
          </Text>

          <Pressable
            onPress={onAddPress}
            className="bg-primary px-10 py-3.5 rounded-xl active:opacity-90"
          >
            <Text className="text-primary-foreground font-bold text-sm uppercase tracking-widest">
              Add Wallet
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-4">
          {wallets.map((wallet) => (
            <View
              key={wallet.id}
              className="flex-row items-center justify-between bg-card p-5 rounded-[20px] border border-border shadow-sm"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-muted items-center justify-center">
                  <Text className="text-foreground font-bold text-lg">{wallet.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text className="text-base font-bold text-foreground">
                    {wallet.name}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {wallet.type.replace(/_/g, ' ')}
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold tracking-tight text-foreground">
                ₹{wallet.balance.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
