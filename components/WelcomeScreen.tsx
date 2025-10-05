
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 mb-4">
        SQL FunHouse
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-8">Zoo Edition</h2>
      <p className="max-w-2xl text-slate-400 mb-12 text-lg">
        Ready to test your database skills? Dive into our interactive SQL quiz based on a zoo database and get instant, AI-powered feedback!
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-violet-600 text-white font-bold rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 text-xl"
      >
        Start the Challenge
      </button>
    </div>
  );
};

export default WelcomeScreen;
