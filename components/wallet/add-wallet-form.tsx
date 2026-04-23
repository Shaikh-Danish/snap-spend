import { WalletType } from '@/model/wallet';
import { ChevronDown, Wallet as WalletIcon, X } from 'lucide-react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountDisplay } from '../add-transaction/amount-display';
import { NumericKeypad } from '../numeric-keypad';
import { WALLET_TYPE_ICONS } from './constants';
import { useWalletForm } from './use-wallet-form';

type AddWalletFormProps = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
};

export const AddWalletForm = ({ onCancel, onSubmit }: AddWalletFormProps) => {
  const { state, actions, control } = useWalletForm({ onSuccess: onCancel });
  const { balance, type, name, walletId, isTypeModalOpen, errors } = state;

  const CurrentIcon = WALLET_TYPE_ICONS[type] || WalletIcon;

  return (
    <Modal visible transparent={false} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom']}>
        {/* 1. Header */}
        <View className="flex-row items-center justify-between px-6 h-14 border-b border-zinc-50">
          <Pressable onPress={onCancel} className="p-2 -ml-2">
            <X size={24} color="#635b4b" />
          </Pressable>
          <Text className="text-foreground font-black text-[10px] uppercase tracking-[4px]">
            New Wallet
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* 2. Balance Display */}
          <View className="py-10 items-center justify-center">
            <AmountDisplay amount={balance} />
            <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-2">
              Starting Balance
            </Text>
          </View>

          {/* 3. Form Inputs */}
          <View className="px-8 gap-8">
            {/* Wallet Name */}
            <View>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="E.g. HDFC Bank"
                    placeholderTextColor="#A6A095"
                    className={`text-2xl text-foreground font-bold py-2 border-b-2 ${errors.name ? 'border-destructive' : 'border-zinc-100'}`}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.name ? (
                <Text className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-2 ml-1">
                  {errors.name.message}
                </Text>
              ) : (
                <Text className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 ml-1">
                  Wallet Label
                </Text>
              )}
            </View>

            {/* Type & ID Row */}
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={() => actions.setShowTypeModal(true)}
                className="flex-1 flex-row items-center justify-between bg-zinc-50 px-5 py-4 rounded-2xl border border-zinc-100"
              >
                <View className="flex-row items-center gap-3">
                  <CurrentIcon size={18} color="#27272a" />
                  <Text className="text-sm font-bold text-foreground capitalize">
                    {type.replace(/_/g, ' ')}
                  </Text>
                </View>
                <ChevronDown size={14} color="#A6A095" />
              </Pressable>

              <View className="flex-1">
                <View className={`bg-zinc-50 px-5 py-4 rounded-2xl border ${errors.walletId ? 'border-destructive' : 'border-zinc-100'}`}>
                  <Controller
                    control={control}
                    name="walletId"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="ID (Last 4 Digit)"
                        placeholderTextColor="#A6A095"
                        className="text-sm font-bold text-foreground p-0"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
            {errors.walletId && (
              <Text className="text-[9px] font-bold text-destructive uppercase tracking-widest -mt-4 ml-1">
                {errors.walletId.message}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* 4. Keypad & Action */}
        <View className="bg-white pt-4 shadow-2xl">
          <NumericKeypad
            onPress={actions.handleNumberPress}
            onDelete={actions.handleDeletePress}
          />
          <View className="px-6 py-6 border-t border-zinc-50">
            <Pressable
              onPress={actions.onSubmit}
              className={`py-4.5 rounded-[20px] items-center justify-center ${name && walletId ? 'bg-primary' : 'bg-zinc-100 opacity-50'
                }`}
            >
              <Text className="text-primary-foreground text-sm font-black uppercase tracking-[3px]">
                Connect Wallet
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Wallet Type Modal */}
        <Modal visible={isTypeModalOpen} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-black/60 justify-end"
            onPress={() => actions.setShowTypeModal(false)}
          >
            <View className="bg-white rounded-t-[40px] p-8 pb-12">
              <View className="w-12 h-1.5 bg-zinc-100 rounded-full self-center mb-8" />
              <Text className="text-xl font-black text-foreground mb-6">Select Wallet Type</Text>
              <ScrollView className="max-h-[400px]">
                <View className="flex-row flex-wrap gap-3">
                  {Object.values(WalletType).map((wType) => {
                    const TypeIcon = WALLET_TYPE_ICONS[wType] || WalletIcon;
                    const isSelected = type === wType;
                    return (
                      <TouchableOpacity
                        key={wType}
                        onPress={() => {
                          actions.setValue('type', wType);
                          actions.setShowTypeModal(false);
                        }}
                        className={`flex-row items-center gap-3 px-5 py-4 rounded-2xl border ${isSelected ? 'bg-primary border-primary' : 'bg-zinc-50 border-zinc-100'
                          }`}
                      >
                        <TypeIcon size={18} color={isSelected ? 'white' : '#27272a'} />
                        <Text className={`font-bold text-xs capitalize ${isSelected ? 'text-white' : 'text-foreground'}`}>
                          {wType.replace(/_/g, ' ')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};
