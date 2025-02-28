
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'html' | 'css' | 'javascript' | 'python' | 'react' | 'other';
  duration: number; // en minutes
  modules: CourseModule[];
  prerequisites: string[];
  author: string;
  authorRole: string;
  imageUrl?: string;
  published: boolean;
  slug: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // en minutes
  completed: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  codeTemplate?: string;
  solution?: string;
  completed: boolean;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // IDs des leçons complétées
  completedExercises: string[]; // IDs des exercices complétés
  currentLesson: string; // ID de la leçon actuelle
  startedAt: string; // Date de début au format ISO
  lastAccessedAt: string; // Dernière date d'accès au format ISO
  completionPercentage: number; // Pourcentage de progression
}
