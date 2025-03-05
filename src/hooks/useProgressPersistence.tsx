
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { formatUserId } from '@/utils/formatUserId';

export interface UserProgress {
  unlockedYears: string[];
  achievements: string[];
  lastUpdated: string;
  cvDownloaded?: boolean;
  userId?: string;
  userEmail?: string;
  currentLevel?: number; // Added missing property
}

// Table name in Supabase for user progress
const PROGRESS_TABLE = 'user_portfolio_progress';

export const useProgressPersistence = () => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress>({
    unlockedYears: [],
    achievements: [],
    lastUpdated: new Date().toISOString(),
    currentLevel: 0 // Initialize with default value
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage
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
          
          // Try to get progress from localStorage
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
            userEmail: user?.primaryEmailAddress?.emailAddress,
            currentLevel: parsedProgress.currentLevel || 0 // Ensure currentLevel exists
          };
          setProgress(updatedProgress);
          console.log("Progress loaded from localStorage for user:", userId);
        } catch (error) {
          console.error("Error parsing progress:", error);
        }
      } else {
        // Initialize new progress
        setProgress({
          unlockedYears: [],
          achievements: [],
          lastUpdated: new Date().toISOString(),
          userId: userId,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          currentLevel: 0 // Initialize with default value
        });
      }
    };
    
    loadUserProgress();
  }, [isSignedIn, user, isLoaded]);

  // Save progress to localStorage
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
        
        // Save to localStorage
        localStorage.setItem(
          `portfolio_progress_${userId}`, 
          JSON.stringify(updatedProgress)
        );
        
        // Record statistics for debugging
        console.log("Statistics updated:", {
          userId: userId,
          email: user.primaryEmailAddress?.emailAddress,
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
