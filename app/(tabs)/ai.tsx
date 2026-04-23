import { ChatHeader } from '@/components/ai/chat-header';
import { ChatInput } from '@/components/ai/chat-input';
import { EmptyState } from '@/components/ai/empty-state';
import { MessageBubble } from '@/components/ai/message-bubble';
import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { map, of, switchMap } from 'rxjs';

interface AiScreenProps {
  thread: ChatThread | null;
  messages: ChatMessage[];
}

const AiScreenContent = ({ thread, messages }: AiScreenProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async (text: string) => {
    try {
      let activeThread = thread;

      // Create thread if it doesn't exist
      if (!activeThread) {
        await database.write(async () => {
          activeThread = await database.get<ChatThread>('chat_threads').create((t) => {
            t.title = text.slice(0, 50); // Set title from first message
          });
        });
      }

      if (!activeThread) return;

      // Save User Message
      await database.write(async () => {
        await database.get<ChatMessage>('chat_messages').create((m) => {
          m.thread.set(activeThread!);
          m.content = text;
          m.role = 'user';
          m.status = 'sent';
        });
      });

      // Simulate AI response (You'll replace this with actual API call)
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ChatHeader />

        <View className="flex-1">
          {messages.length === 0 ? (
            <EmptyState onSelectSuggestion={handleSend} />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-6 pt-4"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg.content} isUser={msg.role === 'user'} />
              ))}
              <View className="h-10" />
            </ScrollView>
          )}
        </View>

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
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