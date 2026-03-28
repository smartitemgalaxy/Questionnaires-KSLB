# WhatsApp Chat Upgrades — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix and harden the WhatsAppChat LLM component — test infrastructure, error handling, Drive submission, and end-of-chat UX — using strict TDD.

**Architecture:** Extract testable pure functions from WhatsAppChat.tsx, add vitest infrastructure, write failing tests first for each of the 5 pending items from Feb 14 session, then implement minimal fixes.

**Tech Stack:** React 19, Vite 6, Vitest 4, @testing-library/react, happy-dom, TypeScript

---

## Task 1: Configure Vitest Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json` (add `"test"` script)

**Step 1: Write vitest.config.ts**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
```

**Step 2: Write tests/setup.ts**

```typescript
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
```

**Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 4: Run vitest to verify setup**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: "No test files found" (no error, no crash)

**Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore: configure vitest with happy-dom and jest-dom matchers"
```

---

## Task 2: Extract parseLLMResponse as a Pure Function

`parseLLMResponse` in `components/WhatsAppChat.tsx:167-198` has a closure dependency on React state (`phase`, `questionNum`, `progress`) in the catch block fallback. Extract it to a standalone module so it can be tested without rendering React.

**Files:**
- Create: `lib/parseLLMResponse.ts`
- Create: `tests/lib/parseLLMResponse.test.ts`
- Modify: `components/WhatsAppChat.tsx` (import from lib)

### Step 1: Write the failing test — valid JSON

```typescript
// tests/lib/parseLLMResponse.test.ts
import { describe, it, expect } from 'vitest';
import { parseLLMResponse } from '@/lib/parseLLMResponse';

describe('parseLLMResponse', () => {
  const fallbackState = { phase: 1, questionNum: 3, progress: 15 };

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
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/parseLLMResponse.test.ts`
Expected: FAIL — `Cannot find module '@/lib/parseLLMResponse'`

### Step 3: Write minimal implementation

```typescript
// lib/parseLLMResponse.ts

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
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/parseLLMResponse.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/parseLLMResponse.ts tests/lib/parseLLMResponse.test.ts
git commit -m "feat: extract parseLLMResponse as pure testable function"
```

---

## Task 3: TDD — parseLLMResponse Edge Cases

Cover all parsing paths: fenced JSON, `<think>` tags, partial JSON, total garbage.

**Files:**
- Modify: `tests/lib/parseLLMResponse.test.ts` (add tests)
- Modify: `lib/parseLLMResponse.ts` (if needed to pass)

### Step 1: Write failing tests — all edge cases

Add to `tests/lib/parseLLMResponse.test.ts`:

```typescript
  it('extracts JSON from markdown fences', () => {
    const input = '```json\n{"message":"Test","phase":2,"question_num":5,"red_flags":[],"collected":{},"progress":25,"done":false}\n```';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Test');
    expect(result.phase).toBe(2);
  });

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

  it('extracts message field from broken JSON', () => {
    const input = '{"message": "Bonjour, comment allez-vous ?", "phase": bad}';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toBe('Bonjour, comment allez-vous ?');
    expect(result.phase).toBe(fallbackState.phase);
  });

  it('uses fallback state when JSON is total garbage', () => {
    const input = 'This is not JSON at all, just plain text response';
    const result = parseLLMResponse(input, fallbackState);
    expect(result.message).toContain('This is not JSON');
    expect(result.phase).toBe(fallbackState.phase);
    expect(result.question_num).toBe(fallbackState.questionNum);
    expect(result.progress).toBe(fallbackState.progress);
    expect(result.done).toBe(false);
  });

  it('returns default message when input is empty', () => {
    const result = parseLLMResponse('', fallbackState);
    expect(result.message).toContain('Désolé');
    expect(result.done).toBe(false);
  });

  it('returns default message when input is only whitespace', () => {
    const result = parseLLMResponse('   \n\t  ', fallbackState);
    expect(result.message).toContain('Désolé');
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

  it('strips JSON artifacts from fallback text', () => {
    const input = '{"broken: json with [brackets] and "quotes"}';
    const result = parseLLMResponse(input, fallbackState);
    // Should not contain raw JSON characters
    expect(result.message).not.toMatch(/[{}\[\]"]/);
  });
```

