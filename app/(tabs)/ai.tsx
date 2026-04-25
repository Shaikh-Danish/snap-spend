import { ChatHeader } from '@/components/ai/chat-header';
import { ChatView } from '@/components/ai/chat-view';
import { ModelLoader } from '@/components/ai/model-loader';
import { ChatService } from '@/lib/ai/chat-service';
import { useAI } from '@/lib/ai/llm-service';
import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { map, of, switchMap } from 'rxjs';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AiScreenProps {
  thread: ChatThread | null;
  messages: ChatMessage[];
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

const AiScreenContent = ({ thread, messages }: AiScreenProps) => {
  const [streamingText, setStreamingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    isReady,
    isLoading,
    isDownloading,
    progress,
    error,
    modelInfo,
    sendMessage,
  } = useAI();

  const handleSend = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    setStreamingText('');

    try {
      // 1. Get or create thread
      const activeThread = await ChatService.getOrCreateThread(thread, text);

      // 2. Add user message
      await ChatService.saveMessage(activeThread, text, 'user');

      // 3. Stream AI response
      let fullResponse = '';
      await sendMessage(text, (token) => {
        fullResponse += token;
        setStreamingText(fullResponse);
      });

      // 4. Save AI response
      await ChatService.saveMessage(activeThread, fullResponse, 'assistant');
      setStreamingText('');
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (error && !isReady) {
    return (
      <SafeAreaView className="flex-1 bg-background p-8 items-center justify-center">
        <View className="items-center gap-4">
          <Text className="text-xl font-bold text-destructive">
            Critical System Error
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Model is being downloaded for the first time — show full download UI
  if (isDownloading) {
    return (
      <ModelLoader
        onDownload={() => {}}
        isDownloading
        progress={progress}
        size={modelInfo.size}
        name={modelInfo.name}
        description={modelInfo.description}
      />
    );
  }

  // Model is auto-loading from cache — show lightweight spinner
  if (isLoading && !isReady) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <View className="items-center gap-3">
          <ActivityIndicator size="large" color="#8B7355" />
          <Text className="text-sm text-muted-foreground font-medium">
            Initializing Snap AI…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="bg-background" />
      <ChatHeader />
      <ChatView
        isReady={isReady}
        messages={messages}
        streamingText={streamingText}
        isGenerating={isGenerating}
        onSend={handleSend}
      />
    </View>
  );
};

// ─── WatermelonDB observer ────────────────────────────────────────────────────

const enhance = withObservables([], () => {
  const threadsQuery = database
    .get<ChatThread>('chat_threads')
    .query(Q.sortBy('updated_at', Q.desc), Q.take(1));

  return {
    thread: threadsQuery.observe().pipe(map((t) => t[0] || null)),
    messages: threadsQuery.observe().pipe(
      switchMap((t) => {
        if (t[0]) return t[0].messages.observe();
        return of([]);
      }),
    ),
  };
});

export default enhance(AiScreenContent);