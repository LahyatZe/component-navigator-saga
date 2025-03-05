
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
        } else if (session) {
          console.log("Supabase session found:", session.user.id);
        } else {
          console.log("No Supabase session found");
        }
        
        setSupaSessionChecked(true);
      } catch (error) {
        console.error("Error checking Supabase session:", error);
        setSupaSessionChecked(true); // Mark as checked even on error so we continue
      }
    };
    
    checkSupabaseSession();

    // Set up session listener to update state when session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Supabase auth state changed:", event);
        setHasSupabaseSession(!!session);
        
        if (event === 'SIGNED_IN') {
          console.log("Supabase session established");
        } else if (event === 'SIGNED_OUT') {
          console.log("Supabase session ended");
        }
      }
    );
    
    // Set up periodic checks for session status when signed in with Clerk
    // This helps detect when Supabase session becomes available after rate limiting
    let intervalId;
    if (isSignedIn && !hasSupabaseSession) {
      intervalId = setInterval(checkSupabaseSession, 30000); // Check every 30 seconds
    }
    
    return () => {
      subscription?.unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, hasSupabaseSession]);

  return { supaSessioChecked, hasSupabaseSession };
};
