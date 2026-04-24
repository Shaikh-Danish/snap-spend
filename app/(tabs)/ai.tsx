import { ChatHeader } from '@/components/ai/chat-header';
import { ChatView } from '@/components/ai/chat-view';
import { ModelLoader } from '@/components/ai/model-loader';
import { ChatService } from '@/lib/ai/chat-service';
import { getModelInfo } from '@/lib/ai/model-info';
import { database } from '@/model';
import ChatMessage from '@/model/chat-message';
import ChatThread from '@/model/chat-thread';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { GEMMA_4_E2B_IT, useModel } from 'react-native-litert-lm';
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
  const [hasStartedDownload, setHasStartedDownload] = useState(false);

  const { model, isReady, downloadProgress, error, load } = useModel(
    GEMMA_4_E2B_IT,
    {
      backend: 'gpu',
      autoLoad: false,
    }
  );

  const startDownload = async () => {
    setHasStartedDownload(true);
    await load();
  };

  // ── Send handler ─────────────────────────────────────────────────────────────

  const handleSend = async (text: string) => {
    if (!isReady || !model || isGenerating) return;

    try {
      setIsGenerating(true);

      // 1. Get or create thread
      const activeThread = await ChatService.getOrCreateThread(thread, text);

      // 2. Persist user message
      await ChatService.saveMessage(activeThread, text, 'user');

      // 3. Stream Gemma response
      let fullResponse = '';
      setStreamingText('');

      await new Promise<void>((resolve, reject) => {
        try {
          model.sendMessageAsync(text, (token, done) => {
            fullResponse += token;
            setStreamingText(fullResponse);
            if (done) resolve();
          });
        } catch (err) {
          reject(err);
        }
      });

      // 4. Persist completed assistant message
      await ChatService.saveMessage(activeThread, fullResponse, 'assistant');
      setStreamingText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render Logic ─────────────────────────────────────────────────────────────

  const isDownloading = downloadProgress !== undefined && downloadProgress < 1;

  const renderContent = () => {
    if (error) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-8">
          <Text className="text-2xl mb-3">⚠️</Text>
          <Text className="text-base font-semibold text-destructive text-center mb-1">
            Failed to load model
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {error}
          </Text>
        </View>
      );
    }

    if (!isReady) {
      const modelInfo = getModelInfo(GEMMA_4_E2B_IT);
      return (
        <ModelLoader
          onDownload={startDownload}
          isDownloading={hasStartedDownload}
          progress={downloadProgress || 0}
          size={modelInfo.size}
          name={modelInfo.name}
          description={modelInfo.description}
        />
      );
    }

    return (
      <ChatView
        messages={messages}
        streamingText={streamingText}
        isGenerating={isGenerating}
        onSend={handleSend}
        isReady={isReady}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="bg-background" />
      <ChatHeader />
      {renderContent()}
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