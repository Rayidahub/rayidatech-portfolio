import { createClient } from '@supabase/supabase-js'

// TEMPORARY - Replace with your actual values
const supabaseUrl = 'https://grtvnrqzmbndbjljramm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydHZucnF6bWJuZGJqbGpyYW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODk5MjMsImV4cCI6MjA5NzM2NTkyM30.FLEqtXCFaYYjfglbvBN1GhIpN2K4jZQIHavoz1AxjK4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)