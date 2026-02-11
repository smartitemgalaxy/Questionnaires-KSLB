
import React, { useState, useCallback } from 'react';
import { CopenhagenAnswers } from '../types';
import { COPENHAGEN_QUESTIONS_FR, COPENHAGEN_RATING_LABELS, COPENHAGEN_RATING_DESCRIPTIONS } from '../constants';

interface CopenhagenFormProps {
    initialAnswers: CopenhagenAnswers;
    onNext: (answers: CopenhagenAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: CopenhagenAnswers) => void;
    onSave: (answers: CopenhagenAnswers) => void;
}

const CopenhagenForm: React.FC<CopenhagenFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<CopenhagenAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Copenhagen Neck Disability Scale</h2>
            </header>

            <section>
                <div className="space-y-1">
                     <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-4 pr-2 mb-2">
                        <div></div>
                        <div className="grid grid-cols-3 w-48">
                            {COPENHAGEN_RATING_DESCRIPTIONS.map(desc => (
                                <div key={desc} className="text-center">
                                    <p className="text-xs text-gray-500 font-medium">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {COPENHAGEN_QUESTIONS_FR.map((q) => (
                            <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                                <p className="text-gray-700"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                                <div className="flex items-center justify-start md:justify-center" role="group" aria-label={`Évaluation pour ${q.text}`}>
                                    <div className="grid grid-cols-3 gap-x-2 w-48">
                                        {COPENHAGEN_RATING_LABELS.map((value, index) => {
                                            const isSelected = answers[q.id] === value;
                                            return (
                                                <div key={value} className="text-center flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAnswerChange(q.id, value)}
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-800 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                                                        aria-pressed={isSelected}
                                                        aria-label={COPENHAGEN_RATING_DESCRIPTIONS[index]}
                                                    >
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default CopenhagenForm;
