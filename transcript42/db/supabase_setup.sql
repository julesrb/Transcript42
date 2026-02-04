-- Create the city_data table
CREATE TABLE IF NOT EXISTS public.city_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    value INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.city_data ENABLE ROW LEVEL SECURITY;

-- Insert initial data
INSERT INTO public.city_data (name, lat, lng, value)
VALUES
    ('Berlin', 52.52, 13.405, 54),
    ('Heilbronn', 49.1427, 9.2109, 35),
    ('Malaga', 36.7213, -4.4214, 28),
    ('São Paulo', -23.559902, -46.697669, 14),
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
    ('Porto', 41.149102, -8.612968, 2),
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
;
