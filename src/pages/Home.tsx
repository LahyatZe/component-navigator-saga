import { FC, useEffect, useState } from 'react';
import { ArrowDown, Trophy, Award, Star, Rocket, BookOpen, Heart, Briefcase, Code, Calendar, Mail, Moon, User } from 'lucide-react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import { toast } from 'sonner';
import QuizModal from '@/components/QuizModal';
import AdminPanel from '@/components/AdminPanel';
import Timeline from '@/components/Timeline';
import Achievements, { Achievement } from '@/components/Achievements';
import ProgressGrid from '@/components/ProgressGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useProgressPersistence } from '@/hooks/useProgressPersistence';

const questions = [
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

const timelineEvents = [
  {
    id: "timeline-1",
    year: "2018",
    title: "Baccalauréat ES",
    subtitle: "Lycée Jean Monnet, Saint-Étienne",
    description: "Obtention du baccalauréat économique et social avec mention, option mathématiques.",
    type: "education" as const
  },
  {
    id: "timeline-2",
    year: "2019",
    title: "Début d'études en informatique",
    subtitle: "IUT de Saint-Étienne",
    description: "Premier pas dans l'univers du développement informatique avec des projets pratiques en programmation.",
    type: "education" as const
  },
  {
    id: "timeline-3",
    year: "2020",
    title: "Stage chez MyPetsLife",
    subtitle: "Développeur web junior",
    description: "Développement d'une application web avec Express.js et React.js pour une startup de services pour animaux de compagnie.",
    type: "work" as const
  },
  {
    id: "timeline-4",
    year: "2021",
    title: "Alternance chez Capgemini",
    subtitle: "Développeur full-stack",
    description: "Participation au développement d'applications bancaires sécurisées avec des technologies modernes.",
    type: "work" as const
  },
  {
    id: "timeline-5",
    year: "2022",
    title: "Titre RNCP Niveau 5",
    subtitle: "Développeur Web",
    description: "Obtention du titre professionnel reconnu attestant de mes compétences en développement web moderne.",
    type: "certification" as const
  },
  {
    id: "timeline-6",
    year: "2023",
    title: "Projet Sam Tool Supervisor",
    subtitle: "Développeur principal",
    description: "Conception et développement d'un logiciel de supervision pour suivre l'activité de contenants automatisés intelligents.",
    type: "work" as const
  },
  {
    id: "timeline-7",
    year: "2024",
    title: "Projet ICY - Solution de gestion",
    subtitle: "Lead Developer",
    description: "Développement d'une application PWA avec Angular pour la gestion d'interventions techniques en milieu industriel.",
    type: "work" as const
  }
];

const sections = [
  {
    id: 'hero',
    title: 'Accueil',
    level: 0,
    component: null,
    icon: <Rocket className="w-6 h-6" />,
    description: "Bienvenue dans mon univers professionnel. C'est ici que commence votre aventure."
  },
  {
    id: 'timeline',
    title: 'Parcours',
    level: 1,
    component: null,
    icon: <BookOpen className="w-6 h-6" />,
    description: "Découvrez mon évolution professionnelle et académique à travers les années."
  },
  {
    id: 'about',
    title: 'À propos',
    level: 2,
    component: <About />,
    icon: <Heart className="w-6 h-6" />,
    description: "Apprenez-en plus sur ma personnalité, mes motivations et mes centres d'intérêt."
  },
  {
    id: 'projects',
    title: 'Projets',
    level: 3,
    component: <Projects />,
    icon: <Code className="w-6 h-6" />,
    description: "Explorez mes réalisations techniques et projets professionnels."
  },
  {
    id: 'contact',
    title: 'Contact',
    level: 4,
    component: <Contact />,
    icon: <Briefcase className="w-6 h-6" />,
    description: "Comment me contacter pour des opportunités ou des collaborations."
  }
];

const ADMIN_EMAIL = "sohaib.zeghouani@gmail.com";

const Home: FC = () => {
  const { progress, saveProgress, isLoaded } = useProgressPersistence();
  const [scrollY, setScrollY] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'profile_created',
      title: 'Premier Pas',
      description: 'Création de votre profil et connexion réussie',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      unlocked: false,
      rarity: 'common',
      category: 'progression'
    },
    {
      id: 'level_1',
      title: 'Apprenti',
      description: 'Vous avez débloqué le niveau 1',
      icon: <Star className="w-5 h-5 text-blue-500" />,
      unlocked: false,
      rarity: 'common',
      category: 'progression'
    },
    {
      id: 'level_2',
      title: 'Développeur',
      description: 'Vous avez débloqué le niveau 2',
      icon: <Code className="w-5 h-5 text-green-500" />,
      unlocked: false,
      rarity: 'uncommon',
      category: 'progression'
    },
    {
      id: 'level_3',
      title: 'Expert',
      description: 'Vous avez débloqué le niveau 3',
      icon: <Award className="w-5 h-5 text-purple-500" />,
      unlocked: false,
      rarity: 'rare',
      category: 'progression'
    },
    {
      id: 'level_4',
      title: 'Maître',
      description: 'Vous avez débloqué le niveau 4 (niveau maximum)',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      unlocked: false,
      rarity: 'epic',
      category: 'progression'
    },
    {
      id: 'all_sections',
      title: 'Explorateur',
      description: 'Vous avez visité toutes les sections du portfolio',
      icon: <Rocket className="w-5 h-5 text-red-500" />,
      unlocked: false,
      rarity: 'uncommon',
      category: 'exploration'
    }
  ]);
  const [levelProgress, setLevelProgress] = useState(0);
  const navigate = useNavigate();
  
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded && user) {
      const updatedAchievements = [...achievements];
      
      updatedAchievements[0].unlocked = true;
      
      if (progress.currentLevel >= 1) updatedAchievements[1].unlocked = true;
      if (progress.currentLevel >= 2) updatedAchievements[2].unlocked = true;
      if (progress.currentLevel >= 3) updatedAchievements[3].unlocked = true;
      
      const visitedAllSections = progress.currentLevel >= 4;
      updatedAchievements[4].unlocked = visitedAllSections;
      
      setAchievements(updatedAchievements);
      
      const correctAnswers = progress.quizHistory.filter(q => q.level === progress.currentLevel + 1 && q.correct).length;
      const totalQuestions = questions.filter(q => q.level === progress.currentLevel + 1).length;
      
      if (totalQuestions > 0) {
        const progressValue = Math.min(100, (correctAnswers / totalQuestions) * 100);
        setLevelProgress(progressValue);
      } else {
        setLevelProgress(0);
      }
    }
  }, [isLoaded, progress, user]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const goToLabs = () => {
    navigate('/labs');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background relative overflow-hidden"
        style={{ backgroundPosition: `50% ${scrollY * 0.5}px` }}
      >
        <div className="text-center px-4 relative z-10 max-w-4xl">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            {user ? `Bienvenue ${user.firstName}` : 'Bienvenue sur Mon Portfolio'}
          </h1>
          
          <SignedIn>
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-xl text-muted-foreground">
                  Niveau {progress.currentLevel} / 4
                </p>
                {progress.currentLevel < 4 && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(levelProgress)}% vers le niveau {progress.currentLevel + 1}
                  </Badge>
                )}
              </div>
              {progress.currentLevel < 4 && (
                <Progress value={levelProgress} className="w-full max-w-md mx-auto" />
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <p className="text-xl text-muted-foreground mb-8">
              Connectez-vous pour progresser dans cette aventure interactive
            </p>
          </SignedOut>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Niveau {progress.currentLevel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {progress.unlockedYears.length} / 7 Années
            </Badge>
            <Badge variant="default" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {achievements.filter(a => a.unlocked).length} / {achievements.length} Succès
            </Badge>
            {isAdmin && (
              <Badge 
                variant="destructive" 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowAdminPanel(true)}
              >
                <Award className="w-4 h-4" />
                Administration
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {user && progress.currentLevel < 4 && (
              <Button onClick={startQuiz} className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Répondre à un quiz
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={goToLabs}
              className="flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              Explorer mes Labs
            </Button>
            {progress.currentLevel >= 3 && (
              <Button 
                variant="secondary" 
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Discuter d'opportunités
              </Button>
            )}
          </div>

          <div className="mt-12">
            <ArrowDown className="w-8 h-8 mx-auto animate-bounce text-primary" />
            <p className="text-sm text-muted-foreground">Découvrez mon parcours en défilant</p>
          </div>
        </div>
      </div>

      {progress.currentLevel >= 1 && (
        <section id="timeline" className="py-16 bg-secondary/5">
          <Timeline events={timelineEvents} unlockedYears={progress.unlockedYears} />
        </section>
      )}

      <ProgressGrid sections={sections} currentLevel={progress.currentLevel} />

      {user && <Achievements achievements={achievements} />}

      {sections.map((section) => (
        section.id !== 'timeline' && (
          <section 
            key={section.id} 
            id={section.id} 
            className={`py-20 transition-all duration-500 ${
              progress.currentLevel < section.level ? 'opacity-30 filter blur-sm pointer-events-none' : 'opacity-100'
            }`}
          >
            {section.component}
          </section>
        )
      ))}

      {showQuiz && (
        <QuizModal
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          onAnswer={handleQuizAnswer}
          currentQuestion={questions.find(q => q.id === currentQuestionId) || questions[0]}
          level={progress.currentLevel + 1}
        />
      )}

      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default Home;
