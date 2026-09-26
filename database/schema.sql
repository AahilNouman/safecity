-- database/schema.sql

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE incident_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    base_severity DECIMAL(3,2) DEFAULT 0.5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO incident_categories (name, base_severity) VALUES
('Harassment', 0.65),
('Stalking', 0.75),
('Threat', 0.85),
('Unsafe Area', 0.55),
('Poor Lighting', 0.40),
('Suspicious Activity', 0.60),
('Other', 0.50);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'moderator' CHECK (role IN ('admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    emergency_contact VARCHAR(20),
    role VARCHAR(50) DEFAULT 'citizen',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    public_report_id VARCHAR(20) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES incident_categories(id),
    description TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    location GEOGRAPHY(Point, 4326),
    incident_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    ai_category VARCHAR(100),
    ai_confidence DECIMAL(5,4),
    severity_score DECIMAL(3,2),
    severity_level VARCHAR(10) CHECK (severity_level IN ('LOW', 'MEDIUM', 'HIGH')),
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_at TIMESTAMPTZ,
    verified_by INTEGER REFERENCES admins(id),
    rejection_reason TEXT,
    original_ai_category VARCHAR(100),
    final_category VARCHAR(100),
    override_reason TEXT
);

CREATE TABLE verification_actions (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id),
    admin_id INTEGER REFERENCES admins(id),
    action VARCHAR(20) CHECK (action IN ('VERIFY', 'REJECT', 'OVERRIDE_CATEGORY')),
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    previous_category VARCHAR(100),
    new_category VARCHAR(100),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clusters (
    id SERIAL PRIMARY KEY,
    cluster_label INTEGER NOT NULL,
    centroid_lat DECIMAL(10,8),
    centroid_lng DECIMAL(11,8),
    centroid GEOGRAPHY(Point, 4326),
    incident_count INTEGER DEFAULT 0,
    primary_category VARCHAR(100),
    avg_severity DECIMAL(3,2),
    radius_meters DECIMAL(10,2),
    time_range_start TIMESTAMPTZ,
    time_range_end TIMESTAMPTZ,
    epsilon DECIMAL(8,4),
    min_samples INTEGER,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE safety_advisories (
    id SERIAL PRIMARY KEY,
    cluster_id INTEGER REFERENCES clusters(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    advisory_level VARCHAR(20) CHECK (advisory_level IN ('INFO', 'CAUTION', 'WARNING')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION set_incident_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_incident_location
BEFORE INSERT OR UPDATE OF latitude, longitude
ON incidents
FOR EACH ROW
EXECUTE FUNCTION set_incident_location();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incidents_modtime
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_report_id()
RETURNS TRIGGER AS $$
DECLARE
    year_str VARCHAR;
BEGIN
    year_str := to_char(NOW(), 'YYYY');
    IF NEW.public_report_id IS NULL THEN
        NEW.public_report_id := 'SC-' || year_str || '-' || lpad(cast(floor(random() * 1000000) as text), 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_report_id
BEFORE INSERT ON incidents
FOR EACH ROW
WHEN (NEW.public_report_id IS NULL)
EXECUTE FUNCTION generate_report_id();

CREATE INDEX idx_incidents_location ON incidents USING GIST (location);
CREATE INDEX idx_clusters_centroid ON clusters USING GIST (centroid);
CREATE INDEX idx_incidents_verification_status ON incidents (verification_status);
CREATE INDEX idx_incidents_category_id ON incidents (category_id);
CREATE INDEX idx_incidents_created_at ON incidents (created_at);
CREATE INDEX idx_incidents_public_report_id ON incidents (public_report_id);
