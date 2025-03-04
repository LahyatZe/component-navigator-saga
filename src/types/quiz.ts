
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  correctAnswer: number;
  level: number;
  hints?: string[];
  usedHints?: string[];
  explanation?: string;
}

// Make sure this interface is accessible where needed
export interface QuizState {
  showQuiz: boolean;
  currentQuestionId: number;
}

// Define the QuizHistory interface
export interface QuizHistory {
  level: number;
  correct: boolean;
}
