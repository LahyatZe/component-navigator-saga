
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Course, UserProgress } from '@/types/course';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import { useProgressStorage } from '@/hooks/useProgressStorage';
import { useProgressUpdater } from '@/hooks/useProgressUpdater';

export const useCourseProgress = (courseId?: string) => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(true);
  
  // Check Supabase session status
  const { supaSessioChecked } = useSupabaseSession();
  
  // Handle progress storage and retrieval
  const { loadProgress, saveProgressToStorage } = useProgressStorage(
    user?.id,
    courseId,
    setProgress,
    setIsLoading
  );
  
  // Handle progress updates with debouncing
  const { updateProgress } = useProgressUpdater(progress, saveProgressToStorage);
  
  // Load progress on initial component mount
  useEffect(() => {
    if (initialLoadRef.current && supaSessioChecked) {
      loadProgress();
      initialLoadRef.current = false;
    }
  }, [isSignedIn, user, courseId, supaSessioChecked, loadProgress]);
  
  // Helper functions to update specific aspects of progress
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
