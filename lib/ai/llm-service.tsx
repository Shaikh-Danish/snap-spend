import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { GEMMA_4_E2B_IT, LiteRTLMInstance, useModel } from 'react-native-litert-lm';
import { getModelInfo, ModelData } from './model-info';

interface AIContextType {
  model: LiteRTLMInstance | null;
  isReady: boolean;
  isDownloading: boolean;
  progress: number;
  error: string | null;
  modelInfo: ModelData;
  load: () => Promise<void>;
  sendMessage: (text: string, onToken: (token: string) => void) => Promise<void>;
  useCpu: boolean;
  setUseCpu: (val: boolean) => void;
}

const AIContext = createContext<AIContextType | null>(null);

const isEmulator = Platform.OS === 'android' &&
  (Platform.constants?.Model?.includes('sdk') ||
    Platform.constants?.Brand === 'google' ||
    Platform.constants?.Fingerprint?.includes('generic'));

export function AIProvider({ children }: { children: ReactNode }) {
  const [hasStartedDownload, setHasStartedDownload] = useState(false);
  const [forceCpu, setForceCpu] = useState(isEmulator);
  const modelInfo = getModelInfo(GEMMA_4_E2B_IT);

  const { model, isReady, downloadProgress, error, load: loadModel } = useModel(
    GEMMA_4_E2B_IT,
    {
      backend: forceCpu ? 'cpu' : 'gpu',
      autoLoad: false,
    }
  );

  // Auto-fallback to CPU if GPU (OpenCL) fails
  React.useEffect(() => {
    if (error && (String(error).includes('OpenCL') || String(error).includes('Status Code: 2')) && !forceCpu) {
      console.warn('GPU acceleration failed (OpenCL mismatch). Falling back to CPU...');
      setForceCpu(true);
    }
  }, [error, forceCpu]);

  const load = useCallback(async () => {
    setHasStartedDownload(true);
    await loadModel();
  }, [loadModel]);

  const sendMessage = useCallback(async (text: string, onToken: (token: string) => void) => {
    if (!model) throw new Error('Model not initialized');

    return new Promise<void>((resolve, reject) => {
      try {
        model.sendMessageAsync(text, (token, done) => {
          onToken(token);
          if (done) resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }, [model]);

  const value = {
    model,
    isReady,
    isDownloading: hasStartedDownload && !isReady,
    progress: downloadProgress || 0,
    error: error ? String(error) : null,
    modelInfo,
    load,
    sendMessage,
    useCpu: forceCpu,
    setUseCpu: setForceCpu,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
