import React, { useState, useCallback } from 'react';
import { ObjectifsAnswers } from '../types';
import { OBJECTIFS_QUESTIONS_FR } from '../constants';

interface ObjectifsFormProps {
    initialAnswers: ObjectifsAnswers;
    onNext: (answers: ObjectifsAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: ObjectifsAnswers) => void;
    onSave: (answers: ObjectifsAnswers) => void;
}

const ObjectifsForm: React.FC<ObjectifsFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<ObjectifsAnswers>(initialAnswers);

    const handleValueChange = useCallback((key: keyof ObjectifsAnswers, value: string | number | null) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleCheckboxChange = useCallback((key: 'q1' | 'q2' | 'q3' | 'q4', value: string) => {
        setAnswers(prev => {
            const currentValues = prev[key] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            
            if (newValues.length > 3) {
                return prev; // Do not update state if more than 3 are selected
            }

            return { ...prev, [key]: newValues };
        });
    }, []);

    const handleAutreChange = useCallback((key: keyof ObjectifsAnswers, value: string) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleDetailsChange = useCallback((detailKey: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            q12_details: {
                ...prev.q12_details,
                [detailKey]: value,
            }
        }));
    }, []);

    return (
        <div className="space-y-12">
            <header className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{OBJECTIFS_QUESTIONS_FR.title}</h2>
            </header>

            {OBJECTIFS_QUESTIONS_FR.sections.map((section, index) => (
                <section key={section.id}>
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-800 pb-2 mb-4">Section {index + 1}</h3>
                    {(section.id === 's1' || section.id === 's2') && (
                         <p className="text-sm text-gray-500 mb-4">Vous pouvez sélectionner jusqu'à 3 réponses.</p>
                    )}
                    <div className="space-y-6">
                        {section.questions.map(q => (
                            <div key={q.id}>
                                <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                                {q.type === 'checkbox' && (
                                    <div className="space-y-2">
                                        {(['q1', 'q2', 'q3', 'q4'] as const).includes(q.id as any) && (() => {
                                            const questionId = q.id as 'q1' | 'q2' | 'q3' | 'q4';
                                            const currentValues = answers[questionId] || [];
                                            const isMaxSelected = currentValues.length >= 3;
                                            
                                            return (
                                                <>
                                                    {q.options.map(opt => {
                                                        const isChecked = currentValues.includes(opt);
                                                        return (
                                                            <label key={opt} className={`flex items-center p-2 rounded-md ${isMaxSelected && !isChecked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                                                <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange(questionId, opt)} disabled={isMaxSelected && !isChecked} className="h-4 w-4 text-[#FF8F87] border-gray-300 rounded focus:ring-[#FF8F87]" />
                                                                <span className="ml-3 text-sm text-gray-700">{opt}</span>
                                                            </label>
                                                        );
                                                    })}
                                                    {q.hasAutre && (
                                                        <div className="flex items-center p-2">
                                                            <input type="checkbox" id={`${q.id}-autre-checkbox`} checked={currentValues.includes('Autre')} onChange={() => handleCheckboxChange(questionId, 'Autre')} disabled={isMaxSelected && !currentValues.includes('Autre')} className="h-4 w-4 text-[#FF8F87] border-gray-300 rounded focus:ring-[#FF8F87]" />
                                                            <label htmlFor={`${q.id}-autre-checkbox`} className="ml-3 text-sm text-gray-700">{q.autreLabel}</label>
                                                            <input type="text" value={answers[`${q.id}_autre` as keyof ObjectifsAnswers] as string} onChange={e => handleAutreChange(`${q.id}_autre` as keyof ObjectifsAnswers, e.target.value)} className="ml-2 flex-grow p-1 bg-white border border-gray-300 rounded-md text-sm" />
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                                {q.type === 'radio' && (
                                    <div className="space-y-2">
                                        {q.options.map(opt => (
                                            <label key={opt} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                                <input type="radio" name={q.id} value={opt} checked={answers[q.id as keyof ObjectifsAnswers] === opt} onChange={() => handleValueChange(q.id as keyof ObjectifsAnswers, opt)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                                <span className="ml-3 text-sm text-gray-700">{opt}</span>
                                            </label>
                                        ))}
                                        {q.hasAutre && (
                                            <div className="flex items-center p-2">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="radio" name={q.id} id={`${q.id}-autre-radio`} checked={answers[q.id as keyof ObjectifsAnswers] === 'Autre'} onChange={() => handleValueChange(q.id as keyof ObjectifsAnswers, 'Autre')} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                                    <span className="ml-3 text-sm text-gray-700">{q.autreLabel}</span>
                                                </label>
                                                <input type="text" value={answers[`${q.id}_autre` as keyof ObjectifsAnswers] as string} onChange={e => handleAutreChange(`${q.id}_autre` as keyof ObjectifsAnswers, e.target.value)} className="ml-2 flex-grow p-1 bg-white border border-gray-300 rounded-md text-sm" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {q.type === 'radio-specify' && (
                                    <div className="space-y-2">
                                        {q.options.map(opt => (
                                            <div key={opt.key}>
                                                <label className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                                    <input type="radio" name={q.id} value={opt.key} checked={answers.q12 === opt.key} onChange={() => handleValueChange('q12', opt.key)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                                    <span className="ml-3 text-sm text-gray-700">{opt.label.split(':')[0]}</span>
                                                </label>
                                                {opt.label.includes(':') && answers.q12 === opt.key && (
                                                    <input type="text" value={answers.q12_details[opt.key] || ''} onChange={e => handleDetailsChange(opt.key, e.target.value)} className="ml-9 mt-1 p-2 w-full max-w-md bg-white border border-gray-300 rounded-md" placeholder="Précisez ici..." />
                                                )}
                                            </div>
                                        ))}
                                        {q.hasAutre && (
                                            <div className="p-2">
                                                <label className="flex items-center cursor-pointer">
                                                    <input type="radio" name={q.id} id={`${q.id}-autre-radio`} checked={answers.q12 === 'autre'} onChange={() => handleValueChange('q12', 'autre')} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                                    <span className="ml-3 text-sm text-gray-700">{q.autreLabel}</span>
                                                </label>
                                                <input type="text" value={answers.q12_details['autre'] || ''} onChange={e => handleDetailsChange('autre', e.target.value)} className="ml-9 mt-1 p-2 w-full max-w-md bg-white border border-gray-300 rounded-md" placeholder="Précisez votre objectif..." />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {q.type === 'scale' && (
                                    <div>
                                        <input type="range" min="0" max={q.max} value={answers[q.id as keyof ObjectifsAnswers] as number ?? 0} onChange={e => handleValueChange(q.id as keyof ObjectifsAnswers, parseInt(e.target.value, 10))} className="w-full" />
                                        <div className="flex justify-between text-xs px-1 mt-1">
                                            <span>0</span>
                                            <span className="font-semibold text-blue-800">{answers[q.id as 'q13' | 'q14']}</span>
                                            <span>{q.max}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            ))}

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

export default ObjectifsForm;