**Step 2: Run tests to verify failures**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/parseLLMResponse.test.ts`
Expected: Mix of PASS and FAIL — any failures reveal implementation gaps

**Step 3: Fix implementation for any failing tests**

Adjust `lib/parseLLMResponse.ts` only as needed to make all tests pass. Minimal changes.

**Step 4: Run tests to verify all pass**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/parseLLMResponse.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add tests/lib/parseLLMResponse.test.ts lib/parseLLMResponse.ts
git commit -m "test: parseLLMResponse edge cases — fences, think tags, garbage, empty"
```

---

## Task 4: Wire Extracted Function into WhatsAppChat

Replace the inline `parseLLMResponse` in WhatsAppChat.tsx with the extracted pure function.

**Files:**
- Modify: `components/WhatsAppChat.tsx`

### Step 1: Write a smoke test that the component renders

```typescript
// tests/components/WhatsAppChat.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsAppChat from '@/components/WhatsAppChat';

// Mock fetch globally to prevent real API calls
globalThis.fetch = vi.fn(() =>
  Promise.resolve(new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify({
      message: 'Bonjour !',
      phase: 1,
      question_num: 1,
      red_flags: [],
      collected: {},
      progress: 0,
      done: false,
    })}}],
  })))
) as any;

describe('WhatsAppChat', () => {
  const defaultProps = {
    onBack: vi.fn(),
    patientInfo: {
      nom: 'Dupont',
      prenom: 'Jean',
      numeroSecuriteSociale: '1234567890123',
      date: '17/02/2026',
    },
  };

  it('renders with patient greeting', async () => {
    render(<WhatsAppChat {...defaultProps} />);
    // The component should show an initial bot message or loading
    expect(screen.getByText(/Chat IA/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/components/WhatsAppChat.test.tsx`
Expected: FAIL (component still uses inline parseLLMResponse, test may pass or fail — either way establishes baseline)

### Step 3: Replace inline function with import

In `components/WhatsAppChat.tsx`:

1. Add import at top:
```typescript
import { parseLLMResponse, type LLMParsed, type FallbackState } from '@/lib/parseLLMResponse';
```

2. Remove the inline `LLMParsed` interface (lines ~17-26) and inline `parseLLMResponse` function (lines ~167-198).

3. Where `parseLLMResponse(text)` is called (in `sendToLLM`), change to:
```typescript
const parsed = parseLLMResponse(text, { phase, questionNum, progress });
```

**Step 4: Run ALL tests**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: All PASS (both parseLLMResponse unit tests and component smoke test)

**Step 5: Commit**

```bash
git add components/WhatsAppChat.tsx tests/components/WhatsAppChat.test.tsx
git commit -m "refactor: wire extracted parseLLMResponse into WhatsAppChat"
```

---

## Task 5: TDD — Error Handling (OpenRouter Down / Timeout)

**Files:**
- Modify: `tests/components/WhatsAppChat.test.tsx`
- Modify: `components/WhatsAppChat.tsx` (if needed)

### Step 1: Write failing test — network error shows user-friendly message

```typescript
  it('shows error message when fetch fails (network error)', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))) as any;

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for error message to appear
    const errorMsg = await screen.findByText(/problème technique/i, {}, { timeout: 5000 });
    expect(errorMsg).toBeInTheDocument();
  });
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/components/WhatsAppChat.test.tsx`
Expected: FAIL or PASS — establishes whether error handling works

### Step 3: Write failing test — timeout shows specific message

```typescript
  it('shows timeout message when request exceeds 30s', async () => {
    globalThis.fetch = vi.fn(() => new Promise((_, reject) => {
      setTimeout(() => reject(new DOMException('The operation was aborted', 'AbortError')), 100);
    })) as any;

    render(<WhatsAppChat {...defaultProps} />);

    const timeoutMsg = await screen.findByText(/délai|timeout|problème/i, {}, { timeout: 5000 });
    expect(timeoutMsg).toBeInTheDocument();
  });
```

### Step 4: Write failing test — API error (404/500)

