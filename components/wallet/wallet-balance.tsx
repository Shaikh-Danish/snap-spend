import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type WalletBalanceProps = {
  totalBalance: number;
};

export function WalletBalance({ totalBalance }: WalletBalanceProps) {
  return (
    <View className="mb-6 mt-12 items-center">
      <Text className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-widest">
        Total Balance
      </Text>
      <Text className="text-5xl font-extrabold tracking-tighter">
        ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
    </View>
  );
}
