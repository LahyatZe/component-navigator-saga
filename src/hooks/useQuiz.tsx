import { useState, useEffect } from 'react';
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

  // Initialiser les indices utilisés pour la question actuelle
  useEffect(() => {
    if (quizState.showQuiz) {
      const questionId = quizState.currentQuestionId.toString();
      const usedHints = progress.usedHints?.[questionId] || [];
      setCurrentHints(usedHints);
    }
  }, [quizState.showQuiz, quizState.currentQuestionId, progress.usedHints]);

  const handleQuizAnswer = (correct: boolean) => {
    try {
      // Make sure quizHistory is always an array
      const currentQuizHistory = Array.isArray(progress.quizHistory) ? progress.quizHistory : [];
      const updatedQuizHistory = [...currentQuizHistory, { level: progress.currentLevel + 1, correct }];
      
      // Save the updated quiz history immediately
      saveProgress({ quizHistory: updatedQuizHistory });
      
      if (correct) {
        // Get questions for the current level, handle safely
        const questionsForCurrentLevel = questions.filter(q => q.level === progress.currentLevel + 1) || [];
        
        // Calculate required correct answers safely
        const requiredCorrectAnswers = questionsForCurrentLevel.length > 0 
          ? Math.ceil(questionsForCurrentLevel.length / 2) 
          : 1;
          
        // Get current correct answers, handle safely
        const correctAnswersForLevel = currentQuizHistory
          .filter(q => q?.level === progress.currentLevel + 1 && q?.correct)
          .length + 1;
        
        console.log(`Required correct: ${requiredCorrectAnswers}, Current correct: ${correctAnswersForLevel}`);
        
        if (correctAnswersForLevel >= requiredCorrectAnswers) {
          const nextLevel = progress.currentLevel + 1;
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
            
            // Update progress with new level and unlocked years
            saveProgress({ 
              currentLevel: nextLevel,
              unlockedYears: newUnlockedYears
            });
            
            // After level up, prepare next quiz with delay to prevent issues
            setTimeout(() => {
              const nextLevelQuestions = questions.filter(q => q.level === nextLevel + 1) || [];
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
          
          // Get remaining questions safely
          const remainingQuestions = questions.filter(q => {
            // Filter for current level
            if (q.level !== progress.currentLevel + 1) return false;
            
            // Only include questions that haven't been answered correctly
            // This is where the filter error was occurring
            return !(currentQuizHistory.some(history => {
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
              const levelQuestions = questions.filter(q => q.level === progress.currentLevel + 1) || [];
              if (levelQuestions.length > 0) {
                const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
                setQuizState(prev => ({
                  ...prev,
                  currentQuestionId: randomQuestion.id,
                  showQuiz: true
                }));
              }
            }
          }, 300);
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
  };

  const handleUseHint = (hintIndex: number) => {
    try {
      const questionId = quizState.currentQuestionId.toString();
      const usedHints = [...(currentHints || []), hintIndex.toString()];
      
      // Mettre à jour l'état local
      setCurrentHints(usedHints);
      
      // Mettre à jour le stockage global
      const updatedUsedHints = { ...(progress.usedHints || {}) };
      updatedUsedHints[questionId] = usedHints;
      
      saveProgress({ 
        usedHints: updatedUsedHints 
      } as Partial<UserProgress>);
    } catch (error) {
      console.error("Error using hint:", error);
    }
  };

  const handleCvDownload = () => {
    try {
      // Make sure to handle the case when usedHints is undefined
      saveProgress({ 
        cvDownloaded: true 
      } as Partial<UserProgress>);
      
      // Create a link element to download the CV
      const link = document.createElement('a');
      link.href = '/CV_Sohaib_ZEGHOUANI.pdf'; // Update this with the actual path to your CV
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
  };

  const startQuiz = () => {
    try {
      if (progress.currentLevel < 4) {
        const levelQuestions = questions.filter(q => q.level === progress.currentLevel + 1) || [];
        
        if (levelQuestions.length === 0) {
          toast.error("Aucune question disponible pour ce niveau!", {
            duration: 3000
          });
          return;
        }
        
        // Handle potentially undefined quizHistory safely
        const quizHistory = Array.isArray(progress.quizHistory) ? progress.quizHistory : [];
        
        const answeredCorrectly = quizHistory
          .filter(h => h?.correct) // Make sure we have valid entries
          .map(h => {
            if (!h) return -1; // Handle null/undefined
            const question = questions.find(q => q.level === h.level && q.id === quizState.currentQuestionId);
            return question ? question.id : -1;
          })
          .filter(id => id !== -1); // Remove invalid entries
        
        // Get unanswered questions
        let unansweredQuestions = levelQuestions.filter(q => !answeredCorrectly.includes(q.id));
        
        if (unansweredQuestions.length === 0) {
          unansweredQuestions = levelQuestions;
        }
        
        // Get a random question
        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
        
        setQuizState({
          currentQuestionId: randomQuestion.id,
          showQuiz: true
        });
        
        console.log("Quiz started with question ID:", randomQuestion.id);
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
  };

  return {
    quizState,
    setQuizState,
    handleQuizAnswer,
    handleUseHint,
    handleCvDownload,
    currentHints,
    startQuiz,
    getCurrentQuestion: (): Question => {
      try {
        const question = questions.find(q => q.id === quizState.currentQuestionId);
        
        if (!question) {
          console.error("Question not found for ID:", quizState.currentQuestionId);
          // Fallback to first question if current not found
          return {
            ...questions[0],
            usedHints: currentHints
          };
        }
        
        return {
          ...question,
          usedHints: currentHints
        };
      } catch (error) {
        console.error("Error getting current question:", error);
        // Return a safe default in case of error
        return {
          id: 1,
          question: "Une question est actuellement indisponible.",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctOptionIndex: 0,
          correctAnswer: 0,
          level: 1,
          usedHints: []
        };
      }
    }
  };
};
