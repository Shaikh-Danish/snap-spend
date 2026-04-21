import { database } from '@/model';
import Wallet from '@/model/wallet';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type WalletPickerProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  wallets: Wallet[];
};

const WalletPickerComponent = ({ selectedId, onSelect, wallets }: WalletPickerProps) => {
  return (
    <View className="h-[42px]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 12, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {wallets.map(wallet => {
          const isSelected = selectedId === wallet.id;
          return (
            <Pressable 
              key={wallet.id}
              onPress={() => onSelect(wallet.id)}
              className="h-[40px] items-center justify-center"
            >
              <View 
                className={`px-5 py-2 rounded-md border flex-row items-center gap-2 ${
                  isSelected ? 'bg-primary border-primary' : 'bg-secondary/10 border-transparent'
                }`}
              >
                <View className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : 'bg-primary/40'}`} />
                <Text 
                  className={`text-xs font-bold tracking-tight ${isSelected ? 'text-white' : 'text-foreground/90'}`}
                >
                  {wallet.name}
                </Text>
                <Text 
                  className={`text-[10px] font-bold ${isSelected ? 'text-white/70' : 'text-muted-foreground/60'}`}
                >
                  ₹{wallet.balance.toLocaleString()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const WalletPicker = withObservables([], () => ({
  wallets: database.collections.get<Wallet>('wallets').query().observe(),
}))(WalletPickerComponent);
