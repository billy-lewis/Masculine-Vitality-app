import { createClient } from '@supabase/supabase-js';

const isDevelopment = import.meta.env.MODE === 'development';

const supabaseUrl = isDevelopment 
  ? import.meta.env.VITE_SUPABASE_URL 
  : 'https://rbrglofyrsjdghvdbliq.supabase.co';

const supabaseAnonKey = isDevelopment
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJicmdsb2Z5cnNqZGdodmRibGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTYxODAsImV4cCI6MjA2MDA5MjE4MH0.b767B7peaXwLlhnvEK4E8fDSPFtqY7Ee7ZazByZPMXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);