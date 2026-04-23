import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type WalletBalanceProps = {
  totalBalance: number;
};

export function WalletBalance({ totalBalance }: WalletBalanceProps) {
  return (
    <View className="mb-14 mt-12 px-6">
      <Text className="text-[11px] font-black text-muted-foreground uppercase tracking-[4px] mb-2">
        Net Worth
      </Text>
      <View className="flex-row items-baseline gap-1">
        <Text className="text-sm font-black text-foreground opacity-40">₹</Text>
        <Text className="text-6xl font-black text-foreground tracking-tighter">
            {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </Text>
        <Text className="text-xl font-bold text-muted-foreground tracking-tighter">
            .{(totalBalance % 1).toFixed(2).split('.')[1]}
        </Text>
      </View>
    </View>
  );
}
