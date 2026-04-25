import { database, Wallet } from '@/model';
import withObservables from '@nozbe/with-observables';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar, ChevronDown, MoreVertical, Wallet as WalletIcon, X } from 'lucide-react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPicker } from '../category-picker';
import { NumericKeypad } from '../numeric-keypad';
import { AmountDisplay } from './amount-display';
import { useTransactionForm } from './use-transaction-form';

type AddTransactionFormProps = {
  wallets: Wallet[];
}

const AddTransactionFormComponent = ({ wallets }: AddTransactionFormProps) => {
  const { state, actions, control } = useTransactionForm(wallets);
  const { amount, type, categoryId, selectedDate, accountId, selectedWallet, showDatePicker, showWalletModal, errors } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom']}>
      {/* 1. Header */}
      <View className="flex-row items-center justify-between px-6 h-14">
        {/* Close Button */}
        <Pressable onPress={actions.handleCancel} className="p-2 -ml-2">
          <X size={24} color="#635b4b" />
        </Pressable>

        {/* Type Switcher */}
        <View className="flex-row bg-zinc-100 p-1 rounded-full">
          <Pressable
            onPress={() => actions.setValue('type', 'expense')}
            className={`px-4 py-1.5 rounded-full ${type === 'expense' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${type === 'expense' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Expense
            </Text>
          </Pressable>
          <Pressable
            onPress={() => actions.setValue('type', 'income')}
            className={`px-4 py-1.5 rounded-full ${type === 'income' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${type === 'income' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Income
            </Text>
          </Pressable>
        </View>

        <Pressable className="p-2 -mr-2">
          <MoreVertical size={24} color="#635b4b" />
        </Pressable>
      </View>

      {/* 2. Vertically Centered Amount */}
      <View className="flex-1 justify-center">
        <AmountDisplay amount={amount} />
      </View>

      {/* 3. Bottom Interaction Zone */}
      <View className="pb-4">
        {/* Metadata Row (Wallet & Date) */}
        <View className="flex-row items-center gap-2 px-6 mb-4">
          <Pressable
            onPress={() => actions.setShowWalletModal(true)}
            className={`flex-1 flex-row items-center justify-between bg-zinc-50 px-4 py-3 rounded-md ${errors.accountId ? 'border border-destructive' : ''}`}
          >
            <View className="flex-row items-center gap-2">
              <WalletIcon size={16} color="#A6A095" />
              <Text className="text-xs font-bold text-foreground/80" numberOfLines={1}>
                {selectedWallet?.name || 'Wallet'}
              </Text>
            </View>
            <ChevronDown size={14} color="#A6A095" />
          </Pressable>

          <Pressable
            onPress={actions.openDatePicker}
            className="flex-1 flex-row items-center justify-between bg-zinc-50 px-4 py-3 rounded-md"
          >
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#A6A095" />
              <Text className="text-[10px] font-bold text-foreground/80">
                {format(selectedDate, 'MMM dd, yy · hh:mm a')}
              </Text>
            </View>
            <ChevronDown size={14} color="#A6A095" />
          </Pressable>
        </View>

        {/* Note Input */}
        <View className="px-8 mb-8">
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="What is this for?"
                placeholderTextColor="#A6A095"
                className="text-base text-foreground font-medium py-2 border-b border-zinc-100"
                value={value}
                onChangeText={onChange}
                multiline={false}
                autoCorrect={false}
              />
            )}
          />
        </View>

        {/* Interaction Group */}
        <View>
          <View className="mb-6">
            <CategoryPicker
              selectedId={categoryId}
              onSelect={(id: string) => actions.setValue('category', id, { shouldValidate: true })}
            />
          </View>

          <NumericKeypad
            onPress={actions.handleNumberPress}
            onDelete={actions.handleDeletePress}
          />

          <View className="px-6 py-6">
            <Pressable
              onPress={actions.onSubmit}
              className="bg-primary py-4 rounded-md items-center justify-center active:opacity-80"
            >
              <Text className="text-primary-foreground text-sm font-bold uppercase tracking-[2px]">Save Transaction</Text>
            </Pressable>
            {errors.amount && (
              <Text className="text-destructive text-center text-xs mt-2 font-bold">{errors.amount.message}</Text>
            )}
            {errors.category && (
              <Text className="text-destructive text-center text-xs mt-2 font-bold">{errors.category.message}</Text>
            )}
            {errors.accountId && (
              <Text className="text-destructive text-center text-xs mt-2 font-bold">{errors.accountId.message}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Wallet Selection Modal */}
      <Modal visible={showWalletModal} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-center px-6"
          onPress={() => actions.setShowWalletModal(false)}
        >
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-lg font-bold mb-4">Select Wallet</Text>
            <ScrollView className="max-h-[400px]">
              {wallets.map(w => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => {
                    actions.setValue('accountId', w.id);
                    actions.setShowWalletModal(false);
                  }}
                  className={`flex-row items-center justify-between py-4 border-b border-zinc-50 ${accountId === w.id ? 'opacity-100' : 'opacity-50'}`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className={`w-1.5 h-1.5 rounded-full ${accountId === w.id ? 'bg-primary' : 'bg-muted'}`} />
                    <Text className="font-bold text-foreground">{w.name}</Text>
                  </View>
                  <Text className="text-xs font-bold text-muted-foreground">₹{w.balance.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* iOS only - declarative date picker */}
      {Platform.OS === 'ios' && showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="datetime"
          display="spinner"
          onChange={(event, date) => {
            actions.setShowDatePicker(false);
            if (event.type === 'set' && date) {
              actions.setValue('date', date, { shouldValidate: true });
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

export const AddTransactionForm = withObservables([], () => ({
  wallets: database.collections.get<Wallet>('wallets').query().observe(),
}))(AddTransactionFormComponent);
