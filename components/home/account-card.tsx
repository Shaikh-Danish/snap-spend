import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import Wallet, { WalletType } from "@/model/wallet";
import { CreditCard, Landmark, Wallet as WalletIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface AccountCardProps {
  account: Wallet;
}

const getWalletIcon = (type: WalletType) => {
  switch (type) {
    case WalletType.CREDIT_CARD: return <CreditCard size={20} color="white" />;
    case WalletType.SAVINGS: return <Landmark size={20} color="white" />;
    default: return <WalletIcon size={20} color="white" />;
  }
};

const getCardBg = (type: WalletType) => {
  switch (type) {
    case WalletType.CREDIT_CARD: return "bg-[#F97316]";
    case WalletType.SAVINGS: return "bg-[#7C3AED]";
    default: return "bg-[#10b981]";
  }
};

export const AccountCard = ({ account }: AccountCardProps) => {
  return (
    <Card className={`mr-3 w-60 h-36 border-0 ${getCardBg(account.type)} p-5 rounded-[24px] shadow-sm relative overflow-hidden`}>
      <View className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />

      <View className="flex-row justify-between items-start mb-4">
        <View className="bg-white/20 p-2 rounded-xl">
          {getWalletIcon(account.type)}
        </View>
        <Text className="text-white/40 text-[9px] font-mono tracking-widest">
          {account.walletId?.slice(-4) || 'CARD'}
        </Text>
      </View>

      <View className="mt-auto">
        <Text className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">{account.name}</Text>
        <Text className="text-white text-2xl font-bold tracking-tighter">
          ₹{account.balance?.toLocaleString(undefined, { minimumFractionDigits: 0 }) || "0"}
        </Text>
      </View>
    </Card>
  );
};