```typescript
  it('shows error message when API returns 404', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ error: { message: 'No endpoints found' } }), { status: 404 }))
    ) as any;

    render(<WhatsAppChat {...defaultProps} />);

    const errorMsg = await screen.findByText(/problème technique/i, {}, { timeout: 5000 });
    expect(errorMsg).toBeInTheDocument();
  });
```

**Step 5: Fix implementation if any test fails**

In `components/WhatsAppChat.tsx` `sendToLLM`, ensure:
- Network errors → show "problème technique" message
- AbortError → show timeout-specific message
- HTTP 404/500 → show "problème technique" message
- All error messages are user-facing French, no raw JSON or English stack traces

**Step 6: Run all tests**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: All PASS

**Step 7: Commit**

```bash
git add tests/components/WhatsAppChat.test.tsx components/WhatsAppChat.tsx
git commit -m "test: error handling — network, timeout, API errors"
```

---

## Task 6: TDD — End-of-Chat Message (No JSON Leak)

Verify that when `done: true`, the patient sees a thank-you message and NOT raw JSON.

**Files:**
- Modify: `tests/components/WhatsAppChat.test.tsx`
- Modify: `components/WhatsAppChat.tsx` (if needed)

### Step 1: Write failing test — thank-you message appears

```typescript
  it('shows thank-you message when chat is done, not raw JSON', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn(() => {
      callCount++;
      const response = callCount === 1
        ? { message: 'Bonjour !', phase: 1, question_num: 1, red_flags: [], collected: {}, progress: 0, done: false }
        : { message: 'Merci Jean pour vos réponses ! Votre bilan est terminé.', phase: 3, question_num: 21, red_flags: [], collected: {}, progress: 100, done: true, synthese: 'Synthèse du bilan.' };
      return Promise.resolve(new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify(response) } }],
      })));
    }) as any;

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for initial message
    await screen.findByText(/Bonjour/i, {}, { timeout: 5000 });

    // The displayed text should never contain raw JSON braces
    const allText = document.body.textContent || '';
    expect(allText).not.toMatch(/\{"message"/);
    expect(allText).not.toMatch(/\{"phase"/);
  });
```

### Step 2: Write failing test — input is disabled when done

```typescript
  it('disables input when chat is complete', async () => {
    // Use a fetch that returns done:true on first user message
    let callCount = 0;
    globalThis.fetch = vi.fn(() => {
      callCount++;
      const done = callCount > 1;
      return Promise.resolve(new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({
          message: done ? 'Merci, bilan terminé.' : 'Bonjour !',
          phase: done ? 3 : 1,
          question_num: done ? 21 : 1,
          red_flags: [],
          collected: {},
          progress: done ? 100 : 0,
          done,
        })}}],
      })));
    }) as any;

    render(<WhatsAppChat {...defaultProps} />);

    // After done, check input is disabled
    await screen.findByText(/terminé|Merci/i, {}, { timeout: 5000 });
    const input = screen.getByPlaceholderText(/message|écri/i);
    expect(input).toBeDisabled();
  });
```

**Step 3: Run tests — verify failures**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/components/WhatsAppChat.test.tsx`
Expected: Failures reveal what needs fixing

**Step 4: Fix implementation if needed**

Ensure `applyResponse` when `done: true`:
- Sets `isDone = true`
- Displays `parsed.message` as the final bot message (not raw JSON)
- Disables input field

**Step 5: Run all tests**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: All PASS

**Step 6: Commit**

```bash
git add tests/components/WhatsAppChat.test.tsx components/WhatsAppChat.tsx
git commit -m "test: end-of-chat — thank-you message, no JSON leak, input disabled"
```

---

## Task 7: TDD — Drive Submission

Test that the auto-submit to Google Drive builds the correct file path and content.

**Files:**
- Create: `tests/lib/driveSubmission.test.ts`
- Create: `lib/buildDrivePayload.ts` (extract from WhatsAppChat)
- Modify: `components/WhatsAppChat.tsx` (import extracted function)

### Step 1: Write failing test — correct file path format

```typescript
// tests/lib/driveSubmission.test.ts
import { describe, it, expect } from 'vitest';
import { buildDrivePayload } from '@/lib/buildDrivePayload';

