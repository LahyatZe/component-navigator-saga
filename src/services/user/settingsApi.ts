
import { supabase } from "@/integrations/supabase/client";
import { formatUserId } from "@/utils/formatUserId";
import { toast } from "sonner";

export interface UserSettings {
  userId: string;
  fullName?: string;
  bio?: string;
  preferences: {
    darkMode: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  lastUpdated: string;
}

const SETTINGS_TABLE = 'user_settings';

// Get user settings from the database
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  console.log("Getting settings for user:", userId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(userId);
  console.log("Formatted user ID for database lookup:", formattedUserId);
  
  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .eq('user_id', formattedUserId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user settings:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.log("No settings found for user", userId);
      return null;
    }

    console.log("Settings data retrieved from database:", data);

    // Parse the preferences JSONB as our expected type
    const preferences = typeof data.preferences === 'string' 
      ? JSON.parse(data.preferences) 
      : data.preferences as {
          darkMode: boolean;
          emailNotifications: boolean;
          pushNotifications: boolean;
        };

    // Transform the data to match our UserSettings type
    return {
      userId: userId, // Keep the original user ID in the returned object
      fullName: data.full_name,
      bio: data.bio,
      preferences: {
        darkMode: preferences.darkMode ?? false,
        emailNotifications: preferences.emailNotifications ?? true,
        pushNotifications: preferences.pushNotifications ?? true,
      },
      lastUpdated: data.last_updated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    throw error;
  }
};

// Save user settings to the database
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  console.log("Saving settings for user:", settings.userId);
  
  // Format the user ID to be compatible with UUID
  const formattedUserId = formatUserId(settings.userId);
  console.log("Formatted user ID for database:", formattedUserId);
  
  try {
    // Ensure preferences is a proper object, not a string
    const preferences = typeof settings.preferences === 'string'
      ? JSON.parse(settings.preferences as unknown as string)
      : settings.preferences;
      
    const { error } = await supabase
      .from(SETTINGS_TABLE)
      .upsert({
        user_id: formattedUserId,
        full_name: settings.fullName,
        bio: settings.bio,
        preferences: preferences,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving user settings:', error);
      toast.error("Failed to save settings");
      throw new Error(error.message);
    }
    
    toast.success("Settings saved successfully");
    console.log("Settings saved successfully for user:", settings.userId);
  } catch (error) {
    console.error('Error in saveUserSettings:', error);
    throw error;
  }
};
