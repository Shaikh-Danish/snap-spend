import { Text } from '@/components/ui/text';
import { BarChart3, BrainCircuit, Wallet } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

const SUGGESTIONS = [
  { icon: BarChart3, label: "Summarize my spending this week" },
  { icon: Wallet, label: "How can I save more on groceries?" },
  { icon: BrainCircuit, label: "Analyze my recurring subscriptions" },
];

export function EmptyState({ onSelectSuggestion }: { onSelectSuggestion: (text: string) => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Central Logo / Icon */}
      {/* <View className="mb-12 opacity-10">
        <Sparkles size={80} className="text-foreground" strokeWidth={1} />
      </View> */}

      {/* Suggestion Pills */}
      <View className="w-full gap-3 items-stretch">
        <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Suggested Inquiries</Text>
        {SUGGESTIONS.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onSelectSuggestion(item.label)}
            className="flex-row items-center gap-3 bg-card border border-border px-5 py-4 rounded-md active:bg-muted shadow-xs"
          >
            <item.icon size={16} className="text-primary" strokeWidth={2.5} />
            <Text className="text-sm font-bold text-foreground/90">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
