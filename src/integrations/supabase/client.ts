// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mqcjdavlrhuthzheqtwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY2pkYXZscmh1dGh6aGVxdHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTU0NzcsImV4cCI6MjA1NjY3MTQ3N30.WnHsiGQ4D9qmD_kK0IvvD31XgwfNXBnYOguGZ-ak9Mw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);