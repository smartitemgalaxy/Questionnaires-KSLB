import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

type View = 'login' | 'register';
type LoginMode = 'numSecu' | 'nameDob';

interface LoginPageProps {
    onAdminAccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminAccess }) => {
    const { register, login, loginByName } = useAuth();
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
                    <div className="flex justify-center mb-4">
                        <Logo className="h-24 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0D57A6]">Questionnaires KSLB</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {view === 'login' ? 'Connectez-vous pour acceder a vos bilans' : 'Creez votre compte patient'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
                                N° Securite Sociale
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
                                <label className={labelClass}>Numero de Securite Sociale</label>
                                <input
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
                                    <label className={labelClass}>Nom</label>
                                    <input type="text" value={loginNom} onChange={e => setLoginNom(e.target.value)} className={inputClass} autoComplete="family-name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Prenom</label>
                                    <input type="text" value={loginPrenom} onChange={e => setLoginPrenom(e.target.value)} className={inputClass} autoComplete="given-name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Date de naissance</label>
                                    <input type="date" value={loginDob} onChange={e => setLoginDob(e.target.value)} className={inputClass} />
                                </div>
                            </>
                        )}

                        <div>
                            <label className={labelClass}>Code PIN (4 chiffres)</label>
                            <input
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
                                Creer un compte
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Prenom</label>
                                <input type="text" value={regPrenom} onChange={e => setRegPrenom(e.target.value)} className={inputClass} autoComplete="given-name" />
                            </div>
                            <div>
                                <label className={labelClass}>Nom</label>
                                <input type="text" value={regNom} onChange={e => setRegNom(e.target.value)} className={inputClass} autoComplete="family-name" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Date de naissance</label>
                            <input type="date" value={regDob} onChange={e => setRegDob(e.target.value)} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Numero de Securite Sociale</label>
                            <input
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
                                <label className={labelClass}>Code PIN</label>
                                <input
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
                                <label className={labelClass}>Confirmer PIN</label>
                                <input
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
                            {isSubmitting ? 'Inscription...' : 'Creer mon compte'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Deja inscrit ?{' '}
                            <button type="button" onClick={() => { setView('login'); setError(''); }} className="text-[#1565C0] font-semibold hover:underline">
                                Se connecter
                            </button>
                        </p>
                    </form>
                )}

                {onAdminAccess && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={onAdminAccess}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Acces administrateur
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
