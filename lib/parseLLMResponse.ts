/**
 * Pure function to parse LLM responses from OpenRouter.
 * Handles: valid JSON, markdown-fenced JSON, <think> blocks (Qwen3/reasoning models),
 * partial JSON, and total garbage — always returns a usable LLMParsed object.
 *
 * Extracted from WhatsAppChat.tsx for testability.
 */

export interface LLMParsed {
  message: string;
  phase: number;
  question_num: number;
  red_flags: string[];
  collected: Record<string, any>;
  progress: number;
  done: boolean;
  synthese?: string;
}

export interface FallbackState {
  phase: number;
  questionNum: number;
  progress: number;
}

export function parseLLMResponse(text: string, fallback: FallbackState): LLMParsed {
  try {
    let s = text;
    // Remove <think> blocks (reasoning models like Qwen3)
    s = s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Extract from markdown fences
    const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) s = fenceMatch[1].trim();
    // Extract outermost braces
    const braceMatch = s.match(/\{[\s\S]*\}/);
    if (braceMatch) s = braceMatch[0];
    return JSON.parse(s);
  } catch {
    console.warn('[KSLB Chat] JSON parse failed, using raw text fallback');
    let cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Try to extract just the message field
    const msgMatch = cleanText.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (msgMatch) {
      try { cleanText = JSON.parse(`"${msgMatch[1]}"`); } catch { /* keep cleanText */ }
    }
    cleanText = cleanText.replace(/[{}"[\]]/g, '').trim();
    if (!cleanText) cleanText = "Désolé, je n'ai pas pu traiter ma réponse. Pouvez-vous reformuler ?";
    return {
      message: cleanText,
      phase: fallback.phase,
      question_num: fallback.questionNum,
      red_flags: [],
      collected: {},
      progress: fallback.progress,
      done: false,
    };
  }
}
