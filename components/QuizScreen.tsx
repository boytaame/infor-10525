
import React, { useState, useCallback, useMemo } from 'react';
import { quizData } from '../data/quizData';
import QuestionCard from './QuestionCard';
import DatabaseTables from './DatabaseTables';
import ProgressBar from './ProgressBar';
import ParticleEffect from './ParticleEffect';

interface QuizScreenProps {
  onFinishQuiz: (score: number, total: number) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ onFinishQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const questions = useMemo(() => quizData, []);
  const currentQuestion = questions[currentQuestionIndex];

  const handleCorrectAnswer = useCallback(() => {
    setScore(prev => prev + 1);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  }, []);
  
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinishQuiz(score, questions.length);
    }
  }, [currentQuestionIndex, questions.length, onFinishQuiz, score]);

  return (
    <div className="w-full relative">
       {showParticles && <ParticleEffect />}
      <h1 className="text-3xl font-bold text-center mb-4 text-slate-200">SQL Challenge</h1>
      <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      <div className="mt-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700">
        <DatabaseTables />
        <div className="mt-6">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onCorrectAnswer={handleCorrectAnswer}
            onNextQuestion={handleNextQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
