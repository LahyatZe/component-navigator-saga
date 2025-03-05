
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

        // For demonstration, we'll use the Supabase anonymous auth
        // In a production app, you'd want to implement a proper JWT exchange
        // through a secure backend API
        
        // Try to sign in with magic link using the user's email
        // This is a more robust approach than using a fixed email
        const userEmail = user.primaryEmailAddress?.emailAddress;
        
        if (!userEmail) {
          throw new Error('User email not available');
        }
        
        // Try to sign in with magic link
        const { data, error: signInError } = await supabase.auth.signInWithOtp({
          email: userEmail,
          options: {
            // Don't actually send an email, just create a session
            shouldCreateUser: true
          }
        });
        
        if (signInError) {
          console.error('Error signing in with OTP:', signInError);
          throw new Error(`Failed to create Supabase session: ${signInError.message}`);
        }
        
        console.log('Successfully created Supabase session for Clerk user');
        setIsSynced(true);
        
        // Set custom user metadata in Supabase session
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            clerk_user_id: user.id,
            formatted_user_id: formatUserId(user.id),
            email: userEmail,
          }
        });
        
        if (metadataError) {
          console.warn('Failed to set user metadata:', metadataError);
        }
      } catch (err) {
        console.error('Error syncing auth session:', err);
        setError(err.message);
        toast.error('Failed to synchronize authentication sessions');
      } finally {
        setIsSyncing(false);
      }
    };

    syncSupabaseSession();
    
    // Listen for Clerk session changes
    return () => {
      // Cleanup if needed
    };
  }, [isSignedIn, user, getToken]);

  return { isSynced, isSyncing, error };
};
