import { Q } from "@nozbe/watermelondb";
import withObservables from "@nozbe/with-observables";
import React from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { database } from "@/model";
import Wallet from "@/model/wallet";

import { AccountCard } from "@/components/home/account-card";
import { StatsOverview } from "@/components/home/stats-overview";
import { TotalBalance } from "@/components/home/total-balance";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react-native";

import { TransactionItem } from "@/components/home/transaction-item";
import Transaction from "@/model/transaction";

interface HomeProps {
  accounts: Wallet[];
  recentTransactions: Transaction[];
}

const Home = ({ accounts, recentTransactions }: HomeProps) => {
  const insets = useSafeAreaInsets();
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <ScrollView
      className="flex-1 bg-[#FDFDFF]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Top Header Compact */}
      <View
        className="px-5 pb-2 flex-row justify-between items-center"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center gap-2.5">
          <Avatar alt="" className="w-9 h-9 border border-muted/50">
            <AvatarImage src="https://ui-avatars.com/api/?name=User&background=7C3AED&color=fff" />
            <AvatarFallback>
              <Text>U</Text>
            </AvatarFallback>
          </Avatar>
        </View>
        <Text className="text-foreground text-lg font-bold">Dashboard</Text>
        <TouchableOpacity className="bg-white p-2 rounded-full shadow-sm border border-muted/20">
          <View className="relative">
            <Bell size={18} color="#09090b" />
            <View className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Header Summary */}
      <TotalBalance balance={totalBalance} />

      {/* Stats Cards & Chart */}
      <StatsOverview />

      {/* Accounts Horizontal Scroll Compact */}
      <View className="mb-6">
        <View className="px-5 mb-4 flex-row justify-between items-center">
          <Text className="text-foreground text-lg font-bold tracking-tight">Accounts</Text>
          <TouchableOpacity>
            <Text className="text-primary text-xs font-bold">See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AccountCard account={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListEmptyComponent={
            <View className="w-screen pr-12">
              <Card className="border-dashed border border-muted/50 h-32 items-center justify-center rounded-[24px]">
                <Text className="text-muted-foreground text-xs">No accounts added yet</Text>
              </Card>
            </View>
          }
        />
      </View>

      {/* Recent Transactions Section Compact */}
      <View className="px-5 mb-8">
        <View className="mb-4 flex-row justify-between items-center">
          <Text className="text-foreground text-lg font-bold tracking-tight">Transactions</Text>
          <TouchableOpacity>
            <Text className="text-primary text-xs font-bold">View All</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))
        ) : (
          <View className="bg-white p-6 rounded-[32px] border border-muted/20 items-center">
            <Text className="text-muted-foreground">No recent transactions</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const enhance = withObservables([], () => ({
  accounts: database.collections.get<Wallet>("wallets").query(),
  recentTransactions: database.collections
    .get<Transaction>("transactions")
    .query(Q.sortBy("created_at", Q.desc), Q.take(5)),
}));

export default enhance(Home);