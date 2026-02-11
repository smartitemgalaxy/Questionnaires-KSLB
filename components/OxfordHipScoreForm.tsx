
import React, { useState, useCallback } from 'react';
import { OHSAnswers } from '../types';
import { OXFORD_HIP_SCORE_QUESTIONS_FR } from '../constants';

interface OxfordHipScoreFormProps {
    initialAnswers: OHSAnswers;
    onNext: (answers: OHSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: OHSAnswers) => void;
    onSave: (answers: OHSAnswers) => void;
}

const OxfordHipScoreForm: React.FC<OxfordHipScoreFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<OHSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    // Score is 4 for best outcome, 0 for worst.
    const scoreValues = [4, 3, 2, 1, 0];

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Oxford Hip Score</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à ces questions concernant votre hanche au cours des 4 dernières semaines. Cochez une seule case pour chaque question.</p>
            </header>

            <div className="space-y-8">
                {OXFORD_HIP_SCORE_QUESTIONS_FR.map(section => (
                    <section key={section.id} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">{section.id}. {section.text}</h3>
                        <div className="space-y-3">
                            {section.options.map((option, index) => {
                                const value = scoreValues[index];
                                const isSelected = answers[section.id] === value;
                                return (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`ohs-${section.id}-${index}`}
                                            name={`ohs-${section.id}`}
                                            checked={isSelected}
                                            onChange={() => handleAnswerChange(section.id, value)}
                                            className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor={`ohs-${section.id}-${index}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                            {option}
                                        </label>
                                    </div>
                                );
                            })}
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
                    <button
                        type="button"
                        onClick={() => onSave(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
                    >
                        Enregistrer
                    </button>
                    <button
                        type="button"
                        onClick={() => onSkipToSummary(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                    >
                        Passer et voir le résumé
                    </button>
                    <button
                        type="button"
                        onClick={() => onNext(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default OxfordHipScoreForm;
