
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "@/types/course";

// Helper function to convert Clerk ID to a UUID-compatible format if needed
const formatUserId = (userId: string): string => {
  // If it already looks like a UUID, return it as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  
  // For Clerk IDs (starting with 'user_'), hash them to create a deterministic UUID
  // This is a simple implementation using a hash function
  if (userId.startsWith('user_')) {
    // We'll use a simple hash and format it as UUID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Create a deterministic UUID-like string from the hash
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-4${hashStr.slice(12, 15)}-a${hashStr.slice(15, 18)}-${Date.now().toString(16).slice(0, 12)}`;
  }
  
  return userId; // Return as is for other formats
};

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
