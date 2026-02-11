
import React, { useState, useCallback } from 'react';
import { HOOSPSAnswers } from '../types';
import { HOOS_PS_QUESTIONS_FR } from '../constants';

interface HOOSPSFormProps {
    initialAnswers: HOOSPSAnswers;
    onNext: (answers: HOOSPSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: HOOSPSAnswers) => void;
    onSave: (answers: HOOSPSAnswers) => void;
}

const HOOSPSForm: React.FC<HOOSPSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<HOOSPSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    // Scoring is reversed: Absente (no difficulty) = 4, Extrême = 0.
    const scoreValues = [4, 3, 2, 1, 0];

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Questionnaire de Hanche HOOS-PS</h2>
                <p className="mt-2 text-sm text-gray-600">Hip disability and Osteoarthritis Outcome Score - Physical Function Short form</p>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Les questions suivantes concernent ce que vous êtes capable de faire. Au cours des huit derniers jours, quelle a été votre difficulté pour chacune des activités suivantes ?</p>
            </header>

            <div className="space-y-8">
                {HOOS_PS_QUESTIONS_FR.map(section => (
                    <section key={section.id} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">{section.id}. {section.text}</h3>
                        <div className="flex flex-wrap gap-2">
                            {section.options.map((option, index) => {
                                const value = scoreValues[index];
                                const isSelected = answers[section.id] === value;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleAnswerChange(section.id, value)}
                                        className={`flex-1 min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                            isSelected
                                            ? 'bg-blue-800 text-white border-blue-800'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                        aria-pressed={isSelected}
                                    >
                                        {option}
                                    </button>
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

export default HOOSPSForm;
