
import React, { useState, useCallback } from 'react';
import { PRTEEAnswers, PRTEEQuestion } from '../types';
import { PRTEE_PAIN_QUESTIONS_FR, PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR, PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR, SPADI_RATING_LABELS } from '../constants';

interface PRTEEFormProps {
    initialAnswers: PRTEEAnswers;
    onNext: (answers: PRTEEAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: PRTEEAnswers) => void;
    onSave: (answers: PRTEEAnswers) => void;
}

const PRTEEForm: React.FC<PRTEEFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<PRTEEAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const QuestionRow: React.FC<{ question: PRTEEQuestion }> = ({ question }) => (
        <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
            <p className="text-gray-700"><span className="font-semibold">{question.id}.</span> {question.text}</p>
            <div className="flex flex-wrap items-center justify-start md:justify-center gap-1" role="group" aria-label={`Évaluation pour ${question.text}`}>
                {SPADI_RATING_LABELS.map((value) => { // Reusing SPADI labels 0-10
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
                <h2 className="text-xl font-bold text-gray-900">Patient-Rated Tennis Elbow Evaluation (PRTEE)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez évaluer la douleur et la difficulté de votre bras affecté au cours de la semaine dernière.</p>
            </header>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle de la douleur</h3>
                <p className="text-sm text-gray-600 mb-4">Veuillez évaluer la douleur de votre bras sur une échelle de 0 à 10 (0 = aucune douleur, 10 = la pire douleur imaginable).</p>
                <div className="space-y-2">
                    {PRTEE_PAIN_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle de la fonction - Activités spécifiques</h3>
                <p className="text-sm text-gray-600 mb-4">Veuillez évaluer le degré de difficulté que vous avez éprouvé pour effectuer chacune des tâches suivantes sur une échelle de 0 à 10 (0 = aucune difficulté, 10 = incapable de faire).</p>
                <div className="space-y-2">
                    {PRTEE_SPECIFIC_ACTIVITIES_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle de la fonction - Activités habituelles</h3>
                <p className="text-sm text-gray-600 mb-4">Veuillez évaluer le degré de difficulté que vous avez éprouvé pour effectuer vos activités habituelles dans chaque domaine sur une échelle de 0 à 10 (0 = aucune difficulté, 10 = incapable de faire).</p>
                <div className="space-y-2">
                    {PRTEE_USUAL_ACTIVITIES_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
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

export default PRTEEForm;
