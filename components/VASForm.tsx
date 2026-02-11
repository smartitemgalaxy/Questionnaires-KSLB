
import React, { useState, useCallback } from 'react';
import { VASAnswers } from '../types';
import { VAS_QUESTION_FR } from '../constants';

interface VASFormProps {
    initialAnswers: VASAnswers;
    onNext: (answers: VASAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: VASAnswers) => void;
    onSave: (answers: VASAnswers) => void;
}

const VASForm: React.FC<VASFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<VASAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((value: number) => {
        setAnswers({ pain: value });
    }, []);

    const ratingLabels = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Échelle Visuelle Analogique (EVA) pour la douleur</h2>
            </header>
            
            <section className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-700 mb-4 font-semibold">{VAS_QUESTION_FR.text}</p>
                <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Échelle de douleur de 0 à 10">
                    {ratingLabels.map((value) => {
                        const isSelected = answers.pain === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleAnswerChange(value)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-800 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                                aria-pressed={isSelected}
                                aria-label={`${value}`}
                            >
                                {value}
                            </button>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                    <span>Aucune douleur</span>
                    <span>Pire douleur imaginable</span>
                </div>
            </section>

            <footer className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                >
                    Précédent
                </button>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-end gap-4">
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors">Enregistrer les réponses</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors">Passer et voir le résumé</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default VASForm;
