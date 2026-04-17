import { Text } from "@/components/ui/text";
import Transaction from "@/model/transaction";
import { Car, Coffee, Home, ShoppingBag, Smartphone } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface TransactionItemProps {
  transaction: Transaction;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('coffee')) return <Coffee size={20} color="#09090b" />;
  if (cat.includes('shop')) return <ShoppingBag size={20} color="#09090b" />;
  if (cat.includes('car') || cat.includes('transport')) return <Car size={20} color="#09090b" />;
  if (cat.includes('rent') || cat.includes('home')) return <Home size={20} color="#09090b" />;
  return <Smartphone size={20} color="#09090b" />;
};

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  return (
    <View className="flex-row items-center justify-between mb-2.5 bg-white p-3 rounded-[20px] shadow-sm border border-muted/20">
      <View className="flex-row items-center gap-3">
        <View className="bg-secondary p-2 rounded-xl">
          {getCategoryIcon(transaction.category)}
        </View>
        <View>
          <Text className="text-foreground font-bold text-sm tracking-tight">{transaction.description}</Text>
          <Text className="text-muted-foreground text-[10px]">{transaction.category}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-bold text-sm ${transaction.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </Text>
        <Text className="text-muted-foreground text-[9px]">
          {transaction.createdAt.toLocaleDateString('default', { day: '2-digit', month: 'short' })}
        </Text>
      </View>
    </View>
  );
};
