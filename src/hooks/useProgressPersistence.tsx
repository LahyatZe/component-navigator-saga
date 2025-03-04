
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatUserId } from '@/utils/formatUserId';

export interface UserProgress {
  currentLevel: number;
  unlockedYears: string[];
  quizHistory: {level: number, correct: boolean}[];
  achievements: string[];
  lastUpdated: string;
  cvDownloaded?: boolean;
  usedHints?: Record<string, string[]>;
  userId?: string;
  userEmail?: string;
}

// Table name in Supabase for user progress
const PROGRESS_TABLE = 'user_portfolio_progress';

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
    if (isLoaded) {
      return;
    }
    
    const loadUserProgress = async () => {
      if (isSignedIn && user) {
        const userId = user.id;
        const formattedUserId = formatUserId(userId);
        
        try {
          console.log("Fetching progress for user ID:", userId);
          console.log("Formatted user ID for database:", formattedUserId);
          
          // Try to get progress from localStorage first as a fallback
          loadFromLocalStorage(userId);
          
          setIsLoaded(true);
        } catch (error) {
          console.error("Error loading progress:", error);
          loadFromLocalStorage(userId);
          setIsLoaded(true);
        }
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
          // Add userId and email to the progress object for statistics
          const updatedProgress = {
            ...parsedProgress,
            userId: userId,
            userEmail: user?.primaryEmailAddress?.emailAddress
          };
          setProgress(updatedProgress);
          console.log("Progress loaded from localStorage for user:", userId);
        } catch (error) {
          console.error("Error parsing progress:", error);
        }
      } else {
        // Initialize new progress
        setProgress({
          currentLevel: 0,
          unlockedYears: [],
          quizHistory: [],
          achievements: [],
          lastUpdated: new Date().toISOString(),
          userId: userId,
          userEmail: user?.primaryEmailAddress?.emailAddress
        });
      }
    };
    
    loadUserProgress();
  }, [isSignedIn, user, isLoaded]);

  // Save progress to localStorage only for now (due to RLS policy error with Supabase)
  const saveProgress = async (newProgress: Partial<UserProgress>) => {
    if (isSignedIn && user) {
      const userId = user.id;
      
      try {
        const updatedProgress = {
          ...progress,
          ...newProgress,
          lastUpdated: new Date().toISOString(),
          userId: userId,
          userEmail: user?.primaryEmailAddress?.emailAddress
        };
        
        setProgress(updatedProgress);
        
        // Save to localStorage as primary storage method
        localStorage.setItem(
          `portfolio_progress_${userId}`, 
          JSON.stringify(updatedProgress)
        );
        
        // Record statistics for debugging
        console.log("Statistics updated:", {
          userId: userId,
          email: user.primaryEmailAddress?.emailAddress,
          level: updatedProgress.currentLevel,
          unlockedYears: updatedProgress.unlockedYears,
          achievements: updatedProgress.achievements,
          timestamp: updatedProgress.lastUpdated
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  return { progress, saveProgress, isLoaded };
};
