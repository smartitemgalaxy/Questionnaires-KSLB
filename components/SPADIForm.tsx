
import React, { useState, useCallback } from 'react';
import { SPADIAnswers, SPADIQuestion } from '../types';
import { SPADI_PAIN_QUESTIONS_FR, SPADI_DISABILITY_QUESTIONS_FR, SPADI_RATING_LABELS } from '../constants';

interface SPADIFormProps {
    initialAnswers: SPADIAnswers;
    onNext: (answers: SPADIAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: SPADIAnswers) => void;
    onSave: (answers: SPADIAnswers) => void;
}

const SPADIForm: React.FC<SPADIFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<SPADIAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const QuestionRow: React.FC<{ question: SPADIQuestion }> = ({ question }) => (
        <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
            <p className="text-gray-700"><span className="font-semibold">{question.id}.</span> {question.text}</p>
            <div className="flex flex-wrap items-center justify-start md:justify-center gap-1" role="group" aria-label={`Évaluation pour ${question.text}`}>
                {SPADI_RATING_LABELS.map((value) => {
                    const isSelected = answers[question.id] === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleAnswerChange(question.id, value)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSelected ? 'bg-blue-800 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
                            aria-pressed={isSelected}
                            aria-label={`${value}`}
                        >
                            {value}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Shoulder Pain and Disability Index (SPADI)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez indiquer le chiffre qui décrit le mieux votre expérience au cours de la semaine dernière.</p>
            </header>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle de la douleur</h3>
                <p className="text-sm text-gray-600 mb-4">Quelle est la gravité de votre douleur ? (0 = aucune douleur, 10 = la pire douleur imaginable)</p>
                <div className="space-y-2">
                    {SPADI_PAIN_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle de l'incapacité</h3>
                <p className="text-sm text-gray-600 mb-4">Quel degré de difficulté éprouvez-vous ? (0 = aucune difficulté, 10 = si difficile que cela nécessite de l'aide)</p>
                <div className="space-y-2">
                    {SPADI_DISABILITY_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
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

export default SPADIForm;