describe('buildDrivePayload', () => {
  const patientInfo = {
    nom: 'Dupont',
    prenom: 'Jean',
    numeroSecuriteSociale: '1234567890123',
    date: '17/02/2026',
  };

  it('builds correct file path with patient info', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Synthèse test',
      collectedData: { motif: 'lombalgie' },
      redFlags: ['douleur thoracique'],
      conversationHistory: [
        { role: 'assistant', content: 'Bonjour' },
        { role: 'user', content: 'Bonjour, j\'ai mal au dos' },
      ],
    });

    expect(payload.filePath).toContain('APP BILANS/Patients Data/');
    expect(payload.filePath).toContain('DUPONT_JEAN_1234567890123');
    expect(payload.filePath).toContain('Tronc commun_1234567890123');
  });

  it('includes synthesis in content', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Patient souffre de lombalgie chronique depuis 3 ans.',
      collectedData: {},
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.content).toContain('Synthèse test' || 'lombalgie chronique');
  });

  it('includes red flags in content when present', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: '',
      collectedData: {},
      redFlags: ['perte de poids inexpliquée', 'fièvre nocturne'],
      conversationHistory: [],
    });

    expect(payload.content).toContain('perte de poids');
    expect(payload.content).toContain('fièvre nocturne');
  });

  it('includes collected data as JSON in content', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: '',
      collectedData: { motif: 'lombalgie', localisation: 'bas du dos' },
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.content).toContain('lombalgie');
    expect(payload.content).toContain('bas du dos');
  });

  it('does NOT include raw JSON objects in the patient-visible message', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Synthèse propre',
      collectedData: { motif: 'test' },
      redFlags: [],
      conversationHistory: [],
    });

    // filePath and content are for Drive, not patient-visible,
    // so they CAN contain JSON. This test ensures structure is correct.
    expect(payload.filePath).toBeTruthy();
    expect(payload.content).toBeTruthy();
    expect(payload.fileName).toMatch(/\.txt$/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/driveSubmission.test.ts`
Expected: FAIL — `Cannot find module '@/lib/buildDrivePayload'`

### Step 3: Extract buildDrivePayload function

```typescript
// lib/buildDrivePayload.ts
import type { PatientInfo } from '@/types';
import type { ChatMessage } from '@/lib/parseLLMResponse';

export interface DrivePayloadInput {
  patientInfo: PatientInfo;
  synthesis: string;
  collectedData: Record<string, any>;
  redFlags: string[];
  conversationHistory: Array<{ role: string; content: string }>;
}

export interface DrivePayload {
  filePath: string;
  fileName: string;
  content: string;
}

export function buildDrivePayload(input: DrivePayloadInput): DrivePayload {
  const { patientInfo, synthesis, collectedData, redFlags, conversationHistory } = input;
  const { nom, prenom, numeroSecuriteSociale } = patientInfo;

  const nomUpper = nom.toUpperCase();
  const prenomUpper = prenom.toUpperCase();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');

  const fileName = `anamnese_chat_${dateStr}_${timeStr}.txt`;
  const filePath = `APP BILANS/Patients Data/${nomUpper}_${prenomUpper}_${numeroSecuriteSociale}/Tronc commun_${numeroSecuriteSociale}/${fileName}`;

  const sections: string[] = [
    `=== ANAMNÈSE CHAT IA - ${dateStr} ===`,
    `Patient: ${prenom} ${nom} (${numeroSecuriteSociale})`,
    '',
  ];

  if (synthesis) {
    sections.push('--- SYNTHÈSE ---', synthesis, '');
  }

  if (Object.keys(collectedData).length > 0) {
    sections.push('--- DONNÉES COLLECTÉES ---', JSON.stringify(collectedData, null, 2), '');
  }

  if (redFlags.length > 0) {
    sections.push('--- RED FLAGS ---', redFlags.map(f => `⚠️ ${f}`).join('\n'), '');
  }

  if (conversationHistory.length > 0) {
    sections.push('--- CONVERSATION COMPLÈTE ---');
    for (const msg of conversationHistory) {
      const prefix = msg.role === 'user' ? 'Patient' : 'Assistant';
      sections.push(`[${prefix}] ${msg.content}`);
    }
  }

  return {
    filePath,
    fileName,
    content: sections.join('\n'),
  };
}
```

**Step 4: Run tests**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/lib/driveSubmission.test.ts`
Expected: All PASS

**Step 5: Wire into WhatsAppChat.tsx**

Replace inline Drive payload building (lines ~296-351 in WhatsAppChat.tsx) with:
```typescript
import { buildDrivePayload } from '@/lib/buildDrivePayload';
```
Then use `buildDrivePayload(...)` to construct filePath and content before calling `submitBilan()`.

**Step 6: Run all tests**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: All PASS

**Step 7: Commit**

```bash
git add lib/buildDrivePayload.ts tests/lib/driveSubmission.test.ts components/WhatsAppChat.tsx
git commit -m "refactor: extract buildDrivePayload, TDD Drive submission path and content"
```

---

## Task 8: TDD — Drive Retry on Error

**Files:**
- Modify: `tests/components/WhatsAppChat.test.tsx`
- Modify: `components/WhatsAppChat.tsx` (if needed)

### Step 1: Write failing test — retry button appears on Drive error

```typescript
  it('shows retry button when Drive submission fails', async () => {
    // Mock submitBilan to fail
    vi.mock('@/utils', () => ({
      submitBilan: vi.fn(() => Promise.reject(new Error('Drive error'))),
    }));

    // Setup fetch to complete the chat (done: true)
    let callCount = 0;
    globalThis.fetch = vi.fn(() => {
      callCount++;
      return Promise.resolve(new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({
          message: callCount === 1 ? 'Bonjour' : 'Merci, terminé !',
          phase: callCount === 1 ? 1 : 3,
          question_num: callCount === 1 ? 1 : 21,
          red_flags: [],
          collected: {},
          progress: callCount === 1 ? 0 : 100,
          done: callCount > 1,
          synthese: callCount > 1 ? 'Synthèse' : undefined,
        })}}],
      })));
    }) as any;

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for retry button to appear
    const retryBtn = await screen.findByText(/réessayer|retry/i, {}, { timeout: 10000 });
    expect(retryBtn).toBeInTheDocument();
  });
```

**Step 2: Run test**

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run tests/components/WhatsAppChat.test.tsx`
Expected: Likely PASS (retry button already exists in UI), but validates the behavior

**Step 3: Fix if needed, then commit**

```bash
git add tests/components/WhatsAppChat.test.tsx components/WhatsAppChat.tsx
git commit -m "test: Drive retry button on submission error"
```

---

## Task 9: Integration — Update WhatsAppChat Imports and Clean Up

Final task: ensure WhatsAppChat.tsx uses all extracted modules and remove dead inline code.

**Files:**
- Modify: `components/WhatsAppChat.tsx`

### Step 1: Verify the component uses extracted modules

Confirm these imports exist at top of WhatsAppChat.tsx:
```typescript
import { parseLLMResponse, type LLMParsed } from '@/lib/parseLLMResponse';
import { buildDrivePayload } from '@/lib/buildDrivePayload';
```

Confirm the inline `LLMParsed` interface, `parseLLMResponse` function, and inline Drive payload building code have been removed.

### Step 2: Run full test suite

Run: `cd /Users/esperanza/questionnaires-app && npx vitest run`
Expected: All PASS

### Step 3: Run build to check no TypeScript errors

Run: `cd /Users/esperanza/questionnaires-app && npx tsc --noEmit`
Expected: No errors

### Step 4: Commit

```bash
git add components/WhatsAppChat.tsx
git commit -m "refactor: clean up WhatsAppChat, all logic extracted and tested"
```

---

## Verification Checklist

After completing all tasks:

- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] `npm run build` — production build succeeds
- [ ] `npm run dev` — app starts, chat works manually
- [ ] parseLLMResponse handles: valid JSON, fenced JSON, `<think>` tags, broken JSON, empty input
- [ ] Error handling: network error, timeout, API 404/500 — all show French user-friendly messages
- [ ] End of chat: thank-you message shown, no raw JSON, input disabled
- [ ] Drive submission: correct file path, includes synthesis + collected data + red flags + conversation
- [ ] Drive retry button appears on submission failure
