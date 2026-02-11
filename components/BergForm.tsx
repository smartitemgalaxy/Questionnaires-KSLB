import React, { useState, useCallback } from 'react';
import { BergAnswers } from '../types';
import { BERG_QUESTIONS_FR } from '../constants';

interface BergFormProps {
    initialAnswers: BergAnswers;
    onNext: (answers: BergAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: BergAnswers) => void;
    onSave: (answers: BergAnswers) => void;
}

const BergForm: React.FC<BergFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<BergAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Échelle d'Équilibre de Berg (Auto-Évaluation)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez auto-évaluer votre capacité à effectuer les tâches suivantes. Choisissez l'option qui décrit le mieux votre performance habituelle sans aide extérieure (aide à la marche ou assistance d'une personne).</p>
            </header>

            <div className="space-y-8">
                {BERG_QUESTIONS_FR.map(section => (
                    <section key={section.id} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-base font-bold text-gray-800">{section.id}. {section.text}</h3>
                        <p className="text-sm text-gray-600 mb-4 italic">{section.instructions}</p>
                        <div className="space-y-3">
                            {section.options.map((option, index) => {
                                // Berg score is 0-4, but options are reversed in the array
                                const scoreValue = section.options.length - 1 - index;
                                const isSelected = answers[section.id] === scoreValue;
                                return (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`berg-${section.id}-${index}`}
                                            name={`berg-${section.id}`}
                                            checked={isSelected}
                                            onChange={() => handleAnswerChange(section.id, scoreValue)}
                                            className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor={`berg-${section.id}-${index}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                            {option}
                                        </label>
                                    </div>
                                );
                            }).reverse() /* Reverse to match 0-4 score with options */}
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

export default BergForm;
