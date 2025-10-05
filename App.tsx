
import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

type GameState = 'welcome' | 'quiz' | 'results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const startQuiz = useCallback(() => {
    setScore(0);
    setGameState('quiz');
  }, []);

  const finishQuiz = useCallback((finalScore: number, total: number) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setGameState('results');
  }, []);

  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);
  
  const renderGameState = () => {
    switch (gameState) {
      case 'quiz':
        return <QuizScreen onFinishQuiz={finishQuiz} />;
      case 'results':
        return <ResultScreen score={score} totalQuestions={totalQuestions} onRestart={restartQuiz} />;
      case 'welcome':
      default:
        return <WelcomeScreen onStart={startQuiz} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_200px,#1e40af,transparent)] opacity-40"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_0%_100px,#3730a3,transparent)] opacity-30"></div>
      <main className="w-full max-w-5xl z-10">
        {renderGameState()}
      </main>
    </div>
  );
};

export default App;
