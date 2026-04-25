import { useRouter } from 'expo-router';
import { ChevronLeft, SquarePen } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function ChatHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => router.navigate('/(tabs)')}
          className="w-10 h-10 items-center justify-center rounded-md border border-border bg-card shadow-xs active:bg-muted"
        >
          <ChevronLeft size={20} className="text-foreground" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View className="items-center">
        <Text className="text-lg font-black tracking-tight text-foreground uppercase">Snap AI</Text>
        <View className="flex-row items-center gap-1">
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
          <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">On-Device AI</Text>
        </View>
      </View>

      <Pressable className="w-10 h-10 items-center justify-center rounded-md border border-border bg-card shadow-xs active:bg-muted">
        <SquarePen size={18} className="text-foreground" strokeWidth={2} />
      </Pressable>
    </View>
  );
}
