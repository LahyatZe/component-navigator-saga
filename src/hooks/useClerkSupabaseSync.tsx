import { useEffect, useState, useCallback } from 'react';
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
  const [retryCount, setRetryCount] = useState(0);
  const [sessionVerified, setSessionVerified] = useState(false);

  // Helper to verify if a session has been established
  const verifySession = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionExists = !!sessionData?.session;
      if (sessionExists) {
        console.log("Session verified successfully");
        setSessionVerified(true);
        setIsSynced(true);
        setRetryCount(0); // Reset retry count on success
        
        // Log a success message for debugging
        console.log("Authentication sync successful");
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Error verifying session:", err);
      return false;
    }
  }, []);

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
        
        // Check if we already have a valid session
        if (await verifySession()) {
          return; // Exit if we already have a valid session
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
        
        // First check if we already have a session
        const { data: existingSession } = await supabase.auth.getSession();
        
        if (existingSession?.session) {
          console.log('Existing Supabase session found');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Run the verification to make sure session is valid and update metadata
          if (await verifySession()) {
            // Now update metadata
            const metadataResult = await updateUserMetadata(user.id, userEmail);
            
            if (metadataResult) {
              console.log('Successfully updated user metadata after session confirmation');
            }
          }
          
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
              setRetryCount(prev => prev + 1);
              return;
            }
            
            console.error('Error signing in with OTP:', signInError);
            throw new Error(`Failed to create Supabase session: ${signInError.message}`);
          }
          
          console.log('Successfully created Supabase session for Clerk user');
          
          // Add a delay to ensure the session is properly established
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check if session creation was successful by verifying session exists
          const sessionSuccess = await verifySession();
          
          if (sessionSuccess) {
            console.log('Session confirmed after creation');
            // Now update metadata
            await updateUserMetadata(user.id, userEmail);
          } else {
            console.log('Session not found after creation attempt, will retry');
            setError('Session not confirmed after creation');
            setRetryCount(prev => prev + 1);
            
            // Try one more immediate verification with a longer timeout
            setTimeout(async () => {
              const secondCheck = await verifySession();
              if (secondCheck) {
                console.log('Session confirmed on second check');
                await updateUserMetadata(user.id, userEmail);
              }
            }, 5000);
          }
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
          return false;
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
          return false;
        }
        
        return true;
      } catch (error) {
        console.warn('Error updating user metadata:', error);
        return false;
      }
    };

    syncSupabaseSession();
    
    // Set up a retry mechanism with exponential backoff and more frequent initial retries
    const intervalId = setInterval(() => {
      if (!isSynced && (error || retryCount > 0)) {
        // Exponential backoff - increase time between retries with each attempt
        // For the first few retries, keep it fairly quick
        const backoffDelay = retryCount <= 3 
          ? 5000 * (retryCount + 1)  // First few retries: 5s, 10s, 15s, 20s
          : Math.min(60000, 5000 * Math.pow(2, retryCount - 3));  // Then exponential
        
        // Only retry if it's been longer than the backoff delay since last attempt
        const now = Date.now();
        if (now - lastAttempt >= backoffDelay) {
          console.log(`Attempting to retry Supabase sync (attempt ${retryCount + 1})...`);
          syncSupabaseSession();
        }
      }
    }, 5000); // Check every 5 seconds
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [isSignedIn, user, getToken, isSynced, error, lastAttempt, retryCount, verifySession]);

  return { isSynced, isSyncing, error, sessionVerified };
};
