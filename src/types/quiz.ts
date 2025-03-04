export interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  level: number;
  hints?: string[];
  usedHints?: string[];
}

// Make sure this interface is accessible where needed
export interface QuizState {
  showQuiz: boolean;
  currentQuestionId: number;
}
