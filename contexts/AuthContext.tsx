import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PatientRecord } from '../storageTypes';
import { RegisterData } from '../services/auth';
import * as AuthService from '../services/auth';
import * as StorageService from '../services/storage';

interface AuthState {
    isAuthenticated: boolean;
    currentPatient: PatientRecord | null;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    login: (mode: 'numSecu', numSecu: string, pin: string) => Promise<{ success: boolean; error?: string }>;
    loginByName: (nom: string, prenom: string, dob: string, pin: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshPatient: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        currentPatient: null,
        isLoading: true,
    });

    // Check existing session on mount
    useEffect(() => {
        StorageService.checkAndMigrateVersion();
        const patient = AuthService.getCurrentPatient();
        if (patient) {
            setState({ isAuthenticated: true, currentPatient: patient, isLoading: false });
        } else {
            setState({ isAuthenticated: false, currentPatient: null, isLoading: false });
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
        setState({ isAuthenticated: false, currentPatient: null, isLoading: false });
    }, []);

    return (
        <AuthContext.Provider value={{
            ...state,
            register,
            login,
            loginByName,
            logout,
            refreshPatient,
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
