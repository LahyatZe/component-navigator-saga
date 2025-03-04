
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
    setQuizState,
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

  // Handle the modal's open state and ensure it works properly
  const handleCloseModal = () => {
    console.log("Closing quiz modal");
    setQuizState(prev => ({ ...prev, showQuiz: false }));
  };

  // Handle the answer and ensure the quiz state is properly updated
  const handleAnswer = (correct: boolean) => {
    console.log("Answer submitted:", correct);
    try {
      handleQuizAnswer(correct);
    } catch (error) {
      console.error("Error handling quiz answer:", error);
      // Prevent complete UI breakdown by ensuring modal stays visible
      setQuizState(prev => ({ ...prev, showQuiz: true }));
    }
  };

  // Ensure we have a valid question before trying to render the modal
  const currentQuestion = getCurrentQuestion();
  
  return (
    <>
      {quizState.showQuiz && currentQuestion && (
        <QuizModal
          isOpen={quizState.showQuiz}
          onClose={handleCloseModal}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestion}
          level={progress.currentLevel + 1}
          onUseHint={handleUseHint}
          onDownloadCV={handleCvDownload}
        />
      )}
    </>
  );
};

export default QuizSection;
