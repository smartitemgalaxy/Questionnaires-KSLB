import React, { useState, useCallback } from 'react';
import { SGRQAnswers } from '../types';
import { SGRQ_QUESTIONS_FR } from '../constants';

interface SGRQFormProps {
    initialAnswers: SGRQAnswers;
    onNext: (answers: SGRQAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: SGRQAnswers) => void;
    onSave: (answers: SGRQAnswers) => void;
}

const SGRQForm: React.FC<SGRQFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<SGRQAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((key: string, value: number | boolean | null) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleCheckboxChange = (key: string) => {
        setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const renderRadioGroup = (q: any, keyPrefix: string) => (
        <div key={q.id} className="p-4 border-b">
            <p className="font-medium mb-2">{q.text}</p>
            <div className="flex flex-wrap gap-2">
                {q.options.map((opt: any) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleAnswerChange(`${keyPrefix}${q.id}`, opt.value)}
                        className={`px-3 py-2 text-sm rounded-md ${answers[`${keyPrefix}${q.id}`] === opt.value ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderCheckboxGroup = (title: string, questions: any[], keyPrefix: string) => (
        <div className="space-y-2">
             <h4 className="text-base font-semibold text-gray-800 mt-4">{title}</h4>
            {questions.map((q: any) => (
                <label key={q.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={!!answers[`${keyPrefix}${q.id}`]}
                        onChange={() => handleCheckboxChange(`${keyPrefix}${q.id}`)}
                        className="h-4 w-4 text-[#FF8F87] border-gray-300 rounded focus:ring-[#FF8F87]"
                    />
                    <span className="ml-3 text-sm text-gray-700">{q.text}</span>
                </label>
            ))}
        </div>
    );


    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Questionnaire Respiratoire du St. George's Hospital</h2>
            </header>

            <section className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">1ère PARTIE - 12 Derniers Mois</h3>
                {SGRQ_QUESTIONS_FR.part1.map(q => renderRadioGroup(q, 'p1_'))}
            </section>
            
            <section className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">2ème PARTIE</h3>
                {SGRQ_QUESTIONS_FR.part2.sections.map(sec => (
                     <div key={sec.title} className="py-4 border-b last:border-0">
                        <h4 className="text-md font-bold text-gray-800 mb-3">{sec.title}</h4>
                        {sec.questions.map((q:any) => {
                            if (q.type === 'radio') return renderRadioGroup(q, `p2_s${sec.id}_`);
                            if (q.type === 'checkbox-group') return renderCheckboxGroup(q.text, q.options, `p2_s${sec.id}_q${q.id}_`);
                            return null;
                        })}
                    </div>
                ))}
            </section>
            
            <section className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">Gêne Globale</h3>
                {renderRadioGroup(SGRQ_QUESTIONS_FR.final, 'final_')}
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

export default SGRQForm;