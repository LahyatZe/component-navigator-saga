
import { FC } from 'react';
import { ArrowDown, Trophy, Award, Star, Rocket, BookOpen, Heart, Briefcase, Code } from 'lucide-react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { UserProgress } from '@/hooks/useProgressPersistence';
import { scrollToSection } from './ScrollToSection';

interface HeroSectionProps {
  progress: UserProgress;
  levelProgress: number;
  isAdmin: boolean;
  startQuiz: () => void;
  showAdminPanel: () => void;
  scrollY: number;
  achievements: any[];
}

// Component for non-authenticated users
export const GuestHero: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background text-center px-4 py-20">
      <Badge variant="outline" className="mb-4">Portfolio interactif</Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Bienvenue sur Mon Portfolio
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Connectez-vous pour progresser dans cette aventure interactive et découvrir l'ensemble de mon parcours.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <Trophy className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Système de progression</h3>
          <p className="text-muted-foreground">Débloquez du contenu en répondant aux quiz et en explorant le portfolio</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <Award className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Badges et succès</h3>
          <p className="text-muted-foreground">Collectionnez des badges et des succès en interagissant avec le contenu</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <Rocket className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Contenu exclusif</h3>
          <p className="text-muted-foreground">Accédez à du contenu exclusif en progressant dans les niveaux</p>
        </div>
      </div>
      
      <div className="mt-12">
        <ArrowDown className="w-8 h-8 mx-auto animate-bounce text-primary" />
        <p className="text-sm text-muted-foreground">Découvrez le contenu de base en défilant</p>
      </div>
    </div>
  );
};

// Component for authenticated users
export const UserHero: FC<HeroSectionProps> = ({ 
  progress, 
  levelProgress, 
  isAdmin, 
  startQuiz, 
  showAdminPanel, 
  scrollY,
  achievements
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const goToLabs = () => {
    navigate('/labs');
  };

  return (
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
              onClick={showAdminPanel}
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
  );
};
