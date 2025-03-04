
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
  popularity?: number; // score de popularité
  rating?: number; // note moyenne sur 5
  reviewCount?: number; // nombre d'avis
  updatedAt?: string; // date de dernière mise à jour
  tags?: string[]; // tags pour la recherche et le filtrage
  price?: number; // prix en euros (0 pour gratuit)
  discount?: number; // réduction en pourcentage
  featured?: boolean; // cours mis en avant
  language?: 'french' | 'english' | 'spanish' | 'german' | 'other';
  certificateAvailable?: boolean; // certification disponible
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string; // Description du module
  lessons: Lesson[];
  duration?: number; // Durée totale du module en minutes
  order?: number; // Ordre d'affichage du module
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // en minutes
  completed: boolean;
  exercises: Exercise[];
  videoUrl?: string; // URL de la vidéo associée
  resources?: Resource[]; // Ressources supplémentaires
  quiz?: Quiz[]; // Quiz de fin de leçon
  order?: number; // Ordre d'affichage de la leçon
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  codeTemplate?: string;
  solution?: string;
  completed: boolean;
  hints?: string[]; // indices pour aider l'étudiant
  testCases?: TestCase[]; // cas de test pour valider l'exercice
  points?: number; // points gagnés en complétant l'exercice
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'github' | 'documentation' | 'other';
  url: string;
  description?: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index de la bonne réponse
  explanation?: string; // explication de la réponse
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean; // si le test est visible par l'étudiant
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedExercises: string[];
  currentLesson: string;
  startedAt: string;
  lastAccessedAt: string;
  completionPercentage: number;
  quizScores: Record<string, number>;
  certificateIssued: boolean;
  notes: Record<string, string>;
  bookmarks: string[];
  usedHints?: Record<string, string[]>; // Added missing property
  cvDownloaded?: boolean; // Added missing property
  quizHistory?: import('@/types/quiz').QuizHistory[]; // Added missing property with import
  unlockedYears?: string[]; // Added missing property
  currentLevel?: number; // Added missing property
  achievements?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: 'course_completion' | 'exercise_streak' | 'quiz_score' | 'first_login' | 'community_participation';
  progress: number; // progression actuelle (0-100)
  isUnlocked: boolean;
  unlockedAt?: string; // Date de déverrouillage au format ISO
}

export interface QuizHistory {
  level: number;
  correct: boolean;
}
