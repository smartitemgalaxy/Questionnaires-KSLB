import React, { useState, useCallback } from 'react';
import { MMRCAnswers } from '../types';
import { MMRC_QUESTION_FR } from '../constants';

interface MMRCFormProps {
    initialAnswers: MMRCAnswers;
    onNext: (answers: MMRCAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: MMRCAnswers) => void;
    onSave: (answers: MMRCAnswers) => void;
}

const MMRCForm: React.FC<MMRCFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<MMRCAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((score: number) => {
        setAnswers({ score });
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{MMRC_QUESTION_FR.text}</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez choisir la description qui correspond le mieux à votre niveau d'essoufflement.</p>
            </header>

            <section className="space-y-3">
                {MMRC_QUESTION_FR.options.map(option => {
                    const isSelected = answers.score === option.score;
                    return (
                        <div key={option.score} className="flex items-center p-3 rounded-lg border bg-white hover:bg-gray-50">
                            <input
                                type="radio"
                                id={`mmrc-${option.score}`}
                                name="mmrc-score"
                                checked={isSelected}
                                onChange={() => handleAnswerChange(option.score)}
                                className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87] cursor-pointer"
                            />
                            <label htmlFor={`mmrc-${option.score}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                <span className="font-bold">Grade {option.score}:</span> {option.text}
                            </label>
                        </div>
                    );
                })}
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
                    <button
                        type="button"
                        onClick={() => onSave(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
                    >
                        Enregistrer les réponses
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

export default MMRCForm;