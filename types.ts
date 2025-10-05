
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'matching'
  | 'open-ended-sql'
  | 'open-ended-text';

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  code?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface MultipleSelectQuestion extends BaseQuestion {
  type: 'multiple-select';
  options: string[];
  correctAnswers: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  queries: { id: string; text: string }[];
  functions: { id: string; text: string }[];
  correctMapping: Record<string, string>;
}

export interface OpenEndedSqlQuestion extends BaseQuestion {
  type: 'open-ended-sql';
  geminiPrompt: string;
  schemaContext: string;
}

export interface OpenEndedTextQuestion extends BaseQuestion {
    type: 'open-ended-text';
    geminiPrompt: string;
    modelAnswer: string;
}


export type QuizQuestion =
  | MultipleChoiceQuestion
  | MultipleSelectQuestion
  | MatchingQuestion
  | OpenEndedSqlQuestion
  | OpenEndedTextQuestion;

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  size: number;
}
