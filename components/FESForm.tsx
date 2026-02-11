import React, { useState, useCallback } from 'react';
import { FESAnswers } from '../types';
import { FES_QUESTIONS_FR, FES_RATING_LABELS } from '../constants';

interface FESFormProps {
    initialAnswers: FESAnswers;
    onNext: (answers: FESAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: FESAnswers) => void;
    onSave: (answers: FESAnswers) => void;
}

const FESForm: React.FC<FESFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FESAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Falls Efficacy Scale (FES)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Sur une échelle de 1 à 10, 1 étant très confiant et 10 pas confiant du tout, à quel point êtes-vous confiant de faire les activités suivantes sans tomber ?</p>
            </header>

            <section>
                <div className="space-y-4">
                    {FES_QUESTIONS_FR.map(q => (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <p className="text-gray-700 mb-2"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                            <div className="flex flex-wrap gap-1 justify-center" role="group">
                                {FES_RATING_LABELS.map(value => {
                                    const isSelected = answers[q.id] === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, value)}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-800 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                             <div className="flex justify-between w-full max-w-sm mx-auto text-xs text-gray-500 mt-1 px-1">
                                <span>Très confiant</span>
                                <span>Pas confiant du tout</span>
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

export default FESForm;
