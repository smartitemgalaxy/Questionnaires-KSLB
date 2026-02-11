import React, { useState, useCallback } from 'react';
import { FOGQAnswers, FOGQQuestion } from '../types';
import { FOGQ_QUESTIONS_FR } from '../constants';

interface FOGQFormProps {
    initialAnswers: FOGQAnswers;
    onNext: (answers: FOGQAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: FOGQAnswers) => void;
    onSave: (answers: FOGQAnswers) => void;
}

const FOGQForm: React.FC<FOGQFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FOGQAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const QuestionRow: React.FC<{ question: FOGQQuestion }> = ({ question }) => (
        <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <p className="text-gray-700 mb-2"><span className="font-semibold">{question.id}.</span> {question.text}</p>
            <div className="flex flex-col space-y-2">
                {question.options.map((option, index) => {
                    const isSelected = answers[question.id] === index;
                    return (
                        <label key={index} className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-200'}`}>
                            <input
                                type="radio"
                                name={`fogq-${question.id}`}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(question.id, index)}
                                className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{option}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Freezing of Gait Questionnaire (FOGQ)</h2>
            </header>

            <section>
                <div className="space-y-4">
                    {FOGQ_QUESTIONS_FR.map(q => <QuestionRow key={q.id} question={q} />)}
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

export default FOGQForm;
