import React, { useState, useCallback } from 'react';
import { HADAnswers } from '../types';
import { HAD_QUESTIONS_FR } from '../constants';

interface HADFormProps {
    initialAnswers: HADAnswers;
    onNext: (answers: HADAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: HADAnswers) => void;
    onSave: (answers: HADAnswers) => void;
}

const HADForm: React.FC<HADFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<HADAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);
    
    // Split questions for two-column layout
    const column1 = HAD_QUESTIONS_FR.filter(q => q.id <= 7);
    const column2 = HAD_QUESTIONS_FR.filter(q => q.id > 7);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Échelle HAD</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6">
                    {column1.map(q => (
                        <div key={q.id} className="p-4 rounded-lg bg-gray-50 border">
                            <p className="font-semibold text-gray-800 mb-3">{q.id}. {q.text}</p>
                            <div className="space-y-2">
                                {q.options.map(opt => (
                                    <label key={opt.value} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`had-${q.id}`}
                                            checked={answers[q.id] === opt.value}
                                            onChange={() => handleAnswerChange(q.id, opt.value)}
                                            className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="space-y-6">
                    {column2.map(q => (
                        <div key={q.id} className="p-4 rounded-lg bg-gray-50 border">
                            <p className="font-semibold text-gray-800 mb-3">{q.id}. {q.text}</p>
                            <div className="space-y-2">
                                {q.options.map(opt => (
                                    <label key={opt.value} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`had-${q.id}`}
                                            checked={answers[q.id] === opt.value}
                                            onChange={() => handleAnswerChange(q.id, opt.value)}
                                            className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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

export default HADForm;