
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseSession = () => {
  const [supaSessioChecked, setSupaSessionChecked] = useState(false);

  useEffect(() => {
    const checkSupabaseSession = async () => {
      try {
        console.log("Checking Supabase session status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking Supabase session:", error);
        }
        
        console.log("Supabase session status:", session ? "Authenticated" : "Not authenticated");
        setSupaSessionChecked(true);
      } catch (error) {
        console.error("Error checking Supabase session:", error);
        setSupaSessionChecked(true); // Mark as checked even on error so we continue
      }
    };
    
    checkSupabaseSession();
  }, []);

  return { supaSessioChecked };
};
