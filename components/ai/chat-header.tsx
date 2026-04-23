import { Text } from '@/components/ui/text';
import { SquarePen } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export function ChatHeader() {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background">
      <Pressable className="p-2 -ml-2 active:opacity-50">
        <SquarePen size={22} className="text-foreground" strokeWidth={1.5} />
      </Pressable>

      <Text className="text-lg font-black text-foreground tracking-tight">Snap AI</Text>

      <Pressable className="bg-foreground px-4 py-1.5 rounded-full active:opacity-80">
        <Text className="text-background text-[11px] font-black uppercase tracking-wider">Sign In</Text>
      </Pressable>
    </View>
  );
}
