import React, { useState, useCallback } from 'react';
import { PSFSAnswers } from '../types';
import { PSFS_DATA_FR } from '../constants';

interface PSFSFormProps {
    initialAnswers: PSFSAnswers;
    onNext: (answers: PSFSAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: PSFSAnswers) => void;
    onSave: (answers: PSFSAnswers) => void;
    title: string;
}

const PSFSForm: React.FC<PSFSFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave, title }) => {
    const [answers, setAnswers] = useState<PSFSAnswers>(initialAnswers);

    const handleDescriptionChange = useCallback((index: number, value: string) => {
        const newActivities = [...answers.activities];
        newActivities[index].description = value;
        setAnswers({ activities: newActivities });
    }, [answers.activities]);
    
    const handleScoreChange = useCallback((index: number, value: number) => {
        const newActivities = [...answers.activities];
        newActivities[index].score = value;
        setAnswers({ activities: newActivities });
    }, [answers.activities]);

    const ratingLabels = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

    return (
        <div className="space-y-8">
            <header className="mb-8">
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{PSFS_DATA_FR.title}</h2>
                        <p className="text-lg text-gray-700">(Echelle Fonctionnelle)</p>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-blue-800 mt-4">{title}</h1>
                <p className="mt-6 text-gray-600 max-w-3xl">{PSFS_DATA_FR.description}</p>
                
                <div className="my-6 flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Échelle de 0 à 10">
                    {ratingLabels.map((value) => (
                        <div key={value} className="w-10 h-10 border border-gray-400 flex items-center justify-center text-sm font-semibold">
                            {value}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-sm text-gray-700 font-semibold px-1">
                    <span>0 signant l'incapacité à réaliser l'activité</span>
                    <span>10 la réalisation sans restriction.</span>
                </div>
                <p className="mt-6 p-3 bg-cyan-50 border-l-4 border-cyan-500 text-cyan-800 rounded-r-lg">
                    Aujourd'hui, il y a-t-il des activités ou des situations de votre vie quotidienne dont vous êtes incapable de réaliser ou pour lesquelles vous rencontrez des difficultés en raison de votre problème ? (Exemples : attraper un objet haut, mettre ses chaussettes, porter les sacs de courses, monter ou descendre les escaliers, prendre une casserole remplie d'eau, rester assis ou debout...)
                </p>
            </header>

            <section className="space-y-8">
                {answers.activities.map((activity, index) => (
                    <div key={index}>
                        <label htmlFor={`activity-desc-${index}`} className="block text-base font-semibold text-gray-800 mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 text-gray-600 mr-2">{index + 1}</span>
                            Activité ou Situation :
                        </label>
                        <input
                            id={`activity-desc-${index}`}
                            type="text"
                            value={activity.description}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            className="w-full p-0 border-0 border-b-2 border-dotted border-gray-400 bg-transparent focus:ring-0 focus:border-gray-600"
                        />
                         <div className="mt-4 flex flex-wrap items-center justify-center gap-1" role="group">
                            {ratingLabels.map(value => {
                                const isSelected = activity.score === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleScoreChange(index, value)}
                                        className={`w-10 h-10 border border-gray-400 flex items-center justify-center text-sm font-semibold transition-colors duration-150 ${isSelected ? 'bg-blue-800 text-white' : 'bg-white hover:bg-gray-100'}`}
                                        aria-pressed={isSelected}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
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

export default PSFSForm;
