
import { useCallback } from 'react';
import { UserProgress } from '@/types/course';
import { getUserProgress, saveUserProgress } from '@/services/course';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProgressStorage = (
  userId?: string,
  courseId?: string,
  setProgress?: (progress: UserProgress) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const loadProgress = useCallback(async () => {
    if (!courseId || !userId || !setProgress || !setIsLoading) {
      if (setIsLoading) setIsLoading(false);
      return;
    }

    try {
      console.log("Loading course progress for user:", userId, "and course:", courseId);
      
      // Check Supabase session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
      }
      
      // Log session status to help with debugging
      console.log("Supabase session status when loading progress:", session ? "Active" : "None");
      
      // Try to get progress from Supabase if we have a session
      if (session) {
        try {
          const progressData = await getUserProgress(userId, courseId);
          
          if (progressData) {
            // Set progress data retrieved from database
            console.log("Retrieved progress data from Supabase:", progressData);
            setProgress(progressData);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error loading progress from Supabase:", error);
          // Continue to localStorage fallback
        }
      } else {
        console.log("No active Supabase session, using localStorage only");
      }
      
      // Fallback to localStorage if Supabase fails or returns no data
      const savedProgress = localStorage.getItem(`course_progress_${userId}_${courseId}`);
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress) as UserProgress;
          setProgress(parsedProgress);
          console.log("Loaded progress from localStorage as fallback");
        } catch (parseError) {
          console.error("Error parsing progress from localStorage:", parseError);
          initializeNewProgress(userId, courseId, setProgress);
        }
      } else {
        // If no progress in localStorage, create a new one
        initializeNewProgress(userId, courseId, setProgress);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, courseId, setProgress, setIsLoading]);

  const initializeNewProgress = (
    userId: string, 
    courseId: string,
    setProgressFn: (progress: UserProgress) => void
  ) => {
    console.log("No existing progress found, initializing new progress");
    const newProgress: UserProgress = {
      userId: userId,
      courseId: courseId,
      completedLessons: [],
      completedExercises: [],
      currentLesson: '', // Will be defined later with the first lesson
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completionPercentage: 0,
      quizScores: {},
      certificateIssued: false,
      notes: {},
      bookmarks: [],
      usedHints: {}, // Ensure this property exists
      cvDownloaded: false,
      unlockedYears: [],
      currentLevel: 0, // Ensure this property exists
      achievements: [] // Ensure this property exists
    };
    setProgressFn(newProgress);
  };

  const saveProgressToStorage = async (progressData: UserProgress) => {
    if (!userId) return;
    
    try {
      console.log("Saving progress to storage:", progressData);
      
      // Always save to localStorage as backup first
      localStorage.setItem(
        `course_progress_${progressData.userId}_${progressData.courseId}`,
        JSON.stringify(progressData)
      );
      
      // Check if we have an active Supabase session before trying to save
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
      }
      
      // Log session status to help with debugging
      console.log("Supabase session status when saving progress:", session ? "Active" : "None");
      
      // Then try to save to Supabase if we have a session
      if (session) {
        try {
          await saveUserProgress(progressData);
          console.log("Progress saved successfully to Supabase");
        } catch (error) {
          console.error("Error saving to Supabase, using localStorage only:", error);
          // We've already saved to localStorage as a backup, so we're good
        }
      } else {
        console.log("No active Supabase session, saved to localStorage only");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  return { loadProgress, saveProgressToStorage };
};
