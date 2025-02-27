
import { FC, useEffect, useState } from 'react';
import { ArrowDown, Trophy, Award, Star, Rocket, BookOpen, Code, Briefcase, Heart } from 'lucide-react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import { toast } from 'sonner';
import QuizModal from '@/components/QuizModal';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
  level: number;
  component: React.ReactNode;
  icon: React.ReactNode;
  description: string;
}

const sections: Section[] = [
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

// Questions étendues pour chaque niveau
const questions = [
  // Niveau 1
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
  // Niveau 2
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
  // Niveau 3
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
  // Niveau 4
  {
    id: 7,
    level: 4,
    question: "Quelle est la technologie principale que j'ai utilisée pour ICY - Solution de gestion d'intervention ?",
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const Home: FC = () => {
  const { user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [unlockedYears, setUnlockedYears] = useState<string[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'profile_created',
      title: 'Premier Pas',
      description: 'Création de votre profil et connexion réussie',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      unlocked: false
    },
    {
      id: 'level_1',
      title: 'Apprenti',
      description: 'Vous avez débloqué le niveau 1',
      icon: <Star className="w-5 h-5 text-blue-500" />,
      unlocked: false
    },
    {
      id: 'level_2',
      title: 'Développeur',
      description: 'Vous avez débloqué le niveau 2',
      icon: <Code className="w-5 h-5 text-green-500" />,
      unlocked: false
    },
    {
      id: 'level_3',
      title: 'Expert',
      description: 'Vous avez débloqué le niveau 3',
      icon: <Award className="w-5 h-5 text-purple-500" />,
      unlocked: false
    },
    {
      id: 'all_sections',
      title: 'Explorateur',
      description: 'Vous avez visité toutes les sections du portfolio',
      icon: <Rocket className="w-5 h-5 text-red-500" />,
      unlocked: false
    }
  ]);
  const [levelProgress, setLevelProgress] = useState(0);
  const [quizHistory, setQuizHistory] = useState<{level: number, correct: boolean}[]>([]);
  const navigate = useNavigate();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  // Recalculer la progression pour le niveau actuel
  useEffect(() => {
    const correctAnswers = quizHistory.filter(q => q.level === currentLevel + 1 && q.correct).length;
    const totalQuestions = questions.filter(q => q.level === currentLevel + 1).length;
    
    if (totalQuestions > 0) {
      const progress = Math.min(100, (correctAnswers / totalQuestions) * 100);
      setLevelProgress(progress);
    } else {
      setLevelProgress(0);
    }

    // Mettre à jour les succès débloqués
    if (user) {
      const updatedAchievements = [...achievements];
      
      // Premier pas
      updatedAchievements[0].unlocked = true;
      
      // Niveaux débloqués
      if (currentLevel >= 1) updatedAchievements[1].unlocked = true;
      if (currentLevel >= 2) updatedAchievements[2].unlocked = true;
      if (currentLevel >= 3) updatedAchievements[3].unlocked = true;
      
      // Explorateur
      const visitedAllSections = currentLevel >= 4;
      updatedAchievements[4].unlocked = visitedAllSections;
      
      setAchievements(updatedAchievements);
    }
  }, [currentLevel, quizHistory, user]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effet pour enregistrer les actions de l'utilisateur
  useEffect(() => {
    if (user) {
      console.log("Session utilisateur enregistrée:", {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        level: currentLevel,
        unlockedYears,
        achievements: achievements.filter(a => a.unlocked).map(a => a.id),
        timestamp: new Date().toISOString()
      });
    }
  }, [user, currentLevel, unlockedYears, achievements]);

  const handleQuizAnswer = (correct: boolean) => {
    // Enregistrer la réponse au quiz
    setQuizHistory(prev => [...prev, { level: currentLevel + 1, correct }]);
    
    if (correct) {
      // Si nous avons répondu correctement à suffisamment de questions de ce niveau
      const questionsForLevel = questions.filter(q => q.level === currentLevel + 1);
      const correctAnswersForLevel = quizHistory.filter(q => q.level === currentLevel + 1 && q.correct).length + 1; // +1 pour la réponse actuelle
      
      if (correctAnswersForLevel >= Math.ceil(questionsForLevel.length / 2)) {
        // Passage au niveau suivant si on a répondu correctement à au moins 50% des questions
        const nextLevel = currentLevel + 1;
        if (nextLevel <= 4) {
          setCurrentLevel(nextLevel);
          
          // Mise à jour des années débloquées
          if (nextLevel === 1) {
            setUnlockedYears(["2018", "2019"]);
            toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2019`, {
              duration: 5000,
              icon: <Trophy className="w-5 h-5 text-yellow-500" />
            });
          } else if (nextLevel === 2) {
            setUnlockedYears(["2018", "2019", "2020", "2021"]);
            toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2021`, {
              duration: 5000,
              icon: <Star className="w-5 h-5 text-blue-500" />
            });
          } else if (nextLevel === 3) {
            setUnlockedYears(["2018", "2019", "2020", "2021", "2022"]);
            toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès aux années 2018-2022`, {
              duration: 5000,
              icon: <Code className="w-5 h-5 text-green-500" />
            });
          } else {
            setUnlockedYears(["2018", "2019", "2020", "2021", "2022", "2023", "2024"]);
            toast.success(`Niveau ${nextLevel} débloqué ! Vous avez accès à toutes les années`, {
              duration: 5000,
              icon: <Award className="w-5 h-5 text-purple-500" />
            });
          }
          
          // Trouver la prochaine question disponible pour le nouveau niveau
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
        
        // Passer à la question suivante du même niveau
        const remainingQuestions = questions.filter(q => 
          q.level === currentLevel + 1 && 
          !quizHistory.some(history => history.level === q.level && history.correct && questions.find(qu => qu.id === currentQuestionId)?.id === q.id)
        );
        
        if (remainingQuestions.length > 0) {
          // Prendre une question aléatoire parmi celles restantes
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
    if (currentLevel < 4) {
      // Trouver une question du niveau actuel + 1 qui n'a pas encore été répondue correctement
      const levelQuestions = questions.filter(q => q.level === currentLevel + 1);
      const answeredCorrectly = quizHistory
        .filter(h => h.correct)
        .map(h => {
          const question = questions.find(q => q.level === h.level && q.id === currentQuestionId);
          return question ? question.id : -1;
        });
      
      const unansweredQuestions = levelQuestions.filter(q => !answeredCorrectly.includes(q.id));
      
      if (unansweredQuestions.length > 0) {
        // Prendre une question aléatoire parmi celles non répondues
        const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
        setCurrentQuestionId(randomQuestion.id);
      } else if (levelQuestions.length > 0) {
        // Si toutes les questions ont été répondues, prendre une question aléatoire
        const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
        setCurrentQuestionId(randomQuestion.id);
      }
      
      setShowQuiz(true);
    }
  };

  const goToLabs = () => {
    navigate('/labs');
  };

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
                  Niveau {currentLevel} / 4
                </p>
                {currentLevel < 4 && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(levelProgress)}% vers le niveau {currentLevel + 1}
                  </Badge>
                )}
              </div>
              {currentLevel < 4 && (
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
              Niveau {currentLevel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {unlockedYears.length} / 7 Années
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
            {user && currentLevel < 4 && (
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
            {currentLevel >= 3 && (
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

      {/* Carte des sections débloquées */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Votre progression</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className={`border rounded-lg p-6 transition-all duration-500 ${
                currentLevel >= section.level 
                  ? 'bg-card hover:shadow-md cursor-pointer' 
                  : 'opacity-40 filter blur-[1px] pointer-events-none bg-gray-100 dark:bg-gray-800'
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${
                  currentLevel >= section.level ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">Niveau {section.level}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{section.description}</p>
              {currentLevel < section.level && (
                <Badge variant="outline" className="mt-4">
                  Débloqué au niveau {section.level}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Succès débloqués */}
      {user && (
        <div className="bg-secondary/20 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Succès débloqués</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 transition-all ${
                    achievement.unlocked 
                      ? 'bg-card hover:shadow-md' 
                      : 'opacity-50 bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      {achievement.icon}
                    </div>
                    <h3 className="font-medium">{achievement.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sections principales */}
      {sections.map((section) => (
        currentLevel >= section.level && section.component && (
          <section 
            key={section.id} 
            id={section.id} 
            className={`py-20 transition-all duration-500 ${
              currentLevel < section.level ? 'opacity-30 filter blur-sm pointer-events-none' : 'opacity-100'
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
          level={currentLevel + 1}
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

// Fonction utilitaire pour faire défiler jusqu'à une section
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default Home;
