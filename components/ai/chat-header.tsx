import { useRouter } from 'expo-router';
import { ChevronLeft, SquarePen } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function ChatHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-background">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => router.navigate('/(tabs)')}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-muted/20"
        >
          <ChevronLeft size={24} className="text-foreground" strokeWidth={2} />
        </Pressable>

      </View>

      <Text className="text-xl font-bold tracking-tight text-foreground">Snap AI</Text>

      <Pressable className="w-10 h-10 items-center justify-center rounded-full active:bg-muted/20">
        <SquarePen size={22} className="text-foreground" strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}
