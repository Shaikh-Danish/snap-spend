import { ChatInput } from '@/components/ai/chat-input';
import { EmptyState } from '@/components/ai/empty-state';
import { MessageBubble } from '@/components/ai/message-bubble';
import ChatMessage from '@/model/chat-message';
import { LegendList } from '@legendapp/list';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';

interface ChatViewProps {
  messages: ChatMessage[];
  streamingText: string;
  isGenerating: boolean;
  onSend: (text: string) => void;
  isReady: boolean;
}

/**
 * Hook that tracks keyboard height on Android (edge-to-edge) and iOS.
 * On Android with edgeToEdge, KeyboardAvoidingView doesn't work because
 * windowSoftInputMode is set to adjustNothing. We manually listen for
 * keyboard events and return an animated value for bottom padding.
 */
function useKeyboardHeight() {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? 250 : 150,
        useNativeDriver: false,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 200 : 100,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
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
  const keyboardHeight = useKeyboardHeight();

  const content = (
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
  );

  // On Android with edge-to-edge, KeyboardAvoidingView doesn't work
  // because windowSoftInputMode is adjustNothing. Use manual padding instead.
  if (Platform.OS === 'android') {
    return (
      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        {content}
      </Animated.View>
    );
  }

  // On iOS, KeyboardAvoidingView works fine
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      style={{ flex: 1 }}
    >
      {content}
    </KeyboardAvoidingView>
  );
}
