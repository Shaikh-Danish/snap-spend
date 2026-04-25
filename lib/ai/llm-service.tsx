import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { GEMMA_4_E2B_IT, LiteRTLMInstance, useModel } from 'react-native-litert-lm';
import { getModelInfo, ModelData } from './model-info';

interface AIContextType {
  model: LiteRTLMInstance | null;
  isReady: boolean;
  isLoading: boolean;
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

// Default to CPU on Android — OpenCL GPU support is not universal across
// Android hardware and useModel cannot re-initialize after a GPU failure.
// iOS uses Metal which is universally available, so GPU is safe there.
const defaultToCpu = Platform.OS === 'android';

export function AIProvider({ children }: { children: ReactNode }) {
  const [hasStartedDownload, setHasStartedDownload] = useState(false);
  const [forceCpu, setForceCpu] = useState(defaultToCpu);
  const hasTriedGpuFallback = useRef(false);
  const modelInfo = getModelInfo(GEMMA_4_E2B_IT);

  const backend = forceCpu ? 'cpu' : 'gpu';

  const { model, isReady, downloadProgress, error, load: loadModel } = useModel(
    GEMMA_4_E2B_IT,
    {
      backend,
      autoLoad: true,
    }
  );

  // Auto-fallback to CPU if GPU (OpenCL) fails
  React.useEffect(() => {
    if (
      error &&
      !forceCpu &&
      !hasTriedGpuFallback.current &&
      (String(error).toLowerCase().includes('opencl') ||
        String(error).includes('Status Code: 2') ||
        String(error).toLowerCase().includes('gpu') ||
        String(error).toLowerCase().includes('delegate'))
    ) {
      console.warn('GPU acceleration failed. Falling back to CPU...', error);
      hasTriedGpuFallback.current = true;
      setForceCpu(true);
    }
  }, [error, forceCpu]);

  // Auto-reload model after falling back to CPU
  React.useEffect(() => {
    if (forceCpu && hasTriedGpuFallback.current && hasStartedDownload && !isReady) {
      console.log('Auto-reloading model with CPU backend...');
      loadModel().catch((err) => {
        console.error('CPU fallback load failed:', err);
      });
    }
  }, [forceCpu, hasStartedDownload, isReady, loadModel]);

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

  // Suppress the OpenCL error from being shown to the user during fallback
  const displayError = (() => {
    if (!error) return null;
    // If we're in the process of falling back to CPU, don't show the GPU error
    if (hasTriedGpuFallback.current && forceCpu && !isReady && hasStartedDownload) {
      return null;
    }
    return String(error);
  })();

  // isLoading = model is auto-loading from cache (not ready yet, no error, no active download)
  // isDownloading = model is being downloaded for the first time (progress > 0 but not ready)
  const isActivelyDownloading = !isReady && (downloadProgress || 0) > 0 && (downloadProgress || 0) < 1;
  const isLoading = !isReady && !error && !isActivelyDownloading;

  const value = {
    model,
    isReady,
    isLoading,
    isDownloading: isActivelyDownloading,
    progress: downloadProgress || 0,
    error: displayError,
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
