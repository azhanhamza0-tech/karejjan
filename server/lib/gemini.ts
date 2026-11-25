import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;

export const KAR_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_UNAVAILABLE');
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedClient;
}
