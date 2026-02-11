
import React, { useState, useCallback } from 'react';
import { DASHAnswers } from '../types';
import { DASH_QUESTIONS_FR, DASH_RATING_LABELS } from '../constants';

interface DASHFormProps {
    initialAnswers: DASHAnswers;
    onNext: (answers: DASHAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: DASHAnswers) => void;
    onSave: (answers: DASHAnswers) => void;
}

const DASHForm: React.FC<DASHFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<DASHAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const renderQuestion = (q: (typeof DASH_QUESTIONS_FR)[0]) => (
        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">{q.id}.</span> {q.text}
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={`Évaluation pour ${q.text}`}>
                {DASH_RATING_LABELS.map((value, index) => {
                    const isSelected = answers[q.id] === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleAnswerChange(q.id, value)}
                            className={`flex-1 basis-1/6 min-w-[120px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                                isSelected 
                                ? 'bg-blue-800 text-white border-blue-800' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                            aria-pressed={isSelected}
                        >
                            {q.options[index]} ({value})
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Questionnaire DASH</h2>
                <p className="mt-1 text-sm text-gray-600">Disabilities of the Arm, Shoulder and Hand</p>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez évaluer votre capacité à effectuer les activités suivantes au cours de la dernière semaine en cochant la case appropriée.</p>
            </header>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Activités quotidiennes</h3>
                <div className="space-y-4">{DASH_QUESTIONS_FR.slice(0, 21).map(renderQuestion)}</div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Symptômes et limitations</h3>
                <div className="space-y-4">{DASH_QUESTIONS_FR.slice(21, 30).map(renderQuestion)}</div>
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

export default DASHForm;
