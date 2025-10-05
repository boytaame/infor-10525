
import React from 'react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  let message = "Great effort!";
  if (percentage === 100) {
    message = "Perfect Score! You're a SQL Master!";
  } else if (percentage >= 75) {
    message = "Excellent! You really know your stuff!";
  } else if (percentage >= 50) {
    message = "Good job! A little more practice and you'll be an expert.";
  }

  return (
    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl animate-fade-in border border-slate-700">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 mb-4">{message}</h1>
      <p className="text-2xl text-slate-300 mb-2">You've completed the challenge!</p>
      <p className="text-5xl font-bold text-white my-6">
        {score} <span className="text-3xl text-slate-400">/ {totalQuestions}</span>
      </p>
      <div className="w-full bg-slate-700 rounded-full h-4 mb-8">
        <div 
          className="bg-gradient-to-r from-cyan-400 to-violet-500 h-4 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
};

export default ResultScreen;
