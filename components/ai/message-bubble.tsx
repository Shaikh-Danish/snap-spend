import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export function MessageBubble({ message, isUser }: { message: string, isUser: boolean }) {
  return (
    <View className={`mb-6 max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
      <View className={`px-5 py-3 rounded-[24px] ${isUser ? 'bg-primary' : 'bg-muted/30 border border-border/20'}`}>
        <Text className={`text-[15px] leading-6 ${isUser ? 'text-primary-foreground font-medium' : 'text-foreground'}`}>
          {message}
        </Text>
      </View>
      <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-2">
        {isUser ? 'You' : 'Snap AI'}
      </Text>
    </View>
  );
}
