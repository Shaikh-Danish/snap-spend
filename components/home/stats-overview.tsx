import { Q } from "@nozbe/watermelondb";
import withObservables from "@nozbe/with-observables";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { Dimensions, View } from "react-native";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

import { database } from "@/model";
import Transaction from "@/model/transaction";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface StatsCardsProps {
  earnings: number;
  spend: number;
  chartData: {
    earnings: number[];
    spend: number[];
    labels: string[];
  };
}

const ChartHeight = 80;
const ChartWidth = Dimensions.get("window").width - 40;

const LineChart = ({ data, color, gradientId }: { data: number[], color: string, gradientId: string }) => {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 5;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * (ChartWidth - 40),
    y: ChartHeight - padding - ((val - min) / range) * (ChartHeight - 2 * padding),
  }));

  const d = points.reduce((acc, p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ""
  );

  const fillD = `${d} L ${points[points.length - 1].x} ${ChartHeight} L ${points[0].x} ${ChartHeight} Z`;

  return (
    <>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={fillD} fill={`url(#${gradientId})`} />
      <Path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
};

export const StatsCards = ({ earnings, spend, chartData }: StatsCardsProps) => {
  return (
    <View className="px-5 mb-6">
      <View className="flex-row gap-3 mb-6">
        {/* Earnings Card */}
        <Card className="flex-1 p-4 bg-[#7C3AED] border-0 rounded-[20px] shadow-sm relative overflow-hidden">
          <View className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full" />
          <View className="flex-row justify-between items-start mb-2">
            <View className="bg-white/20 p-1.5 rounded-lg">
              <TrendingUp size={12} color="white" />
            </View>
          </View>
          <Text className="text-white/60 text-[9px] font-bold uppercase tracking-wider mb-0.5">Salary</Text>
          <Text className="text-white text-lg font-bold">₹{earnings.toLocaleString()}</Text>
        </Card>

        {/* Spend Card */}
        <Card className="flex-1 p-4 bg-[#F97316] border-0 rounded-[20px] shadow-sm relative overflow-hidden">
          <View className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full" />
          <View className="flex-row justify-between items-start mb-2">
            <View className="bg-white/20 p-1.5 rounded-lg">
              <TrendingDown size={12} color="white" />
            </View>
          </View>
          <Text className="text-white/60 text-[9px] font-bold uppercase tracking-wider mb-0.5">Expense</Text>
          <Text className="text-white text-lg font-bold">₹{spend.toLocaleString()}</Text>
        </Card>
      </View>

      {/* Analytics Compact Section */}
      <View className="bg-card/30 rounded-[24px] p-4 border border-muted/20">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-foreground/80 text-xs font-bold uppercase tracking-widest">Analytics</Text>
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <Text className="text-[8px] font-bold text-muted-foreground">IN</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <Text className="text-[8px] font-bold text-muted-foreground">OUT</Text>
            </View>
          </View>
        </View>

        <View style={{ height: ChartHeight, width: ChartWidth - 40 }} className="overflow-visible">
          <Svg height={ChartHeight} width={ChartWidth - 40}>
            <LineChart data={chartData.earnings} color="#7C3AED" gradientId="incomeGradCompact" />
            <LineChart data={chartData.spend} color="#F97316" gradientId="spendGradCompact" />
          </Svg>
        </View>

        <View className="flex-row justify-between mt-3 px-1">
          {chartData.labels.map((label, i) => (
            <Text key={i} className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const enhance = withObservables([], () => {
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
  fourMonthsAgo.setDate(1);
  fourMonthsAgo.setHours(0, 0, 0, 0);

  const transactionsQuery = database.collections
    .get<Transaction>("transactions")
    .query(
      Q.where("created_at", Q.gte(fourMonthsAgo.getTime())),
      Q.sortBy("created_at", Q.asc)
    );

  return {
    transactions: transactionsQuery,
  };
});

// Wrapper to process data
export const StatsOverview = enhance(({ transactions }: { transactions: Transaction[] }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getMonthData = (monthOffset: number) => {
    const targetDate = new Date(currentYear, currentMonth - monthOffset, 1);
    const m = targetDate.getMonth();
    const y = targetDate.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const d = t.createdAt;
      return d.getMonth() === m && d.getFullYear() === y;
    });

    const income = monthTransactions
      .filter((t) => t.type?.toLowerCase() === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) =>
        t.type?.toLowerCase() === "expense" ||
        t.type?.toLowerCase() === "spending" ||
        t.type?.toLowerCase() === "debit"
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      label: targetDate.toLocaleString('default', { month: 'short' })
    };
  };

  const m0 = getMonthData(0); // Current
  const m1 = getMonthData(1); // Prev
  const m2 = getMonthData(2); // Prev Prev

  const chartData = {
    earnings: [m2.income, m1.income, m0.income],
    spend: [m2.expense, m1.expense, m0.expense],
    labels: [m2.label, m1.label, m0.label]
  };

  return (
    <StatsCards
      earnings={m0.income}
      spend={m0.expense}
      chartData={chartData}
    />
  );
});
