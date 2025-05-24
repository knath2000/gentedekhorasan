// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gnlbiezqgkugzzlswfrf.supabase.co';
// IMPORTANT: In a real application, store your anon key in environment variables
// and do not commit it directly to your repository.
// For this exercise, we are using it directly as provided.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdubGJpZXpxZ2t1Z3p6bHN3ZnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDkwNzksImV4cCI6MjA2MjM4NTA3OX0.wZxKs7C5arPNjmf8useU6POWNmCJ03Ummff__ePz1lk';

if (!supabaseUrl) {
  console.error('Supabase URL is not defined. Please check your environment variables.');
}
if (!supabaseAnonKey) {
  console.error('Supabase anonymous key is not defined. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example of how to handle potential errors during client creation, though createClient itself doesn't throw for bad keys immediately.
// Connection errors usually happen on the first query.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Client could not be initialized.");
}