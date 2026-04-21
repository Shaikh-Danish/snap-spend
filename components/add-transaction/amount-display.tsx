import React from 'react';
import { Text, View } from 'react-native';

type AmountDisplayProps = {
  amount: string;
};

export const AmountDisplay = ({ amount }: AmountDisplayProps) => (
  <View className="items-center justify-center py-6">
    <Text className="text-7xl font-bold tracking-tighter text-foreground">
      ₹{amount || '0'}
    </Text>
  </View>
);
