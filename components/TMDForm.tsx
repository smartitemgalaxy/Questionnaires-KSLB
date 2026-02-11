import React, { useState, useCallback } from 'react';
import { TMDAnswers } from '../types';
import { TMD_QUESTIONS_FR } from '../constants';

interface TMDFormProps {
    initialAnswers: TMDAnswers;
    onNext: (answers: TMDAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: TMDAnswers) => void;
    onSave: (answers: TMDAnswers) => void;
}

const TMDForm: React.FC<TMDFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<TMDAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({...prev, [questionId]: value}));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">TMD Disability Index Questionnaire</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez cocher la seule affirmation qui vous correspond le mieux (pas nécessairement exactement) dans chacune des catégories suivantes.</p>
            </header>

            <div className="space-y-8">
                {TMD_QUESTIONS_FR.map(section => (
                    <section key={section.id}>
                        <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">{section.id}. {section.section}</h3>
                        <div className="space-y-3">
                            {section.options.map((option, index) => {
                                const isSelected = answers[section.id] === index;
                                return (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`tmd-${section.id}-${index}`}
                                            name={`tmd-${section.id}`}
                                            checked={isSelected}
                                            onChange={() => handleAnswerChange(section.id, index)}
                                            className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87] cursor-pointer"
                                        />
                                        <label htmlFor={`tmd-${section.id}-${index}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
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

export default TMDForm;
