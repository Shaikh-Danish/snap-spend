import { ChatHeader } from '@/components/ai/chat-header';
import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';
import { LegendList } from "@legendapp/list";
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }} edges={['top']}>
      <ChatHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* <View className="flex-1">
          {messages.length === 0 ? (
            <EmptyState onSelectSuggestion={handleSend} />
          ) : ( */}
        <LegendList
          data={items}
          renderItem={({ item }) => <Text>{item.title}</Text>}
          keyExtractor={(item) => item.id}
          recycleItems
        />
        {/* <LegendList
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
        /> */}
        {/* )} */}
        {/* </View> */}

        <View>
          <TextInput placeholder='Ask Anything...' placeholderTextColor="#A6A095" />
        </View>

        {/* <ChatInput onSend={handleSend} /> */}
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