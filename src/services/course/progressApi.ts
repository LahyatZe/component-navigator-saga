
import { supabase } from "@/integrations/supabase/client";
import { UserProgress } from "@/types/course";
import { formatUserId } from "@/utils/formatUserId";

// Save course progress for a user
export const saveUserProgress = async (progress: UserProgress) => {
  console.log("Saving course progress for user:", progress.userId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(progress.userId);
  console.log("Formatted user ID for database:", formattedUserId);
  
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: formattedUserId,
      course_id: progress.courseId,
      completed_lessons: progress.completedLessons,
      completed_exercises: progress.completedExercises,
      current_lesson: progress.currentLesson,
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
    throw new Error(error.message);
  }

  return data;
};

// Get user progress for a course
export const getUserProgress = async (userId: string, courseId: string): Promise<UserProgress | null> => {
  console.log("Getting course progress for user:", userId, "and course:", courseId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(userId);
  console.log("Formatted user ID for database lookup:", formattedUserId);
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', formattedUserId)
      .eq('course_id', courseId)
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

    // Transform the data to match our UserProgress type with proper type handling
    return {
      userId: userId, // Keep the original user ID in the returned object
      courseId: data.course_id,
      completedLessons: data.completed_lessons || [],
      completedExercises: data.completed_exercises || [],
      currentLesson: data.current_lesson || '',
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
