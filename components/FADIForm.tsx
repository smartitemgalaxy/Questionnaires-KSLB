import React, { useState, useCallback } from 'react';
import { FADIAnswers, FADIQuestion } from '../types';
import { FADI_ADL_QUESTIONS_FR, FADI_SPORTS_QUESTIONS_FR } from '../constants';

interface FADIFormProps {
    initialAnswers: FADIAnswers;
    onNext: (answers: FADIAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: FADIAnswers) => void;
    onSave: (answers: FADIAnswers) => void;
}

const options = [
    { label: "Aucune difficulté", value: 4 },
    { label: "Difficulté légère", value: 3 },
    { label: "Difficulté modérée", value: 2 },
    { label: "Difficulté extrême", value: 1 },
    { label: "Incapable de faire", value: 0 },
    { label: "Non applicable", value: 'N/A' },
] as const;

const FADIForm: React.FC<FADIFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FADIAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number | 'N/A') => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const QuestionRow: React.FC<{ question: FADIQuestion }> = ({ question }) => (
        <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <p className="text-gray-700 mb-2"><span className="font-semibold">{question.scale === 'adl' ? question.id : question.id - 26}.</span> {question.text}</p>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => {
                    const isSelected = answers[question.id] === opt.value;
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleAnswerChange(question.id, opt.value)}
                            className={`flex-1 min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            aria-pressed={isSelected}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Foot and Ankle Disability Index (FADI)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à chaque question avec une seule réponse qui décrit le mieux votre état au cours de la semaine dernière.</p>
            </header>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle des activités de la vie quotidienne</h3>
                <div className="space-y-2">
                    {FADI_ADL_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Échelle des sports</h3>
                <div className="space-y-2">
                    {FADI_SPORTS_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
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

export default FADIForm;
