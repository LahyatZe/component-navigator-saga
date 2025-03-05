
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

export const useSupabaseSession = () => {
  const [supaSessioChecked, setSupaSessionChecked] = useState(false);
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const checkSupabaseSession = async () => {
      try {
        console.log("Checking Supabase session status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking Supabase session:", error);
        }
        
        setHasSupabaseSession(!!session);
        
        if (!session && isSignedIn) {
          console.log("Clerk is signed in but no Supabase session found. This may indicate a sync issue.");
        } else {
          console.log("Supabase session status:", session ? "Authenticated" : "Not authenticated");
        }
        
        setSupaSessionChecked(true);
      } catch (error) {
        console.error("Error checking Supabase session:", error);
        setSupaSessionChecked(true); // Mark as checked even on error so we continue
      }
    };
    
    checkSupabaseSession();

    // Set up periodic checks for session status when signed in with Clerk
    // This helps detect when Supabase session becomes available after rate limiting
    let intervalId;
    if (isSignedIn && !hasSupabaseSession) {
      intervalId = setInterval(checkSupabaseSession, 30000); // Check every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, hasSupabaseSession]);

  return { supaSessioChecked, hasSupabaseSession };
};
