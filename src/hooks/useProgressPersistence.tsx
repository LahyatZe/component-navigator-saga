
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export interface UserProgress {
  currentLevel: number;
  unlockedYears: string[];
  quizHistory: {level: number, correct: boolean}[];
  achievements: string[];
  lastUpdated: string;
}

export const useProgressPersistence = () => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress>({
    currentLevel: 0,
    unlockedYears: [],
    quizHistory: [],
    achievements: [],
    lastUpdated: new Date().toISOString()
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Chargement de la progression depuis localStorage
  useEffect(() => {
    // Initialiser isLoaded à false lors du premier rendu ou lorsque l'état de connexion change
    if (!isLoaded) {
      setIsLoaded(false);
    }
    
    if (isSignedIn && user) {
      const userId = user.id;
      const savedProgress = localStorage.getItem(`portfolio_progress_${userId}`);
      
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress) as UserProgress;
          setProgress(parsedProgress);
          console.log("Progression chargée pour l'utilisateur:", userId);
        } catch (error) {
          console.error("Erreur lors du chargement de la progression:", error);
        }
      }
      
      setIsLoaded(true);
    } else if (isSignedIn === false) {
      // L'utilisateur n'est définitivement pas connecté
      setIsLoaded(true);
    }
  }, [isSignedIn, user]);

  // Sauvegarde de la progression
  const saveProgress = (newProgress: Partial<UserProgress>) => {
    if (isSignedIn && user) {
      const userId = user.id;
      const updatedProgress = {
        ...progress,
        ...newProgress,
        lastUpdated: new Date().toISOString()
      };
      
      setProgress(updatedProgress);
      
      localStorage.setItem(
        `portfolio_progress_${userId}`, 
        JSON.stringify(updatedProgress)
      );
      
      console.log("Progression sauvegardée pour l'utilisateur:", userId);
      
      // Enregistrement des statistiques
      console.log("Statistiques mises à jour:", {
        userId: userId,
        email: user.primaryEmailAddress?.emailAddress,
        level: updatedProgress.currentLevel,
        unlockedYears: updatedProgress.unlockedYears,
        achievements: updatedProgress.achievements,
        timestamp: updatedProgress.lastUpdated
      });
    }
  };

  return { progress, saveProgress, isLoaded };
};
