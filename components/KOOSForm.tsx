
import React, { useState, useCallback } from 'react';
import { KOOSAnswers, KOOSSubscale } from '../types';
import { KOOS_QUESTIONS_FR, KOOS_RATING_LABELS, KOOS_RATING_DESCRIPTIONS, KOOS_RATING_DESCRIPTIONS_FREQ, KOOS_RATING_DESCRIPTIONS_ABILITY, KOOS_RATING_DESCRIPTIONS_QOL_FREQ, KOOS_RATING_DESCRIPTIONS_QOL_MODIF, KOOS_RATING_DESCRIPTIONS_QOL_GENE } from '../constants';

interface KOOSFormProps {
    initialAnswers: KOOSAnswers;
    onNext: (answers: KOOSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: KOOSAnswers) => void;
    onSave: (answers: KOOSAnswers) => void;
}

const getRatingDescriptions = (questionId: string) => {
    if (['S1', 'S2', 'S3', 'P1'].includes(questionId)) return KOOS_RATING_DESCRIPTIONS_FREQ;
    if (['S4', 'S5'].includes(questionId)) return KOOS_RATING_DESCRIPTIONS_ABILITY;
    if (questionId === 'Q1') return KOOS_RATING_DESCRIPTIONS_QOL_FREQ;
    if (['Q2', 'Q3'].includes(questionId)) return KOOS_RATING_DESCRIPTIONS_QOL_MODIF;
    if (questionId === 'Q4') return KOOS_RATING_DESCRIPTIONS_QOL_GENE;
    return KOOS_RATING_DESCRIPTIONS;
};

const KOOSForm: React.FC<KOOSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<KOOSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);
    
    const renderSubscale = (subscale: KOOSSubscale) => (
        <section key={subscale.key}>
            <h3 className="text-lg font-bold text-gray-800 pb-2 mb-2 border-b">{subscale.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{subscale.description}</p>
            <div className="space-y-4">
                {subscale.questions.map(q => {
                    const descriptions = getRatingDescriptions(q.id);
                    return (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <p className="text-gray-700 mb-2"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2" role="group">
                                {KOOS_RATING_LABELS.map((value, index) => {
                                    const isSelected = answers[q.id] === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, value)}
                                            className={`w-full h-full text-center px-2 py-3 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {descriptions[index]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Knee injury and Osteoarthritis Outcome Score (KOOS)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre à chaque question en cochant une seule case qui vous semble la plus adaptée.</p>
            </header>
            
            <div className="space-y-8">
                {KOOS_QUESTIONS_FR.map(renderSubscale)}
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

export default KOOSForm;
