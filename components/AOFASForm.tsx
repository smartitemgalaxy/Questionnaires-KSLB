import React, { useState, useCallback } from 'react';
import { AOFASAnswers } from '../types';

interface AOFASFormProps {
    initialAnswers: AOFASAnswers;
    onNext: (answers: AOFASAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: AOFASAnswers) => void;
    onSave: (answers: AOFASAnswers) => void;
}

const sections = {
    pain: { title: "Douleur (40 points)", options: [ { label: 'Aucune', value: 40 }, { label: 'Légère, occasionnelle', value: 30 }, { label: 'Modérée, quotidienne', value: 20 }, { label: 'Sévère, presque toujours présente', value: 0 } ]},
    activity_limitations: { title: "Limitations d'activité, support requis", options: [ { label: 'Pas de limitations, pas de support', value: 10 }, { label: "Pas de limitation des activités quotidiennes, limitation des activités récréatives, pas de support", value: 7 }, { label: 'Limitation des activités quotidiennes et récréatives, canne', value: 4 }, { label: 'Limitation sévère des activités quotidiennes et récréatives, déambulateur, béquilles, fauteuil roulant, orthèse', value: 0 } ]},
    walking_distance: { title: "Distance de marche maximale, blocs", options: [ { label: 'Plus de six', value: 5 }, { label: 'Quatre à six', value: 4 }, { label: 'Un à trois', value: 2 }, { label: 'Moins d’un', value: 0 } ]},
    walking_surface: { title: "Surfaces de marche", options: [ { label: 'Pas de difficulté sur aucune surface', value: 5 }, { label: 'Quelques difficultés sur terrain accidenté, escaliers, pentes, échelles', value: 3 }, { label: 'Difficulté sévère sur terrain accidenté, escaliers, pentes, échelles', value: 0 } ]},
    gait_abnormality: { title: "Anomalie de la marche", options: [ { label: 'Aucune, légère', value: 8 }, { label: 'Évidente', value: 4 }, { label: 'Marquée', value: 0 } ]},
    sagittal_motion: { title: "Mouvement sagittal (flexion plus extension)", options: [ { label: 'Normal ou restriction légère (30° ou plus)', value: 8 }, { label: 'Restriction modérée (15° - 29°)', value: 4 }, { label: 'Restriction sévère (moins de 15°)', value: 0 } ]},
    hindfoot_motion: { title: "Mouvement de l'arrière-pied (inversion plus éversion)", options: [ { label: 'Normal ou restriction légère (75% - 100% normal)', value: 6 }, { label: 'Restriction modérée (25% - 74% normal)', value: 3 }, { label: 'Restriction marquée (moins de 25% normal)', value: 0 } ]},
    stability: { title: "Stabilité de la cheville et de l'arrière-pied (antéropostérieure, varus-valgus)", options: [ { label: 'Stable', value: 8 }, { label: 'Définitivement instable', value: 0 } ]},
    alignment: { title: "Alignement (10 points)", options: [ { label: 'Bon, pied plantigrade, cheville-arrière-pied bien aligné', value: 10 }, { label: 'Moyen, pied plantigrade, un certain degré de désalignement de la cheville-arrière-pied observé, pas de symptômes', value: 5 }, { label: 'Mauvais, pied non plantigrade, désalignement sévère, symptômes', value: 0 } ]},
};

const AOFASForm: React.FC<AOFASFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<AOFASAnswers>(initialAnswers);

    const handleChange = useCallback((name: keyof AOFASAnswers, value: number) => {
        setAnswers(prev => ({ ...prev, [name]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">AOFAS Ankle-Hindfoot Scale</h2>
            </header>
            
            <div className="space-y-6">
                {Object.entries(sections).map(([key, section]) => (
                    <section key={key} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">{section.title}</h3>
                        <div className="space-y-3">
                            {section.options.map(opt => (
                                <div key={opt.value} className="flex items-center">
                                    <input type="radio" id={`${key}-${opt.value}`} name={key} checked={answers[key as keyof AOFASAnswers] === opt.value} onChange={() => handleChange(key as keyof AOFASAnswers, opt.value)} className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                                    <label htmlFor={`${key}-${opt.value}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">{opt.label}</label>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <footer className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                >
                    Précédent
                </button>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-end gap-4">
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100">Enregistrer</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300">Passer</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default AOFASForm;
