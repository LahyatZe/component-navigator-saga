
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
const PROGRESS_TABLE = 'user_portfolio_progress';

// Helper function to convert Clerk ID to a UUID-compatible format if needed
const formatUserId = (userId: string): string => {
  // If it already looks like a UUID, return it as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  
  // For Clerk IDs (starting with 'user_'), hash them to create a deterministic UUID
  if (userId.startsWith('user_')) {
    // We'll use a simple hash and format it as UUID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Create a deterministic UUID-like string from the hash
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-4${hashStr.slice(12, 15)}-a${hashStr.slice(15, 18)}-${Date.now().toString(16).slice(0, 12)}`;
  }
  
  return userId; // Return as is for other formats
};

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
        const formattedUserId = formatUserId(userId);
        
        try {
          console.log("Fetching progress for user ID:", userId);
          console.log("Formatted user ID for database:", formattedUserId);
          
          // Try to get progress from Supabase first
          const { data, error } = await supabase
            .from(PROGRESS_TABLE)
            .select('*')
            .eq('user_id', formattedUserId)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching progress:", error);
            loadFromLocalStorage(userId);
            return;
          }
          
          if (data) {
            console.log("Progress data from Supabase:", data);
            // Convert Supabase data to our UserProgress type
            // Ensure quiz_history is properly parsed as an array of objects
            let parsedQuizHistory: {level: number, correct: boolean}[] = [];
            
            if (data.quiz_history) {
              // Handle quiz_history which may come as a string or JSON
              try {
                // If it's already a JSON object or array
                if (Array.isArray(data.quiz_history)) {
                  parsedQuizHistory = data.quiz_history as {level: number, correct: boolean}[];
                } else if (typeof data.quiz_history === 'string') {
                  // If it's a JSON string that needs parsing
                  parsedQuizHistory = JSON.parse(data.quiz_history);
                } else if (typeof data.quiz_history === 'object') {
                  // If it's already an object but not an array
                  console.warn("Quiz history is an object but not an array, using empty array instead");
                  parsedQuizHistory = [];
                }
              } catch (e) {
                console.error("Error parsing quiz history:", e);
                parsedQuizHistory = [];
              }
            }
            
            const userProgress: UserProgress = {
              currentLevel: data.current_level || 0,
              unlockedYears: data.unlocked_years || [],
              quizHistory: parsedQuizHistory,
              achievements: data.achievements || [],
              lastUpdated: data.last_updated || new Date().toISOString()
            };
            
            setProgress(userProgress);
            console.log("Progress loaded from Supabase for user:", userId);
          } else {
            // No data in Supabase, try localStorage as fallback
            loadFromLocalStorage(userId);
          }
        } catch (error) {
          console.error("Error loading progress:", error);
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
          console.log("Progress loaded from localStorage for user:", userId);
        } catch (error) {
          console.error("Error parsing progress:", error);
        }
      }
    };
    
    loadUserProgress();
  }, [isSignedIn, user]);

  // Save progress to Supabase and localStorage as backup
  const saveProgress = async (newProgress: Partial<UserProgress>) => {
    if (isSignedIn && user) {
      const userId = user.id;
      const formattedUserId = formatUserId(userId);
      
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
        console.log("Saving progress for user:", userId);
        console.log("Formatted user ID for database:", formattedUserId);
        
        // Use upsert with onConflict to handle both insert and update cases
        const { error } = await supabase
          .from(PROGRESS_TABLE)
          .upsert({
            user_id: formattedUserId,
            current_level: updatedProgress.currentLevel,
            unlocked_years: updatedProgress.unlockedYears,
            quiz_history: updatedProgress.quizHistory,
            achievements: updatedProgress.achievements,
            last_updated: updatedProgress.lastUpdated
          }, {
            onConflict: 'user_id'
          });
          
        if (error) {
          console.error("Error saving to Supabase:", error);
          toast.error("Error saving your progress");
        } else {
          console.log("Progress saved to Supabase for user:", userId);
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
      
      // Record statistics
      console.log("Statistics updated:", {
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
