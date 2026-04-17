import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { MoreHorizontal } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface TotalBalanceProps {
  balance: number;
}

export const TotalBalance = ({ balance }: TotalBalanceProps) => {
  return (
    <View className="px-5 pt-6 pb-4">
      <Card className="bg-[#1C1C1E] border-0 rounded-[28px] p-5 shadow-xl relative overflow-hidden">
        {/* Abstract pattern decoration */}
        <View className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full" />

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white/60 text-xs font-medium uppercase tracking-widest">Total Balance</Text>
          <MoreHorizontal size={18} color="white" opacity={0.5} />
        </View>

        <Text className="text-white text-3xl font-bold tracking-tight mb-6">
          ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-white/30 text-[10px] font-mono tracking-[4px]">**** **** **** 1985</Text>
          <View className="flex-row">
            <View className="w-4 h-4 rounded-full bg-rose-500/80 -mr-1.5" />
            <View className="w-4 h-4 rounded-full bg-amber-500/80" />
          </View>
        </View>
      </Card>
    </View>
  );
};
