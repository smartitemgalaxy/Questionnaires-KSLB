
import React, { useState, useCallback } from 'react';
import { IKDCAnswers, IKDCQuestion } from '../types';
import { IKDC_QUESTIONS_FR } from '../constants';

interface IKDCFormProps {
    initialAnswers: IKDCAnswers;
    onNext: (answers: IKDCAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: IKDCAnswers) => void;
    onSave: (answers: IKDCAnswers) => void;
}

const IKDCForm: React.FC<IKDCFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<IKDCAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);
    
    const handleSubAnswerChange = useCallback((questionId: string, subId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...(prev[questionId] as object || {}),
                [subId]: value
            }
        }));
    }, []);

    const renderQuestion = (q: IKDCQuestion) => {
        switch (q.type) {
            case 'select':
                return (
                    <div className="space-y-2">
                        {q.options?.map((opt, index) => (
                            <label key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
                                <input
                                    type="radio"
                                    name={q.id}
                                    checked={answers[q.id] === index}
                                    onChange={() => handleAnswerChange(q.id, index)}
                                    className="h-4 w-4 text-blue-800 border-gray-300 focus:ring-blue-500"
                                />
                                <span>{opt.text}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'scale':
                const scaleValue = (answers[q.id] as number) ?? 5;
                return (
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={scaleValue}
                            onChange={(e) => handleAnswerChange(q.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs px-1 mt-1">
                            <span>0</span>
                            <span className="font-semibold text-blue-800">{scaleValue}</span>
                            <span>10</span>
                        </div>
                    </div>
                );
            case 'yesno':
                return (
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => handleAnswerChange(q.id, 0)} className={`px-4 py-2 rounded-md font-semibold ${answers[q.id] === 0 ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Oui</button>
                        <button type="button" onClick={() => handleAnswerChange(q.id, 1)} className={`px-4 py-2 rounded-md font-semibold ${answers[q.id] === 1 ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Non</button>
                    </div>
                );
             case 'function':
                const functionAnswers = answers[q.id] as { [key: string]: number | null } || {};
                return (
                    <div className="space-y-4">
                        {q.subQuestions?.map(sq => (
                            <div key={sq.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
                                <p className="font-medium text-gray-700">{sq.text}</p>
                                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                    {sq.options?.map((opt, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            onClick={() => handleSubAnswerChange(q.id, sq.id, index)}
                                            className={`px-3 py-1.5 rounded-md text-sm ${functionAnswers[sq.id] === index ? 'bg-blue-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">International Knee Documentation Committee (IKDC)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à toutes les questions en vous basant sur votre genou affecté.</p>
            </header>

            <div className="space-y-6">
                {IKDC_QUESTIONS_FR.map(q => (
                    <section key={q.id} className="p-4 border rounded-lg bg-gray-50">
                        {q.type === 'function' ? (
                            <>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">{q.id}. {q.text}</h3>
                                {renderQuestion(q)}
                            </>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                                <p className="text-base font-semibold text-gray-800">{q.id}. {q.text}</p>
                                <div className="md:w-64">
                                    {renderQuestion(q)}
                                </div>
                            </div>
                        )}
                    </section>
                ))}
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

export default IKDCForm;
