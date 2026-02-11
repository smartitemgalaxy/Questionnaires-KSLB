
import React, { useState, useCallback } from 'react';
import { LysholmAnswers } from '../types';
import { LYSHOLM_QUESTIONS_FR } from '../constants';

interface LysholmFormProps {
    initialAnswers: LysholmAnswers;
    onNext: (answers: LysholmAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: LysholmAnswers) => void;
    onSave: (answers: LysholmAnswers) => void;
}

const LysholmForm: React.FC<LysholmFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<LysholmAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Lysholm Knee Scoring Scale</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à chaque section en cochant la case qui décrit le mieux votre situation actuelle.</p>
            </header>

            <div className="space-y-8">
                {LYSHOLM_QUESTIONS_FR.map(section => (
                    <section key={section.id}>
                        <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">{section.id}. {section.section}</h3>
                        <div className="space-y-3">
                            {section.options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`lysholm-${section.id}-${index}`}
                                        name={`lysholm-${section.id}`}
                                        checked={answers[section.id] === index}
                                        onChange={() => handleAnswerChange(section.id, index)}
                                        className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`lysholm-${section.id}-${index}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                        {option.text}
                                    </label>
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

export default LysholmForm;
