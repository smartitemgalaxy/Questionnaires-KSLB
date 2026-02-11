import React from 'react';
import { RatingQuestion as QuestionType } from '../types';
import { RATING_LABELS, SCORE_SCALE_WORK_ITEMS, SCORE_SCALE_PHYSICAL_ACTIVITY_ITEMS } from '../constants';

interface QuestionProps {
  question: QuestionType;
  selectedValue: number | null;
  onAnswerChange: (questionId: number, value: number) => void;
}

const scoredItems = new Set([...SCORE_SCALE_WORK_ITEMS, ...SCORE_SCALE_PHYSICAL_ACTIVITY_ITEMS]);

const Question: React.FC<QuestionProps> = ({ question, selectedValue, onAnswerChange }) => {
  const isScored = scoredItems.has(question.id);

  return (
    <div className="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4">
      <p className="text-gray-700">
        <span className="font-semibold">{question.id}.</span> {question.text}
        {isScored && <span className="text-blue-800 ml-1">*</span>}
      </p>
      <div className="flex items-center justify-start md:justify-center space-x-1 sm:space-x-2" role="group" aria-label={`Rating for question ${question.id}`}>
        {RATING_LABELS.map((value) => {
          const isSelected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onAnswerChange(question.id, value)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isSelected 
                  ? 'bg-blue-800 text-white shadow-md scale-110' 
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-200'
                }`}
              aria-pressed={isSelected}
              aria-label={`Select rating ${value}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Question;