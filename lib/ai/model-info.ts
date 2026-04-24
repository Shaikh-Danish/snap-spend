import { GEMMA_3N_E2B_IT_INT4, GEMMA_4_E2B_IT, GEMMA_4_E4B_IT } from 'react-native-litert-lm';

export interface ModelData {
  name: string;
  size: string;
  description: string;
}

export const AIModelInfo: Record<string, ModelData> = {
  [GEMMA_4_E2B_IT]: {
    name: 'Gemma 4 IT',
    size: '2.58 GB',
    description: 'Latest generation 2B model, optimized for speed and safety.'
  },
  [GEMMA_4_E4B_IT]: {
    name: 'Gemma 4 IT (Large)',
    size: '3.65 GB',
    description: 'Higher quality 4B model for complex reasoning.'
  },
  [GEMMA_3N_E2B_IT_INT4]: {
    name: 'Gemma 3n IT',
    size: '1.2 GB',
    description: 'Preview generation efficient model.'
  }
};

export const getModelInfo = (url: string) => {
  return AIModelInfo[url] || {
    name: 'AI Model',
    size: 'Unknown',
    description: 'Generic AI assistant model.'
  };
};
