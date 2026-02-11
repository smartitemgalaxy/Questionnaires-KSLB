import React, { useState, useCallback } from 'react';
import { LEFSAnswers } from '../types';
import { LEFS_QUESTIONS_FR } from '../constants';

interface LEFSFormProps {
    initialAnswers: LEFSAnswers;
    onNext: (answers: LEFSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: LEFSAnswers) => void;
    onSave: (answers: LEFSAnswers) => void;
}

const LEFSForm: React.FC<LEFSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<LEFSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Lower Extremity Functional Scale (LEFS)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Nous souhaitons savoir si vous éprouvez des difficultés avec les activités énumérées ci-dessous à cause de votre problème au membre inférieur. Veuillez fournir une réponse pour chaque activité.</p>
            </header>

            <section>
                <div className="space-y-4">
                    {LEFS_QUESTIONS_FR.map(q => (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <p className="text-gray-700 mb-2"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                            <div className="flex flex-wrap gap-2">
                                {q.options.map((option, index) => {
                                    const value = index; // Score 0-4
                                    const isSelected = answers[q.id] === value;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, value)}
                                            className={`flex-1 min-w-[120px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
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
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100">Enregistrer</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300">Passer</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default LEFSForm;
