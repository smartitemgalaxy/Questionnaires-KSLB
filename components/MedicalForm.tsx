
import React, { useState } from 'react';
import { MedicalAnswers, MedicalAnswer, MedicalQuestionDef, MedicalQuestionSectionDef, AnatomySelection } from '../types';
import AnatomySelector from './AnatomySelector';

interface MedicalFormProps {
    title: string;
    questionnaire: MedicalQuestionSectionDef[];
    initialAnswers: MedicalAnswers;
    onNext: (answers: MedicalAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: MedicalAnswers) => void;
    onSave: (answers: MedicalAnswers) => void;
}

const MedicalQuestion: React.FC<{
    question: MedicalQuestionDef;
    answer: MedicalAnswer;
    onChange: (id: string, answer: MedicalAnswer) => void;
}> = ({ question, answer, onChange }) => {
    const { id, text, type, placeholder } = question;

    const handleValueChange = (value: string | boolean) => {
        onChange(id, { ...answer, value });
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, { ...answer, details: e.target.value });
    };

    return (
        <div className="py-4 border-b border-gray-200 last:border-b-0">
            <label htmlFor={id} className={`block text-gray-700 mb-2 ${text.startsWith('Cochez la zone') ? 'font-bold' : 'font-medium'}`}>{text}</label>
            {type === 'text' && (
                <input
                    id={id}
                    type="text"
                    value={(answer.value as string) || ''}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                    placeholder={placeholder || ''}
                />
            )}
             {type === 'anatomy-selector' && (
                <AnatomySelector
                    value={answer.value as AnatomySelection | null}
                    onChange={(newValue) => onChange(id, { ...answer, value: newValue })}
                />
            )}
            {(type === 'yes-no' || type === 'yes-no-specify') && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-4">
                        <button type="button" onClick={() => handleValueChange(true)} className={`px-4 py-2 rounded-md text-sm font-semibold ${answer.value === true ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Oui</button>
                        <button type="button" onClick={() => handleValueChange(false)} className={`px-4 py-2 rounded-md text-sm font-semibold ${answer.value === false ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Non</button>
                    </div>
                    {type === 'yes-no-specify' && answer.value === true && (
                        <div className="ml-1">
                            <label className="block text-sm text-gray-500 mb-1">Précisez :</label>
                            <input
                                type="text"
                                value={answer.details}
                                onChange={handleDetailsChange}
                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                                placeholder={placeholder || ''}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const MedicalForm: React.FC<MedicalFormProps> = ({ title, questionnaire, initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<MedicalAnswers>(initialAnswers);

    const handleAnswerChange = (id: string, answer: MedicalAnswer) => {
        setAnswers(prev => ({...prev, [id]: answer}));
    };
    
    return (
        <div>
            <header className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </header>
            <div className="space-y-8">
                {questionnaire.map(section => (
                    <section key={section.title}>
                        <h3 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-blue-800">{section.title}</h3>
                        <div className="space-y-2">
                            {section.questions.map(q => (
                                <MedicalQuestion 
                                    key={q.id}
                                    question={q}
                                    answer={answers[q.id]}
                                    onChange={handleAnswerChange}
                                />
                            ))}
                        </div>
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

export default MedicalForm;
