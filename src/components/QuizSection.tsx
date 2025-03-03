
import { FC } from 'react';
import QuizModal from '@/components/QuizModal';
import { UserProgress } from '@/hooks/useProgressPersistence';
import { useQuiz } from '@/hooks/useQuiz';
import { questions } from '@/data/quizQuestions';
import { Question } from '@/types/quiz';

interface QuizSectionProps {
  progress: UserProgress;
  questions: Question[];
  saveProgress: (updates: Partial<UserProgress>) => void;
}

const QuizSection: FC<QuizSectionProps> = ({ progress, saveProgress }) => {
  const { quizState, handleQuizAnswer, startQuiz, getCurrentQuestion } = useQuiz(progress, saveProgress);

  return (
    <>
      {quizState.showQuiz && (
        <QuizModal
          isOpen={quizState.showQuiz}
          onClose={() => quizState.showQuiz = false}
          onAnswer={handleQuizAnswer}
          currentQuestion={getCurrentQuestion()}
          level={progress.currentLevel + 1}
        />
      )}
    </>
  );
};

export default QuizSection;
