import 'server-only';
import { generateBlogPostWithGroq } from './providers/groq';

export interface GenerateBlogPostInput {
  topic: string;
  tone?: string;
  keywords?: string[];
  wordCount?: number;
  audience?: string;
  model?: string;
}

export interface GenerateBlogPostOutput {
  title: string;
  metaDescription: string;
  content: string;
  suggestedTags: string[];
}

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  const provider = process.env.AI_PROVIDER || 'groq';
  switch (provider.toLowerCase()) {
    case 'groq':
      return generateBlogPostWithGroq(input);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
