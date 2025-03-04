
import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/types/course';

interface UseQuizHintsProps {
  progress: UserProgress;
  currentQuestionId: number;
  saveProgress: (updates: Partial<UserProgress>) => void;
}

export const useQuizHints = ({ 
  progress, 
  currentQuestionId,
  saveProgress 
}: UseQuizHintsProps) => {
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  // Initialize hints used for the current question
  useEffect(() => {
    const questionId = currentQuestionId.toString();
    const usedHints = progress?.usedHints?.[questionId] || [];
    setCurrentHints(usedHints);
  }, [currentQuestionId, progress?.usedHints]);

  const handleUseHint = useCallback((hintIndex: number) => {
    try {
      const questionId = currentQuestionId.toString();
      const usedHints = [...(currentHints || []), hintIndex.toString()];
      
      // Update local state
      setCurrentHints(usedHints);
      
      // Update global storage
      const updatedUsedHints = { ...(progress?.usedHints || {}) };
      updatedUsedHints[questionId] = usedHints;
      
      saveProgress({ 
        usedHints: updatedUsedHints 
      } as Partial<UserProgress>);
    } catch (error) {
      console.error("Error using hint:", error);
    }
  }, [currentHints, progress?.usedHints, currentQuestionId, saveProgress]);

  return {
    currentHints,
    handleUseHint
  };
};
