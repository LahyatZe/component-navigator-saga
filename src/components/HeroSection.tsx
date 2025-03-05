
import { FC } from 'react';
import { ArrowDown, Award, Star, Rocket, BookOpen, Heart, Briefcase, Code } from 'lucide-react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserProgress } from '@/hooks/useProgressPersistence';
import { scrollToSection } from './ScrollToSection';

interface HeroSectionProps {
  progress: UserProgress;
  isAdmin: boolean;
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
        Connectez-vous pour profiter d'une expérience interactive et découvrir l'ensemble de mon parcours.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <BookOpen className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Parcours professionnel</h3>
          <p className="text-muted-foreground">Découvrez mon parcours et mon évolution professionnelle</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <Award className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Réalisations</h3>
          <p className="text-muted-foreground">Explorez mes projets et réalisations professionnelles</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all">
          <Rocket className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Expertise technique</h3>
          <p className="text-muted-foreground">Consultez mes domaines d'expertise technique</p>
        </div>
      </div>
      
      <div className="mt-12">
        <ArrowDown className="w-8 h-8 mx-auto animate-bounce text-primary" />
        <p className="text-sm text-muted-foreground">Découvrez mon parcours en défilant</p>
      </div>
    </div>
  );
};

// Component for authenticated users
export const UserHero: FC<HeroSectionProps> = ({ 
  progress, 
  isAdmin, 
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
            <Badge variant="outline" className="text-xs">
              Portfolio Interactif
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Expériences
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Projets
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={goToLabs}
            className="flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Explorer mes Labs
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => scrollToSection("contact")}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Discuter d'opportunités
          </Button>
        </div>

        <div className="mt-12">
          <ArrowDown className="w-8 h-8 mx-auto animate-bounce text-primary" />
          <p className="text-sm text-muted-foreground">Découvrez mon parcours en défilant</p>
        </div>
      </div>
    </div>
  );
};
