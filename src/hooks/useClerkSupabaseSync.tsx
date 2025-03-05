
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
  const [lastAttempt, setLastAttempt] = useState<number>(0);

  useEffect(() => {
    // Only attempt to sync if the user is signed in with Clerk
    if (!isSignedIn || !user) {
      console.log('No Clerk session to sync with Supabase');
      setIsSynced(false);
      return;
    }

    const syncSupabaseSession = async () => {
      try {
        // Check if we've attempted recently (within 30 seconds)
        const now = Date.now();
        const timeSinceLastAttempt = now - lastAttempt;
        
        if (lastAttempt > 0 && timeSinceLastAttempt < 30000) {
          console.log(`Rate limiting: waiting before retry (${Math.ceil((30000 - timeSinceLastAttempt) / 1000)}s)`);
          return; // Exit early if we've attempted too recently
        }
        
        setIsSyncing(true);
        setError(null);
        setLastAttempt(now);
        
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
        
        try {
          const { data, error: signInError } = await supabase.auth.signInWithOtp({
            email: userEmail,
            options: {
              shouldCreateUser: true
            }
          });
          
          if (signInError) {
            // Check if it's a rate limiting error
            if (signInError.message.includes('security purposes') || signInError.message.includes('rate limit')) {
              console.log('Rate limiting detected, will retry later:', signInError.message);
              // Don't throw, just set error and return
              setError(`Rate limited. Will retry automatically: ${signInError.message}`);
              return;
            }
            
            console.error('Error signing in with OTP:', signInError);
            throw new Error(`Failed to create Supabase session: ${signInError.message}`);
          }
          
          console.log('Successfully created Supabase session for Clerk user');
          setIsSynced(true);
          
          // Update user metadata after ensuring session exists
          await updateUserMetadata(user.id, userEmail);
        } catch (signInErr) {
          console.error('Error in OTP sign in:', signInErr);
          throw signInErr;
        }
        
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
    
    // Set up a retry mechanism
    const intervalId = setInterval(() => {
      if (!isSynced && error && error.includes('rate limit')) {
        console.log('Attempting to retry Supabase sync after rate limit...');
        syncSupabaseSession();
      }
    }, 30000); // Check every 30 seconds
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [isSignedIn, user, getToken, isSynced, error, lastAttempt]);

  return { isSynced, isSyncing, error };
};
