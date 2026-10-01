export interface AIModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  speed: string;
  isDefault?: boolean;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    badge: '⭐ Recommended',
    description: 'Deepest analysis, rich editorial cadence, elite SEO structure',
    speed: '~6s',
    isDefault: true,
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS 20B',
    badge: '⚡ Ultra-Fast',
    description: 'Sub-3s generation, punchy conversion structure',
    speed: '~2.5s',
  },
  {
    id: 'groq/compound-mini',
    name: 'Compound Mini',
    badge: '🧠 Reasoning',
    description: 'Structured reasoning, tight link compliance',
    speed: '~10s',
  },
];

export const DEFAULT_MODEL_ID = 'openai/gpt-oss-120b';

export function getValidModel(modelId?: string): string {
  if (!modelId) return DEFAULT_MODEL_ID;
  return AVAILABLE_MODELS.find((m) => m.id === modelId)?.id ?? DEFAULT_MODEL_ID;
}
