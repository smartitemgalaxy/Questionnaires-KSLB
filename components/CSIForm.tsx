
import React, { useState, useCallback } from 'react';
import { CSI_PartA_Answers, CSI_PartB_Answers, CSI_PartB_Answer } from '../types';
import { 
    CSI_PART_A_QUESTIONS_FR, 
    CSI_PART_A_RATING_LABELS,
    CSI_PART_A_RATING_DESCRIPTIONS,
    CSI_PART_B_QUESTIONS_FR
} from '../constants';

interface CSIFormProps {
    initialPartAAnswers: CSI_PartA_Answers;
    initialPartBAnswers: CSI_PartB_Answers;
    onNext: (partA: CSI_PartA_Answers, partB: CSI_PartB_Answers) => void;
    onPrevious: () => void;
    onSave: (partA: CSI_PartA_Answers, partB: CSI_PartB_Answers) => void;
    onSkipToSummary: (partA: CSI_PartA_Answers, partB: CSI_PartB_Answers) => void;
}

const CSIForm: React.FC<CSIFormProps> = ({ initialPartAAnswers, initialPartBAnswers, onNext, onPrevious, onSave, onSkipToSummary }) => {
    const [partAAnswers, setPartAAnswers] = useState(initialPartAAnswers);
    const [partBAnswers, setPartBAnswers] = useState(initialPartBAnswers);

    const handlePartAChange = useCallback((questionId: number, value: number) => {
        setPartAAnswers(prev => ({...prev, [questionId]: value}));
    }, []);

    const handlePartBChange = useCallback((questionId: number, answer: CSI_PartB_Answer) => {
        setPartBAnswers(prev => ({...prev, [questionId]: answer}));
    }, []);

    return (
        <div className="space-y-12">
            <header className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Inventaire de Sensibilisation Centrale (CSI)</h2>
            </header>

            {/* Partie A */}
            <section>
                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-800 pb-2 mb-4">PARTIE A</h3>
                <p className="text-gray-600 mb-6">Veuillez indiquer pour chaque situation la proposition la plus adaptée.</p>
                <div className="space-y-1">
                    <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-4 pr-2 mb-2">
                        <div></div>
                        <div className="grid grid-cols-5 w-[20rem] sm:w-[25rem]">
                            {CSI_PART_A_RATING_DESCRIPTIONS.map((desc) => (
                                <div key={desc} className="text-center">
                                    <p className="text-xs text-gray-500 font-medium">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {CSI_PART_A_QUESTIONS_FR.map((q) => (
                             <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                                <p className="text-gray-700"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                                <div className="flex items-center justify-start md:justify-center" role="group" aria-label={`Évaluation pour la question ${q.id}`}>
                                    <div className="grid grid-cols-5 gap-x-1 sm:gap-x-2 w-[20rem] sm:w-[25rem]">
                                        {CSI_PART_A_RATING_LABELS.map((value, index) => {
                                            const isSelected = partAAnswers[q.id] === value;
                                            return (
                                                <div key={value} className="text-center flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePartAChange(q.id, value)}
                                                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F87] ${isSelected ? 'bg-[#FF8F87] text-white shadow-md scale-110' : 'bg-gray-200 text-gray-700 hover:bg-rose-100'}`}
                                                        aria-pressed={isSelected}
                                                        aria-label={`${CSI_PART_A_RATING_DESCRIPTIONS[index]}`}
                                                    >
                                                        
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partie B */}
            <section>
                 <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-800 pb-2 mb-4">PARTIE B</h3>
                 <p className="text-gray-600 mb-6">Un médecin vous a-t-il diagnostiqué l'un des troubles suivants? Pour chaque diagnostic, veuillez cocher Oui ou Non et indiquer l'année du diagnostic.</p>
                 <div className="space-y-4">
                     {CSI_PART_B_QUESTIONS_FR.map(q => {
                        const answer = partBAnswers[q.id];
                        return (
                            <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                                <p className="text-gray-700"><span className="font-semibold">{q.id}.</span> {q.text}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center space-x-4">
                                        <button type="button" onClick={() => handlePartBChange(q.id, {...answer, diagnosed: true})} className={`px-4 py-2 rounded-md text-sm font-semibold ${answer.diagnosed === true ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Oui</button>
                                        <button type="button" onClick={() => handlePartBChange(q.id, {...answer, diagnosed: false, year: ''})} className={`px-4 py-2 rounded-md text-sm font-semibold ${answer.diagnosed === false ? 'bg-[#FF8F87] text-white' : 'bg-gray-200'}`}>Non</button>
                                    </div>
                                    {answer.diagnosed && (
                                        <input
                                            type="text"
                                            value={answer.year}
                                            onChange={(e) => handlePartBChange(q.id, {...answer, year: e.target.value})}
                                            className="flex-grow p-2 bg-gray-50 border border-gray-300 rounded-md"
                                            placeholder="Année du diagnostic"
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                 </div>
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
                    <button
                        type="button"
                        onClick={() => onSave(partAAnswers, partBAnswers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-blue-800 border border-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
                    >
                        Enregistrer les réponses
                    </button>
                    <button
                        type="button"
                        onClick={() => onSkipToSummary(partAAnswers, partBAnswers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                    >
                        Passer et voir le résumé
                    </button>
                    <button
                        type="button"
                        onClick={() => onNext(partAAnswers, partBAnswers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-800 rounded-lg shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default CSIForm;
