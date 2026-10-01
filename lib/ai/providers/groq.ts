import 'server-only';
import Groq from 'groq-sdk';
import { buildBlogPostPrompt, blogPostResponseSchema } from '../prompts/blogPost';
import { normalizeContentToHtml } from '../contentFormatter';
import { getValidModel } from '../models';
import type { GenerateBlogPostInput, GenerateBlogPostOutput } from '../generateBlogPost';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables');
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  const RETRIABLE = [429, 502, 503];
  const BACKOFF_MS = [1000, 3000];
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number }).status;
      if (!status || !RETRIABLE.includes(status) || attempt === maxRetries) throw err;
      await new Promise((res) => setTimeout(res, BACKOFF_MS[attempt] ?? 3000));
    }
  }
  throw lastError;
}

interface ParsedBlogResponse {
  title?: string;
  metaDescription?: string;
  content?: string;
  suggestedTags?: string[];
}

function safeParseJson(raw: string): ParsedBlogResponse {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    let repaired = cleaned;
    if (!repaired.endsWith('}')) {
      const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) repaired += '"';
      repaired += '}';
    }
    try {
      return JSON.parse(repaired);
    } catch {
      const title = repaired.match(/"title"\s*:\s*"([^"]+)"/)?.[1] || '';
      const metaDescription = repaired.match(/"metaDescription"\s*:\s*"([^"]+)"/)?.[1] || '';
      const contentMatch = repaired.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"suggestedTags"|"$)/);
      const content = contentMatch ? contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';
      return { title, metaDescription, content, suggestedTags: [] };
    }
  }
}

export async function generateBlogPostWithGroq(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  const groq = getGroqClient();
  const prompt = buildBlogPostPrompt(input);
  const model = getValidModel(input.model || process.env.GROQ_MODEL);

  const completion = await withRetry(() =>
    groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a seasoned human entertainment journalist and streaming content strategist with 15+ years of experience. Write with deep analytical substance, genuine passion for film and TV, and zero detectable AI clichés. Output strictly valid JSON matching the requested schema. The content field MUST be clean, valid semantic HTML with rich visual hierarchy (h2, h3, p, ul, ol, li, strong, blockquote). Never output markdown code blocks or commentary around the JSON.',
        },
        { role: 'user', content: prompt },
      ],
      model,
      max_completion_tokens: 8000,
      reasoning_effort: 'low',
      response_format: { type: 'json_schema', json_schema: blogPostResponseSchema },
    })
  );

  const choice = completion.choices[0];
  const raw = choice?.message?.content;

  if (choice?.finish_reason === 'length') {
    console.error('Groq response truncated (finish_reason: length)', { usage: completion.usage });
  }

  if (!raw) throw new Error('No response received from Groq');

  const parsed = safeParseJson(raw);
  const formattedHtml = normalizeContentToHtml(parsed.content || '');

  return {
    title: parsed.title ? String(parsed.title).trim() : '',
    metaDescription: parsed.metaDescription ? String(parsed.metaDescription).trim() : '',
    content: formattedHtml,
    suggestedTags: Array.isArray(parsed.suggestedTags)
      ? parsed.suggestedTags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [],
  };
}
