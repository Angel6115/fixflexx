// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bvpxvhqggjqatflmackr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cHh2aHFnZ2pxYXRmbG1hY2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODU0MjAsImV4cCI6MjA1OTM2MTQyMH0.HpmoQ8uikfrb3uo9Mssx543jy75xdFLUZLrN-w-QaPk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
