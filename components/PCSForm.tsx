import React, { useState, useCallback } from 'react';
import { PCSAnswers } from '../types';
import { 
    PCS_QUESTIONS_FR, 
    PCS_RATING_LABELS,
    PCS_RATING_DESCRIPTIONS
} from '../constants';

interface PCSFormProps {
    initialAnswers: PCSAnswers;
    onNext: (answers: PCSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: PCSAnswers) => void;
    onSave: (answers: PCSAnswers) => void;
}

const PCSForm: React.FC<PCSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<PCSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: value,
        }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">PCS</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">En utilisant l'échelle de 0 à 4, veuillez indiquer dans quelle mesure vous avez ces pensées et sentiments lorsque vous ressentez de la douleur (0 = Pas du tout, 1 = Légèrement, 2 = Modérément, 3 = Fortement, 4 = Tout le temps).</p>
            </header>
            
            <section>
                <div className="space-y-1">
                    <div className="hidden md:grid grid-cols-[1fr_auto] items-end gap-4 mb-2" style={{height: '60px'}}>
                        <div />
                        <div className="grid grid-cols-5 w-[16rem] sm:w-[20rem]">
                            {PCS_RATING_DESCRIPTIONS.map((desc) => (
                                <div key={desc} className="flex justify-center items-end transform -rotate-45 origin-bottom">
                                    <p className="text-xs text-gray-500 font-medium whitespace-nowrap pb-1">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                    {PCS_QUESTIONS_FR.map((q) => (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                            <p className="text-gray-700">
                                <span className="font-semibold">{q.id}.</span> {q.text}
                            </p>
                            <div className="flex items-center justify-start md:justify-center" role="group" aria-label={`Évaluation pour la question ${q.id}`}>
                                <div className="grid grid-cols-5 gap-x-1 sm:gap-x-2 w-[16rem] sm:w-[20rem]">
                                {PCS_RATING_LABELS.map((value, index) => {
                                const isSelected = answers[q.id] === value;
                                return (
                                    <div key={value} className="text-center flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, value)}
                                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F87]
                                                ${isSelected 
                                                ? 'bg-[#FF8F87] text-white shadow-md scale-110' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-rose-100'
                                                }`}
                                            aria-pressed={isSelected}
                                            aria-label={`${PCS_RATING_DESCRIPTIONS[index]}: ${value}`}
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

export default PCSForm;