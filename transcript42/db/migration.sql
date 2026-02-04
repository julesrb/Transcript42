-- Migration to create the 'logs' table based on the provided sample
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS logs (
    idx BIGSERIAL PRIMARY KEY,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id TEXT,
    transcript_type TEXT,
    json_path TEXT, -- This stores the filename path in the 'transcript' bucket
    pdf_path TEXT, -- This stores the filename path in the 'transcript' bucket
    location TEXT, -- This stores the primary campus name (e.g., 'Berlin')
    location_id BIGINT -- This stores the 42 API campus ID
);

-- Note: Ensure you have a storage bucket named 'transcript' created 
-- via the Supabase Dashboard Storage section.
