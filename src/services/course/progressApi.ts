
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
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Check if we have a valid session
    if (sessionError || !sessionData.session) {
      console.log("No authenticated session found, creating anonymous session");
      const { error: signInError } = await supabase.auth.signInAnonymously();
      
      if (signInError) {
        console.error("Failed to create anonymous session:", signInError);
        throw new Error("Authentication failed: " + signInError.message);
      }
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Get the updated session after potential sign-in
    const { data: updatedSession } = await supabase.auth.getSession();
    console.log("Session status:", updatedSession.session ? "Authenticated" : "Not authenticated");
    
    if (!updatedSession.session) {
      throw new Error("Failed to establish authenticated session");
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
        bookmarks: progress.bookmarks
      }, {
        onConflict: 'user_id,course_id'
      });

    if (error) {
      console.error('Error saving progress:', error);
      throw error;
    }

    console.log("Progress saved successfully");
    return data;
  } catch (error) {
    console.error('Error saving progress:', error);
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
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Check if we have a valid session
    if (sessionError || !sessionData.session) {
      console.log("No authenticated session found, creating anonymous session");
      const { error: signInError } = await supabase.auth.signInAnonymously();
      
      if (signInError) {
        console.error("Failed to create anonymous session:", signInError);
        throw new Error("Authentication failed: " + signInError.message);
      }
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
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
      bookmarks: data.bookmarks || []
    };
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    throw error;
  }
};
