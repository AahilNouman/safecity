# SafeCity — Women's Safety & Civic Refuge Platform (Bengaluru)

SafeCity is a production-grade, human-designed public safety and emergency navigation platform engineered for women, students, and night commuters in Bengaluru. The platform unites crowdsourced street safety reporting, verified 24/7 safe refuge havens, lower-risk corridor navigation, and live companion virtual escorts.

---

## Key Features & Product Modules

### 1. Dedicated Reassuring Homepage & Navigation
- **Authentic Civic Voice**: Replaces AI clichés and generic marketing text with clear, human-designed safety guidance.
- **Quick Discreet Exit (`ESC` shortcut)**: Instantly closes safety views and redirects to a neutral weather site if the user is on a monitored or shared device.
- **Always-Accessible Helplines**: 1-tap direct phone dialers for **Police Emergency 112**, **Women Helpline 1091**, and **Cyber Harassment 1930**.

### 2. Upgraded Live Safety Map & 24/7 Safe Haven Locator
- **Reliable OpenStreetMap Tile Engine**: Built on high-resolution Leaflet tiles with automatic ESRI GIS fallback (no API key restrictions or watermarks).
- **14 Verified 24/7 Safe Havens**: Police stations (Cubbon Park, Indiranagar, Shivajinagar, Koramangala), 24-hour hospital trauma centers (Manipal, Bowring, Victoria), and 24x7 pharmacies (Apollo, MedPlus) with 1-tap call and navigation.
- **Dynamic Risk Filters**: Filter by category (Harassment, Stalking, Poor Lighting, Unsafe Area, Suspicious Activity), severity, and safe haven type.
- **Locate Me**: One-click live GPS positioning with custom accuracy beacon.

### 3. Confidential Incident Reporting
- **100% Anonymous by Default**: No personal identity or private device details are collected or logged.
- **Interactive Pin Drop Map**: Draggable safety pin and GPS auto-locate for pinpoint precision.
- **Unique Tracking ID**: Generates an encrypted tracking number (e.g. `AS-2026-10492`) with instant verification lookup.
- **Anti-Duplicate Protection**: Form submission prevents accidental multiple dispatches.

### 4. Lower-Risk Route Navigation
- **Arterial Corridor Engine**: Compares routes scored against incident density and safe haven proximity.
- **Recommended Well-Lit Route vs. Shortcut**: Displays safety scores (e.g. 94/100 vs. 48/100) and guides commuters along illuminated commercial arterials within 350m of active safe havens.

### 5. Companion Escort & 3-Minute Inactivity Watchdog
- **Live Companion GPS Trail**: Monitors pedestrian progress along safe transit corridors.
- **Inactivity Detection**: If a commuter remains stopped for over 3 minutes, triggers an audible warning and prompts an "I'm Safe" check-in.
- **Automated SOS Dispatch**: Dispatches automated WhatsApp and SMS distress links with exact live Google Maps coordinates to the user's trusted emergency contact.

### 6. Professional Login & Registration Experience
- **Split-Screen Design**: High-contrast, trustworthy layout with data confidentiality disclosures.
- **Security Validation**: Password visibility toggles, live strength meter (length, numbers, symbols), and remember-me state.
- **Dual Session Integration**: Connects to the Node.js backend when running, with local encrypted session fallback when offline.

### 7. Moderator Safety Command Portal
- **Internal Verification Queue**: Review, approve (`VERIFIED`), or reject (`REJECTED`) pending community incident reports before public mapping.
- **Category Analytics**: Real-time distribution doughnut charts (Chart.js) and incident metrics.

---

## Map Bug Diagnosis & Root Cause Resolution

| Issue Identified | Root Cause | Engineering Solution Implemented |
|---|---|---|
| **Opaque Black Canvas Overlay** | A custom procedural `GridLayer` was painting an opaque `#0F1932` canvas over map tiles. | Removed the blocking canvas layer; integrated clean OpenStreetMap tiles with ESRI World Street Map fallback. |
| **0x0 Viewport / Grey Map on Tab Switch** | Leaflet calculates zero dimensions when initialized in hidden or transitioning tabs. | Added `ResizeObserver` lifecycle management on `#BengaluruMainMap` and all map wrappers with automatic `invalidateSize()` calls. |
| **Route Map & Pin Map Invisibility** | Container lacked explicit height during initial load and Leaflet controls had z-index conflicts. | Enforced responsive container heights and set modal z-indexes to `z-[9999]` with isolated map stacking contexts. |
| **Tracking Lookup False Error** | `lookupReportByTrackingId()` displayed a red error message on empty initial input. | Added guard to only perform lookup when a non-empty tracking ID is provided. |

---

## Tech Stack & Architecture

- **Frontend**: HTML5, Tailwind CSS 3.4 CDN, Leaflet.js 1.9.4, Chart.js 4.4, Lucide Icons, Google Fonts (Inter, JetBrains Mono)
- **Backend**: Node.js, Express.js REST API (`backend/server.js`)
- **Database**: MySQL (`database/schema.sql`)
- **Routing Engine**: OSRM (Open Source Routing Machine) + SafeCity Risk Matrix

---

## Quick Start & Running Locally

### 1. Run the Frontend
Simply open `index.html` (or `frontend/index.html`) directly in any web browser, or serve using any static web server:
\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
\`\`\`

### 2. (Optional) Run the Node.js + MySQL Backend
\`\`\`bash
# Import schema
mysql -u root -p < database/schema.sql

# Install backend dependencies & start
cd backend
npm install
npm start
\`\`\`
The backend will listen on `http://localhost:5000`. The frontend automatically detects the running backend API and syncs live incident data and user accounts.

### 3. Demo Credentials
- **Moderator Portal**: `admin@safecity.bengaluru.in` / `SafeCity@2026`
- **Sample Verified Tracking ID**: `AS-2026-10492` or `AS-2026-10834`
