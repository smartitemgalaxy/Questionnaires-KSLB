import React, { useState, useCallback } from 'react';
import { WPAIAnswers } from '../types';
import { WPAI_QUESTIONS_FR } from '../constants';

interface WPAIFormProps {
    initialAnswers: WPAIAnswers;
    onNext: (answers: WPAIAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: WPAIAnswers) => void;
    onSave: (answers: WPAIAnswers) => void;
}

const WPAIForm: React.FC<WPAIFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<WPAIAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((field: keyof WPAIAnswers, value: any) => {
        setAnswers(prev => {
            const newAnswers = { ...prev, [field]: value };
            // Logic: if unemployed, clear work-related questions
            if (field === 'employed' && value === 'no') {
                newAnswers.missedWorkHoursHealth = null;
                newAnswers.missedWorkHoursOther = null;
                newAnswers.workedHours = null;
                newAnswers.workAffected = null;
            }
             // Logic: if worked 0 hours, skip work productivity question
            if (field === 'workedHours' && (value === 0 || value === null || value === '')) {
                newAnswers.workAffected = null;
            }
            return newAnswers;
        });
    }, []);

    const showWorkQuestions = answers.employed === 'yes';
    const showWorkProductivityQuestion = showWorkQuestions && (answers.workedHours ?? 0) > 0;
    
    const ScaleInput: React.FC<{ question: string; value: number | null; onChange: (value: number) => void; minLabel: string; maxLabel: string; }> = ({ question, value, onChange, minLabel, maxLabel }) => (
        <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-gray-700 mb-2 font-semibold">{question}</p>
            <div className="flex flex-wrap items-center justify-center gap-1" role="group">
                {Array.from({ length: 11 }, (_, i) => i).map(v => (
                    <button key={v} type="button" onClick={() => onChange(v)} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F87] ${value === v ? 'bg-[#FF8F87] text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-rose-100'}`} aria-pressed={value === v}>{v}</button>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                <span>{minLabel}</span><span>{maxLabel}</span>
            </div>
        </div>
    );
    
    const HourSelect: React.FC<{ question: string; value: number | null; onChange: (value: number | null) => void; }> = ({ question, value, onChange }) => {
        const options = Array.from({ length: 101 }, (_, i) => i); // 0 to 100
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <label htmlFor={question} className="block text-gray-700 font-semibold mb-2">{question}</label>
                <select
                    id={question}
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md"
                >
                    <option value="">Sélectionnez un nombre d'heures</option>
                    {options.map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Work Productivity and Activity Impairment (WPAI)</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Les questions suivantes portent sur l'effet de vos problèmes de santé sur votre capacité à travailler et à effectuer des activités régulières.</p>
            </header>

            <div className="space-y-6">
                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 pb-2 mb-4">{WPAI_QUESTIONS_FR.q1}</h3>
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => handleAnswerChange('employed', 'yes')} className={`px-4 py-2 rounded-md font-semibold ${answers.employed === 'yes' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Oui</button>
                        <button type="button" onClick={() => handleAnswerChange('employed', 'no')} className={`px-4 py-2 rounded-md font-semibold ${answers.employed === 'no' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Non</button>
                    </div>
                </section>

                {showWorkQuestions && (
                    <>
                        <HourSelect question={WPAI_QUESTIONS_FR.q2} value={answers.missedWorkHoursHealth} onChange={v => handleAnswerChange('missedWorkHoursHealth', v)} />
                        <HourSelect question={WPAI_QUESTIONS_FR.q3} value={answers.missedWorkHoursOther} onChange={v => handleAnswerChange('missedWorkHoursOther', v)} />
                        <HourSelect question={WPAI_QUESTIONS_FR.q4} value={answers.workedHours} onChange={v => handleAnswerChange('workedHours', v)} />
                    </>
                )}
                
                <div className={showWorkProductivityQuestion ? '' : 'hidden'}>
                    <ScaleInput question={WPAI_QUESTIONS_FR.q5} value={answers.workAffected} onChange={v => handleAnswerChange('workAffected', v)} minLabel="Aucun effet sur le travail" maxLabel="Le travail est complètement empêché" />
                </div>

                <ScaleInput question={WPAI_QUESTIONS_FR.q6} value={answers.activityAffected} onChange={v => handleAnswerChange('activityAffected', v)} minLabel="Aucun effet sur les activités" maxLabel="Les activités sont complètement empêchées" />
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
                    <button type="button" onClick={() => onNext(answers)} className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900">Terminer et voir le résumé</button>
                </div>
            </footer>
        </div>
    );
};

export default WPAIForm;
