import { AdminAccount, AdminSessionData, APP_STORAGE_KEYS } from '../storageTypes';
import { auditLog } from './storage';

// ---- Rate Limiting (persisted in localStorage — survives refresh) (#C05) ----

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
const ADMIN_RATE_LIMIT_KEY = 'kslb_admin_rate_limit';

interface AdminRateLimitState {
    attempts: number;
    lockoutUntil: number;
}

function getAdminRateLimitState(): AdminRateLimitState {
    try {
        const raw = localStorage.getItem(ADMIN_RATE_LIMIT_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore corrupt data */ }
    return { attempts: 0, lockoutUntil: 0 };
}

function saveAdminRateLimitState(state: AdminRateLimitState): void {
    localStorage.setItem(ADMIN_RATE_LIMIT_KEY, JSON.stringify(state));
}

function checkAdminRateLimit(): string | null {
    const state = getAdminRateLimitState();
    if (Date.now() < state.lockoutUntil) {
        const remaining = Math.ceil((state.lockoutUntil - Date.now()) / 1000);
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        return `Trop de tentatives. Réessayez dans ${min}m${sec.toString().padStart(2, '0')}s.`;
    }
    if (state.lockoutUntil > 0 && Date.now() >= state.lockoutUntil) {
        saveAdminRateLimitState({ attempts: 0, lockoutUntil: 0 });
        return null;
    }
    if (state.attempts >= MAX_ATTEMPTS) {
        const newState = { attempts: 0, lockoutUntil: Date.now() + LOCKOUT_MS };
        saveAdminRateLimitState(newState);
        return `Trop de tentatives. Réessayez dans 5 minutes.`;
    }
    return null;
}

// ---- Password Hashing ----

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'kslb-admin-salt-2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---- Admin CRUD ----

function getAdmins(): AdminAccount[] {
    try {
        const raw = localStorage.getItem(APP_STORAGE_KEYS.ADMINS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveAdmins(admins: AdminAccount[]): void {
    localStorage.setItem(APP_STORAGE_KEYS.ADMINS, JSON.stringify(admins));
}

function getAdminById(id: string): AdminAccount | null {
    return getAdmins().find(a => a.id === id) || null;
}

function getAdminByUsername(username: string): AdminAccount | null {
    return getAdmins().find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

// ---- Setup (first admin) ----

export function hasAnyAdmin(): boolean {
    return getAdmins().length > 0;
}

export async function setupFirstAdmin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (getAdmins().length > 0) {
        return { success: false, error: 'Un administrateur existe déjà.' };
    }
    if (username.trim().length < 3) {
        return { success: false, error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.' };
    }
    // #M04 — Strengthened password policy (8+ chars, 1 uppercase, 1 lowercase, 1 digit)
    if (password.length < 8) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return { success: false, error: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.' };
    }

    const admin: AdminAccount = {
        id: crypto.randomUUID(),
        username: username.trim(),
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
    };
    saveAdmins([admin]);

    // Auto-login
    const session: AdminSessionData = { adminId: admin.id, loggedInAt: new Date().toISOString() };
    localStorage.setItem(APP_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));

    return { success: true };
}

// ---- Login / Logout ----

export async function adminLogin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    const rateLimitError = checkAdminRateLimit();
    if (rateLimitError) return { success: false, error: rateLimitError };

    const admin = getAdminByUsername(username);
    if (!admin) {
        const s = getAdminRateLimitState();
        s.attempts++;
        saveAdminRateLimitState(s);
        return { success: false, error: 'Identifiants incorrects.' };
    }

    const hash = await hashPassword(password);
    if (hash !== admin.passwordHash) {
        const s = getAdminRateLimitState();
        s.attempts++;
        saveAdminRateLimitState(s);
        return { success: false, error: 'Identifiants incorrects.' };
    }

    localStorage.removeItem(ADMIN_RATE_LIMIT_KEY);
    const session: AdminSessionData = { adminId: admin.id, loggedInAt: new Date().toISOString() };
    localStorage.setItem(APP_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));

    auditLog('ADMIN_LOGIN', admin.id, `username=${username}`);
    return { success: true };
}

export function adminLogout(): void {
    localStorage.removeItem(APP_STORAGE_KEYS.ADMIN_SESSION);
}

const ADMIN_SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 heures

export function getAdminSession(): AdminSessionData | null {
    try {
        const raw = localStorage.getItem(APP_STORAGE_KEYS.ADMIN_SESSION);
        if (!raw) return null;
        const session: AdminSessionData = JSON.parse(raw);
        const age = Date.now() - new Date(session.loggedInAt).getTime();
        if (age > ADMIN_SESSION_EXPIRY_MS) {
            localStorage.removeItem(APP_STORAGE_KEYS.ADMIN_SESSION);
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export function getCurrentAdmin(): AdminAccount | null {
    const session = getAdminSession();
    if (!session) return null;
    return getAdminById(session.adminId);
}
