
import { FC, useEffect, useState } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import AdminPanel from '@/components/AdminPanel';
import { GuestHero, UserHero } from '@/components/HeroSection';
import QuizSection, { questions } from '@/components/QuizSection';
import UserProgress, { sections } from '@/components/UserProgress';
import { useProgressPersistence } from '@/hooks/useProgressPersistence';
import { useAchievements } from '@/hooks/useAchievements';

const ADMIN_EMAIL = "sohaib.zeghouani@gmail.com";

const Home: FC = () => {
  const { progress, saveProgress, isLoaded } = useProgressPersistence();
  const [scrollY, setScrollY] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);
  
  const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { achievements } = useAchievements(progress, user?.id);

  // Affichage de chargement si les données ne sont pas encore chargées
  const isDataReady = isUserLoaded && (isSignedIn ? isLoaded : true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate level progress
  useEffect(() => {
    if (isLoaded && user) {
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

  // Affichage de chargement pendant que les données se chargent
  if (!isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Affichage différent selon que l'utilisateur est connecté ou non */}
      <SignedIn>
        <UserHero 
          progress={progress}
          levelProgress={levelProgress}
          isAdmin={isAdmin}
          startQuiz={() => {
            const quizSection = document.getElementById('quiz-section');
            if (quizSection) {
              const quizComponent = quizSection.querySelector('button');
              if (quizComponent) {
                quizComponent.click();
              }
            }
          }}
          showAdminPanel={() => setShowAdminPanel(true)}
          scrollY={scrollY}
          achievements={achievements}
        />
        <div id="quiz-section" className="hidden">
          <QuizSection 
            progress={progress} 
            questions={questions}
            saveProgress={saveProgress}
          />
        </div>
      </SignedIn>
      
      <SignedOut>
        <GuestHero />
      </SignedOut>

      <UserProgress 
        progress={progress}
        isSignedIn={!!isSignedIn}
        isLoaded={isLoaded}
        achievements={achievements}
      />

      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        >
          <div>Admin panel content</div>
        </AdminPanel>
      )}
    </div>
  );
};

export default Home;
