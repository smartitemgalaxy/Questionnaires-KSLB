
import React from 'react';
import { FABQScores as Scores } from '../types';

interface ScoreDisplayProps {
  scores: Scores;
}

const ScoreCard: React.FC<{ title: string; score: number | null; maxScore: number; interpretation: string }> = ({ title, score, maxScore, interpretation }) => (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-5xl font-bold text-blue-600 my-2">
            {score !== null ? score : 'N/A'}
            <span className="text-2xl text-gray-400 font-normal"> / {maxScore}</span>
        </p>
        <p className="text-sm text-gray-500">{interpretation}</p>
    </div>
);


const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores }) => {
  return (
    <div className="my-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreCard 
                title="Fear-Avoidance Beliefs about Work"
                score={scores.work}
                maxScore={42}
                interpretation="Higher scores suggest greater fear-avoidance related to work."
            />
             <ScoreCard 
                title="Fear-Avoidance Beliefs about Physical Activity"
                score={scores.physicalActivity}
                maxScore={24}
                interpretation="Higher scores suggest greater fear-avoidance related to physical activity."
            />
        </div>
        <p className="text-xs text-gray-500 mt-6 text-center">
            <span className="font-semibold text-blue-600">*</span> 
            Only questions marked with an asterisk are included in the scoring. This scoring is for informational purposes and is not a substitute for professional medical advice.
        </p>
    </div>
  );
};

export default ScoreDisplay;