import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uawazhciwlexzqkdemdl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2F6aGNpd2xleHpxa2RlbWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mjk4MzMsImV4cCI6MjA4ODQwNTgzM30.Wo0YqXLIuWvGl6JgV0FhanCNvSJJIrJdMPE5WMA7wK8'

export const supabase = createClient(supabaseUrl, supabaseKey)