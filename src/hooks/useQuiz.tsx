
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Trophy, Star, Code, Award, Rocket, Download } from 'lucide-react';
import { questions } from '@/data/quizQuestions';
import { UserProgress } from '@/types/course';
import { Question, QuizState } from '@/types/quiz';

export const useQuiz = (
  progress: UserProgress,
  saveProgress: (updates: Partial<UserProgress>) => void
) => {
  const [quizState, setQuizState] = useState<QuizState>({
    showQuiz: false,
    currentQuestionId: 1,
  });
  const [currentHints, setCurrentHints] = useState<string[]>([]);

  // Initialize hints used for the current question
  useEffect(() => {
    if (quizState.showQuiz) {
      const questionId = quizState.currentQuestionId.toString();
      const usedHints = progress?.usedHints?.[questionId] || [];
      setCurrentHints(usedHints);
    }
  }, [quizState.showQuiz, quizState.currentQuestionId, progress?.usedHints]);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    try {
      // Make sure quizHistory is always an array
      const currentQuizHistory = Array.isArray(progress?.quizHistory) ? [...progress.quizHistory] : [];
      const updatedQuizHistory = [...currentQuizHistory, { level: (progress?.currentLevel || 0) + 1, correct }];
      
      // Save the updated quiz history immediately
      saveProgress({ quizHistory: updatedQuizHistory });
      
      if (correct) {
        // Safely check if questions array is defined before filtering
        if (!Array.isArray(questions)) {
          console.error("Questions array is not properly defined");
          toast.error("Une erreur s'est produite. Veuillez rafraîchir la page.");
          return;
        }
        
        // Defensively filter questions for current level
        const questionsForCurrentLevel = questions.filter(q => 
          q && q.level === ((progress?.currentLevel || 0) + 1)
        ) || [];
        
        // Calculate required correct answers safely
        const requiredCorrectAnswers = questionsForCurrentLevel.length > 0 
          ? Math.ceil(questionsForCurrentLevel.length / 2) 
          : 1;
          
        // Get current correct answers, handle safely
        const correctAnswersForLevel = (currentQuizHistory || [])
          .filter(q => q && q.level === ((progress?.currentLevel || 0) + 1) && q.correct)
          .length + 1;
        
        console.log(`Required correct: ${requiredCorrectAnswers}, Current correct: ${correctAnswersForLevel}`);
        
        if (correctAnswersForLevel >= requiredCorrectAnswers) {
          const nextLevel = (progress?.currentLevel || 0) + 1;
          if (nextLevel <= 4) {
            let newUnlockedYears: string[] = [];
            
            if (nextLevel === 1) {
              newUnlockedYears = ["2018", "2019"];
              toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2019`, {
                duration: 5000,
                icon: <Trophy className="w-5 h-5 text-yellow-500" />
              });
            } else if (nextLevel === 2) {
              newUnlockedYears = ["2018", "2019", "2020", "2021"];
              toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2021`, {
                duration: 5000,
                icon: <Star className="w-5 h-5 text-blue-500" />
              });
            } else if (nextLevel === 3) {
              newUnlockedYears = ["2018", "2019", "2020", "2021", "2022"];
              toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2022`, {
                duration: 5000,
                icon: <Code className="w-5 h-5 text-green-500" />
              });
            } else {
              newUnlockedYears = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];
              toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès à toutes les années`, {
                duration: 5000,
                icon: <Award className="w-5 h-5 text-purple-500" />
              });
            }
            
            // Update statistics for display - use safe property access
            console.log("Statistics updated:", {
              userId: progress?.userId,
              email: progress?.userEmail,
              level: nextLevel,
              unlockedYears: newUnlockedYears,
              achievements: progress?.achievements || [],
              timestamp: new Date().toISOString()
            });
            
            // Update progress with new level and unlocked years
            saveProgress({ 
              currentLevel: nextLevel,
              unlockedYears: newUnlockedYears
            });
            
            // After level up, prepare next quiz with delay to prevent issues
            setTimeout(() => {
              // Safely check if questions array is defined before filtering
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
                // Close this quiz and move to next level
                setQuizState(prev => ({
                  ...prev,
                  showQuiz: false,
                  currentQuestionId: nextLevelQuestions[0].id
                }));
              } else {
                // Close the quiz if no more questions
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
            // Close quiz with delay
            setTimeout(() => {
              setQuizState(prev => ({
                ...prev,
                showQuiz: false
              }));
            }, 300);
          }
        } else {
          toast.success(`Bonne réponse ! ${correctAnswersForLevel} / ${requiredCorrectAnswers} pour débloquer le niveau suivant`, {
            duration: 3000
          });
          
          // Get remaining questions - ensure questions array is valid
          if (!Array.isArray(questions)) {
            console.error("Questions array is not properly defined");
            toast.error("Une erreur s'est produite. Veuillez rafraîchir la page.");
            return;
          }
          
          try {
            // Add a defensive check before filtering
            const safeQuestionsArray = Array.isArray(questions) ? questions : [];
            
            const remainingQuestions = safeQuestionsArray.filter(q => {
              if (!q) return false;
              
              // Filter for current level
              if (q.level !== (progress?.currentLevel || 0) + 1) return false;
              
              // Only include questions that haven't been answered correctly
              // Add null check before using some() on quizHistory
              return !(Array.isArray(currentQuizHistory) && currentQuizHistory.some(history => {
                if (!history) return false;
                
                return history.level === q.level && 
                  history.correct && 
                  quizState.currentQuestionId === q.id;
              }));
            }) || [];
            
            // Display another question with delay to prevent issues
            setTimeout(() => {
              if (remainingQuestions.length > 0) {
                // Show a random remaining question
                const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
                setQuizState(prev => ({
                  ...prev,
                  currentQuestionId: randomQuestion.id,
                  showQuiz: true
                }));
              } else {
                // If all questions are answered, show a random question from this level
                // Safely access questions array with a null check
                if (!Array.isArray(questions)) {
                  setQuizState(prev => ({
                    ...prev,
                    showQuiz: false
                  }));
                  return;
                }
                
                const levelQuestions = questions.filter(q => 
                  q && q.level === (progress?.currentLevel || 0) + 1
                ) || [];
                
                if (levelQuestions.length > 0) {
                  const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
                  setQuizState(prev => ({
                    ...prev,
                    currentQuestionId: randomQuestion.id,
                    showQuiz: true
                  }));
                } else {
                  // Fallback if no questions at this level (shouldn't happen)
                  setQuizState(prev => ({
                    ...prev,
                    showQuiz: false
                  }));
                }
              }
            }, 300);
          } catch (filterError) {
            console.error("Error filtering questions:", filterError);
            // Fallback in case of filter error - just show any question from this level
            setTimeout(() => {
              // Safely access questions array
              if (!Array.isArray(questions)) {
                setQuizState(prev => ({
                  ...prev,
                  showQuiz: false
                }));
                return;
              }
              
              const fallbackQuestions = questions.filter(q => 
                q && q.level === (progress?.currentLevel || 0) + 1
              ) || [];
              
              if (fallbackQuestions.length > 0) {
                const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
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
            }, 300);
          }
        }
      } else {
        toast.error("Ce n'est pas la bonne réponse, essayez encore !", {
          duration: 3000
        });
        
        // Stay on the same question after wrong answer with delay
        setTimeout(() => {
          setQuizState(prev => ({
            ...prev,
            showQuiz: true
          }));
        }, 300);
      }
    } catch (error) {
      console.error("Error in handleQuizAnswer:", error);
      
      // Keep the quiz open in case of error
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          showQuiz: true
        }));
      }, 300);
    }
  }, [progress, saveProgress, quizState.currentQuestionId]);

  const handleUseHint = useCallback((hintIndex: number) => {
    try {
      const questionId = quizState.currentQuestionId.toString();
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
  }, [currentHints, progress?.usedHints, quizState.currentQuestionId, saveProgress]);

  const handleCvDownload = useCallback(() => {
    try {
      // Make sure to handle the case when usedHints is undefined
      saveProgress({ 
        cvDownloaded: true 
      } as Partial<UserProgress>);
      
      // Create a link element to download the CV
      const link = document.createElement('a');
      link.href = '/CV_Sohaib_ZEGHOUANI.pdf';
      link.download = 'CV_Sohaib_ZEGHOUANI.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Merci d'avoir téléchargé mon CV !", {
        duration: 3000,
        icon: <Download className="w-5 h-5 text-blue-500" />
      });
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Erreur lors du téléchargement du CV. Veuillez réessayer.", {
        duration: 3000
      });
    }
  }, [saveProgress]);

  const startQuiz = useCallback(() => {
    try {
      if ((progress?.currentLevel || 0) < 4) {
        // Ensure questions array is valid before using it
        if (!Array.isArray(questions)) {
          toast.error("Erreur lors du démarrage du quiz: données des questions non disponibles", {
            duration: 3000
          });
          return;
        }
        
        const levelQuestions = questions.filter(q => 
          q && q.level === (progress?.currentLevel || 0) + 1
        ) || [];
        
        if (levelQuestions.length === 0) {
          toast.error("Aucune question disponible pour ce niveau!", {
            duration: 3000
          });
          return;
        }
        
        // Handle potentially undefined quizHistory safely
        const quizHistory = Array.isArray(progress?.quizHistory) ? progress.quizHistory : [];
        
        // Safely get answered correctly questions
        // Add a defensive check before using map/filter methods
        const answeredCorrectly = Array.isArray(quizHistory) 
          ? quizHistory
              .filter(h => h && h.correct) // Make sure we have valid entries
              .map(h => {
                if (!h) return -1; // Handle null/undefined
                // Find the corresponding question - ensure questions array is valid
                if (!Array.isArray(questions)) return -1;
                
                const question = questions.find(q => q && q.level === h.level && q.id === quizState.currentQuestionId);
                return question ? question.id : -1;
              })
              .filter(id => id !== -1) // Remove invalid entries
          : [];
        
        // Get unanswered questions with proper null check
        let unansweredQuestions = Array.isArray(levelQuestions) 
          ? levelQuestions.filter(q => !answeredCorrectly.includes(q.id))
          : [];
        
        if (unansweredQuestions.length === 0) {
          unansweredQuestions = levelQuestions;
        }
        
        // Get a random question - add check to ensure there are questions
        if (unansweredQuestions.length > 0) {
          const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
          
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
      // Ensure questions array is properly defined
      if (!Array.isArray(questions)) {
        console.error("Questions array is not properly defined");
        return null;
      }
      
      const question = questions.find(q => q && q.id === quizState.currentQuestionId);
      
      if (!question) {
        console.error("Question not found for ID:", quizState.currentQuestionId);
        // Return null if question not found
        return null;
      }
      
      return {
        ...question,
        usedHints: currentHints
      };
    } catch (error) {
      console.error("Error getting current question:", error);
      // Return null in case of error
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

