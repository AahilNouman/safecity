-- SafeCity MySQL Database Schema & Bengaluru Seed Data
CREATE DATABASE IF NOT EXISTS safecity_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE safecity_db;

-- 1. Users & Emergency Contacts Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    emergency_name VARCHAR(120) NOT NULL,
    emergency_phone VARCHAR(30) NOT NULL,
    emergency_relation VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Community Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id VARCHAR(32) UNIQUE NOT NULL,
    category ENUM('Harassment', 'Stalking', 'Threat', 'Poor Lighting', 'Unsafe Area', 'Suspicious Activity', 'Other') NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    location_name VARCHAR(255) DEFAULT 'Bengaluru',
    severity ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    incident_time DATETIME NOT NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(255) DEFAULT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_coords (latitude, longitude)
);

-- 3. 24/7 Safe Havens Table
CREATE TABLE IF NOT EXISTS safe_havens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    type ENUM('POLICE', 'HOSPITAL', 'PHARMACY_24X7', 'COMMERCIAL_HUB') NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    phone_number VARCHAR(40) NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_open_24x7 BOOLEAN DEFAULT TRUE
);

-- 4. Emergency Alerts (Walk Buddy SOS & Inactivity Dispatches)
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    user_name VARCHAR(120) DEFAULT 'Walk Buddy User',
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    reason ENUM('INACTIVITY', 'SOS') NOT NULL,
    contact_name VARCHAR(120) NOT NULL,
    contact_phone VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(160) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'MODERATOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin (Password: SafeCity@2026)
INSERT INTO admins (email, password_hash, role) VALUES
('admin@safecity.bengaluru.in', '$2b$10$SafeCity2026ModeratorHashValueExample99123456', 'SUPER_MODERATOR');

-- Seed Verified 24/7 Safe Havens in Bengaluru
INSERT INTO safe_havens (name, type, latitude, longitude, phone_number, address, is_open_24x7) VALUES
('Cubbon Park Police Station', 'POLICE', 12.9763, 77.5929, '080-22942570', 'Kasturba Road, Near Cubbon Park Metro, Bengaluru 560001', TRUE),
('Indiranagar Police Station', 'POLICE', 12.9784, 77.6408, '080-22942542', '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038', TRUE),
('Shivajinagar Police Station', 'POLICE', 12.9857, 77.6057, '080-22942584', 'broadway Road, Near Russell Market, Shivajinagar, Bengaluru 560051', TRUE),
('Koramangala Police Station', 'POLICE', 12.9352, 77.6245, '080-22942565', '20th Main Rd, 8th Block, Koramangala, Bengaluru 560095', TRUE),
('Nagawara / KG Halli Police Outpost', 'POLICE', 13.0412, 77.6132, '080-22942480', 'Outer Ring Road, Nagawara Junction, Bengaluru 560045', TRUE),
('Manipal Hospital Emergency Trauma Center', 'HOSPITAL', 12.9592, 77.6476, '080-25024444', '98, HAL Old Airport Rd, Kodihalli, Bengaluru 560017', TRUE),
('Bowring & Lady Curzon Hospital 24x7 ER', 'HOSPITAL', 12.9823, 77.6041, '080-25591325', 'Lady Curzon Rd, Tasker Town, Shivajinagar, Bengaluru 560001', TRUE),
('Victoria Hospital Emergency Care', 'HOSPITAL', 12.9636, 77.5746, '080-26701150', 'Fort Rd, Near City Market Metro, Kalasipalyam, Bengaluru 560002', TRUE),
('St. Johns Medical College Hospital ER', 'HOSPITAL', 12.9298, 77.6203, '080-22065000', 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru 560034', TRUE),
('Apollo Pharmacy 24x7 — Indiranagar', 'PHARMACY_24X7', 12.9719, 77.6412, '1860-500-0101', 'CMH Road, Near Indiranagar Metro Station, Bengaluru 560038', TRUE),
('Apollo Pharmacy 24x7 — MG Road / Brigade', 'PHARMACY_24X7', 12.9738, 77.6074, '080-25587341', 'Church Street & Brigade Rd Junction, Bengaluru 560001', TRUE),
('MedPlus 24x7 Pharmacy — Shivajinagar', 'PHARMACY_24X7', 12.9882, 77.6038, '040-67006700', 'Infantry Road Cross, Shivajinagar, Bengaluru 560001', TRUE),
('Apollo Pharmacy 24x7 — Nagawara Manyata', 'PHARMACY_24X7', 13.0435, 77.6205, '080-41256890', 'Opp Manyata Tech Park Gate 2, Nagawara, Bengaluru 560045', TRUE),
('Shell 24x7 Bright Select Hub — Hebbal', 'COMMERCIAL_HUB', 13.0358, 77.5970, '080-23541890', 'Bellary Road, Hebbal Flyover Service Rd, Bengaluru 560024', TRUE);

-- Seed Verified Community Street Safety Incidents in Bengaluru
INSERT INTO incidents (report_id, category, description, latitude, longitude, location_name, severity, incident_time, status, is_anonymous) VALUES
('AS-2026-10492', 'Poor Lighting', 'Over 6 consecutive streetlights non-functional along Govindpura stretch after 9:30 PM. Heavy blind spots for solo commuters.', 13.0235000, 77.6142000, 'Govindpura Main Rd Cross, Near Nagawara', 'High', '2026-10-20 21:40:00', 'VERIFIED', TRUE),
('AS-2026-10834', 'Harassment', 'Group on two-wheelers verbally harassing evening commuters near the unlit service lane intersection between 8:30 PM and 11:00 PM.', 13.0195000, 77.6118000, 'Govindpura Junction Service Lane, Arabic College Post', 'High', '2026-10-20 22:15:00', 'VERIFIED', TRUE),
('AS-2026-11209', 'Stalking', 'Persistent following reported by two students exiting night metro toward Kempegowda bus bays.', 12.9772000, 77.5731000, 'Majestic Subway Underpass towards Platform 4', 'High', '2026-10-19 23:05:00', 'VERIFIED', TRUE),
('AS-2026-11470', 'Suspicious Activity', 'Frequent loitering in unmonitored commercial corridor after 10 PM. Foot police patrol requested.', 12.9885000, 77.6048000, 'Russell Market South Lane, Shivajinagar', 'Medium', '2026-10-19 22:10:00', 'VERIFIED', TRUE),
('AS-2026-11982', 'Unsafe Area', 'Deserted unlit lane connecting 80 Feet Road to residential layout with lack of evening civic foot traffic.', 12.9348000, 77.6251000, 'Koramangala 4th Block Interior Link Road', 'Medium', '2026-10-18 20:30:00', 'VERIFIED', TRUE);
