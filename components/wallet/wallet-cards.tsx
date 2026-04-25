import { Text } from '@/components/ui/text';
import Wallet from '@/model/wallet';
import { Plus, Wallet as WalletIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { WALLET_TYPE_ICONS } from './constants';

type WalletCardsProps = {
  wallets: Wallet[];
  onAddPress: () => void;
  onEditPress: (wallet: Wallet) => void;
};

export function WalletCards({ wallets, onAddPress, onEditPress }: WalletCardsProps) {
  return (
    <View className="px-6 mb-10">
      {/* List Header */}
      <View className="flex-row items-center justify-between mb-10">
        <View>
          <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-[4px] mb-1">
            Accounts
          </Text>
          <Text className="text-3xl font-black text-foreground tracking-tighter">
            Wallets
          </Text>
        </View>
        <Pressable
          onPress={onAddPress}
          className="bg-primary w-12 h-12 items-center justify-center rounded-full active:scale-90 transition-transform"
        >
          <Plus size={20} color="white" strokeWidth={3} />
        </Pressable>
      </View>

      {!wallets?.length ? (
        <View className="py-20 items-center justify-center">
          <View className="mb-6 opacity-20">
            <WalletIcon size={48} color="#635b4b" strokeWidth={1} />
          </View>
          <Text className="text-base font-bold text-foreground text-center">
            No active wallets
          </Text>
          <Text className="text-xs text-muted-foreground text-center mt-1 px-10 leading-4">
            Link your accounts to start tracking your net worth.
          </Text>
        </View>
      ) : (
        <View className="gap-10">
          {wallets.map((wallet) => {
            const Icon = WALLET_TYPE_ICONS[wallet.type] || WalletIcon;
            return (
              <Pressable
                key={wallet.id}
                onPress={() => onEditPress(wallet)}
                className="flex-row items-center justify-between active:opacity-60"
              >
                <View className="flex-row items-center gap-5">
                  <View className="w-10 h-10 items-center justify-center">
                    <Icon size={22} color="#635b4b" strokeWidth={2} />
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-foreground tracking-tight leading-5">
                      {wallet.name}
                    </Text>
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {wallet.type.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-xl font-black text-foreground tracking-tighter">
                    ₹{wallet.balance.toLocaleString('en-IN')}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <View className="w-1 h-1 rounded-full bg-primary/40" />
                    <Text className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      Available
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
