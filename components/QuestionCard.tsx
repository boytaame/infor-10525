
import React, { useState, useCallback, useMemo } from 'react';
import { QuizQuestion, MultipleChoiceQuestion, MultipleSelectQuestion, MatchingQuestion, OpenEndedSqlQuestion, OpenEndedTextQuestion } from '../types';
import { evaluateSqlQuery, evaluateExplanation } from '../services/geminiService';

interface QuestionCardProps {
  question: QuizQuestion;
  onCorrectAnswer: () => void;
  onNextQuestion: () => void;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-slate-900/70 p-4 rounded-md text-sm text-cyan-300 overflow-x-auto my-4 border border-slate-700">
    <code>{code}</code>
  </pre>
);

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onCorrectAnswer, onNextQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | Record<string, string>>('');
  const [userText, setUserText] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isAnswered) return;

    let correct = false;
    switch (question.type) {
      case 'multiple-choice':
        correct = selectedAnswer === (question as MultipleChoiceQuestion).correctAnswer;
        break;
      case 'multiple-select':
        const correctAnswers = (question as MultipleSelectQuestion).correctAnswers;
        const selected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
        correct = correctAnswers.length === selected.length && correctAnswers.every(ans => selected.includes(ans));
        break;
      case 'matching':
        const correctMapping = (question as MatchingQuestion).correctMapping;
        const userMapping = typeof selectedAnswer === 'object' ? selectedAnswer : {};
        correct = Object.keys(correctMapping).length > 0 && Object.keys(correctMapping).every(key => correctMapping[key] === userMapping[key]);
        break;
      case 'open-ended-sql':
        setIsLoading(true);
        const sqlResult = await evaluateSqlQuery(userText, (question as OpenEndedSqlQuestion).geminiPrompt, (question as OpenEndedSqlQuestion).schemaContext);
        correct = sqlResult.isCorrect;
        setFeedback(sqlResult.explanation);
        setIsLoading(false);
        break;
      case 'open-ended-text':
        setIsLoading(true);
        const textResult = await evaluateExplanation(userText, (question as OpenEndedTextQuestion).modelAnswer, (question as OpenEndedTextQuestion).geminiPrompt);
        correct = true; // For text, we always proceed and just show feedback.
        setFeedback(textResult.feedback);
        setIsLoading(false);
        break;
    }

    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      onCorrectAnswer();
    }
  }, [isAnswered, question, selectedAnswer, onCorrectAnswer, userText]);

  const handleOptionChange = (value: string) => {
    if (question.type === 'multiple-select') {
      const currentAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
      if (currentAnswers.includes(value)) {
        setSelectedAnswer(currentAnswers.filter(ans => ans !== value));
      } else {
        setSelectedAnswer([...currentAnswers, value]);
      }
    } else {
      setSelectedAnswer(value);
    }
  };
  
  const handleMatchingChange = (queryId: string, functionId: string) => {
    setSelectedAnswer(prev => ({ ...(typeof prev === 'object' ? prev : {}), [queryId]: functionId }));
  };

  const renderAnswerOptions = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'multiple-select':
        const isMultiSelect = question.type === 'multiple-select';
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(question as MultipleChoiceQuestion | MultipleSelectQuestion).options.map((option, i) => {
              const isSelected = isMultiSelect 
                ? Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
                : selectedAnswer === option;
              
              let buttonClass = 'p-4 rounded-lg text-left transition-all duration-200 border-2 ';
              if (isAnswered) {
                const isCorrectOption = isMultiSelect 
                    ? (question as MultipleSelectQuestion).correctAnswers.includes(option)
                    : (question as MultipleChoiceQuestion).correctAnswer === option;
                if(isCorrectOption) {
                    buttonClass += 'bg-green-500/20 border-green-500';
                } else if (isSelected) {
                    buttonClass += 'bg-red-500/20 border-red-500';
                } else {
                    buttonClass += 'bg-slate-700/50 border-transparent';
                }
              } else {
                buttonClass += isSelected ? 'bg-violet-600 border-violet-400' : 'bg-slate-700/50 border-transparent hover:bg-slate-600/50';
              }

              return (
                <button key={i} onClick={() => handleOptionChange(option)} disabled={isAnswered} className={buttonClass}>
                    <pre className="text-sm whitespace-pre-wrap text-slate-200 bg-transparent p-0 border-0 m-0"><code>{option}</code></pre>
                </button>
              );
            })}
          </div>
        );
      case 'matching':
        const q = question as MatchingQuestion;
        return (
            <div className="space-y-4">
                {q.queries.map(query => (
                    <div key={query.id} className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="font-mono text-sm text-cyan-300 mb-2">{query.id}: {query.text}</p>
                        <select
                            onChange={(e) => handleMatchingChange(query.id, e.target.value)}
                            disabled={isAnswered}
                            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-white"
                            value={(selectedAnswer as Record<string,string>)[query.id] || ''}
                        >
                            <option value="">Select a function...</option>
                            {q.functions.map(func => <option key={func.id} value={func.id}>{func.id}: {func.text}</option>)}
                        </select>
                         {isAnswered && (
                            <div className={`mt-2 text-sm font-semibold ${q.correctMapping[query.id] === (selectedAnswer as Record<string,string>)[query.id] ? 'text-green-400' : 'text-red-400'}`}>
                                Correct Answer: {q.correctMapping[query.id]} - {q.functions.find(f => f.id === q.correctMapping[query.id])?.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );

      case 'open-ended-sql':
      case 'open-ended-text':
        return (
            <textarea
                value={userText}
                onChange={e => setUserText(e.target.value)}
                disabled={isAnswered || isLoading}
                placeholder={question.type === 'open-ended-sql' ? "Write your SQL query here..." : "Write your explanation here..."}
                className="w-full h-40 p-3 bg-slate-900 border border-slate-600 rounded-md text-slate-200 font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-down">
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{question.questionText}</h3>
      {question.code && <CodeBlock code={question.code} />}
      <div className="mt-4">{renderAnswerOptions()}</div>
      
       <div className="mt-6 min-h-[80px]">
        {isAnswered && !isLoading && (
          <div className={`p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            <h4 className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            {feedback && <p className="text-sm mt-1">{feedback}</p>}
            {(question.type === 'open-ended-text') && <p className="text-sm mt-1"><b>Model Answer:</b> {(question as OpenEndedTextQuestion).modelAnswer}</p>}
          </div>
        )}
        {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-t-transparent border-violet-400 rounded-full animate-spin"></div>
                <span>Gemini is thinking...</span>
            </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        {isAnswered ? (
          <button onClick={onNextQuestion} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors transform hover:scale-105">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
            {isLoading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
