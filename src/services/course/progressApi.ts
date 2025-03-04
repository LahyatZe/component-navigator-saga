import { supabase } from "@/integrations/supabase/client";
import { UserProgress } from "@/types/course";
import { formatUserId, formatStringToUuid } from "@/utils/formatUserId";

// Save course progress for a user
export const saveUserProgress = async (progress: UserProgress) => {
  console.log("Saving course progress for user:", progress.userId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(progress.userId);
  console.log("Formatted user ID for database:", formattedUserId);
  
  // Handle course ID - ensure it's a valid UUID
  let courseId = progress.courseId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId)) {
    // If courseId is not a UUID (e.g., it's a slug), we need to generate a deterministic UUID
    courseId = formatStringToUuid(courseId);
  }
  
  // Handle current lesson ID - ensure it's a valid UUID or null
  let currentLessonId = progress.currentLesson;
  if (currentLessonId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentLessonId)) {
    // Convert string lesson ID to UUID format
    currentLessonId = formatStringToUuid(currentLessonId);
  }

  // If currentLessonId is empty string, set it to null for database
  if (currentLessonId === '') {
    currentLessonId = null;
  }
  
  try {
    // Check if we have a session without trying to create one
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log("No authenticated session found, saving to localStorage only");
      return null; // Return early, caller will handle localStorage saving
    }
    
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: formattedUserId,
        course_id: courseId,
        completed_lessons: progress.completedLessons,
        completed_exercises: progress.completedExercises,
        current_lesson: currentLessonId,
        started_at: progress.startedAt,
        last_accessed_at: new Date().toISOString(),
        completion_percentage: progress.completionPercentage,
        quiz_scores: progress.quizScores,
        certificate_issued: progress.certificateIssued,
        notes: progress.notes,
        bookmarks: progress.bookmarks,
        used_hints: progress.usedHints || {},
        cv_downloaded: progress.cvDownloaded || false,
        quiz_history: progress.quizHistory || [],
        current_level: progress.currentLevel || 0,
        unlocked_years: progress.unlockedYears || []
      }, {
        onConflict: 'user_id,course_id'
      });

    if (error) {
      console.error('Error saving progress:', error);
      throw error;
    }

    console.log("Progress saved successfully to Supabase");
    return data;
  } catch (error) {
    console.error('Error saving progress:', error);
    // Rethrowing as a more descriptive error
    if (error.message && error.message.includes("session")) {
      throw new Error("No authenticated session available");
    }
    throw error;
  }
};

// Get user progress for a course
export const getUserProgress = async (userId: string, courseId: string): Promise<UserProgress | null> => {
  console.log("Getting course progress for user:", userId, "and course:", courseId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(userId);
  console.log("Formatted user ID for database lookup:", formattedUserId);
  
  try {
    // Check if we have a session without trying to create one
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log("No authenticated session found, using localStorage only");
      throw new Error("No authenticated session available");
    }
    
    // Check if courseId is a UUID, if not convert it
    let formattedCourseId = courseId;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId)) {
      // If courseId is not a UUID (e.g., it's a slug), we need to generate a deterministic UUID
      formattedCourseId = formatStringToUuid(courseId);
      console.log("Formatted course ID for database lookup:", formattedCourseId);
    }
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', formattedUserId)
      .eq('course_id', formattedCourseId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user progress:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.log("No progress data found for user", userId);
      return null;
    }

    console.log("Progress data retrieved from database:", data);

    // Get the original lesson ID from the UUID format if needed
    let currentLesson = data.current_lesson || '';
    
    // Transform the data to match our UserProgress type with proper type handling
    return {
      userId: userId, // Keep the original user ID in the returned object
      courseId: courseId, // Keep the original course ID in the returned object
      completedLessons: data.completed_lessons || [],
      completedExercises: data.completed_exercises || [],
      currentLesson: currentLesson,
      startedAt: data.started_at || new Date().toISOString(),
      lastAccessedAt: data.last_accessed_at || new Date().toISOString(),
      completionPercentage: data.completion_percentage || 0,
      // Ensure quiz_scores is properly cast to Record<string, number>
      quizScores: typeof data.quiz_scores === 'object' && data.quiz_scores !== null 
        ? data.quiz_scores as Record<string, number> 
        : {},
      certificateIssued: !!data.certificate_issued,
      // Ensure notes is properly cast to Record<string, string>
      notes: typeof data.notes === 'object' && data.notes !== null 
        ? data.notes as Record<string, string> 
        : {},
      bookmarks: data.bookmarks || [],
      usedHints: typeof data.used_hints === 'object' && data.used_hints !== null
        ? data.used_hints as Record<string, string[]>
        : {},
      cvDownloaded: !!data.cv_downloaded,
      quizHistory: Array.isArray(data.quiz_history) ? data.quiz_history : [],
      currentLevel: data.current_level || 0,
      unlockedYears: Array.isArray(data.unlocked_years) ? data.unlocked_years : []
    };
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    throw error;
  }
};
