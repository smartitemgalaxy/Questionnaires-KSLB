import React, { useState, useCallback } from 'react';
import { ICIQAnswers } from '../types';
import { ICIQ_DATA_FR } from '../constants';

interface ICIQFormProps {
    initialAnswers: ICIQAnswers;
    onNext: (answers: ICIQAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: ICIQAnswers) => void;
    onSave: (answers: ICIQAnswers) => void;
}

const ICIQForm: React.FC<ICIQFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<ICIQAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((field: keyof ICIQAnswers, value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleWhenChange = useCallback((field: keyof ICIQAnswers['when']) => {
        setAnswers(prev => ({
            ...prev,
            when: { ...prev.when, [field]: !prev.when[field] },
        }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">ICIQ-UI Short Form</h2>
                <p className="mt-1 text-sm text-gray-600">Questionnaire International sur l'Incontinence Urinaire</p>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Veuillez répondre aux questions suivantes en pensant à votre situation en moyenne au cours des 4 dernières semaines.</p>
            </header>

            <div className="space-y-6">
                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">2. {ICIQ_DATA_FR.q2.text}</h3>
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => handleAnswerChange('gender', 'female')} className={`px-4 py-2 rounded-md font-semibold ${answers.gender === 'female' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Femme</button>
                        <button type="button" onClick={() => handleAnswerChange('gender', 'male')} className={`px-4 py-2 rounded-md font-semibold ${answers.gender === 'male' ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Homme</button>
                    </div>
                </section>

                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">3. {ICIQ_DATA_FR.q3.text}</h3>
                    <div className="flex flex-col space-y-2">
                        {ICIQ_DATA_FR.q3.options.map(opt => (
                            <label key={opt.value} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input type="radio" name="frequency" checked={answers.frequency === opt.value} onChange={() => handleAnswerChange('frequency', opt.value)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                <span className="ml-3 text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">4. {ICIQ_DATA_FR.q4.text}</h3>
                    <div className="flex flex-col space-y-2">
                        {ICIQ_DATA_FR.q4.options.map(opt => (
                            <label key={opt.value} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input type="radio" name="amount" checked={answers.amount === opt.value} onChange={() => handleAnswerChange('amount', opt.value)} className="h-4 w-4 text-[#FF8F87] border-gray-300 focus:ring-[#FF8F87]" />
                                <span className="ml-3 text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">5. {ICIQ_DATA_FR.q5.text}</h3>
                    <div>
                        <input type="range" min="0" max="10" value={answers.interference ?? 0} onChange={e => handleAnswerChange('interference', parseInt(e.target.value))} className="w-full" />
                        <div className="flex justify-between text-xs px-1 mt-1">
                            <span>Pas du tout</span>
                            <span className="font-semibold text-blue-800">{answers.interference}</span>
                            <span>Énormément</span>
                        </div>
                    </div>
                </section>

                <section className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">6. {ICIQ_DATA_FR.q6.text}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ICIQ_DATA_FR.q6.options.map(opt => (
                            <label key={opt.key} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" checked={answers.when[opt.key as keyof ICIQAnswers['when']]} onChange={() => handleWhenChange(opt.key as keyof ICIQAnswers['when'])} className="h-4 w-4 text-[#FF8F87] border-gray-300 rounded focus:ring-[#FF8F87]" />
                                <span className="ml-3 text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

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

export default ICIQForm;