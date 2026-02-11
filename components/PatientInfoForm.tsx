
import React, { useState } from 'react';
import { PatientInfo } from '../types';
import Logo from './Logo';

interface PatientInfoFormProps {
    onSubmit: (info: PatientInfo) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ onSubmit }) => {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [numeroSecuriteSociale, setNumeroSecuriteSociale] = useState('');

    const handleNumeroSecuriteSocialeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length <= 15) {
            setNumeroSecuriteSociale(digitsOnly);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prenom && nom && numeroSecuriteSociale.length === 15) {
            onSubmit({
                prenom,
                nom,
                numeroSecuriteSociale,
                date: new Date().toLocaleDateString('fr-FR'),
            });
        }
    };
    
    const isFormValid = prenom.trim() !== '' && nom.trim() !== '' && numeroSecuriteSociale.length === 15;

    return (
        <div className="text-center">
            <div className="mb-8 flex justify-center">
                <Logo className="h-24 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D57A6] mb-2">Bienvenue</h2>
            <p className="text-gray-600 mb-8">Veuillez vous identifier pour commencer votre bilan.</p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div>
                    <label htmlFor="prenom" className="block text-left text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        id="prenom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87]"
                        required
                        autoComplete="given-name"
                    />
                </div>
                <div>
                    <label htmlFor="nom" className="block text-left text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87]"
                        required
                        autoComplete="family-name"
                    />
                </div>
                 <div>
                    <label htmlFor="numeroSecuriteSociale" className="block text-left text-sm font-medium text-gray-700 mb-1">Numéro de Sécurité Sociale</label>
                    <input
                        type="text"
                        id="numeroSecuriteSociale"
                        value={numeroSecuriteSociale}
                        onChange={handleNumeroSecuriteSocialeChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8F87] focus:border-[#FF8F87]"
                        required
                        autoComplete="off"
                        maxLength={15}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Entrez les 15 chiffres"
                    />
                    <p className={`text-right text-xs mt-1 ${numeroSecuriteSociale.length === 15 ? 'text-green-600' : 'text-gray-500'}`}>
                        {numeroSecuriteSociale.length} / 15 chiffres
                    </p>
                </div>
                
                <button
                    type="submit"
                    className="w-full px-6 py-3 text-base font-semibold text-white bg-[#1565C0] rounded-lg shadow-sm hover:bg-[#0D57A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1565C0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!isFormValid}
                >
                    Commencer le questionnaire
                </button>
            </form>
        </div>
    );
};

export default PatientInfoForm;
