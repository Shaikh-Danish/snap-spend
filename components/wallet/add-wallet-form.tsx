import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { WalletType } from '@/model/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as z from 'zod';

import {
  Banknote,
  Briefcase,
  CircleDollarSign,
  CreditCard,
  Lock,
  PiggyBank,
  TrendingUp,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import { ScrollView, TouchableOpacity } from 'react-native';

const TYPE_ICONS: Record<WalletType, any> = {
  [WalletType.SAVINGS]: PiggyBank,
  [WalletType.CURRENT]: CircleDollarSign,
  [WalletType.CREDIT_CARD]: CreditCard,
  [WalletType.DEBIT_CARD]: CreditCard,
  [WalletType.MUTUAL_FUNDS]: TrendingUp,
  [WalletType.STOCKS]: TrendingUp,
  [WalletType.BONDS]: Briefcase,
  [WalletType.CASH]: Banknote,
  [WalletType.WALLET]: WalletIcon,
  [WalletType.FIXED_DEPOSIT]: Lock,
};

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  balance: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && val !== '', {
    message: 'Balance must be a valid positive number',
  }),
  type: z.nativeEnum(WalletType),
  walletId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AddWalletFormProps = {
  onSubmit: (data: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export function AddWalletForm({ onSubmit, onCancel }: AddWalletFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      balance: '',
      type: WalletType.CURRENT,
      walletId: '',
    },
    mode: 'onChange',
  });

  return (
    <View className="gap-6 mt-4 pb-4">
      <View className="gap-2">
        <Label nativeID="name-label" className="text-foreground">Wallet Name</Label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="e.g. Chase Checkings"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              aria-labelledby="name-label"
              className={errors.name ? "border-destructive text-foreground" : "text-foreground"}
            />
          )}
        />
        {errors.name && <Text className="text-destructive text-xs">{errors.name.message}</Text>}
      </View>

      <View className="gap-2">
        <Label nativeID="type-label" className="text-foreground">Account Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {Object.values(WalletType).map((type) => {
                const IconComp = TYPE_ICONS[type] || WalletIcon;
                const isSelected = value === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => onChange(type)}
                    className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border ${
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'bg-secondary/30 border-border/50'
                    }`}
                  >
                    <IconComp size={14} color={isSelected ? 'white' : '#71717a'} />
                    <Text className={`text-xs font-semibold capitalize ${
                      isSelected ? 'text-white' : 'text-muted-foreground'
                    }`}>
                      {type.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.type && <Text className="text-destructive text-xs">{errors.type.message}</Text>}
      </View>

      <View className="gap-2">
        <Label nativeID="balance-label" className="text-foreground">Initial Balance (₹)</Label>
        <Controller
          control={control}
          name="balance"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="₹0.00"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              aria-labelledby="balance-label"
              className={errors.balance ? "border-destructive text-foreground" : "text-foreground"}
            />
          )}
        />
        {errors.balance && <Text className="text-destructive text-xs">{errors.balance.message}</Text>}
      </View>

      <View className="gap-2">
        <Label nativeID="wallet-id-label" className="text-foreground">Last 4 Digits / ID (Optional)</Label>
        <Controller
          control={control}
          name="walletId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="e.g. 1234"
              keyboardType="numeric"
              maxLength={4}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              aria-labelledby="wallet-id-label"
              className="text-foreground"
            />
          )}
        />
      </View>

      <View className="flex-row gap-4 mt-4">
        {onCancel && (
          <Button variant="outline" onPress={onCancel} className="flex-1">
            <Text>Cancel</Text>
          </Button>
        )}
        <Button onPress={handleSubmit(onSubmit)} className="flex-1" disabled={!isValid || isSubmitting}>
          <Text>{isSubmitting ? 'Adding...' : 'Add'}</Text>
        </Button>
      </View>
    </View>
  );
}
