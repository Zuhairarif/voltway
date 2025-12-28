
import { createClient } from '@supabase/supabase-js';

// Credentials provided by the user
const supabaseUrl = 'https://ffnqaipezhzlthuiwdvd.supabase.co';
const supabaseAnonKey = 'sb_publishable_UlO-JdyBvofuA5fAKuBW0g_4Qt_e7JL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  // Since we hardcoded valid credentials, this now always returns true
  return !!supabaseUrl && !!supabaseAnonKey && !supabaseUrl.includes('your-project-url');
};
