import React, { useState, useCallback } from 'react';
import { FFIRAnswers, FFIRQuestion } from '../types';
import { 
    FFIR_PAIN_QUESTIONS_FR, 
    FFIR_STIFFNESS_QUESTIONS_FR, 
    FFIR_DIFFICULTY_QUESTIONS_FR, 
    FFIR_ACTIVITY_QUESTIONS_FR,
    FFIR_SOCIAL_QUESTIONS_FR
} from '../constants';

interface FFIRFormProps {
    initialAnswers: FFIRAnswers;
    onNext: (answers: FFIRAnswers) => void;
    onPrevious: () => void;
    onSkipToSummary: (answers: FFIRAnswers) => void;
    onSave: (answers: FFIRAnswers) => void;
}

const sections = [
    { title: "Douleur", description: "Veuillez indiquer à quel point votre douleur au pied était intense dans chacune des situations suivantes au cours de la semaine dernière.", questions: FFIR_PAIN_QUESTIONS_FR, options: ["Aucune douleur", "Légère", "Modérée", "Sévère"] },
    { title: "Raideur", description: "Veuillez indiquer à quel point votre raideur au pied était sévère dans chacune des situations suivantes au cours de la semaine dernière.", questions: FFIR_STIFFNESS_QUESTIONS_FR, options: ["Aucune raideur", "Légère", "Modérée", "Sévère"] },
    { title: "Difficulté", description: "Veuillez indiquer le degré de difficulté que vous avez eu à effectuer chaque activité à cause de vos problèmes de pieds au cours de la semaine dernière.", questions: FFIR_DIFFICULTY_QUESTIONS_FR, options: ["Aucune difficulté", "Légère", "Modérée", "Sévère"] },
    { title: "Limitation d'activité", description: "Au cours de la semaine dernière, combien de temps avez-vous :", questions: FFIR_ACTIVITY_QUESTIONS_FR, options: ["Jamais", "Parfois", "La plupart du temps", "Tout le temps"] },
    { title: "Problèmes sociaux", description: "Au cours de la semaine dernière, combien de temps avez-vous ressenti :", questions: FFIR_SOCIAL_QUESTIONS_FR, options: ["Jamais", "Parfois", "La plupart du temps", "Tout le temps"] },
];

const FFIRForm: React.FC<FFIRFormProps> = ({ initialAnswers, onNext, onPrevious, onSkipToSummary, onSave }) => {
    const [answers, setAnswers] = useState<FFIRAnswers>(initialAnswers);

    const handleAnswerChange = useCallback((questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    }, []);

    const QuestionRow: React.FC<{ question: FFIRQuestion, options: string[] }> = ({ question, options }) => (
        <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
            <p className="text-gray-700 mb-2">{question.text}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleAnswerChange(question.id, index + 1)}
                        className={`flex-1 min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${answers[question.id] === index + 1 ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        aria-pressed={answers[question.id] === index + 1}
                    >
                        {opt}
                    </button>
                ))}
                { ![5,6,13,27,28].includes(question.id) && <button type="button" onClick={() => handleAnswerChange(question.id, 5)} className={`min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${answers[question.id] === 5 ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`} >N/A</button> }
                { [5,6,13].includes(question.id) && <button type="button" onClick={() => handleAnswerChange(question.id, 5)} className={`min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${answers[question.id] === 5 ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`} >N'utilise pas d'inserts</button> }
                { [27].includes(question.id) && <button type="button" onClick={() => handleAnswerChange(question.id, 5)} className={`min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${answers[question.id] === 5 ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`} >Pas d'activités extérieures</button> }
                { [28].includes(question.id) && <button type="button" onClick={() => handleAnswerChange(question.id, 5)} className={`min-w-[100px] text-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${answers[question.id] === 5 ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`} >Ne fait pas de sport</button> }
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Revised Foot Function Index (FFI-R) Short Form</h2>
            </header>

            {sections.map(section => (
                <section key={section.title}>
                    <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4 border-b">{section.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                    <div className="space-y-4">
                        {section.questions.map(q => <QuestionRow key={q.id} question={q} options={section.options} />)}
                    </div>
                </section>
            ))}

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

export default FFIRForm;
