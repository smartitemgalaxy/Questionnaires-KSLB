import { PatientAccount, PatientRecord, SessionData } from '../storageTypes';
import * as StorageService from './storage';

// ---- PIN Hashing ----

export async function hashPin(pin: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'kslb-questionnaires-2024');
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

export async function registerPatient(data: RegisterData): Promise<{ success: boolean; patientId?: string; error?: string }> {
    // Check uniqueness by numero secu
    const existing = StorageService.getPatientByNumSecu(data.numeroSecuriteSociale);
    if (existing) {
        return { success: false, error: 'Un compte existe deja avec ce numero de securite sociale.' };
    }

    const pinHash = await hashPin(data.pin);
    const id = crypto.randomUUID();

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
    const patient = StorageService.getPatientByNumSecu(numSecu);
    if (!patient) {
        return { success: false, error: 'Aucun compte trouve avec ce numero.' };
    }

    const pinHash = await hashPin(pin);
    if (pinHash !== patient.account.pinHash) {
        return { success: false, error: 'Code PIN incorrect.' };
    }

    const session: SessionData = {
        patientId: patient.account.id,
        loggedInAt: new Date().toISOString(),
    };
    StorageService.setSession(session);

    return { success: true, patientId: patient.account.id };
}

export async function loginByNameDob(
    nom: string, prenom: string, dob: string, pin: string
): Promise<{ success: boolean; patientId?: string; error?: string }> {
    const patient = StorageService.findPatientByNameDob(nom, prenom, dob);
    if (!patient) {
        return { success: false, error: 'Aucun compte trouve avec ces informations.' };
    }

    const pinHash = await hashPin(pin);
    if (pinHash !== patient.account.pinHash) {
        return { success: false, error: 'Code PIN incorrect.' };
    }

    const session: SessionData = {
        patientId: patient.account.id,
        loggedInAt: new Date().toISOString(),
    };
    StorageService.setSession(session);

    return { success: true, patientId: patient.account.id };
}

// ---- Session ----

export function logout(): void {
    StorageService.clearSession();
}

export function getCurrentSession(): SessionData | null {
    return StorageService.getSession();
}

export function getCurrentPatient(): PatientRecord | null {
    const session = StorageService.getSession();
    if (!session) return null;
    return StorageService.getPatientById(session.patientId);
}
