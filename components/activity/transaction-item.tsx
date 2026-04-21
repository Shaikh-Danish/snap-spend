import { Text } from '@/components/ui/text';
import Transaction from '@/model/transaction';
import {
  Car,
  Home,
  ShoppingBag,
  Ticket,
  Utensils,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

const CATEGORY_ICONS: Record<string, any> = {
  food: Utensils,
  shopping: ShoppingBag,
  transport: Car,
  housing: Home,
  utilities: Zap,
  entertainment: Ticket,
  default: ShoppingBag,
};

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-100 text-orange-600',
  shopping: 'bg-blue-100 text-blue-600',
  transport: 'bg-purple-100 text-purple-600',
  housing: 'bg-emerald-100 text-emerald-600',
  utilities: 'bg-yellow-100 text-yellow-600',
  entertainment: 'bg-rose-100 text-rose-600',
  default: 'bg-zinc-100 text-zinc-600',
};

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.amount < 0;
  const category = transaction.category?.toLowerCase() || 'default';
  const IconComp = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  const colorClasses = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  const bgClass = colorClasses.split(' ')[0];
  const textClass = colorClasses.split(' ')[1];

  return (
    <Pressable className="flex-row items-center justify-between py-4 px-4 active:bg-secondary/10">
      <View className="flex-row items-center flex-1">
        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${bgClass}`}>
          <IconComp size={22} className={textClass} />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-base font-bold text-foreground" numberOfLines={1}>
            {transaction.description || transaction.category}
          </Text>
          <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
            {transaction.type} • {transaction.status}
          </Text>
        </View>
      </View>
      <View className="items-end ml-4">
        <Text className={`text-base font-extrabold ${isExpense ? 'text-foreground' : 'text-emerald-600'}`}>
          {isExpense ? '' : '+'}{transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </Text>
      </View>
    </Pressable>
  );
}
