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
      <View className="w-full gap-3 items-start">
        {SUGGESTIONS.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onSelectSuggestion(item.label)}
            className="flex-row items-center gap-3 bg-muted/20 border border-border/40 px-5 py-4 rounded-[24px] active:scale-[0.98] transition-transform"
          >
            <item.icon size={16} className="text-muted-foreground" />
            <Text className="text-sm font-medium text-foreground/80">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
