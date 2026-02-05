-- ==========================================
-- TOTAL SUPABASE SETUP FOR TRANSCRIPT 42 (SERVER-SIDE ONLY)
-- ==========================================

-- 1. City Data Table (Stats for the Map)
-- name is changed to campus and is the Primary Key
CREATE TABLE IF NOT EXISTS public.city_data (
    campus TEXT PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    value INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but NO public policies (Only accessible via service role / Admin)
ALTER TABLE public.city_data ENABLE ROW LEVEL SECURITY;

-- 2. PDF Generation Log Table (Audit trail)
CREATE TABLE IF NOT EXISTS public.pdf_gen_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id TEXT,
    transcript_type TEXT,
    json_path TEXT, -- filename in bucket
    pdf_path TEXT,  -- filename in bucket
    location TEXT   -- primary campus name
);

-- Enable RLS but NO public policies
ALTER TABLE public.pdf_gen_log ENABLE ROW LEVEL SECURITY;

-- 3. Usage Table (Individual user stats)
CREATE TABLE IF NOT EXISTS public.usage (
    user_id TEXT PRIMARY KEY,
    value INTEGER DEFAULT 1,
    campus TEXT,
    last_used TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but NO public policies
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- INITIAL DATA FOR CITIES as of 04/02/2026
-- ==========================================
INSERT INTO public.city_data (campus, lat, lng, value)
VALUES
    ('Berlin', 52.52, 13.405, 65),
    ('Heilbronn', 49.1427, 9.2109, 45),
    ('Malaga', 36.7213, -4.4214, 29),
    ('São Paulo', -23.559902, -46.697669, 15),
    ('Amsterdam', 52.3741881, 4.9156938, 12),
    ('Paris', 48.8566, 2.3522, 12),
    ('Tétouan', 35.5889, -5.3626, 8),
    ('Wolfsburg', 52.4227, 10.7865, 5),
    ('Beirut', 33.8938, 35.5018, 4),
    ('Madrid', 40.4168, -3.7038, 3),
    ('Brussels', 50.84635, 4.35515, 3),
    ('Le Havre', 49.4944, 0.1079, 3),
    ('Luxembourg', 49.49719, 5.98519, 3),
    ('Amman', 31.9454, 35.9284, 3),
    ('Barcelona', 41.3851, 2.1734, 3),
    ('Rabat', 34.0209, -6.8416, 2),
    ('Lyon', 45.780556, 4.749167, 2),
    ('Porto', 41.149102, -8.612968, 5),
    ('Urduliz', 43.38025, -2.960389, 1),
    ('Benguerir', 32.2622, -7.9511, 1),
    ('Bangkok', 13.72979, 100.77665, 1),
    ('Antananarivo', -18.88339, 47.51342, 1),
    ('Luanda', -8.84221, 13.26577, 1),
    ('Singapore', 1.341103, 103.957582, 1),
    ('Quebec', 46.8139, -71.208, 1),
    ('Rome', 41.9028, 12.4964, 1),
    ('Istanbul', 41.0967, 28.99595, 1),
    ('Khouribga', 32.8847, -6.9066, 1),
    ('Helsinki', 60.1807809, 24.9582435, 1),
    ('Warsaw', 52.23467, 20.97059, 1),
    ('Vienna', 48.24584, 16.37682, 1),
    ('Nice', 43.68338, 7.2028, 1)
ON CONFLICT (campus) DO UPDATE SET value = EXCLUDED.value;

-- 4. General Logs Table
CREATE TABLE IF NOT EXISTS public.logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    level TEXT DEFAULT 'info',
    service TEXT DEFAULT 'transcript42',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Note: Ensure you have a storage bucket named 'transcript' created 
-- via the Supabase Dashboard Storage section.
