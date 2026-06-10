import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vkobzwrqydcypugliutf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrb2J6d3JxeWRjeXB1Z2xpdXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTA3MTUsImV4cCI6MjA5NjY4NjcxNX0.5vsWySpWyg1C1r6CjQzjf2Z0dRyHfG7YU-a_lPx2du4'

export const supabase = createClient(supabaseUrl, supabaseKey)
