import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vkxvnteaflgvtkeuuhcr.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreHZudGVhZmxndnRrZWV1aGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMzExODYsImV4cCI6MjEwNzYwNzE4Nn0.iAB115-uvfEqbbE2I0W0U5ERbbbH5XGGzAS0NXnra9E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);