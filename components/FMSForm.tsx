import React, { useState, useCallback } from 'react';
import { FESAnswers as FMSAnswers } from '../types';
import { FES_QUESTIONS_FR as FMS_QUESTIONS_FR } from '../constants';

interface FMSFormProps {
    initialAnswers: FMSAnswers;
    onNext: (answers: FMSAnswers) => void;
    onSkipToSummary: (answers: FMSAnswers) => void;
    onSave: (answers: FMSAnswers) => void;
}

const scoringOptions = [
    { score: 3, criteria: ["Mouvement parfait."] },
    { score: 2, criteria: ["Mouvement réalisé avec une légère compensation."] },
    { score: 1, criteria: ["Incapable de réaliser le mouvement correctement."] },
    { score: 0, criteria: ["Douleur pendant le mouvement."] },
];

const FMSForm: React.FC<FMSFormProps> = ({ initialAnswers, onNext, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FMSAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Functional Movement Screen (FMS) - Auto-évaluation</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez lire la description de chaque mouvement et des critères de notation, puis sélectionnez le score qui correspond le mieux à votre capacité à effectuer le test. Soyez honnête dans votre auto-évaluation. Si vous ressentez une douleur pendant un mouvement, sélectionnez le score 0.</p>
                <p className="mt-2 text-sm text-red-600 font-semibold">NOTE : Ceci est une auto-évaluation et ne remplace pas une évaluation FMS réalisée par un professionnel certifié.</p>
            </header>

            <div className="space-y-8">
                {FMS_QUESTIONS_FR.map(q => (
                    <section key={q.id} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">{q.text}</h3>
                        <p className="text-sm text-gray-600 mb-4 italic">Description du mouvement non disponible.</p>
                        <div className="space-y-3">
                            {scoringOptions.map(s => (
                                <div key={s.score} className="flex items-start p-2 rounded-md transition-colors hover:bg-gray-100">
                                    <input
                                        type="radio"
                                        id={`fms-${q.id}-${s.score}`}
                                        name={`fms-${q.id}`}
                                        checked={answers[q.id] === s.score}
                                        onChange={() => handleAnswerChange(q.id, s.score)}
                                        className="h-4 w-4 mt-1 text-blue-800 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`fms-${q.id}-${s.score}`} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                                        <span className="font-bold">Score {s.score}:</span>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            {s.criteria.map((crit, index) => <li key={index}>{crit}</li>)}
                                        </ul>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <footer className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <button type="button" onClick={() => onSave(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100">Enregistrer</button>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-end gap-4">
                    <button type="button" onClick={() => onSkipToSummary(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300">Passer</button>
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900">Suivant</button>
                </div>
            </footer>
        </div>
    );
};

export default FMSForm;
