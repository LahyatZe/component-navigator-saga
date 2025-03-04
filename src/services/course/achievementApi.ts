
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "@/types/course";
import { formatUserId } from "@/utils/formatUserId";

// Get achievements for a user
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  console.log("Getting achievements for user:", userId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(userId);
  console.log("Formatted user ID for database lookup:", formattedUserId);
  
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievement_id(*)
      `)
      .eq('user_id', formattedUserId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      throw new Error(error.message);
    }

    console.log("Achievement data retrieved from database:", data);

    return data.map(item => ({
      id: item.achievement.id,
      title: item.achievement.title,
      description: item.achievement.description,
      icon: item.achievement.icon,
      // Cast condition to the specific union type
      condition: item.achievement.condition as 'course_completion' | 'exercise_streak' | 'quiz_score' | 'first_login' | 'community_participation',
      progress: item.progress,
      isUnlocked: item.is_unlocked,
      unlockedAt: item.unlocked_at
    }));
  } catch (error) {
    console.error('Error in getUserAchievements:', error);
    throw error;
  }
};
