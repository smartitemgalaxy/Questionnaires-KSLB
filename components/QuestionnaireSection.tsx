
import React from 'react';
import { RatingQuestion as QuestionType, FABQAnswers as Answers } from '../types';
import Question from './Question';
import { RATING_LABELS } from '../constants';

interface QuestionnaireSectionProps {
  title: string;
  description: string;
  questions: QuestionType[];
  answers: Answers;
  onAnswerChange: (questionId: number, value: number) => void;
}

const QuestionnaireSection: React.FC<QuestionnaireSectionProps> = ({ title, description, questions, answers, onAnswerChange }) => {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
      <div className="space-y-1">
        <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-4 pr-2">
            <div></div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium">
                {RATING_LABELS.map(label => <span key={`header-${label}`}>{label}</span>)}
            </div>
        </div>
        <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-4 pr-2 -mt-1 mb-2">
            <div className="text-right text-xs text-gray-500">Completely disagree</div>
            <div className="w-64 grid grid-cols-7">
                <div className="col-span-3"></div>
                <div className="text-center text-xs text-gray-500">Unsure</div>
                <div className="col-span-3"></div>
            </div>
            <div className="text-left text-xs text-gray-500">Completely agree</div>
        </div>


        <div className="space-y-4">
          {questions.map((q) => (
            <Question
              key={q.id}
              question={q}
              selectedValue={answers[q.id]}
              onAnswerChange={onAnswerChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuestionnaireSection;