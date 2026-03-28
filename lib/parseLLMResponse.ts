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

// Known LLM typos in French medical questions (Llama 3.3 70B pattern)
const TYPO_CORRECTIONS: [RegExp, string][] = [
  [/\bRessez-vous\b/g, 'Ressentez-vous'],
  [/\bRessent[ei]z vous\b/g, 'Ressentez-vous'],
  [/\bRessentez vous\b/g, 'Ressentez-vous'],
  [/\bAvez vous\b/g, 'Avez-vous'],
  [/\bEtes-vous\b/g, 'Êtes-vous'],
  [/\betes-vous\b/g, 'êtes-vous'],
  [/\bA quelle\b/g, 'À quelle'],
  [/\ba quelle\b/g, 'à quelle'],
  [/\bOu avez\b/g, 'Où avez'],
  [/\bopere\(e\)/g, 'opéré(e)'],
  [/\banxieuse\b/g, 'anxieuse'],
  [/\banxieux\b/g, 'anxieux'],
  [/\bproffession\b/gi, 'profession'],
  [/\bkinésitérapie\b/gi, 'kinésithérapie'],
  [/\bkinesitherapie\b/gi, 'kinésithérapie'],
];

function fixTypos(text: string): string {
  let fixed = text;
  for (const [pattern, replacement] of TYPO_CORRECTIONS) {
    fixed = fixed.replace(pattern, replacement);
  }
  return fixed;
}

export function parseLLMResponse(text: string, fallback: FallbackState): LLMParsed {
  try {
    let s = text;
    // Remove <think> blocks (reasoning models like Qwen3)
    s = s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Strip model control tokens (Llama, Mistral, ChatML)
    s = s.replace(/<\|(?:python_tag|start_header_id|end_header_id|eot_id|im_start|im_end|endoftext|pad|begin_of_text|end_of_text)\|>/g, '').trim();
    // Extract from markdown fences
    const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) s = fenceMatch[1].trim();
    // Extract outermost braces
    const braceMatch = s.match(/\{[\s\S]*\}/);
    if (braceMatch) s = braceMatch[0];
    const parsed: LLMParsed = JSON.parse(s);
    // Fix known LLM typos in the message shown to the patient
    if (parsed.message) parsed.message = fixTypos(parsed.message);
    return parsed;
  } catch {
    console.warn('[KSLB Chat] JSON parse failed, using raw text fallback');
    let cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    // Strip model control tokens in fallback path too
    cleanText = cleanText.replace(/<\|(?:python_tag|start_header_id|end_header_id|eot_id|im_start|im_end|endoftext|pad|begin_of_text|end_of_text)\|>/g, '').trim();
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
