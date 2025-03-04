
import { toast } from 'sonner';
import { Trophy, Star, Code, Award, Rocket } from 'lucide-react';
import { Question, QuizHistory } from '@/types/quiz';
import { questions } from '@/data/quizQuestions';

/**
 * Gets questions for a specific level
 */
export const getQuestionsForLevel = (level: number): Question[] => {
  // Safely check if questions array is defined before filtering
  if (!Array.isArray(questions)) {
    console.error("Questions array is not properly defined");
    return [];
  }
  
  // Defensively filter questions for current level
  return questions.filter(q => q && q.level === level) || [];
};

/**
 * Calculates the required number of correct answers to level up
 */
export const getRequiredCorrectAnswers = (level: number): number => {
  const questionsForLevel = getQuestionsForLevel(level);
  return questionsForLevel.length > 0 ? Math.ceil(questionsForLevel.length / 2) : 1;
};

/**
 * Gets the number of correct answers for a specific level
 */
export const getCorrectAnswersCount = (quizHistory: QuizHistory[], level: number): number => {
  if (!Array.isArray(quizHistory)) return 0;
  
  return quizHistory
    .filter(q => q && q.level === level && q.correct)
    .length;
};

/**
 * Checks if the user can level up based on their quiz history
 */
export const canLevelUp = (quizHistory: QuizHistory[], currentLevel: number): boolean => {
  const level = currentLevel + 1; // Next level to unlock
  const requiredCorrect = getRequiredCorrectAnswers(level);
  const correctAnswers = getCorrectAnswersCount(quizHistory, level);
  
  return correctAnswers >= requiredCorrect;
};

/**
 * Gets the unlocked years based on the level
 */
export const getUnlockedYearsForLevel = (level: number): string[] => {
  switch (level) {
    case 1:
      return ["2018", "2019"];
    case 2:
      return ["2018", "2019", "2020", "2021"];
    case 3:
      return ["2018", "2019", "2020", "2021", "2022"];
    case 4:
      return ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
    default:
      return [];
  }
};

/**
 * Shows a level up toast notification
 */
export const showLevelUpToast = (level: number): void => {
  if (level === 1) {
    toast.success(`Niveau ${level} débloqué ! Vous avez accès aux années 2018-2019`, {
      duration: 5000,
      icon: <Trophy className="w-5 h-5 text-yellow-500" />
    });
  } else if (level === 2) {
    toast.success(`Niveau ${level} débloqué ! Vous avez accès aux années 2018-2021`, {
      duration: 5000,
      icon: <Star className="w-5 h-5 text-blue-500" />
    });
  } else if (level === 3) {
    toast.success(`Niveau ${level} débloqué ! Vous avez accès aux années 2018-2022`, {
      duration: 5000,
      icon: <Code className="w-5 h-5 text-green-500" />
    });
  } else {
    toast.success(`Niveau ${level} débloqué ! Vous avez accès à toutes les années`, {
      duration: 5000,
      icon: <Award className="w-5 h-5 text-purple-500" />
    });
  }
};

/**
 * Shows a success toast for correct answers
 */
export const showCorrectAnswerToast = (correctAnswers: number, requiredCorrect: number): void => {
  toast.success(`Bonne réponse ! ${correctAnswers} / ${requiredCorrect} pour débloquer le niveau suivant`, {
    duration: 3000
  });
};

/**
 * Shows a wrong answer toast
 */
export const showWrongAnswerToast = (): void => {
  toast.error("Ce n'est pas la bonne réponse, essayez encore !", {
    duration: 3000
  });
};

/**
 * Gets a random question from a list of questions
 */
export const getRandomQuestion = (questionsList: Question[]): Question | null => {
  if (!Array.isArray(questionsList) || questionsList.length === 0) {
    return null;
  }
  
  return questionsList[Math.floor(Math.random() * questionsList.length)];
};

/**
 * Gets the current question by ID
 */
export const getQuestionById = (questionId: number): Question | null => {
  try {
    // Ensure questions array is properly defined
    if (!Array.isArray(questions)) {
      console.error("Questions array is not properly defined");
      return null;
    }
    
    const question = questions.find(q => q && q.id === questionId);
    
    if (!question) {
      console.error("Question not found for ID:", questionId);
      // Return null if question not found
      return null;
    }
    
    return question;
  } catch (error) {
    console.error("Error getting question by ID:", error);
    // Return null in case of error
    return null;
  }
};
