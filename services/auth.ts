import { PatientAccount, PatientRecord, SessionData } from '../storageTypes';
import * as StorageService from './storage';
import { auditLog } from './storage';

// ---- Rate Limiting (persisted in localStorage — survives refresh) (#C05) ----

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_KEY = 'kslb_patient_rate_limit';

interface RateLimitState {
    attempts: number;
    lockoutUntil: number;
}

function getRateLimitState(): RateLimitState {
    try {
        const raw = localStorage.getItem(RATE_LIMIT_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore corrupt data */ }
    return { attempts: 0, lockoutUntil: 0 };
}

function saveRateLimitState(state: RateLimitState): void {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
}

function checkRateLimit(): string | null {
    const state = getRateLimitState();
    if (Date.now() < state.lockoutUntil) {
        const remaining = Math.ceil((state.lockoutUntil - Date.now()) / 1000);
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        return `Trop de tentatives. Réessayez dans ${min}m${sec.toString().padStart(2, '0')}s.`;
    }
    // Reset lockout if expired
    if (state.lockoutUntil > 0 && Date.now() >= state.lockoutUntil) {
        saveRateLimitState({ attempts: 0, lockoutUntil: 0 });
        return null;
    }
    if (state.attempts >= MAX_ATTEMPTS) {
        const newState = { attempts: 0, lockoutUntil: Date.now() + LOCKOUT_MS };
        saveRateLimitState(newState);
        const min = Math.floor(LOCKOUT_MS / 60000);
        return `Trop de tentatives. Réessayez dans ${min} minutes.`;
    }
    return null;
}

function recordFailedAttempt(): void {
    const state = getRateLimitState();
    state.attempts++;
    saveRateLimitState(state);
}

function resetAttempts(): void {
    localStorage.removeItem(RATE_LIMIT_KEY);
}

// ---- PIN Hashing ----

// #M05 — Per-account salt (accountId = UUID) replaces static salt
export async function hashPin(pin: string, accountId?: string): Promise<string> {
    const salt = accountId || 'kslb-questionnaires-2024'; // fallback for registration before ID exists
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---- Registration ----

export interface RegisterData {
    nom: string;
    prenom: string;
    dateNaissance: string;
    numeroSecuriteSociale: string;
    pin: string;
}

// #M02 — Basic French NSS format validation
function isValidNSS(nss: string): boolean {
    if (nss.length !== 15) return false;
    const gender = nss[0];
    if (gender !== '1' && gender !== '2') return false;
    const month = parseInt(nss.substring(3, 5), 10);
    if (month < 1 || (month > 12 && month !== 20)) return false; // 20 = Corse
    return /^\d{15}$/.test(nss);
}

export async function registerPatient(data: RegisterData): Promise<{ success: boolean; patientId?: string; error?: string }> {
    // #M02 — Validate NSS format
    if (!isValidNSS(data.numeroSecuriteSociale)) {
        return { success: false, error: 'Le numéro de sécurité sociale n\'est pas au format valide.' };
    }

    // Check uniqueness by numero secu
    const existing = StorageService.getPatientByNumSecu(data.numeroSecuriteSociale);
    if (existing) {
        return { success: false, error: 'Un compte existe déjà avec ce numéro de sécurité sociale.' };
    }

    const id = crypto.randomUUID();
    const pinHash = await hashPin(data.pin, id);

    const account: PatientAccount = {
        id,
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        dateNaissance: data.dateNaissance,
        numeroSecuriteSociale: data.numeroSecuriteSociale,
        pinHash,
        createdAt: new Date().toISOString(),
    };

    const record: PatientRecord = {
        account,
        completedBilans: [],
        inProgress: null,
    };

    try {
        StorageService.savePatient(record);
    } catch (e: any) {
        return { success: false, error: e.message || 'Erreur lors de l\'enregistrement.' };
    }

    // Auto-login after registration
    const session: SessionData = {
        patientId: id,
        loggedInAt: new Date().toISOString(),
    };
    StorageService.setSession(session);

    return { success: true, patientId: id };
}

// ---- Login ----

export async function loginByNumSecu(numSecu: string, pin: string): Promise<{ success: boolean; patientId?: string; error?: string }> {
    const rateLimitError = checkRateLimit();
    if (rateLimitError) return { success: false, error: rateLimitError };

    const patient = StorageService.getPatientByNumSecu(numSecu);
    if (!patient) {
        recordFailedAttempt();
        // #M01 — Generic error to prevent account enumeration
        return { success: false, error: 'Identifiants incorrects.' };
    }

    const pinHash = await hashPin(pin, patient.account.id);
    if (pinHash !== patient.account.pinHash) {
        recordFailedAttempt();
        return { success: false, error: 'Identifiants incorrects.' };
    }

    resetAttempts();
    const session: SessionData = {
        patientId: patient.account.id,
        loggedInAt: new Date().toISOString(),
    };
    StorageService.setSession(session);

    auditLog('PATIENT_LOGIN', patient.account.id, 'numSecu');
    return { success: true, patientId: patient.account.id };
}

export async function loginByNameDob(
    nom: string, prenom: string, dob: string, pin: string
): Promise<{ success: boolean; patientId?: string; error?: string }> {
    const rateLimitError = checkRateLimit();
    if (rateLimitError) return { success: false, error: rateLimitError };

    const patient = StorageService.findPatientByNameDob(nom, prenom, dob);
    if (!patient) {
        recordFailedAttempt();
        return { success: false, error: 'Identifiants incorrects.' };
    }

    const pinHash = await hashPin(pin, patient.account.id);
    if (pinHash !== patient.account.pinHash) {
        recordFailedAttempt();
        return { success: false, error: 'Identifiants incorrects.' };
    }

    resetAttempts();
    const session: SessionData = {
        patientId: patient.account.id,
        loggedInAt: new Date().toISOString(),
    };
    StorageService.setSession(session);

    auditLog('PATIENT_LOGIN', patient.account.id, 'nameDob');
    return { success: true, patientId: patient.account.id };
}

// ---- Session ----

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 heures

export function logout(): void {
    StorageService.clearSession();
}

export function getCurrentSession(): SessionData | null {
    const session = StorageService.getSession();
    if (!session) return null;
    const age = Date.now() - new Date(session.loggedInAt).getTime();
    if (age > SESSION_EXPIRY_MS) {
        StorageService.clearSession();
        return null;
    }
    return session;
}

export function getCurrentPatient(): PatientRecord | null {
    const session = getCurrentSession();
    if (!session) return null;
    return StorageService.getPatientById(session.patientId);
}
