import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PatientRecord } from '../storageTypes';
import { RegisterData } from '../services/auth';
import * as AuthService from '../services/auth';
import * as StorageService from '../services/storage';

interface AuthState {
    isAuthenticated: boolean;
    currentPatient: PatientRecord | null;
    isLoading: boolean;
    sessionExpired: boolean; // #M03 — flag for user-visible expiry message
}

interface AuthContextValue extends AuthState {
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    login: (mode: 'numSecu', numSecu: string, pin: string) => Promise<{ success: boolean; error?: string }>;
    loginByName: (nom: string, prenom: string, dob: string, pin: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshPatient: () => void;
    clearSessionExpired: () => void; // #M03
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        currentPatient: null,
        isLoading: true,
        sessionExpired: false,
    });

    // Check existing session on mount
    useEffect(() => {
        StorageService.checkAndMigrateVersion();

        // DEV_BYPASS: ?dev=patient or ?dev=admin in URL skips auth
        if (import.meta.env.DEV) {
            const devMode = new URLSearchParams(window.location.search).get('dev');
            if (devMode === 'patient' || devMode === 'admin') {
                const devPatient: PatientRecord = {
                    account: { id: 'dev-test-001', nom: 'Test', prenom: 'Dev', dateNaissance: '1990-01-01', numeroSecuriteSociale: '1900175000001', pinHash: 'fakehash', createdAt: new Date().toISOString() },
                    completedBilans: [], inProgress: null
                };
                setState({ isAuthenticated: true, currentPatient: devPatient, isLoading: false, sessionExpired: false });
                return;
            }
        }

        // #M03 — Detect expired session to show user-visible message
        const rawSession = StorageService.getSession();
        const patient = AuthService.getCurrentPatient();
        if (patient) {
            setState({ isAuthenticated: true, currentPatient: patient, isLoading: false, sessionExpired: false });
        } else {
            // If there was a stored session but getCurrentPatient returned null → session expired
            const expired = rawSession !== null && patient === null;
            setState({ isAuthenticated: false, currentPatient: null, isLoading: false, sessionExpired: expired });
        }
    }, []);

    const refreshPatient = useCallback(() => {
        const patient = AuthService.getCurrentPatient();
        if (patient) {
            setState(prev => ({ ...prev, currentPatient: patient }));
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        const result = await AuthService.registerPatient(data);
        if (result.success && result.patientId) {
            const patient = StorageService.getPatientById(result.patientId);
            setState({ isAuthenticated: true, currentPatient: patient, isLoading: false });
        }
        return { success: result.success, error: result.error };
    }, []);

    const login = useCallback(async (_mode: 'numSecu', numSecu: string, pin: string) => {
        const result = await AuthService.loginByNumSecu(numSecu, pin);
        if (result.success && result.patientId) {
            const patient = StorageService.getPatientById(result.patientId);
            setState({ isAuthenticated: true, currentPatient: patient, isLoading: false });
        }
        return { success: result.success, error: result.error };
    }, []);

    const loginByName = useCallback(async (nom: string, prenom: string, dob: string, pin: string) => {
        const result = await AuthService.loginByNameDob(nom, prenom, dob, pin);
        if (result.success && result.patientId) {
            const patient = StorageService.getPatientById(result.patientId);
            setState({ isAuthenticated: true, currentPatient: patient, isLoading: false });
        }
        return { success: result.success, error: result.error };
    }, []);

    const logout = useCallback(() => {
        AuthService.logout();
        StorageService.invalidateCache();
        setState({ isAuthenticated: false, currentPatient: null, isLoading: false, sessionExpired: false });
    }, []);

    // #M03 — Allow LoginPage to clear the expired message after user sees it
    const clearSessionExpired = useCallback(() => {
        setState(prev => ({ ...prev, sessionExpired: false }));
    }, []);

    // #M08 — Multi-tab localStorage sync: detect login/logout from another tab
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'kslb_session' || e.key === 'kslb_patients') {
                const patient = AuthService.getCurrentPatient();
                if (patient) {
                    setState(prev => ({ ...prev, isAuthenticated: true, currentPatient: patient, sessionExpired: false }));
                } else if (state.isAuthenticated) {
                    // Another tab logged out or session was cleared
                    StorageService.invalidateCache();
                    setState({ isAuthenticated: false, currentPatient: null, isLoading: false, sessionExpired: false });
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [state.isAuthenticated]);

    return (
        <AuthContext.Provider value={{
            ...state,
            register,
            login,
            loginByName,
            logout,
            refreshPatient,
            clearSessionExpired,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
