
export interface Question {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hints?: string[];
  usedHints?: string[];
}

export interface QuizHistory {
  level: number;
  correct: boolean;
}

export interface QuizState {
  showQuiz: boolean;
  currentQuestionId: number;
}
