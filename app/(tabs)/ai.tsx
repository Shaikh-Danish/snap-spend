import { ChatHeader } from '@/components/ai/chat-header';
import { ChatInput } from '@/components/ai/chat-input';
import { EmptyState } from '@/components/ai/empty-state';
import { MessageBubble } from '@/components/ai/message-bubble';
import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';
import { LegendList } from "@legendapp/list";
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { map, of, switchMap } from 'rxjs';

interface AiScreenProps {
  thread: ChatThread | null;
  messages: ChatMessage[];
}

const items = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
];

const AiScreenContent = ({ thread, messages }: AiScreenProps) => {
  const listRef = useRef<any>(null);

  const handleSend = async (text: string) => {
    try {
      let activeThread = thread;

      if (!activeThread) {
        await database.write(async () => {
          activeThread = await database.get<ChatThread>('chat_threads').create((t) => {
            t.title = text.slice(0, 50);
          });
        });
      }

      if (!activeThread) return;

      await database.write(async () => {
        await database.get<ChatMessage>('chat_messages').create((m) => {
          m.thread.set(activeThread!);
          m.content = text;
          m.role = 'user';
          m.status = 'sent';
        });
      });

      setTimeout(async () => {
        await database.write(async () => {
          await database.get<ChatMessage>('chat_messages').create((m) => {
            m.thread.set(activeThread!);
            m.content = "I'm your Snap AI assistant. I've recorded your message properly in my local history. I can help you analyze your spending or manage your wallets!";
            m.role = 'assistant';
            m.status = 'sent';
          });
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="bg-background" />
      <ChatHeader />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}
      >
        <View className="flex-1">
          {/* Scrollable Content / Empty State Area */}
          <View className="flex-1">
            {messages.length === 0 ? (
              <EmptyState onSelectSuggestion={handleSend} />
            ) : (
              <LegendList
                ref={listRef}
                data={messages}
                renderItem={({ item: msg }) => (
                  <MessageBubble
                    message={msg.content}
                    isUser={msg.role === 'user'}
                  />
                )}
                keyExtractor={(msg) => msg.id}
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
                recycleItems
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              />
            )}
          </View>

          {/* Bottom Input Area */}
          <ChatInput onSend={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </View>

  );
};

const enhance = withObservables([], () => {
  const threadsQuery = database.get<ChatThread>('chat_threads').query(Q.sortBy('updated_at', Q.desc), Q.take(1));

  return {
    thread: threadsQuery.observe().pipe(map(t => t[0] || null)),
    messages: threadsQuery.observe().pipe(
      switchMap(t => {
        if (t[0]) {
          return t[0].messages.observe();
        }
        return of([]);
      })
    ),
  };
});

export default enhance(AiScreenContent);