-- DEMO/DEVELOPMENT DATA ONLY - NOT REAL INCIDENT DATA

INSERT INTO admins (email, password_hash, full_name, role) VALUES
('admin@safecity.local', '$2a$12$LJ3m4ys3GZvGxKFGkCIuPuBFMsHBY0TL5urSVfiGlmOHCz.MGeHPi', 'Admin User', 'admin');

DO $$
DECLARE
    admin_id INTEGER;
    cat_id INTEGER;
    i INTEGER;
    lat DECIMAL;
    lng DECIMAL;
    sev DECIMAL;
    status VARCHAR;
BEGIN
    SELECT id INTO admin_id FROM admins WHERE email = 'admin@safecity.local';
    
    -- Cluster A: Majestic (12.977, 77.572)
    FOR i IN 1..10 LOOP
        SELECT id INTO cat_id FROM incident_categories ORDER BY random() LIMIT 1;
        lat := 12.977 + (random() * 0.004 - 0.002);
        lng := 77.572 + (random() * 0.004 - 0.002);
        sev := 0.2 + random() * 0.75;
        
        INSERT INTO incidents (category_id, description, latitude, longitude, incident_time, severity_score, severity_level, verification_status, verified_by, verified_at)
        VALUES (cat_id, 'Cluster A incident ' || i, lat, lng, NOW() - (random() * 60 || ' days')::interval, sev, 'MEDIUM', 'VERIFIED', admin_id, NOW());
    END LOOP;

    -- Cluster B: Koramangala (12.935, 77.625)
    FOR i IN 1..15 LOOP
        SELECT id INTO cat_id FROM incident_categories ORDER BY random() LIMIT 1;
        lat := 12.935 + (random() * 0.004 - 0.002);
        lng := 77.625 + (random() * 0.004 - 0.002);
        sev := 0.2 + random() * 0.75;
        
        INSERT INTO incidents (category_id, description, latitude, longitude, incident_time, severity_score, severity_level, verification_status, verified_by, verified_at)
        VALUES (cat_id, 'Cluster B incident ' || i, lat, lng, NOW() - (random() * 60 || ' days')::interval, sev, 'MEDIUM', 'VERIFIED', admin_id, NOW());
    END LOOP;

    -- Cluster C: Electronic City (12.845, 77.660)
    FOR i IN 1..8 LOOP
        SELECT id INTO cat_id FROM incident_categories ORDER BY random() LIMIT 1;
        lat := 12.845 + (random() * 0.004 - 0.002);
        lng := 77.660 + (random() * 0.004 - 0.002);
        sev := 0.2 + random() * 0.75;
        
        INSERT INTO incidents (category_id, description, latitude, longitude, incident_time, severity_score, severity_level, verification_status)
        VALUES (cat_id, 'Cluster C incident ' || i, lat, lng, NOW() - (random() * 60 || ' days')::interval, sev, 'MEDIUM', 'PENDING');
    END LOOP;

    -- PENDING noise
    FOR i IN 1..12 LOOP
        SELECT id INTO cat_id FROM incident_categories ORDER BY random() LIMIT 1;
        lat := 12.91 + (random() * 0.08);
        lng := 77.55 + (random() * 0.10);
        sev := 0.2 + random() * 0.75;
        
        INSERT INTO incidents (category_id, description, latitude, longitude, incident_time, severity_score, severity_level, verification_status)
        VALUES (cat_id, 'Pending incident ' || i, lat, lng, NOW() - (random() * 60 || ' days')::interval, sev, 'MEDIUM', 'PENDING');
    END LOOP;

    -- REJECTED noise
    FOR i IN 1..10 LOOP
        SELECT id INTO cat_id FROM incident_categories ORDER BY random() LIMIT 1;
        lat := 12.91 + (random() * 0.08);
        lng := 77.55 + (random() * 0.10);
        sev := 0.2 + random() * 0.75;
        
        INSERT INTO incidents (category_id, description, latitude, longitude, incident_time, severity_score, severity_level, verification_status, verified_by, verified_at, rejection_reason)
        VALUES (cat_id, 'Rejected incident ' || i, lat, lng, NOW() - (random() * 60 || ' days')::interval, sev, 'MEDIUM', 'REJECTED', admin_id, NOW(), 'Spam report');
    END LOOP;
END $$;

INSERT INTO verification_actions (incident_id, admin_id, action, previous_status, new_status, reason)
SELECT id, verified_by, 'VERIFY', 'PENDING', 'VERIFIED', 'Verified by admin'
FROM incidents WHERE verification_status = 'VERIFIED';

INSERT INTO verification_actions (incident_id, admin_id, action, previous_status, new_status, reason)
SELECT id, verified_by, 'REJECT', 'PENDING', 'REJECTED', rejection_reason
FROM incidents WHERE verification_status = 'REJECTED';
