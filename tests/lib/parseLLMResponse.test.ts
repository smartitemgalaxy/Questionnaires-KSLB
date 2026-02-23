import { describe, it, expect } from 'vitest';
import { parseLLMResponse } from '@/lib/parseLLMResponse';

describe('parseLLMResponse', () => {
  const fallbackState = { phase: 1, questionNum: 3, progress: 15 };

  // --- Happy path ---

  it('parses valid JSON response', () => {
    const input = JSON.stringify({
      message: 'Bonjour, quelle est votre douleur ?',
      phase: 1,
      question_num: 1,
      red_flags: [],
      collected: {},
      progress: 5,
      done: false,
    });

    const result = parseLLMResponse(input, fallbackState);

    expect(result.message).toBe('Bonjour, quelle est votre douleur ?');
    expect(result.phase).toBe(1);
    expect(result.question_num).toBe(1);
    expect(result.done).toBe(false);
  });

  it('preserves synthese field when present', () => {
    const input = JSON.stringify({
      message: 'Merci, voici la synthèse.',
      phase: 3,
      question_num: 21,
      red_flags: [],
      collected: {},
      progress: 100,
      done: true,
      synthese: 'Patient présente des douleurs lombaires chroniques...',
    });
    const result = parseLLMResponse(input, fallbackState);
    expect(result.done).toBe(true);
    expect(result.synthese).toContain('douleurs lombaires');
    expect(result.progress).toBe(100);
  });

  // --- Markdown fences ---

  it('extracts JSON from markdown fences', () => {
    const input = '```json\n{"message":"Test","phase":2,"question_num":5,"red_flags":[],"collected":{},"progress":25,"done":false}\n```';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Test');
    expect(result.phase).toBe(2);
  });

  // --- <think> blocks (Qwen3 / reasoning models) ---

  it('strips <think> blocks before parsing', () => {
    const input = '<think>Internal reasoning here</think>{"message":"Après réflexion","phase":1,"question_num":2,"red_flags":[],"collected":{},"progress":10,"done":false}';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Après réflexion');
  });

  it('handles <think> blocks with nested content', () => {
    const input = '<think>Let me think about {"this": true} carefully</think>\n```json\n{"message":"Résultat","phase":1,"question_num":1,"red_flags":["douleur thoracique"],"collected":{"motif":"dos"},"progress":5,"done":false}\n```';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Résultat');
    expect(result.red_flags).toContain('douleur thoracique');
  });

  // --- Broken / partial JSON ---

  it('extracts message field from broken JSON', () => {
    const input = '{"message": "Bonjour, comment allez-vous ?", "phase": bad}';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Bonjour, comment allez-vous ?');
    expect(result.phase).toBe(fallbackState.phase);
  });

  it('strips JSON artifacts from fallback text', () => {
    const input = '{"broken: json with [brackets] and "quotes"}';
    const result = parseLLMResponse(input, fallbackState);
    // Should not contain raw JSON characters
    expect(result.message).not.toMatch(/[{}\[\]"]/);
  });

  // --- Trailing text after JSON (qwen3:8b pattern) ---

  it('extracts JSON when model adds trailing text after closing brace', () => {
    const json = '{"message":"Depuis quand avez-vous mal ?","phase":1,"question_num":2,"red_flags":[],"collected":{"motif":"dos"},"progress":10,"done":false}';
    const input = json + '\n\nI hope this JSON response helps with the medical interview.';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toContain('Depuis quand');
    expect(result.phase).toBe(1);
    expect(result.question_num).toBe(2);
  });

  it('handles JSON with think block AND trailing text', () => {
    const input = '<think>I need to ask about pain characteristics</think>{"message":"Quel type de douleur ressentez-vous ?","phase":1,"question_num":3,"red_flags":[],"collected":{},"progress":15,"done":false}\nNote: moved to question 3.';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toContain('type de douleur');
    expect(result.question_num).toBe(3);
  });

  it('recovers message from JSON with unescaped French apostrophes', () => {
    const input = '{"message": "Comment la douleur s\'étend-elle ?", "phase": 1}';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toContain('douleur');
  });

  // --- Total garbage ---

  it('uses fallback state when JSON is total garbage', () => {
    const input = 'This is not JSON at all, just plain text response';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toContain('This is not JSON');
    expect(result.phase).toBe(fallbackState.phase);
    expect(result.question_num).toBe(fallbackState.questionNum);
    expect(result.progress).toBe(fallbackState.progress);
    expect(result.done).toBe(false);
  });

  // --- Empty / whitespace ---

  it('returns default message when input is empty', () => {
    const result = parseLLMResponse('', fallbackState);
    expect(result.message).toContain('Désolé');
    expect(result.done).toBe(false);
  });

  it('returns default message when input is only whitespace', () => {
    const result = parseLLMResponse('   \n\t  ', fallbackState);
    expect(result.message).toContain('Désolé');
  });
});
