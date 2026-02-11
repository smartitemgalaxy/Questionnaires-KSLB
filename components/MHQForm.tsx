
import React, { useState, useCallback } from 'react';
import { MHQAnswers, MHQQuestion } from '../types';
import { MHQ_QUESTIONS_FR } from '../constants';

interface MHQFormProps {
    initialAnswers: MHQAnswers;
    onNext: (answers: MHQAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: MHQAnswers) => void;
    onSave: (answers: MHQAnswers) => void;
}

const MHQForm: React.FC<MHQFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<MHQAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);
    
    // Group questions by their main section title
    const sections = {
        'Fonction de la main droite': MHQ_QUESTIONS_FR.filter(q => q.section === 'I_A'),
        'Fonction de la main gauche': MHQ_QUESTIONS_FR.filter(q => q.section === 'I_B'),
        'Activités avec la main droite': MHQ_QUESTIONS_FR.filter(q => q.section === 'II_A'),
        'Activités avec la main gauche': MHQ_QUESTIONS_FR.filter(q => q.section === 'II_B'),
        'Activités avec les deux mains': MHQ_QUESTIONS_FR.filter(q => q.section === 'II_C'),
        'Travail': MHQ_QUESTIONS_FR.filter(q => q.section === 'III'),
        'Douleur à la main droite': MHQ_QUESTIONS_FR.filter(q => q.section === 'IV_A'),
        'Douleur à la main gauche': MHQ_QUESTIONS_FR.filter(q => q.section === 'IV_B'),
        'Apparence de la main droite': MHQ_QUESTIONS_FR.filter(q => q.section === 'V_A'),
        'Apparence de la main gauche': MHQ_QUESTIONS_FR.filter(q => q.section === 'V_B'),
        'Satisfaction concernant la main droite': MHQ_QUESTIONS_FR.filter(q => q.section === 'VI_A'),
        'Satisfaction concernant la main gauche': MHQ_QUESTIONS_FR.filter(q => q.section === 'VI_B'),
    };

    const skipPainRight = answers['IV_A_1'] === 5;
    const skipPainLeft = answers['IV_B_1'] === 5;

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Michigan Hand Outcomes Questionnaire (MHQ)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Ce questionnaire concerne vos mains et votre santé. Veuillez répondre à CHAQUE question en encerclant la meilleure réponse.</p>
            </header>

            <div className="space-y-8">
                {Object.entries(sections).map(([title, questions]) => {
                    if (title === 'Douleur à la main droite' && skipPainRight && questions[0].id !== 'IV_A_1') return null;
                    if (title === 'Douleur à la main gauche' && skipPainLeft && questions[0].id !== 'IV_B_1') return null;
                    
                    // Specific skip logic for pain questions
                    const filteredQuestions = questions.filter(q => {
                        if (q.section === 'IV_A' && skipPainRight) return q.id === 'IV_A_1';
                        if (q.section === 'IV_B' && skipPainLeft) return q.id === 'IV_B_1';
                        return true;
                    });
                    
                    return (
                        <section key={title} className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">{title}</h3>
                            <div className="space-y-4">
                                {filteredQuestions.map(q => (
                                    <div key={q.id}>
                                        <p className="text-gray-700 mb-2">{q.text}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {q.options?.map((option, index) => {
                                                const value = index + 1;
                                                const isSelected = answers[q.id] === value;
                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleAnswerChange(q.id, value)}
                                                        className={`flex-1 min-w-[120px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                {title === 'Douleur à la main droite' && answers['IV_A_1'] === 5 && <p className="text-sm text-gray-500 mt-2">Vous avez indiqué "Jamais" de douleur, vous pouvez passer à la section suivante.</p>}
                                {title === 'Douleur à la main gauche' && answers['IV_B_1'] === 5 && <p className="text-sm text-gray-500 mt-2">Vous avez indiqué "Jamais" de douleur, vous pouvez passer à la section suivante.</p>}
                            </div>
                        </section>
                    );
                })}
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

export default MHQForm;
