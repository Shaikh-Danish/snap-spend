import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

export function MessageBubble({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) {
  return (
    <View
      className={`mb-6 max-w-[90%] ${
        isUser ? 'self-end items-end' : 'self-start items-start'
      }`}
    >
      <View
        className={`px-4 py-3 rounded-md shadow-sm ${
          isUser
            ? 'bg-primary border border-primary/20'
            : 'bg-card border border-border'
        }`}
      >
        <Text
          className={`text-[15px] leading-6 ${
            isUser ? 'text-primary-foreground font-medium' : 'text-foreground'
          }`}
        >
          {message}
        </Text>
      </View>
      <Text className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-2 px-1">
        {isUser ? 'Personal Assistant' : 'Snap AI Engine'}
      </Text>
    </View>
  );
}
