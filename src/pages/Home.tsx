
import { FC, useEffect, useState } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import AdminPanel from '@/components/AdminPanel';
import { GuestHero, UserHero } from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';
import UserProgress, { sections } from '@/components/UserProgress';
import { useProgressPersistence } from '@/hooks/useProgressPersistence';
import { useAchievements } from '@/hooks/useAchievements';
import { questions } from '@/data/quizQuestions';
import { UserProgress as CourseUserProgress } from '@/types/course';

const ADMIN_EMAIL = "sohaib.zeghouani@gmail.com";

const Home: FC = () => {
  const { progress, saveProgress, isLoaded } = useProgressPersistence();
  const [scrollY, setScrollY] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);
  
  const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { achievements } = useAchievements(progress, user?.id);

  const isDataReady = isUserLoaded && (isSignedIn ? isLoaded : true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Start quiz function that will be passed to UserHero
  const startQuizDirectly = () => {
    if (window && (window as any).__startQuiz) {
      (window as any).__startQuiz();
    }
  };

  // Convert progress to the type expected by QuizSection
  const mapProgressToQuizSection = (): CourseUserProgress => {
    return {
      userId: user?.id || '',
      courseId: 'portfolio-course',
      completedLessons: [],
      completedExercises: [],
      currentLesson: '',
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completionPercentage: 0,
      quizScores: {},
      certificateIssued: false,
      notes: {},
      bookmarks: [],
      usedHints: {},
      cvDownloaded: progress.cvDownloaded || false,
      quizHistory: progress.quizHistory || [],
      unlockedYears: progress.unlockedYears || [],
      currentLevel: progress.currentLevel || 0
    };
  };

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
      <SignedIn>
        <UserHero 
          progress={progress}
          levelProgress={levelProgress}
          isAdmin={isAdmin}
          startQuiz={startQuizDirectly}
          showAdminPanel={() => setShowAdminPanel(true)}
          scrollY={scrollY}
          achievements={achievements}
        />
        <QuizSection 
          progress={mapProgressToQuizSection()} 
          questions={questions}
          saveProgress={(updates) => {
            // Map the updates back to our progress type
            const progressUpdates = {
              currentLevel: updates.currentLevel,
              unlockedYears: updates.unlockedYears,
              quizHistory: updates.quizHistory,
            };
            saveProgress(progressUpdates);
          }}
        />
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
