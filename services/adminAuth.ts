import { AdminAccount, AdminSessionData, APP_STORAGE_KEYS } from '../storageTypes';

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
        return { success: false, error: 'Un administrateur existe deja.' };
    }
    if (username.trim().length < 3) {
        return { success: false, error: 'Le nom d\'utilisateur doit contenir au moins 3 caracteres.' };
    }
    if (password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caracteres.' };
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
    const admin = getAdminByUsername(username);
    if (!admin) {
        return { success: false, error: 'Identifiants incorrects.' };
    }

    const hash = await hashPassword(password);
    if (hash !== admin.passwordHash) {
        return { success: false, error: 'Identifiants incorrects.' };
    }

    const session: AdminSessionData = { adminId: admin.id, loggedInAt: new Date().toISOString() };
    localStorage.setItem(APP_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));

    return { success: true };
}

export function adminLogout(): void {
    localStorage.removeItem(APP_STORAGE_KEYS.ADMIN_SESSION);
}

export function getAdminSession(): AdminSessionData | null {
    try {
        const raw = localStorage.getItem(APP_STORAGE_KEYS.ADMIN_SESSION);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function getCurrentAdmin(): AdminAccount | null {
    const session = getAdminSession();
    if (!session) return null;
    return getAdminById(session.adminId);
}
