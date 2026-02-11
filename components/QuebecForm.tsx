
import React, { useState, useCallback } from 'react';
import { QuebecAnswers } from '../types';
import { QUEBEC_QUESTIONS_FR, QUEBEC_RATING_LABELS, QUEBEC_RATING_DESCRIPTIONS } from '../constants';

interface QuebecFormProps {
    initialAnswers: QuebecAnswers;
    onNext: (answers: QuebecAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: QuebecAnswers) => void;
    onSave: (answers: QuebecAnswers) => void;
}

const QuebecForm: React.FC<QuebecFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<QuebecAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">The Québec Back Pain Disability Scale (Version modifiée)</h2>
                 <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Avez-vous de la difficulté aujourd'hui à accomplir les activités suivantes à cause de votre blessure liée au travail? Veuillez encercler le chiffre de l'échelle de 0 à 5 qui correspond le mieux à chacune des activités.</p>
            </header>

            <section>
                <div>
                    {/* Header row for descriptions. This div creates the vertical space and holds the labels. */}
                    <div className="hidden md:grid grid-cols-[1fr_auto] items-end gap-4" style={{ height: '12rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                        <div />
                        <div className="grid grid-cols-6 w-[20rem] sm:w-[25rem] gap-x-1 sm:gap-x-2 h-full">
                            {QUEBEC_RATING_DESCRIPTIONS.map((desc) => (
                                <div key={desc} className="relative"> {/* Use relative positioning for each label container */}
                                    <p
                                        className="absolute bottom-6 left-1/2 transform -rotate-45 origin-bottom-left text-xs text-gray-500 font-medium whitespace-nowrap"
                                    >
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Question rows */}
                    <div className="space-y-2">
                        {QUEBEC_QUESTIONS_FR.map((q) => (
                            <div key={q.id} className="p-3 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                                <p className="text-gray-700"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                                <div className="flex items-center justify-start md:justify-center" role="group" aria-label={`Évaluation pour ${q.text}`}>
                                    <div className="grid grid-cols-6 gap-x-1 sm:gap-x-2 w-[20rem] sm:w-[25rem]">
                                        {QUEBEC_RATING_LABELS.map((value) => {
                                            const isSelected = answers[q.id] === value;
                                            return (
                                                <div key={value} className="text-center flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAnswerChange(q.id, value)}
                                                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-offset-2 focus:ring-slate-400 bg-slate-200 text-slate-800 border border-slate-300/50 ${isSelected ? 'ring-2 ring-slate-500' : ''}`}
                                                        aria-pressed={isSelected}
                                                        aria-label={`${value}`}
                                                    >
                                                        {value}
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

export default QuebecForm;
