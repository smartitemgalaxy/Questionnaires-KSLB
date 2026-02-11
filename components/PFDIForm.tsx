import React, { useState, useCallback } from 'react';
import { PFDIAnswers } from '../types';
import { PFDI_QUESTIONS_FR } from '../constants';

interface PFDIFormProps {
    initialAnswers: PFDIAnswers;
    onNext: (answers: PFDIAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: PFDIAnswers) => void;
    onSave: (answers: PFDIAnswers) => void;
}

const botherOptions = ["Pas du tout", "Un peu", "Modérément", "Beaucoup"];

const PFDIForm: React.FC<PFDIFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<PFDIAnswers>(initialAnswers);

    const handleSymptomChange = useCallback((questionId: number, value: 'yes' | 'no') => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                hasSymptom: value,
                bother: value === 'no' ? null : prev[questionId]?.bother,
            },
        }));
    }, []);

    const handleBotherChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                bother: value,
            },
        }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pelvic Floor Distress Inventory Questionnaire - Short Form 20 (PFDI-20)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à toutes les questions de l'enquête suivante en tenant compte de vos symptômes au cours des 3 derniers mois.</p>
            </header>

            <div className="space-y-6">
                {PFDI_QUESTIONS_FR.map(q => (
                    <section key={q.id} className="p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold text-gray-800 mb-3">{q.id}. {q.text}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium">Avez-vous ce symptôme?</span>
                                <button type="button" onClick={() => handleSymptomChange(q.id, 'yes')} className={`px-4 py-2 rounded-md text-sm font-semibold ${answers[q.id]?.hasSymptom === 'yes' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Oui</button>
                                <button type="button" onClick={() => handleSymptomChange(q.id, 'no')} className={`px-4 py-2 rounded-md text-sm font-semibold ${answers[q.id]?.hasSymptom === 'no' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Non</button>
                            </div>
                            {answers[q.id]?.hasSymptom === 'yes' && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Si oui, à quel point cela vous dérange-t-il ?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {botherOptions.map((option, index) => {
                                            const isSelected = answers[q.id]?.bother === index;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleBotherChange(q.id, index)}
                                                    className={`flex-1 min-w-[80px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
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
                    <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors">Enregistrer</button>
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors">Passer</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default PFDIForm;