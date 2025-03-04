
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  correctAnswer: number; // Added this property
  level: number;
  hints?: string[];
  usedHints?: string[];
  explanation?: string; // Added this property
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
