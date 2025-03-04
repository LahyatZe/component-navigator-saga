
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Course, UserProgress } from '@/types/course';
import { getUserProgress, saveUserProgress } from '@/services/course';
import { toast } from 'sonner';

export const useCourseProgress = (courseId?: string) => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!isSignedIn || !user || !courseId) {
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
          await saveProgressToStorage(newProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
        toast.error("Error loading your progress");
        
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
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [isSignedIn, user, courseId]);

  const saveProgressToStorage = async (progressData: UserProgress) => {
    if (!isSignedIn || !user) return;
    
    try {
      console.log("Saving progress to storage:", progressData);
      // Save to Supabase
      await saveUserProgress(progressData);
      
      // Also cache in localStorage as backup
      localStorage.setItem(
        `course_progress_${progressData.userId}_${progressData.courseId}`,
        JSON.stringify(progressData)
      );
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Error saving your progress");
      
      // Fallback to localStorage only
      localStorage.setItem(
        `course_progress_${progressData.userId}_${progressData.courseId}`,
        JSON.stringify(progressData)
      );
    }
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    if (!progress) return;
    
    const updatedProgress = {
      ...progress,
      ...updates,
      lastAccessedAt: new Date().toISOString()
    };
    
    setProgress(updatedProgress);
    saveProgressToStorage(updatedProgress);
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
    if (!progress) return;
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
