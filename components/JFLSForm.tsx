import React, { useState, useCallback } from 'react';
import { JFLSAnswers } from '../types';
import { JFLS_QUESTIONS_FR } from '../constants';

interface JFLSFormProps {
    initialAnswers: JFLSAnswers;
    onNext: (answers: JFLSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: JFLSAnswers) => void;
    onSave: (answers: JFLSAnswers) => void;
}

const ratingLabels = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

export const JFLSForm: React.FC<JFLSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<JFLSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Jaw Functional Limitation Scale – 20 (JFLS-20)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Pour chaque élément ci-dessous, veuillez indiquer le niveau de limitation au cours du dernier mois. Si l'activité a été complètement évitée parce qu'elle est trop difficile, encerclez '10'. Si vous évitez une activité pour des raisons autres que la douleur ou la difficulté, laissez l'élément vide.</p>
            </header>

            <section>
                <div className="space-y-4">
                    {JFLS_QUESTIONS_FR.map(q => (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <p className="text-gray-700 mb-2"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                            <div className="flex flex-wrap items-center justify-start md:justify-center gap-1" role="group">
                                {ratingLabels.map(value => {
                                    const isSelected = answers[q.id] === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, value)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-800 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between w-[360px] max-w-full mx-auto text-xs text-gray-500 mt-1 px-1">
                                <span>Aucune limitation</span>
                                <span>Limitation sévère</span>
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
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors">Enregistrer les réponses</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors">Passer et voir le résumé</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default JFLSForm;
