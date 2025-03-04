
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProgress {
  currentLevel: number;
  unlockedYears: string[];
  quizHistory: {level: number, correct: boolean}[];
  achievements: string[];
  lastUpdated: string;
}

// Table name in Supabase for user progress
const PROGRESS_TABLE = 'user_progress';

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

  // Load progress from Supabase or fallback to localStorage
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(false);
    }
    
    const loadUserProgress = async () => {
      if (isSignedIn && user) {
        const userId = user.id;
        
        try {
          // Try to get progress from Supabase first
          const { data, error } = await supabase
            .from(PROGRESS_TABLE)
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (error) {
            console.error("Erreur lors de la récupération de la progression:", error);
            loadFromLocalStorage(userId);
            return;
          }
          
          if (data) {
            // Convert Supabase data to our UserProgress type
            const userProgress: UserProgress = {
              currentLevel: data.current_level || 0,
              unlockedYears: data.unlocked_years || [],
              quizHistory: data.quiz_history || [],
              achievements: data.achievements || [],
              lastUpdated: data.last_updated || new Date().toISOString()
            };
            
            setProgress(userProgress);
            console.log("Progression chargée depuis Supabase pour l'utilisateur:", userId);
          } else {
            // No data in Supabase, try localStorage as fallback
            loadFromLocalStorage(userId);
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la progression:", error);
          loadFromLocalStorage(userId);
        }
        
        setIsLoaded(true);
      } else if (isSignedIn === false) {
        // User is definitely not signed in
        setIsLoaded(true);
      }
    };
    
    const loadFromLocalStorage = (userId: string) => {
      const savedProgress = localStorage.getItem(`portfolio_progress_${userId}`);
      
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress) as UserProgress;
          setProgress(parsedProgress);
          console.log("Progression chargée depuis localStorage pour l'utilisateur:", userId);
        } catch (error) {
          console.error("Erreur lors du parsing de la progression:", error);
        }
      }
    };
    
    loadUserProgress();
  }, [isSignedIn, user]);

  // Save progress to Supabase and localStorage as backup
  const saveProgress = async (newProgress: Partial<UserProgress>) => {
    if (isSignedIn && user) {
      const userId = user.id;
      const updatedProgress = {
        ...progress,
        ...newProgress,
        lastUpdated: new Date().toISOString()
      };
      
      setProgress(updatedProgress);
      
      // Save to localStorage as a backup
      localStorage.setItem(
        `portfolio_progress_${userId}`, 
        JSON.stringify(updatedProgress)
      );
      
      // Save to Supabase
      try {
        const { error } = await supabase
          .from(PROGRESS_TABLE)
          .upsert({
            user_id: userId,
            current_level: updatedProgress.currentLevel,
            unlocked_years: updatedProgress.unlockedYears,
            quiz_history: updatedProgress.quizHistory,
            achievements: updatedProgress.achievements,
            last_updated: updatedProgress.lastUpdated
          })
          .select();
          
        if (error) {
          console.error("Erreur lors de la sauvegarde dans Supabase:", error);
          toast.error("Erreur lors de la sauvegarde de votre progression");
        } else {
          console.log("Progression sauvegardée dans Supabase pour l'utilisateur:", userId);
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la progression:", error);
      }
      
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
