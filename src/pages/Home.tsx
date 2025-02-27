
import { FC, useEffect, useState } from 'react';
import { ArrowDown, Trophy, Award, Star } from 'lucide-react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import { toast } from 'sonner';
import QuizModal from '@/components/QuizModal';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Section {
  id: string;
  title: string;
  level: number;
  component: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'hero',
    title: 'Accueil',
    level: 0,
    component: null
  },
  {
    id: 'timeline',
    title: 'Parcours',
    level: 1,
    component: null
  },
  {
    id: 'about',
    title: 'À propos',
    level: 2,
    component: <About />
  },
  {
    id: 'projects',
    title: 'Projets',
    level: 3,
    component: <Projects />
  },
  {
    id: 'contact',
    title: 'Contact',
    level: 4,
    component: <Contact />
  }
];

const ADMIN_EMAIL = "sohaib.zeghouani@gmail.com";

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
    correctAnswer: 1
  },
  {
    id: 2,
    level: 2,
    question: "Dans quelle entreprise ai-je effectué mon alternance ?",
    options: [
      "Sam Outillage",
      "My Pets Life",
      "Capgemini Technologies & Services",
      "IGSI Calliope"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    level: 3,
    question: "Quel est mon dernier titre RNCP obtenu ?",
    options: [
      "Niveau 5 - Développeur Web",
      "Niveau 6 - Concepteur Développeur",
      "Niveau 7 - Expert IT",
      "Niveau 4 - Technicien"
    ],
    correctAnswer: 1
  }
];

const Home: FC = () => {
  const { user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [unlockedYears, setUnlockedYears] = useState<string[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      const nextLevel = currentLevel + 1;
      if (nextLevel <= 4) {
        setCurrentLevel(nextLevel);
        setCurrentQuestionId(nextLevel);
        
        if (nextLevel === 1) {
          setUnlockedYears(["2018", "2019"]);
        } else if (nextLevel === 2) {
          setUnlockedYears(["2018", "2019", "2020", "2021"]);
        } else if (nextLevel === 3) {
          setUnlockedYears(["2018", "2019", "2020", "2021", "2022"]);
        } else {
          setUnlockedYears(["2018", "2019", "2020", "2021", "2022", "2023", "2024"]);
        }
        
        toast.success(`Niveau ${nextLevel} débloqué !`);
      }
    } else {
      toast.error("Ce n'est pas la bonne réponse, essayez encore !");
    }
    setShowQuiz(false);
  };

  const startQuiz = () => {
    if (currentLevel < 4) {
      setShowQuiz(true);
    }
  };

  return (
    <div className="min-h-screen">
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background relative overflow-hidden"
        style={{ backgroundPosition: `50% ${scrollY * 0.5}px` }}
      >
        <div className="text-center px-4 relative z-10">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            {user ? `Bienvenue ${user.firstName}` : 'Bienvenue sur Mon Portfolio'}
          </h1>
          
          <SignedIn>
            <p className="text-xl text-muted-foreground mb-8">
              Niveau actuel : {currentLevel} / 4
            </p>
          </SignedIn>
          <SignedOut>
            <p className="text-xl text-muted-foreground mb-8">
              Connectez-vous pour progresser
            </p>
          </SignedOut>

          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Niveau {currentLevel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {unlockedYears.length} / 7 Années
            </Badge>
            {isAdmin && (
              <Badge 
                variant="default" 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowAdminPanel(true)}
              >
                <Award className="w-4 h-4" />
                Administration
              </Badge>
            )}
          </div>

          {user && currentLevel < 4 && (
            <Button onClick={startQuiz} className="mb-8">
              Passer au niveau suivant
            </Button>
          )}
        </div>
      </div>

      {sections.map((section, index) => (
        currentLevel >= section.level && (
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

export default Home;
