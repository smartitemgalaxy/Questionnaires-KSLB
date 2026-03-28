import { describe, it, expect } from 'vitest';
import { buildDrivePayload } from '@/lib/buildDrivePayload';

describe('buildDrivePayload', () => {
  const patientInfo = {
    nom: 'Dupont',
    prenom: 'Jean',
    numeroSecuriteSociale: '1234567890123',
    date: '17/02/2026',
  };

  // --- File path ---

  it('builds correct file path with patient info', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Synthèse test',
      collectedData: { motif: 'lombalgie' },
      redFlags: ['douleur thoracique'],
      conversationHistory: [
        { role: 'assistant', content: 'Bonjour' },
        { role: 'user', content: "Bonjour, j'ai mal au dos" },
      ],
    });

    expect(payload.filePath).toContain('APP BILANS/Patients Data/');
    expect(payload.filePath).toContain('DUPONT_Jean_1234567890123');
    expect(payload.filePath).toContain('Tronc commun_1234567890123');
  });

  it('generates a .txt filename', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: '',
      collectedData: {},
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.fileName).toMatch(/\.txt$/);
    expect(payload.fileName).toContain('Anamnese_Chat');
  });

  // --- Content ---

  it('includes synthesis in content', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Patient souffre de lombalgie chronique depuis 3 ans.',
      collectedData: {},
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.content).toContain('lombalgie chronique');
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

  it('shows "Aucun red flag" when no flags detected', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: '',
      collectedData: {},
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.content).toContain('Aucun red flag');
  });

  it('includes collected data in content', () => {
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

  it('includes conversation history in content', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: '',
      collectedData: {},
      redFlags: [],
      conversationHistory: [
        { role: 'assistant', content: 'Comment allez-vous ?' },
        { role: 'user', content: 'Ça va, mais j\'ai mal au dos' },
      ],
    });

    expect(payload.content).toContain('Comment allez-vous');
    expect(payload.content).toContain('mal au dos');
    expect(payload.content).toContain('PATIENT');
    expect(payload.content).toContain('ASSISTANT');
  });

  it('has a non-empty filePath and content', () => {
    const payload = buildDrivePayload({
      patientInfo,
      synthesis: 'Synthèse propre',
      collectedData: { motif: 'test' },
      redFlags: [],
      conversationHistory: [],
    });

    expect(payload.filePath).toBeTruthy();
    expect(payload.content).toBeTruthy();
    expect(payload.fileName).toBeTruthy();
  });
});
