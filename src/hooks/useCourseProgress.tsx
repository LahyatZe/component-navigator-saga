
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Course, UserProgress } from '@/types/course';

export const useCourseProgress = (courseId?: string) => {
  const { user, isSignedIn } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = () => {
      if (!isSignedIn || !user || !courseId) {
        setIsLoading(false);
        return;
      }

      const userId = user.id;
      const savedProgress = localStorage.getItem(`course_progress_${userId}_${courseId}`);
      
      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress) as UserProgress;
          setProgress(parsedProgress);
        } catch (error) {
          console.error("Erreur lors du chargement de la progression:", error);
        }
      } else {
        // Initialiser une nouvelle progression pour ce cours
        const newProgress: UserProgress = {
          userId: userId,
          courseId: courseId,
          completedLessons: [],
          completedExercises: [],
          currentLesson: '', // Sera défini plus tard avec la première leçon
          startedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
          completionPercentage: 0
        };
        setProgress(newProgress);
        saveProgressToStorage(newProgress);
      }
      
      setIsLoading(false);
    };

    loadProgress();
  }, [isSignedIn, user, courseId]);

  const saveProgressToStorage = (progressData: UserProgress) => {
    if (!isSignedIn || !user) return;
    
    const userId = user.id;
    localStorage.setItem(
      `course_progress_${userId}_${progressData.courseId}`,
      JSON.stringify(progressData)
    );
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
    
    // Vérifier si la leçon existe dans le cours
    const lessonExists = course.modules.some(module => 
      module.lessons.some(lesson => lesson.id === lessonId)
    );
    
    if (!lessonExists) {
      console.error(`Leçon ${lessonId} non trouvée dans le cours ${course.id}`);
      return;
    }
    
    // Ajouter la leçon aux leçons complétées si elle n'y est pas déjà
    if (!progress.completedLessons.includes(lessonId)) {
      const completedLessons = [...progress.completedLessons, lessonId];
      
      // Calculer le nouveau pourcentage de progression
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
    
    // Vérifier si l'exercice existe dans le cours
    const exerciseExists = course.modules.some(module => 
      module.lessons.some(lesson => 
        lesson.exercises.some(exercise => exercise.id === exerciseId)
      )
    );
    
    if (!exerciseExists) {
      console.error(`Exercice ${exerciseId} non trouvé dans le cours ${course.id}`);
      return;
    }
    
    // Ajouter l'exercice aux exercices complétés s'il n'y est pas déjà
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
