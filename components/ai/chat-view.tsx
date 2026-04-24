import { ChatInput } from '@/components/ai/chat-input';
import { EmptyState } from '@/components/ai/empty-state';
import { MessageBubble } from '@/components/ai/message-bubble';
import ChatMessage from '@/model/chat-message';
import { LegendList } from '@legendapp/list';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

interface ChatViewProps {
  messages: ChatMessage[];
  streamingText: string;
  isGenerating: boolean;
  onSend: (text: string) => void;
  isReady: boolean;
}

export function ChatView({
  messages,
  streamingText,
  isGenerating,
  onSend,
  isReady,
}: ChatViewProps) {
  const listRef = useRef<any>(null);
  const hasContent = messages.length > 0 || streamingText !== '';

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        {/* Message list / empty state */}
        <View className="flex-1">
          {!hasContent ? (
            <EmptyState onSelectSuggestion={onSend} />
          ) : (
            <LegendList
              ref={listRef}
              data={messages}
              renderItem={({ item: msg }) => (
                <MessageBubble message={msg.content} isUser={msg.role === 'user'} />
              )}
              keyExtractor={(msg) => msg.id}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 24,
              }}
              recycleItems
              onContentSizeChange={() =>
                listRef.current?.scrollToEnd({ animated: true })
              }
              ListFooterComponent={
                streamingText ? (
                  <View className="mb-2">
                    <MessageBubble message={streamingText + '▌'} isUser={false} />
                  </View>
                ) : isGenerating ? (
                  <View className="flex-row items-center gap-2 px-4 py-2">
                    <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
                      <Text className="text-xs text-muted-foreground font-bold">AI</Text>
                    </View>
                    <View className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <Text className="text-muted-foreground text-sm tracking-widest">
                        •••
                      </Text>
                    </View>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* Input bar */}
        <ChatInput onSend={onSend} disabled={isGenerating || !isReady} />
      </View>
    </KeyboardAvoidingView>
  );
}
