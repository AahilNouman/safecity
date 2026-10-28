-- =========================================================================
-- SafeCity — Supabase PostgreSQL Database Schema & Migration Script
-- Version: 2.0.0
-- Description: Shared persistent cloud database for cross-device reporting,
--              status moderation, and evidence storage.
-- =========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 2. Incident Reports Table (incident_reports)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(32) UNIQUE NOT NULL,
    reporter_id UUID DEFAULT NULL,
    reporter_name VARCHAR(120) DEFAULT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Harassment', 'Stalking', 'Threat', 'Poor Lighting', 
        'Unsafe Area', 'Suspicious Activity', 'Other'
    )),
    severity VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (severity IN (
        'Low', 'Medium', 'High'
    )),
    title VARCHAR(200) DEFAULT NULL,
    description TEXT NOT NULL CHECK (char_length(description) >= 10),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    location_name VARCHAR(255) DEFAULT 'Bengaluru Street Pin',
    location_text VARCHAR(255) DEFAULT NULL,
    image_paths TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'VERIFIED', 'REJECTED'
    )),
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    incident_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by VARCHAR(120) DEFAULT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NULL,
    moderator_notes TEXT DEFAULT NULL,
    rejection_reason VARCHAR(255) DEFAULT NULL
);

-- Indexes for rapid spatial and status queries
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON public.incident_reports (status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_category ON public.incident_reports (category);
CREATE INDEX IF NOT EXISTS idx_incident_reports_coords ON public.incident_reports (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_incident_reports_created ON public.incident_reports (created_at DESC);

-- =========================================================================
-- 3. Incident Status Audit History Table (incident_status_history)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.incident_status_history (
    id BIGSERIAL PRIMARY KEY,
    incident_id UUID REFERENCES public.incident_reports(id) ON DELETE CASCADE,
    report_id VARCHAR(32) NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    reviewed_by VARCHAR(120) NOT NULL,
    moderator_notes TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_report ON public.incident_status_history (report_id);
CREATE INDEX IF NOT EXISTS idx_status_history_incident ON public.incident_status_history (incident_id);

-- =========================================================================
-- 4. Safe Havens Table (safe_havens)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.safe_havens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    type VARCHAR(40) NOT NULL CHECK (type IN (
        'POLICE', 'HOSPITAL', 'PHARMACY_24X7', 'COMMERCIAL_HUB'
    )),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    phone_number VARCHAR(40) NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_open_24x7 BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safe_havens_coords ON public.safe_havens (latitude, longitude);

-- =========================================================================
-- 5. Emergency Alerts Table (emergency_alerts)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) DEFAULT NULL,
    user_name VARCHAR(120) DEFAULT 'Commuter',
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    reason VARCHAR(50) NOT NULL DEFAULT 'SOS',
    contact_name VARCHAR(120) NOT NULL,
    contact_phone VARCHAR(40) NOT NULL,
    maps_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 6. Automated Trigger for Updated At & Status History
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_incident_status_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();

    -- When status changes, log entry to incident_status_history
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.incident_status_history (
            incident_id,
            report_id,
            previous_status,
            new_status,
            reviewed_by,
            moderator_notes,
            created_at
        ) VALUES (
            NEW.id,
            NEW.report_id,
            OLD.status,
            NEW.status,
            COALESCE(NEW.reviewed_by, 'Moderator'),
            COALESCE(NEW.moderator_notes, NEW.rejection_reason),
            NOW()
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_incident_status_update ON public.incident_reports;
CREATE TRIGGER trg_incident_status_update
    BEFORE UPDATE ON public.incident_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_incident_status_update();

-- =========================================================================
-- 7. Row-Level Security (RLS) Policies
-- =========================================================================
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_havens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- A. Incident Reports Policies
-- Anyone can view verified and pending incidents on the map and feed
CREATE POLICY "Public read verified and pending reports"
    ON public.incident_reports
    FOR SELECT
    USING (status IN ('VERIFIED', 'PENDING'));

-- Anyone (citizen, anonymous) can insert a new report with status PENDING
CREATE POLICY "Citizens can insert incident reports as PENDING"
    ON public.incident_reports
    FOR INSERT
    WITH CHECK (status = 'PENDING');

-- Service role and authenticated moderators can perform full operations
CREATE POLICY "Moderators can update incident reports"
    ON public.incident_reports
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- B. Safe Havens Policies: Public can read all open safe havens
CREATE POLICY "Public read safe havens"
    ON public.safe_havens
    FOR SELECT
    USING (true);

-- C. Emergency Alerts Policies: Citizens can insert emergency alerts
CREATE POLICY "Citizens can insert emergency alerts"
    ON public.emergency_alerts
    FOR INSERT
    WITH CHECK (true);

-- =========================================================================
-- 8. Seed Verified Safe Havens in Bengaluru
-- =========================================================================
INSERT INTO public.safe_havens (name, type, latitude, longitude, phone_number, address, is_open_24x7)
VALUES
('Cubbon Park Police Station', 'POLICE', 12.9763000, 77.5929000, '080-22942570', 'Kasturba Road, Near Cubbon Park Metro, Bengaluru 560001', TRUE),
('Indiranagar Police Station', 'POLICE', 12.9784000, 77.6408000, '080-22942542', '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', TRUE),
('Shivajinagar Police Station', 'POLICE', 12.9857000, 77.6057000, '080-22942584', 'Broadway Road, Near Russell Market, Shivajinagar, Bengaluru 560051', TRUE),
('Koramangala Police Station', 'POLICE', 12.9352000, 77.6245000, '080-22942565', '20th Main Rd, 8th Block, Koramangala, Bengaluru 560095', TRUE),
('Nagawara / KG Halli Police Outpost', 'POLICE', 13.0412000, 77.6132000, '080-22942480', 'Outer Ring Road, Nagawara Junction, Bengaluru 560045', TRUE),
('Manipal Hospital Emergency Trauma Center', 'HOSPITAL', 12.9592000, 77.6476000, '080-25024444', '98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017', TRUE),
('Bowring & Lady Curzon Hospital 24x7 ER', 'HOSPITAL', 12.9823000, 77.6041000, '080-25591325', 'Lady Curzon Rd, Tasker Town, Shivajinagar, Bengaluru 560001', TRUE),
('Victoria Hospital Emergency Care', 'HOSPITAL', 12.9636000, 77.5746000, '080-26701150', 'Fort Rd, Near City Market Metro, Kalasipalyam, Bengaluru 560002', TRUE),
('St. Johns Medical College Hospital ER', 'HOSPITAL', 12.9298000, 77.6203000, '080-22065000', 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru 560034', TRUE),
('Apollo Pharmacy 24x7 — Indiranagar', 'PHARMACY_24X7', 12.9719000, 77.6412000, '1860-500-0101', 'CMH Road, Near Indiranagar Metro Station, Bengaluru 560038', TRUE),
('Apollo Pharmacy 24x7 — MG Road / Brigade', 'PHARMACY_24X7', 12.9738000, 77.6074000, '080-25587341', 'Church Street & Brigade Rd Junction, Bengaluru 560001', TRUE),
('MedPlus 24x7 Pharmacy — Shivajinagar', 'PHARMACY_24X7', 12.9882000, 77.6038000, '040-67006700', 'Infantry Road Cross, Shivajinagar, Bengaluru 560001', TRUE),
('Apollo Pharmacy 24x7 — Nagawara Manyata', 'PHARMACY_24X7', 13.0435000, 77.6205000, '080-41256890', 'Opp Manyata Tech Park Gate 2, Nagawara, Bengaluru 560045', TRUE),
('Shell 24x7 Bright Select Hub — Hebbal', 'COMMERCIAL_HUB', 13.0358000, 77.5970000, '080-23541890', 'Bellary Road, Hebbal Flyover Service Rd, Bengaluru 560024', TRUE)
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 9. Seed Verified Community Street Safety Incidents in Bengaluru
-- =========================================================================
INSERT INTO public.incident_reports (report_id, category, description, latitude, longitude, location_name, severity, incident_time, status, is_anonymous)
VALUES
('AS-2026-10492', 'Poor Lighting', 'Over 6 consecutive streetlights non-functional along Govindpura stretch after 9:30 PM. Heavy blind spots for solo commuters.', 13.0235000, 77.6142000, 'Govindpura Main Rd Cross, Near Nagawara', 'High', '2026-10-20 21:40:00+00', 'VERIFIED', TRUE),
('AS-2026-10834', 'Harassment', 'Group on two-wheelers verbally harassing evening commuters near the unlit service lane intersection between 8:30 PM and 11:00 PM.', 13.0195000, 77.6118000, 'Govindpura Junction Service Lane, Arabic College Post', 'High', '2026-10-20 22:15:00+00', 'VERIFIED', TRUE),
('AS-2026-11209', 'Stalking', 'Persistent following reported by two students exiting night metro toward Kempegowda bus bays.', 12.9772000, 77.5731000, 'Majestic Subway Underpass towards Platform 4', 'High', '2026-10-19 23:05:00+00', 'VERIFIED', TRUE),
('AS-2026-11470', 'Suspicious Activity', 'Frequent loitering in unmonitored commercial corridor after 10 PM. Foot police patrol requested.', 12.9885000, 77.6048000, 'Russell Market South Lane, Shivajinagar', 'Medium', '2026-10-19 22:10:00+00', 'VERIFIED', TRUE),
('AS-2026-11982', 'Unsafe Area', 'Deserted unlit lane connecting 80 Feet Road to residential layout with lack of evening civic foot traffic.', 12.9348000, 77.6189000, 'Koramangala 4th Block Interior Link Road', 'Medium', '2026-10-18 20:30:00+00', 'VERIFIED', TRUE),
('AS-2026-12340', 'Poor Lighting', 'Flickering streetlights behind metro pillar 42. Mild visibility degradation.', 12.9745000, 77.6432000, '12th Main Road Cross, Indiranagar', 'Low', '2026-10-17 21:00:00+00', 'VERIFIED', TRUE)
ON CONFLICT (report_id) DO NOTHING;

-- =========================================================================
-- 10. Supabase Storage Bucket Configuration (SQL definition)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'incident-evidence', 
    'incident-evidence', 
    FALSE, 
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage upload policy: Anyone can upload evidence with an incident report
CREATE POLICY "Allow public evidence upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'incident-evidence');

-- Storage select policy: Read access for evidence
CREATE POLICY "Allow evidence read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'incident-evidence');

-- =========================================================================
-- 11. Enable Supabase Realtime Publication for incident_reports
-- =========================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'incident_reports'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.incident_reports;
    END IF;
END $$;
