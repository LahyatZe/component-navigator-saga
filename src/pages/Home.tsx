
import { FC, useEffect, useState } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import AdminPanel from '@/components/AdminPanel';
import { GuestHero, UserHero } from '@/components/HeroSection';
import UserProgress, { sections } from '@/components/UserProgress';
import { useProgressPersistence } from '@/hooks/useProgressPersistence';
import { useAchievements } from '@/hooks/useAchievements';

const ADMIN_EMAIL = "sohaib.zeghouani@gmail.com";

const Home: FC = () => {
  const { progress, saveProgress, isLoaded } = useProgressPersistence();
  const [scrollY, setScrollY] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const { achievements } = useAchievements(progress, user?.id);

  const isDataReady = isUserLoaded && (isSignedIn ? isLoaded : true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          isAdmin={isAdmin}
          showAdminPanel={() => setShowAdminPanel(true)}
          scrollY={scrollY}
          achievements={achievements}
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
