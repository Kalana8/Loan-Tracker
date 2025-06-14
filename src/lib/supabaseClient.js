import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yktgocjkdyuehklxgfco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdGdvY2prZHl1ZWhrbHhnZmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTE1MzQsImV4cCI6MjA2NDk2NzUzNH0.aIRQLIK3NuKcy8e6d9BkRhYhurfGYrpS8o7s22W-4aw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);