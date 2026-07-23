
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hyqegxnljggorrgrecev.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cWVneG5samdnb3JyZ3JlY2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NzI2ODYsImV4cCI6MjEwMDI0ODY4Nn0.JO9xhAKUHmga7JdcOxTm-uKpiPBTzulYMMTwyOHdj5Y'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

