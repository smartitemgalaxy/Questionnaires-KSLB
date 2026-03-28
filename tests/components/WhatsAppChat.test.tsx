import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsAppChat from '@/components/WhatsAppChat';

// Helper: create a mock fetch that returns a valid LLM response
function mockFetchOk(responseOverrides: Record<string, any> = {}) {
  const defaultResponse = {
    message: 'Bonjour !',
    phase: 1,
    question_num: 1,
    red_flags: [],
    collected: {},
    progress: 0,
    done: false,
    ...responseOverrides,
  };

  return vi.fn(() =>
    Promise.resolve(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(defaultResponse) } }],
    })))
  );
}

const defaultProps = {
  onBack: vi.fn(),
  patientInfo: {
    nom: 'Dupont',
    prenom: 'Jean',
    numeroSecuriteSociale: '1234567890123',
    date: '17/02/2026',
  },
};

describe('WhatsAppChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Default: mock fetch to return a valid response (prevents real API calls)
    globalThis.fetch = mockFetchOk();
  });

  // --- Smoke test ---

  it('renders header with Chat IA title', async () => {
    render(<WhatsAppChat {...defaultProps} />);
    expect(screen.getByText(/Assistant KSLB/i)).toBeInTheDocument();
  });

  it('shows initial bot message on successful fetch', async () => {
    globalThis.fetch = mockFetchOk({ message: 'Bonjour Jean ! Quel est le motif de votre consultation ?' });
    render(<WhatsAppChat {...defaultProps} />);

    const greeting = await screen.findByText(/Bonjour Jean/i, {}, { timeout: 5000 });
    expect(greeting).toBeInTheDocument();
  });

  // --- Error handling ---

  it('shows fallback message when fetch fails (network error)', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));

    render(<WhatsAppChat {...defaultProps} />);

    // The component catches the error in the initial useEffect and shows a fallback
    const fallback = await screen.findByText(/Connexion au serveur impossible/i, {}, { timeout: 5000 });
    expect(fallback).toBeInTheDocument();
  });

  it('shows fallback message when API returns 404', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve(new Response(
        JSON.stringify({ error: { message: 'No endpoints found' } }),
        { status: 404 }
      ))
    );

    render(<WhatsAppChat {...defaultProps} />);

    const fallback = await screen.findByText(/Connexion au serveur impossible/i, {}, { timeout: 5000 });
    expect(fallback).toBeInTheDocument();
  });

  it('shows fallback message when API returns 500', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve(new Response('Internal Server Error', { status: 500 }))
    );

    render(<WhatsAppChat {...defaultProps} />);

    const fallback = await screen.findByText(/Connexion au serveur impossible/i, {}, { timeout: 5000 });
    expect(fallback).toBeInTheDocument();
  });

  it('shows fallback message when request is aborted (timeout)', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.reject(new DOMException('The operation was aborted', 'AbortError'))
    );

    render(<WhatsAppChat {...defaultProps} />);

    // AbortError gets caught and transformed to a French message, then the initial useEffect
    // catches that and shows the fallback
    const fallback = await screen.findByText(/Connexion au serveur impossible/i, {}, { timeout: 5000 });
    expect(fallback).toBeInTheDocument();
  });

  it('never shows raw error objects or stack traces to the patient', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('ECONNREFUSED 127.0.0.1')));

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for the fallback to render
    await screen.findByText(/Connexion au serveur impossible/i, {}, { timeout: 5000 });

    // The raw error should NOT be visible
    const allText = document.body.textContent || '';
    expect(allText).not.toContain('ECONNREFUSED');
    expect(allText).not.toContain('127.0.0.1');
  });

  // --- End-of-chat (done: true) ---

  it('shows thank-you message when chat completes, not raw JSON', async () => {
    globalThis.fetch = mockFetchOk({
      message: 'Merci Jean pour vos réponses ! Votre anamnèse est terminée.',
      phase: 3,
      question_num: 21,
      red_flags: [],
      collected: {},
      progress: 100,
      done: true,
      synthese: 'Patient présente des douleurs lombaires.',
    });

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for the thank-you message to appear
    const thankYou = await screen.findByText(/Merci Jean/i, {}, { timeout: 5000 });
    expect(thankYou).toBeInTheDocument();

    // No raw JSON should be visible
    const allText = document.body.textContent || '';
    expect(allText).not.toMatch(/\{"message"/);
    expect(allText).not.toMatch(/\{"phase"/);
    expect(allText).not.toMatch(/"done"\s*:\s*true/);
  });

  it('disables input when chat is complete', async () => {
    globalThis.fetch = mockFetchOk({
      message: 'Merci, bilan terminé.',
      phase: 3,
      question_num: 21,
      red_flags: [],
      collected: {},
      progress: 100,
      done: true,
      synthese: 'Synthèse test.',
    });

    render(<WhatsAppChat {...defaultProps} />);

    // Wait for the placeholder to change to "Anamnèse terminée" (indicates isDone=true)
    const input = await screen.findByPlaceholderText(/Anamnèse terminée/i, {}, { timeout: 5000 });
    expect(input).toBeDisabled();
  });

  it('shows status indicator "Anamnèse terminée" when done', async () => {
    globalThis.fetch = mockFetchOk({
      message: 'Merci !',
      phase: 3,
      question_num: 21,
      red_flags: [],
      collected: {},
      progress: 100,
      done: true,
      synthese: 'Synthèse.',
    });

    render(<WhatsAppChat {...defaultProps} />);

    const status = await screen.findByText(/Anamnèse terminée/i, {}, { timeout: 5000 });
    expect(status).toBeInTheDocument();
  });
});
