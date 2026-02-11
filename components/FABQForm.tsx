
import React, { useState, useCallback } from 'react';
import { FABQAnswers, RatingQuestion } from '../types';
import { 
    PHYSICAL_ACTIVITY_QUESTIONS_FR, 
    WORK_QUESTIONS_FR, 
    RATING_LABELS
} from '../constants';

interface FABQFormProps {
    initialAnswers: FABQAnswers;
    onNext: (answers: FABQAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: FABQAnswers) => void;
    onSave: (answers: FABQAnswers) => void;
}

const QuestionnaireSection: React.FC<{
  title: string;
  description: string;
  questions: RatingQuestion[];
  answers: FABQAnswers;
  onAnswerChange: (questionId: number, value: number) => void;
}> = ({ title, description, questions, answers, onAnswerChange }) => (
    <section className="p-4 sm:p-6 rounded-lg bg-white shadow-sm">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0D57A6]">{title}</h2>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
        <div className="space-y-4">
            <div className="hidden md:grid grid-cols-[1fr_auto] items-end gap-4" style={{ height: '7rem', paddingRight: '0.5rem' }}>
                <div />
                <div className="grid grid-cols-7 w-[20rem] sm:w-[25rem] gap-x-1 sm:gap-x-2 h-full">
                    {/* Col 0 */}
                    <div className="relative">
                        <p className="absolute bottom-4 left-1/2 transform -rotate-45 origin-bottom-left text-xs text-gray-500 font-medium whitespace-nowrap">
                            Pas du tout d'accord
                        </p>
                    </div>
                    {/* Col 1 */}
                    <div />
                    {/* Col 2 */}
                    <div />
                    {/* Col 3 */}
                    <div className="relative">
                        <p className="absolute bottom-4 left-1/2 transform -rotate-45 origin-bottom-left text-xs text-gray-500 font-medium whitespace-nowrap">
                            Incertain
                        </p>
                    </div>
                    {/* Col 4 */}
                    <div />
                    {/* Col 5 */}
                    <div />
                    {/* Col 6 */}
                    <div className="relative">
                        <p className="absolute bottom-4 left-1/2 transform -rotate-45 origin-bottom-left text-xs text-gray-500 font-medium whitespace-nowrap">
                            Tout à fait d'accord
                        </p>
                    </div>
                </div>
            </div>
            {questions.map((q) => (
                <div key={q.id} className="p-3 rounded-lg transition-colors duration-200 bg-white border border-slate-200 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
                    <p className="text-gray-700">
                        <span className="font-semibold">{q.id}.</span> {q.text}
                    </p>
                    <div className="flex items-center justify-start md:justify-center" role="group" aria-label={`Évaluation pour la question ${q.id}`}>
                        <div className="grid grid-cols-7 gap-x-1 sm:gap-x-2 w-[20rem] sm:w-[25rem]">
                            {RATING_LABELS.map((value) => {
                            const isSelected = answers[q.id] === value;
                            return (
                                <div key={value} className="flex justify-center">
                                <button
                                key={value}
                                type="button"
                                onClick={() => onAnswerChange(q.id, value)}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-offset-2 focus:ring-slate-400 bg-slate-200 text-slate-800 border border-slate-300/50 ${isSelected ? 'ring-2 ring-slate-500' : 'hover:bg-slate-300'}`}
                                aria-pressed={isSelected}
                                aria-label={`Sélectionner l'évaluation ${value}`}
                                >
                                {value}
                                </button>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const FABQForm: React.FC<FABQFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FABQAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: value,
        }));
    }, []);

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-[#0D57A6]">Questionnaire sur les Croyances d'Évitement de la Peur (FABQ)</h2>
                <p className="mt-2 text-sm text-gray-600">Waddell et al (1993) Pain, 52 (1993) 157 - 168</p>
            </header>
            
            <QuestionnaireSection
                title="Activité Physique"
                description="Voici certaines des choses que d'autres patients nous ont dites à propos de leur douleur. Pour chaque affirmation, veuillez sélectionner un nombre de 0 à 6 pour indiquer dans quelle mesure les activités physiques telles que se pencher, soulever, marcher ou conduire affectent ou affecteraient votre mal de dos. (0 = Pas du tout d'accord, 3 = Incertain, 6 = Tout à fait d'accord)."
                questions={PHYSICAL_ACTIVITY_QUESTIONS_FR}
                answers={answers}
                onAnswerChange={handleAnswerChange}
            />

            <QuestionnaireSection
                title="Travail"
                description="Les affirmations suivantes concernent la manière dont votre travail normal affecte ou affecterait votre mal de dos. (0 = Pas du tout d'accord, 3 = Incertain, 6 = Tout à fait d'accord)."
                questions={WORK_QUESTIONS_FR}
                answers={answers}
                onAnswerChange={handleAnswerChange}
            />

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
                        onClick={() => onSave(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-[#1565C0] border border-[#1565C0] rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                    >
                        Enregistrer les réponses
                    </button>
                    <button
                        type="button"
                        onClick={() => onSkipToSummary(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                    >
                        Passer et voir le résumé
                    </button>
                    <button
                        type="button"
                        onClick={() => onNext(answers)}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-[#1565C0] rounded-lg shadow-sm hover:bg-[#0D57A6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1565C0] transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default FABQForm;
