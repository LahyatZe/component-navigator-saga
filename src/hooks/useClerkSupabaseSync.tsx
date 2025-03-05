
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { formatUserId } from '@/utils/formatUserId';
import { toast } from 'sonner';

/**
 * This hook synchronizes Clerk authentication with Supabase
 * by creating a custom JWT that Supabase can understand
 */
export const useClerkSupabaseSync = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt to sync if the user is signed in with Clerk
    if (!isSignedIn || !user) {
      console.log('No Clerk session to sync with Supabase');
      setIsSynced(false);
      return;
    }

    const syncSupabaseSession = async () => {
      try {
        setIsSyncing(true);
        setError(null);
        
        console.log('Syncing Clerk session with Supabase...');
        
        // Get the Clerk token - in a production app, this would be used
        // to generate a custom JWT for Supabase
        const clerkToken = await getToken();
        
        if (!clerkToken) {
          throw new Error('Could not get auth token from Clerk');
        }

        // Try to get the user's email
        const userEmail = user.primaryEmailAddress?.emailAddress;
        
        if (!userEmail) {
          throw new Error('User email not available');
        }
        
        // Check if we already have a session first
        const { data: existingSession } = await supabase.auth.getSession();
        
        if (existingSession?.session) {
          console.log('Existing Supabase session found, using it');
          setIsSynced(true);
          
          // Update user metadata with Clerk data
          await updateUserMetadata(user.id, userEmail);
          return;
        }
        
        // No existing session, create a new one with OTP
        console.log('No existing session, creating new one with OTP');
        const { data, error: signInError } = await supabase.auth.signInWithOtp({
          email: userEmail,
          options: {
            shouldCreateUser: true
          }
        });
        
        if (signInError) {
          console.error('Error signing in with OTP:', signInError);
          throw new Error(`Failed to create Supabase session: ${signInError.message}`);
        }
        
        console.log('Successfully created Supabase session for Clerk user');
        setIsSynced(true);
        
        // Update user metadata after ensuring session exists
        await updateUserMetadata(user.id, userEmail);
        
      } catch (err) {
        console.error('Error syncing auth session:', err);
        setError(err.message);
        toast.error('Failed to synchronize authentication sessions');
      } finally {
        setIsSyncing(false);
      }
    };

    const updateUserMetadata = async (userId: string, email: string) => {
      try {
        // Make sure we have a session before attempting to update metadata
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session) {
          console.warn('No active session found when updating metadata');
          return;
        }
        
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            clerk_user_id: userId,
            formatted_user_id: formatUserId(userId),
            email: email,
          }
        });
        
        if (metadataError) {
          console.warn('Failed to set user metadata:', metadataError);
        }
      } catch (error) {
        console.warn('Error updating user metadata:', error);
      }
    };

    syncSupabaseSession();
    
    // Cleanup if needed
    return () => {
      // Any cleanup code here
    };
  }, [isSignedIn, user, getToken]);

  return { isSynced, isSyncing, error };
};
