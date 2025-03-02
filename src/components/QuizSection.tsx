
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { Trophy, Star, Code, Award, Rocket } from 'lucide-react';
import QuizModal from '@/components/QuizModal';
import { UserProgress } from '@/hooks/useProgressPersistence';

export interface Question {
  id: number;
  level: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizSectionProps {
  progress: UserProgress;
  questions: Question[];
  saveProgress: (updates: Partial<UserProgress>) => void;
}

export const questions: Question[] = [
  {
    id: 1,
    level: 1,
    question: "Quel a été mon premier diplôme ?",
    options: [
      "Bac S",
      "Bac ES",
      "Bac Pro",
      "Bac L"
    ],
    correctAnswer: 1,
    explanation: "J'ai obtenu un Bac ES en 2018 avant de poursuivre mes études en informatique."
  },
  {
    id: 2,
    level: 1,
    question: "Dans quelle ville ai-je commencé mes études supérieures ?",
    options: [
      "Paris",
      "Lyon",
      "Saint-Étienne",
      "Montpellier"
    ],
    correctAnswer: 2,
    explanation: "J'ai commencé mes études supérieures à Saint-Étienne, où j'ai développé mes premières compétences en développement."
  },
  {
    id: 3,
    level: 2,
    question: "Dans quelle entreprise ai-je effectué mon alternance ?",
    options: [
      "Sam Outillage",
      "My Pets Life",
      "Capgemini Technologies & Services",
      "IGSI Calliope"
    ],
    correctAnswer: 2,
    explanation: "J'ai effectué mon alternance chez Capgemini Technologies & Services, où j'ai travaillé sur des projets d'applications bancaires."
  },
  {
    id: 4,
    level: 2,
    question: "Quelle technologie ai-je principalement utilisée lors de mon stage chez MyPetsLife ?",
    options: [
      "Java",
      "Python",
      "Express.js et React.js",
      "C++"
    ],
    correctAnswer: 2,
    explanation: "J'ai principalement utilisé Express.js et React.js lors de mon stage chez MyPetsLife pour développer leur plateforme."
  },
  {
    id: 5,
    level: 3,
    question: "Quel est mon dernier titre RNCP obtenu ?",
    options: [
      "Niveau 5 - Développeur Web",
      "Niveau 6 - Concepteur Développeur",
      "Niveau 7 - Expert IT",
      "Niveau 4 - Technicien"
    ],
    correctAnswer: 1,
    explanation: "J'ai obtenu le titre RNCP niveau 5 - Développeur Web, attestant de mes compétences en développement d'applications web."
  },
  {
    id: 6,
    level: 3,
    question: "Sur quel projet significatif ai-je travaillé en 2023 ?",
    options: [
      "Application mobile de livraison",
      "Logiciel de supervision Sam Tool Supervisor",
      "Système de gestion de contenu",
      "Plateforme e-commerce"
    ],
    correctAnswer: 1,
    explanation: "En 2023, j'ai travaillé sur le logiciel de supervision Sam Tool Supervisor pour suivre l'activité de contenants automatisés intelligents."
  },
  {
    id: 7,
    level: 4,
    question: "Quelle technologie principale que j'ai utilisée pour ICY - Solution de gestion d'intervention ?",
    options: [
      "React",
      "Vue.js",
      "Angular",
      "Svelte"
    ],
    correctAnswer: 2,
    explanation: "Pour ICY, j'ai principalement utilisé Angular, avec TypeScript et PWA pour développer une solution robuste et performante."
  },
  {
    id: 8,
    level: 4,
    question: "Quelle compétence technique ai-je particulièrement développée dans mes projets récents ?",
    options: [
      "IA et machine learning",
      "Développement d'applications PWA",
      "Blockchain",
      "Réalité virtuelle"
    ],
    correctAnswer: 1,
    explanation: "Ces dernières années, j'ai particulièrement développé mes compétences en développement d'applications PWA, comme en témoigne le projet ICY."
  }
];

const QuizSection: FC<QuizSectionProps> = ({ progress, saveProgress }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);

  const handleQuizAnswer = (correct: boolean) => {
    const updatedQuizHistory = [...progress.quizHistory, { level: progress.currentLevel + 1, correct }];
    saveProgress({ quizHistory: updatedQuizHistory });
    
    if (correct) {
      const questionsForLevel = questions.filter(q => q.level === progress.currentLevel + 1);
      const correctAnswersForLevel = progress.quizHistory.filter(q => q.level === progress.currentLevel + 1 && q.correct).length + 1;
      
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
            setCurrentQuestionId(nextLevelQuestions[0].id);
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
          !progress.quizHistory.some(history => history.level === q.level && history.correct && questions.find(qu => qu.id === currentQuestionId)?.id === q.id)
        );
        
        if (remainingQuestions.length > 0) {
          const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
          setCurrentQuestionId(randomQuestion.id);
        }
      }
    } else {
      toast.error("Ce n'est pas la bonne réponse, essayez encore !", {
        duration: 3000
      });
    }
    setShowQuiz(false);
  };

  const startQuiz = () => {
    if (progress.currentLevel < 4) {
      const levelQuestions = questions.filter(q => q.level === progress.currentLevel + 1);
      const answeredCorrectly = progress.quizHistory
        .filter(h => h.correct)
        .map(h => {
          const question = questions.find(q => q.level === h.level && q.id === currentQuestionId);
          return question ? question.id : -1;
        });
      
      const unansweredQuestions = levelQuestions.filter(q => !answeredCorrectly.includes(q.id));
      
      if (unansweredQuestions.length > 0) {
        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
        setCurrentQuestionId(randomQuestion.id);
      } else if (levelQuestions.length > 0) {
        const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
        setCurrentQuestionId(randomQuestion.id);
      }
      
      setShowQuiz(true);
    }
  };

  return (
    <>
      {showQuiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          onAnswer={handleQuizAnswer}
          currentQuestion={questions.find(q => q.id === currentQuestionId) || questions[0]}
          level={progress.currentLevel + 1}
        />
      )}
    </>
  );
};

export default QuizSection;
export { questions };
