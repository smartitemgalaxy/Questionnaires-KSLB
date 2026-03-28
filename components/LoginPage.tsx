import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

type View = 'login' | 'register';
type LoginMode = 'numSecu' | 'nameDob';

interface LoginPageProps {
    onAdminAccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminAccess }) => {
    const { register, login, loginByName, sessionExpired, clearSessionExpired } = useAuth();
    const [view, setView] = useState<View>('login');
    const [loginMode, setLoginMode] = useState<LoginMode>('numSecu');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Login fields
    const [loginNumSecu, setLoginNumSecu] = useState('');
    const [loginPin, setLoginPin] = useState('');
    const [loginNom, setLoginNom] = useState('');
    const [loginPrenom, setLoginPrenom] = useState('');
    const [loginDob, setLoginDob] = useState('');

    // Register fields
    const [regPrenom, setRegPrenom] = useState('');
    const [regNom, setRegNom] = useState('');
    const [regDob, setRegDob] = useState('');
    const [regNumSecu, setRegNumSecu] = useState('');
    const [regPin, setRegPin] = useState('');
    const [regPinConfirm, setRegPinConfirm] = useState('');

    const handleNumSecuChange = (value: string, setter: (v: string) => void) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 15) setter(digits);
    };

    const handlePinChange = (value: string, setter: (v: string) => void) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 4) setter(digits);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        let result;
        if (loginMode === 'numSecu') {
            if (loginNumSecu.length !== 15 || loginPin.length !== 4) {
                setError('Veuillez remplir tous les champs correctement.');
                setIsSubmitting(false);
                return;
            }
            result = await login('numSecu', loginNumSecu, loginPin);
        } else {
            if (!loginNom.trim() || !loginPrenom.trim() || !loginDob || loginPin.length !== 4) {
                setError('Veuillez remplir tous les champs correctement.');
                setIsSubmitting(false);
                return;
            }
            result = await loginByName(loginNom, loginPrenom, loginDob, loginPin);
        }

        if (!result.success) {
            setError(result.error || 'Erreur de connexion.');
        }
        setIsSubmitting(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!regPrenom.trim() || !regNom.trim() || !regDob || regNumSecu.length !== 15 || regPin.length !== 4) {
            setError('Veuillez remplir tous les champs correctement.');
            return;
        }
        if (regPin !== regPinConfirm) {
            setError('Les codes PIN ne correspondent pas.');
            return;
        }

        setIsSubmitting(true);
        const result = await register({
            nom: regNom,
            prenom: regPrenom,
            dateNaissance: regDob,
            numeroSecuriteSociale: regNumSecu,
            pin: regPin,
        });

        if (!result.success) {
            setError(result.error || 'Erreur lors de l\'inscription.');
        }
        setIsSubmitting(false);
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87] outline-none transition-colors";
    const labelClass = "block text-left text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <Logo className="h-16 sm:h-24 w-auto" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0D57A6]">Questionnaires KSLB</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {view === 'login' ? 'Connectez-vous pour accéder à vos bilans' : 'Créez votre compte patient'}
                    </p>
                </div>

                {/* #M03 — Session expiry banner */}
                {sessionExpired && (
                    <div role="alert" className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center justify-between">
                        <span>Votre session a expiré. Veuillez vous reconnecter.</span>
                        <button onClick={clearSessionExpired} className="ml-2 text-amber-600 hover:text-amber-800 font-bold text-lg leading-none" aria-label="Fermer">&times;</button>
                    </div>
                )}

                {error && (
                    <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {view === 'login' ? (
                    <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        {/* Login mode tabs */}
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => { setLoginMode('numSecu'); setError(''); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${loginMode === 'numSecu' ? 'bg-white text-[#0D57A6] shadow-sm' : 'text-gray-500'}`}
                            >
                                N° Sécurité Sociale
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginMode('nameDob'); setError(''); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${loginMode === 'nameDob' ? 'bg-white text-[#0D57A6] shadow-sm' : 'text-gray-500'}`}
                            >
                                Nom & Date de naissance
                            </button>
                        </div>

                        {loginMode === 'numSecu' ? (
                            <div>
                                <label htmlFor="login-numsecu" className={labelClass}>Numéro de Sécurité Sociale</label>
                                <input
                                    id="login-numsecu"
                                    type="text"
                                    value={loginNumSecu}
                                    onChange={e => handleNumSecuChange(e.target.value, setLoginNumSecu)}
                                    className={inputClass}
                                    placeholder="15 chiffres"
                                    inputMode="numeric"
                                    autoComplete="off"
                                />
                                <p className={`text-right text-xs mt-1 ${loginNumSecu.length === 15 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {loginNumSecu.length}/15
                                </p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="login-nom" className={labelClass}>Nom</label>
                                    <input id="login-nom" type="text" value={loginNom} onChange={e => setLoginNom(e.target.value)} className={inputClass} autoComplete="family-name" />
                                </div>
                                <div>
                                    <label htmlFor="login-prenom" className={labelClass}>Prénom</label>
                                    <input id="login-prenom" type="text" value={loginPrenom} onChange={e => setLoginPrenom(e.target.value)} className={inputClass} autoComplete="given-name" />
                                </div>
                                <div>
                                    <label htmlFor="login-dob" className={labelClass}>Date de naissance</label>
                                    <input id="login-dob" type="date" value={loginDob} onChange={e => setLoginDob(e.target.value)} className={inputClass} />
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="login-pin" className={labelClass}>Code PIN (4 chiffres)</label>
                            <input
                                id="login-pin"
                                type="password"
                                value={loginPin}
                                onChange={e => handlePinChange(e.target.value, setLoginPin)}
                                className={inputClass}
                                placeholder="••••"
                                inputMode="numeric"
                                maxLength={4}
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 text-base font-semibold text-white bg-[#1565C0] rounded-lg shadow-sm hover:bg-[#0D57A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1565C0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Connexion...' : 'Se connecter'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Pas encore inscrit ?{' '}
                            <button type="button" onClick={() => { setView('register'); setError(''); }} className="text-[#1565C0] font-semibold hover:underline">
                                Créer un compte
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="reg-prenom" className={labelClass}>Prénom</label>
                                <input id="reg-prenom" type="text" value={regPrenom} onChange={e => setRegPrenom(e.target.value)} className={inputClass} autoComplete="given-name" />
                            </div>
                            <div>
                                <label htmlFor="reg-nom" className={labelClass}>Nom</label>
                                <input id="reg-nom" type="text" value={regNom} onChange={e => setRegNom(e.target.value)} className={inputClass} autoComplete="family-name" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reg-dob" className={labelClass}>Date de naissance</label>
                            <input id="reg-dob" type="date" value={regDob} onChange={e => setRegDob(e.target.value)} className={inputClass} />
                        </div>

                        <div>
                            <label htmlFor="reg-numsecu" className={labelClass}>Numéro de Sécurité Sociale</label>
                            <input
                                id="reg-numsecu"
                                type="text"
                                value={regNumSecu}
                                onChange={e => handleNumSecuChange(e.target.value, setRegNumSecu)}
                                className={inputClass}
                                placeholder="15 chiffres"
                                inputMode="numeric"
                                autoComplete="off"
                            />
                            <p className={`text-right text-xs mt-1 ${regNumSecu.length === 15 ? 'text-green-600' : 'text-gray-400'}`}>
                                {regNumSecu.length}/15
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="reg-pin" className={labelClass}>Code PIN</label>
                                <input
                                    id="reg-pin"
                                    type="password"
                                    value={regPin}
                                    onChange={e => handlePinChange(e.target.value, setRegPin)}
                                    className={inputClass}
                                    placeholder="4 chiffres"
                                    inputMode="numeric"
                                    maxLength={4}
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="reg-pin-confirm" className={labelClass}>Confirmer PIN</label>
                                <input
                                    id="reg-pin-confirm"
                                    type="password"
                                    value={regPinConfirm}
                                    onChange={e => handlePinChange(e.target.value, setRegPinConfirm)}
                                    className={inputClass}
                                    placeholder="4 chiffres"
                                    inputMode="numeric"
                                    maxLength={4}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        {regPin.length === 4 && regPinConfirm.length === 4 && regPin !== regPinConfirm && (
                            <p className="text-red-500 text-xs">Les codes PIN ne correspondent pas.</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 text-base font-semibold text-white bg-[#1565C0] rounded-lg shadow-sm hover:bg-[#0D57A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1565C0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Inscription...' : 'Créer mon compte'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Déjà inscrit ?{' '}
                            <button type="button" onClick={() => { setView('login'); setError(''); }} className="text-[#1565C0] font-semibold hover:underline">
                                Se connecter
                            </button>
                        </p>
                    </form>
                )}

                {/* #M31 — Admin link: improved visibility & accessibility */}
                {onAdminAccess && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={onAdminAccess}
                            className="text-xs text-gray-500 hover:text-[#1565C0] underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2 rounded"
                            aria-label="Accéder à l'espace administrateur"
                        >
                            Accès administrateur
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
