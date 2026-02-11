
import React, { useState, useCallback } from 'react';
import { HAGOSAnswers, HAGOSSubscale } from '../types';
import { HAGOS_QUESTIONS_FR } from '../constants';

interface HAGOSFormProps {
    initialAnswers: HAGOSAnswers;
    onNext: (answers: HAGOSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: HAGOSAnswers) => void;
    onSave: (answers: HAGOSAnswers) => void;
}

const HAGOSForm: React.FC<HAGOSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<HAGOSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const getOptionsForQuestion = (questionId: string): string[] => {
        if (['S1', 'S2', 'S5'].includes(questionId)) return ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"];
        if (['P1', 'P2'].includes(questionId)) return ["Jamais", "Mensuel", "Hebdomadaire", "Quotidien", "Toujours"];
        if (['PA1', 'PA2'].includes(questionId)) return ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais"];
        if (questionId === 'Q1') return ["Jamais", "Mensuel", "Hebdomadaire", "Quotidien", "Constamment"];
        if (questionId === 'Q2') return ["Pas du tout", "Légèrement", "Modérément", "Sévèrement", "Totalement"];
        if (['Q4', 'Q5'].includes(questionId)) return ["Pas du tout", "Rarement", "Parfois", "Souvent", "Tout le temps"];
        // Default for severity
        return ["Aucun(e)", "Léger/Légère", "Modéré(e)", "Sévère", "Extrême"];
    };

    const renderSubscale = (subscale: HAGOSSubscale) => (
        <section key={subscale.key} className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 pb-2 mb-2 border-b">{subscale.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{subscale.description}</p>
            <div className="space-y-4">
                {subscale.questions.map(q => {
                    const options = getOptionsForQuestion(q.id);
                    return (
                        <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                            <p className="text-gray-700 mb-2"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                            <div className="flex flex-wrap gap-2" role="group">
                                {options.map((option, index) => {
                                    const isSelected = answers[q.id] === index;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, index)}
                                            className={`flex-1 min-w-[100px] text-center px-2 py-3 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            aria-pressed={isSelected}
                                        >
                                            {option}
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
                <h2 className="text-xl font-bold text-gray-900">Copenhagen Hip and Groin Outcome Score (HAGOS)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Ce questionnaire vous interroge sur votre opinion concernant votre problème de hanche et/ou d'aine. Les questions doivent être répondues en tenant compte de la fonction de votre hanche et/ou de votre aine au cours de la semaine écoulée.</p>
            </header>
            
            <div className="space-y-8">
                {HAGOS_QUESTIONS_FR.map(renderSubscale)}
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

export default HAGOSForm;
