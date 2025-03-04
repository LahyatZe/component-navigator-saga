
import { FC } from 'react';
import QuizModal from '@/components/QuizModal';
import { UserProgress } from '@/hooks/useProgressPersistence';
import { useQuiz } from '@/hooks/useQuiz';
import { Question } from '@/types/quiz';

interface QuizSectionProps {
  progress: UserProgress;
  questions: Question[];
  saveProgress: (updates: Partial<UserProgress>) => void;
}

const QuizSection: FC<QuizSectionProps> = ({ progress, questions, saveProgress }) => {
  const { 
    quizState, 
    handleQuizAnswer, 
    handleUseHint,
    handleCvDownload,
    currentHints,
    startQuiz, 
    getCurrentQuestion 
  } = useQuiz(progress, saveProgress);

  return (
    <>
      {quizState.showQuiz && (
        <QuizModal
          isOpen={quizState.showQuiz}
          onClose={() => quizState.showQuiz = false}
          onAnswer={handleQuizAnswer}
          currentQuestion={getCurrentQuestion()}
          level={progress.currentLevel + 1}
          onUseHint={handleUseHint}
          onDownloadCV={handleCvDownload}
        />
      )}
    </>
  );
};

export default QuizSection;
