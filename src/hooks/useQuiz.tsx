
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
    const updatedQuizHistory = [...(progress.quizHistory || []), { level: progress.currentLevel + 1, correct }];
    saveProgress({ quizHistory: updatedQuizHistory });
    
    if (correct) {
      const questionsForLevel = questions.filter(q => q.level === progress.currentLevel + 1);
      const correctAnswersForLevel = (progress.quizHistory || []).filter(q => q.level === progress.currentLevel + 1 && q.correct).length + 1;
      
      if (correctAnswersForLevel >= Math.ceil(questionsForLevel.length / 2)) {
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
          
          saveProgress({ 
            currentLevel: nextLevel,
            unlockedYears: newUnlockedYears
          });
          
          const nextLevelQuestions = questions.filter(q => q.level === nextLevel + 1);
          if (nextLevelQuestions.length > 0) {
            setQuizState(prev => ({
              ...prev,
              currentQuestionId: nextLevelQuestions[0].id
            }));
          }
        } else {
          toast.success("Félicitations ! Vous avez débloqué tout le contenu du portfolio !", {
            duration: 5000,
            icon: <Rocket className="w-5 h-5 text-red-500" />
          });
        }
      } else {
        toast.success(`Bonne réponse ! ${correctAnswersForLevel} / ${Math.ceil(questionsForLevel.length / 2)} pour débloquer le niveau suivant`, {
          duration: 3000
        });
        
        const remainingQuestions = questions.filter(q => 
          q.level === progress.currentLevel + 1 && 
          !(progress.quizHistory || []).some(history => 
            history.level === q.level && 
            history.correct && 
            questions.find(qu => qu.id === quizState.currentQuestionId)?.id === q.id
          )
        );
        
        if (remainingQuestions.length > 0) {
          const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
          setQuizState(prev => ({
            ...prev,
            currentQuestionId: randomQuestion.id
          }));
        }
      }
    } else {
      toast.error("Ce n'est pas la bonne réponse, essayez encore !", {
        duration: 3000
      });
    }
    
    setQuizState(prev => ({
      ...prev,
      showQuiz: false
    }));
    
    // Réinitialiser les indices utilisés pour la prochaine question
    setCurrentHints([]);
  };

  const handleUseHint = (hintIndex: number) => {
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
  };

  const handleCvDownload = () => {
    // Make sure to handle the case when usedHints is undefined
    saveProgress({ 
      cvDownloaded: true 
    } as Partial<UserProgress>);
    
    // Create a link element to download the CV
    const link = document.createElement('a');
    link.href = '/CV_Sohaib_ZEGHOUANI.pdf'; // Update this with the actual path to your CV
    link.download = 'CV_Sohaib_ZEGHOUANI.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Merci d'avoir téléchargé mon CV !", {
      duration: 3000,
      icon: <Download className="w-5 h-5 text-blue-500" />
    });
  };

  const startQuiz = () => {
    if (progress.currentLevel < 4) {
      const levelQuestions = questions.filter(q => q.level === progress.currentLevel + 1);
      const answeredCorrectly = (progress.quizHistory || [])
        .filter(h => h.correct)
        .map(h => {
          const question = questions.find(q => q.level === h.level && q.id === quizState.currentQuestionId);
          return question ? question.id : -1;
        });
      
      const unansweredQuestions = levelQuestions.filter(q => !answeredCorrectly.includes(q.id));
      
      if (unansweredQuestions.length > 0) {
        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
        setQuizState(prev => ({
          ...prev,
          currentQuestionId: randomQuestion.id
        }));
      } else if (levelQuestions.length > 0) {
        const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
        setQuizState(prev => ({
          ...prev,
          currentQuestionId: randomQuestion.id
        }));
      }
      
      setQuizState(prev => ({
        ...prev,
        showQuiz: true
      }));
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
      const question = questions.find(q => q.id === quizState.currentQuestionId) || questions[0];
      return {
        ...question,
        usedHints: currentHints
      };
    }
  };
};
