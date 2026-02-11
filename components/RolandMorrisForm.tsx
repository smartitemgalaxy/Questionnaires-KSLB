
import React, { useState, useCallback } from 'react';
import { RolandMorrisAnswers } from '../types';
import { ROLAND_MORRIS_QUESTIONS_FR } from '../constants';

interface RolandMorrisFormProps {
    initialAnswers: RolandMorrisAnswers;
    onNext: (answers: RolandMorrisAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: RolandMorrisAnswers) => void;
    onSave: (answers: RolandMorrisAnswers) => void;
}

const RolandMorrisForm: React.FC<RolandMorrisFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<RolandMorrisAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, isChecked: boolean) => {
        setAnswers(prev => ({ ...prev, [questionId]: isChecked }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Questionnaire d'évaluation de la capacité fonctionnelle (EIFEL)</h2>
                 <p className="mt-2 text-sm text-gray-600">(Version française du Roland and Morris Disability Questionnaire)</p>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Quand vous lirez une phrase qui correspond bien à une difficulté qui vous affecte aujourd'hui, cochez-la. Dans le cas contraire, laissez un blanc et passez à la phrase suivante.</p>
            </header>

            <section>
                <div className="space-y-3">
                    {ROLAND_MORRIS_QUESTIONS_FR.map(q => (
                        <div key={q.id} className="flex items-start p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <input
                                type="checkbox"
                                id={`roland-morris-${q.id}`}
                                checked={!!answers[q.id]}
                                onChange={(e) => handleAnswerChange(q.id, e.target.checked)}
                                className="h-4 w-4 mt-1 text-[#FF8F87] border-gray-300 rounded focus:ring-[#FF8F87] cursor-pointer"
                            />
                            <label htmlFor={`roland-morris-${q.id}`} className="ml-3 text-gray-700 cursor-pointer">
                                {q.text}
                            </label>
                        </div>
                    ))}
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

export default RolandMorrisForm;
