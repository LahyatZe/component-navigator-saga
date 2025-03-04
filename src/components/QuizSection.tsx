
import { FC, useEffect } from 'react';
import QuizModal from '@/components/QuizModal';
import { UserProgress } from '@/types/course';
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

  // Expose startQuiz method to parent component
  useEffect(() => {
    // Add startQuiz to window for external access
    if (window) {
      (window as any).__startQuiz = startQuiz;
    }
    
    // Cleanup
    return () => {
      if (window) {
        delete (window as any).__startQuiz;
      }
    };
  }, [startQuiz]);

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
