import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_ANON_KEY;

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

if (!supabaseAdmin) {
    if (process.env.NODE_ENV === 'production') {
        console.error("CRITICAL: Supabase credentials missing in production!");
    }
}
