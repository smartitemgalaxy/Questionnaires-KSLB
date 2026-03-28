import {
    APP_STORAGE_KEYS, APP_VERSION,
    PatientRecord, SessionData, InProgressSession, CompletedBilan
} from '../storageTypes';

// In-memory cache to avoid parsing on every read
let patientsCache: PatientRecord[] | null = null;

function readPatients(): PatientRecord[] {
    if (patientsCache) return patientsCache;
    try {
        const raw = localStorage.getItem(APP_STORAGE_KEYS.PATIENTS);
        patientsCache = raw ? JSON.parse(raw) : [];
    } catch {
        patientsCache = [];
    }
    return patientsCache!;
}

function writePatients(patients: PatientRecord[]): void {
    try {
        localStorage.setItem(APP_STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
        patientsCache = patients;
    } catch (e: any) {
        if (e?.name === 'QuotaExceededError') {
            throw new Error('Espace de stockage insuffisant. Veuillez exporter et supprimer d\'anciens bilans.');
        }
        throw e;
    }
}

// ---- Patient CRUD ----

export function getPatients(): PatientRecord[] {
    return readPatients();
}

export function getPatientById(id: string): PatientRecord | null {
    return readPatients().find(p => p.account.id === id) || null;
}

export function getPatientByNumSecu(numSecu: string): PatientRecord | null {
    return readPatients().find(p => p.account.numeroSecuriteSociale === numSecu) || null;
}

export function findPatientByNameDob(nom: string, prenom: string, dob: string): PatientRecord | null {
    const normNom = nom.trim().toLowerCase();
    const normPrenom = prenom.trim().toLowerCase();
    return readPatients().find(p =>
        p.account.nom.toLowerCase() === normNom &&
        p.account.prenom.toLowerCase() === normPrenom &&
        p.account.dateNaissance === dob
    ) || null;
}

export function savePatient(record: PatientRecord): void {
    const patients = readPatients();
    patients.push(record);
    writePatients(patients);
}

export function updatePatient(record: PatientRecord): void {
    const patients = readPatients();
    const idx = patients.findIndex(p => p.account.id === record.account.id);
    if (idx === -1) throw new Error('Patient introuvable');
    patients[idx] = record;
    writePatients(patients);
}

// ---- Session ----

export function getSession(): SessionData | null {
    try {
        const raw = localStorage.getItem(APP_STORAGE_KEYS.SESSION);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setSession(session: SessionData): void {
    localStorage.setItem(APP_STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
    localStorage.removeItem(APP_STORAGE_KEYS.SESSION);
}

// ---- In-progress bilan ----

export function saveInProgress(patientId: string, session: InProgressSession): void {
    const patient = getPatientById(patientId);
    if (!patient) return;
    patient.inProgress = session;
    updatePatient(patient);
}

export function clearInProgress(patientId: string): void {
    const patient = getPatientById(patientId);
    if (!patient) return;
    patient.inProgress = null;
    updatePatient(patient);
}

export function getInProgress(patientId: string): InProgressSession | null {
    const patient = getPatientById(patientId);
    return patient?.inProgress || null;
}

// ---- Completed bilans ----

export function saveCompletedBilan(patientId: string, bilan: CompletedBilan): void {
    const patient = getPatientById(patientId);
    if (!patient) return;
    patient.completedBilans.push(bilan);
    patient.inProgress = null;
    updatePatient(patient);
}

export function getCompletedBilans(patientId: string): CompletedBilan[] {
    const patient = getPatientById(patientId);
    return patient?.completedBilans || [];
}

export function deleteCompletedBilan(patientId: string, bilanId: string): void {
    const patient = getPatientById(patientId);
    if (!patient) return;
    patient.completedBilans = patient.completedBilans.filter(b => b.id !== bilanId);
    updatePatient(patient);
}

// ---- Export ----

export function exportPatientDataAsJSON(patientId: string): string {
    const patient = getPatientById(patientId);
    if (!patient) return '{}';
    // Remove sensitive data from export
    const { pinHash, ...accountSafe } = patient.account;
    return JSON.stringify({ account: accountSafe, completedBilans: patient.completedBilans }, null, 2);
}

// ---- Storage usage ----

export function getStorageUsage(): { usedKB: number; percentage: number } {
    let total = 0;
    for (const key of Object.values(APP_STORAGE_KEYS)) {
        const item = localStorage.getItem(key);
        if (item) total += item.length * 2; // UTF-16 = 2 bytes per char
    }
    const usedKB = Math.round(total / 1024);
    const limitKB = 5120; // ~5MB conservative estimate
    return { usedKB, percentage: Math.round((usedKB / limitKB) * 100) };
}

// ---- Version migration ----

export function checkAndMigrateVersion(): void {
    const stored = localStorage.getItem(APP_STORAGE_KEYS.VERSION);
    if (!stored) {
        localStorage.setItem(APP_STORAGE_KEYS.VERSION, APP_VERSION);
    }
    // Future migrations can go here
}

// ---- Cache invalidation (for external use if needed) ----

export function invalidateCache(): void {
    patientsCache = null;
}

// ---- Audit Log Stub (#M10) ----
// Structured audit trail for security-sensitive actions.
// Currently writes to console; future: persist to localStorage or remote endpoint.

interface AuditEntry {
    timestamp: string;
    action: string;
    actor: string;       // 'admin' | patientId
    details?: string;
}

const AUDIT_LOG_KEY = 'kslb_audit_log';
const MAX_AUDIT_ENTRIES = 200;

export function auditLog(action: string, actor: string, details?: string): void {
    const entry: AuditEntry = {
        timestamp: new Date().toISOString(),
        action,
        actor,
        details,
    };
    if (process.env.NODE_ENV === 'development') {
        console.info('[KSLB Audit]', entry);
    }
    try {
        const raw = localStorage.getItem(AUDIT_LOG_KEY);
        const log: AuditEntry[] = raw ? JSON.parse(raw) : [];
        log.push(entry);
        // Keep only the last MAX_AUDIT_ENTRIES
        if (log.length > MAX_AUDIT_ENTRIES) {
            log.splice(0, log.length - MAX_AUDIT_ENTRIES);
        }
        localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(log));
    } catch { /* localStorage full or unavailable — ignore silently */ }
}

export function getAuditLog(): AuditEntry[] {
    try {
        const raw = localStorage.getItem(AUDIT_LOG_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}
