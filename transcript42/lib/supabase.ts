import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials missing. Logging will be disabled.");
}

// Singleton client - initialized once and reused
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
