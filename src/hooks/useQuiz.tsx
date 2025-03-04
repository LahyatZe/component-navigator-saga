import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Rocket } from 'lucide-react';
import { questions } from '@/data/quizQuestions';
import { UserProgress } from '@/types/course';
import { Question, QuizState } from '@/types/quiz';
import { useQuizHints } from './useQuizHints';
import { useCvDownload } from './useCvDownload';
import { 
  getQuestionsForLevel, 
  getRequiredCorrectAnswers,
  getCorrectAnswersCount,
  canLevelUp,
  getUnlockedYearsForLevel,
  showLevelUpToast,
  showCorrectAnswerToast,
  showWrongAnswerToast,
  getRandomQuestion,
  getQuestionById
} from '@/utils/quizUtils';

export const useQuiz = (
  progress: UserProgress,
  saveProgress: (updates: Partial<UserProgress>) => void
) => {
  const [quizState, setQuizState] = useState<QuizState>({
    showQuiz: false,
    currentQuestionId: 1,
  });
  
  const { currentHints, handleUseHint } = useQuizHints({
    progress, 
    currentQuestionId: quizState.currentQuestionId,
    saveProgress
  });
  
  const { handleCvDownload } = useCvDownload({ saveProgress });

  const handleQuizAnswer = useCallback((correct: boolean) => {
    try {
      const currentQuizHistory = Array.isArray(progress?.quizHistory) ? [...progress.quizHistory] : [];
      const updatedQuizHistory = [...currentQuizHistory, { level: (progress?.currentLevel || 0) + 1, correct }];
      
      saveProgress({ quizHistory: updatedQuizHistory });
      
      if (correct) {
        if (!Array.isArray(questions)) {
          console.error("Questions array is not properly defined");
          toast.error("Une erreur s'est produite. Veuillez rafraîchir la page.");
          return;
        }
        
        const nextLevel = (progress?.currentLevel || 0) + 1;
        const correctAnswersForLevel = getCorrectAnswersCount(updatedQuizHistory, nextLevel);
        const requiredCorrectAnswers = getRequiredCorrectAnswers(nextLevel);
        
        console.log(`Required correct: ${requiredCorrectAnswers}, Current correct: ${correctAnswersForLevel}`);
        
        if (correctAnswersForLevel >= requiredCorrectAnswers) {
          if (nextLevel <= 4) {
            const newUnlockedYears = getUnlockedYearsForLevel(nextLevel);
            
            showLevelUpToast(nextLevel);
            
            console.log("Statistics updated:", {
              userId: progress?.userId || 'unknown',
              email: progress?.userEmail || 'unknown',
              level: nextLevel,
              unlockedYears: newUnlockedYears,
              achievements: progress?.achievements || [],
              timestamp: new Date().toISOString()
            });
            
            saveProgress({ 
              currentLevel: nextLevel,
              unlockedYears: newUnlockedYears
            });
            
            setTimeout(() => {
              if (!Array.isArray(questions)) {
                console.error("Questions array is not properly defined");
                setQuizState(prev => ({
                  ...prev,
                  showQuiz: false
                }));
                return;
              }
              
              const nextLevelQuestions = questions.filter(q => q && q.level === nextLevel + 1) || [];
              if (nextLevelQuestions.length > 0) {
                setQuizState(prev => ({
                  ...prev,
                  showQuiz: false,
                  currentQuestionId: nextLevelQuestions[0].id
                }));
              } else {
                setQuizState(prev => ({
                  ...prev,
                  showQuiz: false
                }));
              }
            }, 300);
          } else {
            toast.success("Félicitations ! Vous avez débloqué tout le contenu du portfolio !", {
              duration: 5000,
              icon: <Rocket className="w-5 h-5 text-red-500" />
            });
            setTimeout(() => {
              setQuizState(prev => ({
                ...prev,
                showQuiz: false
              }));
            }, 300);
          }
        } else {
          showCorrectAnswerToast(correctAnswersForLevel, requiredCorrectAnswers);
          
          try {
            const levelQuestions = getQuestionsForLevel((progress?.currentLevel || 0) + 1);
            
            const answeredCorrectly = Array.isArray(updatedQuizHistory) 
              ? updatedQuizHistory
                  .filter(h => h && h.correct) 
                  .map(h => {
                    if (!h) return -1;
                    const question = questions.find(q => q && q.level === h.level && q.id === quizState.currentQuestionId);
                    return question ? question.id : -1;
                  })
                  .filter(id => id !== -1)
              : [];
            
            const remainingQuestions = levelQuestions.filter(q => {
              if (!q) return false;
              
              if (q.level !== (progress?.currentLevel || 0) + 1) return false;
              
              return !(Array.isArray(updatedQuizHistory) && updatedQuizHistory.some(history => {
                if (!history) return false;
                
                return history.level === q.level && 
                  history.correct && 
                  quizState.currentQuestionId === q.id;
              }));
            }) || [];
            
            setTimeout(() => {
              if (remainingQuestions.length > 0) {
                const randomQuestion = getRandomQuestion(remainingQuestions);
                if (randomQuestion) {
                  setQuizState(prev => ({
                    ...prev,
                    currentQuestionId: randomQuestion.id,
                    showQuiz: true
                  }));
                }
              } else {
                const levelQuestions = getQuestionsForLevel((progress?.currentLevel || 0) + 1);
                
                const randomQuestion = getRandomQuestion(levelQuestions);
                if (randomQuestion) {
                  setQuizState(prev => ({
                    ...prev,
                    currentQuestionId: randomQuestion.id,
                    showQuiz: true
                  }));
                } else {
                  setQuizState(prev => ({
                    ...prev,
                    showQuiz: false
                  }));
                }
              }
            }, 300);
          } catch (filterError) {
            console.error("Error filtering questions:", filterError);
            setTimeout(() => {
              setQuizState(prev => ({
                ...prev,
                showQuiz: false
              }));
            }, 300);
          }
        }
      } else {
        showWrongAnswerToast();
        
        setTimeout(() => {
          setQuizState(prev => ({
            ...prev,
            showQuiz: true
          }));
        }, 300);
      }
    } catch (error) {
      console.error("Error in handleQuizAnswer:", error);
      
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          showQuiz: true
        }));
      }, 300);
    }
  }, [progress, saveProgress, quizState.currentQuestionId]);

  const startQuiz = useCallback(() => {
    try {
      if ((progress?.currentLevel || 0) < 4) {
        const currentLevel = (progress?.currentLevel || 0) + 1;
        const levelQuestions = getQuestionsForLevel(currentLevel);
        
        if (levelQuestions.length === 0) {
          toast.error("Aucune question disponible pour ce niveau!", {
            duration: 3000
          });
          return;
        }
        
        const quizHistory = Array.isArray(progress?.quizHistory) ? progress.quizHistory : [];
        
        const answeredCorrectly = Array.isArray(quizHistory) 
          ? quizHistory
              .filter(h => h && h.correct)
              .map(h => {
                if (!h) return -1;
                const question = questions.find(q => q && q.level === h.level && q.id === quizState.currentQuestionId);
                return question ? question.id : -1;
              })
              .filter(id => id !== -1)
          : [];
        
        let unansweredQuestions = Array.isArray(levelQuestions) 
          ? levelQuestions.filter(q => q && !answeredCorrectly.includes(q.id))
          : [];
        
        if (unansweredQuestions.length === 0) {
          unansweredQuestions = levelQuestions;
        }
        
        const randomQuestion = getRandomQuestion(unansweredQuestions);
        
        if (randomQuestion) {
          setQuizState({
            currentQuestionId: randomQuestion.id,
            showQuiz: true
          });
          
          console.log("Quiz started with question ID:", randomQuestion.id);
        } else {
          toast.error("Aucune question disponible pour ce niveau!", {
            duration: 3000
          });
        }
      } else {
        toast.info("Vous avez déjà débloqué tous les niveaux !", {
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Erreur lors du démarrage du quiz. Veuillez réessayer.", {
        duration: 3000
      });
    }
  }, [progress?.currentLevel, progress?.quizHistory, quizState.currentQuestionId]);

  const getCurrentQuestion = useCallback((): Question | null => {
    try {
      const question = getQuestionById(quizState.currentQuestionId);
      
      if (!question) {
        return null;
      }
      
      return {
        ...question,
        usedHints: currentHints
      };
    } catch (error) {
      console.error("Error getting current question:", error);
      return null;
    }
  }, [currentHints, quizState.currentQuestionId]);

  return {
    quizState,
    setQuizState,
    handleQuizAnswer,
    handleUseHint,
    handleCvDownload,
    currentHints,
    startQuiz,
    getCurrentQuestion
  };
};
