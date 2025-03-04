
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Course, UserProgress } from '@/types/course';
import { getUserProgress, saveUserProgress } from '@/services/course';
import { toast } from 'sonner';
import { formatStringToUuid } from '@/utils/formatUserId';
import { supabase } from '@/integrations/supabase/client';

export const useCourseProgress = (courseId?: string) => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);
  const [supabaseAuthChecked, setSupabaseAuthChecked] = useState(false);

  // Check Supabase auth status
  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        console.log("Checking Supabase authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking Supabase session:", error);
        }
        
        console.log("Supabase session status:", session ? "Authenticated" : "Not authenticated");
        setSupabaseAuthChecked(true);
      } catch (error) {
        console.error("Error checking Supabase auth:", error);
        setSupabaseAuthChecked(true); // Mark as checked even on error so we continue
      }
    };
    
    checkSupabaseAuth();
    
    // Clean up function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      if (!courseId || !isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = user.id;
        console.log("Loading course progress for user:", userId, "and course:", courseId);
        
        // Try to get progress from Supabase
        const progressData = await getUserProgress(userId, courseId);
        
        if (progressData) {
          // Set progress data retrieved from database
          console.log("Retrieved progress data:", progressData);
          setProgress(progressData);
        } else {
          // Initialize a new progress for this course
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
            bookmarks: []
          };
          setProgress(newProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        
        // Fallback to localStorage if database fails
        const savedProgress = localStorage.getItem(`course_progress_${user.id}_${courseId}`);
        if (savedProgress) {
          try {
            const parsedProgress = JSON.parse(savedProgress) as UserProgress;
            setProgress(parsedProgress);
            console.log("Loaded progress from localStorage as fallback");
          } catch (error) {
            console.error("Error parsing progress from localStorage:", error);
          }
        } else {
          // If no progress in localStorage, create a new one
          console.log("No existing progress in localStorage, initializing new progress");
          const newProgress: UserProgress = {
            userId: user.id,
            courseId: courseId,
            completedLessons: [],
            completedExercises: [],
            currentLesson: '',
            startedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            completionPercentage: 0,
            quizScores: {},
            certificateIssued: false,
            notes: {},
            bookmarks: []
          };
          setProgress(newProgress);
        }
      } finally {
        setIsLoading(false);
        initialLoadRef.current = false;
      }
    };

    // Only load progress when component mounts and we've checked Supabase auth
    if (initialLoadRef.current && supabaseAuthChecked) {
      loadProgress();
    }
  }, [isSignedIn, user, courseId, supabaseAuthChecked]);

  const saveProgressToStorage = async (progressData: UserProgress) => {
    if (!isSignedIn || !user) return;
    
    try {
      console.log("Saving progress to storage:", progressData);
      
      // Save to localStorage as backup first
      localStorage.setItem(
        `course_progress_${progressData.userId}_${progressData.courseId}`,
        JSON.stringify(progressData)
      );
      
      // Then try to save to Supabase
      try {
        await saveUserProgress(progressData);
        console.log("Progress saved successfully to Supabase");
      } catch (error) {
        console.error("Error saving to Supabase, using localStorage only:", error);
        // We've already saved to localStorage as a backup
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      // We've already saved to localStorage as a backup
    }
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    if (!progress) return;
    
    // Don't update if nothing has changed
    let hasChanged = false;
    for (const key in updates) {
      if (JSON.stringify(updates[key]) !== JSON.stringify(progress[key])) {
        hasChanged = true;
        break;
      }
    }
    
    if (!hasChanged) {
      console.log("No changes detected, skipping update");
      return;
    }
    
    const updatedProgress = {
      ...progress,
      ...updates,
      lastAccessedAt: new Date().toISOString()
    };
    
    setProgress(updatedProgress);
    
    // Clear any existing timeout to prevent multiple saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce the save operation to prevent excessive API calls
    saveTimeoutRef.current = setTimeout(() => {
      saveProgressToStorage(updatedProgress);
      saveTimeoutRef.current = null;
    }, 2000); // 2 second debounce
  };

  const markLessonAsCompleted = (lessonId: string, course: Course) => {
    if (!progress) return;
    
    // Verify if the lesson exists in the course
    const lessonExists = course.modules.some(module => 
      module.lessons.some(lesson => lesson.id === lessonId)
    );
    
    if (!lessonExists) {
      console.error(`Leçon ${lessonId} non trouvée dans le cours ${course.id}`);
      return;
    }
    
    // Add the lesson to completed lessons if it's not already there
    if (!progress.completedLessons.includes(lessonId)) {
      const completedLessons = [...progress.completedLessons, lessonId];
      
      // Calculate the new completion percentage
      const totalLessons = course.modules.reduce(
        (total, module) => total + module.lessons.length, 
        0
      );
      
      const completionPercentage = Math.round(
        (completedLessons.length / totalLessons) * 100
      );
      
      updateProgress({
        completedLessons,
        completionPercentage
      });
    }
  };

  const markExerciseAsCompleted = (exerciseId: string, course: Course) => {
    if (!progress) return;
    
    // Verify if the exercise exists in the course
    const exerciseExists = course.modules.some(module => 
      module.lessons.some(lesson => 
        lesson.exercises.some(exercise => exercise.id === exerciseId)
      )
    );
    
    if (!exerciseExists) {
      console.error(`Exercice ${exerciseId} non trouvé dans le cours ${course.id}`);
      return;
    }
    
    // Add the exercise to completed exercises if it's not already there
    if (!progress.completedExercises.includes(exerciseId)) {
      const completedExercises = [...progress.completedExercises, exerciseId];
      updateProgress({ completedExercises });
    }
  };

  const setCurrentLesson = (lessonId: string) => {
    if (!progress || progress.currentLesson === lessonId) return;
    updateProgress({ currentLesson: lessonId });
  };

  return {
    progress,
    isLoading,
    markLessonAsCompleted,
    markExerciseAsCompleted,
    setCurrentLesson,
    updateProgress
  };
};
