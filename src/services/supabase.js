import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dtcegllzgflhuhdbllbr.supabase.co'
const supabaseKey = 'sb_publishable_gW5DeEfGvAa-4YnkYZZZNA_Z2Rs5gsu'

export const supabase = createClient(supabaseUrl, supabaseKey)
