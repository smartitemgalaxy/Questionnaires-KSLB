
import React, { useState, useCallback } from 'react';
import { AmplitudesAnswers, MouvementAmplitudes } from '../types';
import { AMPLITUDES_QUESTIONS_FR } from '../constants';

interface AmplitudesFormProps {
    initialAnswers: AmplitudesAnswers;
    onNext: (answers: AmplitudesAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: AmplitudesAnswers) => void;
    onSave: (answers: AmplitudesAnswers) => void;
}

type Side = 'gauche' | 'droite';

const AmplitudesForm: React.FC<AmplitudesFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<AmplitudesAnswers>(initialAnswers);
    const [activeSides, setActiveSides] = useState<Record<string, Side>>({});

    const handleAnswerChange = useCallback((partKey: string, mvtKey: string, type: 'amplitude' | 'douleur', value: string, side?: Side) => {
        setAnswers(prev => {
            const newAnswers = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (side) {
                if (!newAnswers[partKey]) newAnswers[partKey] = { gauche: {}, droite: {} };
                if (!newAnswers[partKey][side]) newAnswers[partKey][side] = {};
                if (!(newAnswers[partKey][side] as any)[mvtKey]) (newAnswers[partKey][side] as any)[mvtKey] = { amplitude: null, douleur: null };
                ((newAnswers[partKey][side] as any)[mvtKey] as MouvementAmplitudes)[type] = value;
            } else {
                if (!newAnswers[partKey]) newAnswers[partKey] = {};
                if (!newAnswers[partKey][mvtKey]) newAnswers[partKey][mvtKey] = { amplitude: null, douleur: null };
                (newAnswers[partKey][mvtKey] as MouvementAmplitudes)[type] = value;
            }
            return newAnswers;
        });
    }, []);

    const getAnswer = (partKey: string, mvtKey: string, type: 'amplitude' | 'douleur', side?: Side): string | null => {
        if (side) {
            return (answers[partKey]?.[side] as any)?.[mvtKey]?.[type] || null;
        }
        return (answers[partKey]?.[mvtKey] as MouvementAmplitudes)?.[type] || null;
    };
    
    return (
        <div className="space-y-12">
            <header className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Auto-évaluation des Amplitudes Articulaires</h2>
                <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Ce questionnaire permet d'évaluer la mobilité de vos articulations. Pour chaque mouvement, choisissez la proposition qui décrit le mieux votre amplitude. Ensuite, indiquez si vous ressentez une douleur et à quel moment.</p>
            </header>

            {AMPLITUDES_QUESTIONS_FR.map(part => (
                <section key={part.partKey}>
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-800 pb-2 mb-4">{part.region}</h3>
                    
                    {part.bilateral && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Veuillez effectuer les mouvements suivants avec chaque bras séparément.</p>
                            <div className="flex justify-center gap-2 p-1 bg-gray-200 rounded-lg w-max mx-auto">
                                <button onClick={() => setActiveSides(p => ({...p, [part.partKey]: 'gauche'}))} className={`px-4 py-1 rounded-md text-sm font-semibold ${activeSides[part.partKey] !== 'droite' ? 'bg-white shadow' : ''}`}>Gauche</button>
                                <button onClick={() => setActiveSides(p => ({...p, [part.partKey]: 'droite'}))} className={`px-4 py-1 rounded-md text-sm font-semibold ${activeSides[part.partKey] === 'droite' ? 'bg-white shadow' : ''}`}>Droite</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        {part.mouvements.map(mvt => {
                            const side = part.bilateral ? (activeSides[part.partKey] || 'gauche') : undefined;
                            return (
                                <div key={mvt.mvtKey} className="p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold text-gray-800 mb-4">{mvt.mouvement} {side && `(${side})`}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Amplitude */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">{mvt.amplitude.question}</p>
                                            <div className="space-y-2">
                                                {mvt.amplitude.options.map(opt => (
                                                    <label key={opt} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                                        <input type="radio" name={`${part.partKey}-${mvt.mvtKey}-amp-${side}`} checked={getAnswer(part.partKey, mvt.mvtKey, 'amplitude', side) === opt} onChange={() => handleAnswerChange(part.partKey, mvt.mvtKey, 'amplitude', opt, side)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]"/>
                                                        <span className="ml-3 text-sm text-gray-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Douleur */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">{mvt.douleur.question}</p>
                                            <div className="space-y-2">
                                                 {mvt.douleur.options.map(opt => (
                                                    <label key={opt} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                                        <input type="radio" name={`${part.partKey}-${mvt.mvtKey}-douleur-${side}`} checked={getAnswer(part.partKey, mvt.mvtKey, 'douleur', side) === opt} onChange={() => handleAnswerChange(part.partKey, mvt.mvtKey, 'douleur', opt, side)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]"/>
                                                        <span className="ml-3 text-sm text-gray-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

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

export default AmplitudesForm;
