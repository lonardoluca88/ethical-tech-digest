
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from window.__SUPABASE_CLIENT__ which is set by Lovable
const supabaseData = (window as any).__SUPABASE_CLIENT__ || {};
const supabaseUrl = supabaseData.supabaseUrl || '';
const supabaseAnonKey = supabaseData.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found. Make sure Supabase is properly connected in Lovable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
