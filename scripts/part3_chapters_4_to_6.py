# -*- coding: utf-8 -*-
"""
Part 3: Chapters 4, 5, and 6 for SafeCity Capstone Thesis
"""

part3_text = '''
def build_chapter_4(doc):
    add_chapter_heading(doc, "CHAPTER-4", "PROPOSED METHODOLOGY")

    add_subtopic_heading(doc, "4.1 SYSTEM OVERVIEW & THEORETICAL FORMULATION")
    add_body_paragraph(doc, "The SafeCity platform formulates urban navigation not merely as a topological distance-minimization problem, but as a multi-criteria decision-making optimization problem under spatial and temporal uncertainty. We model the metropolitan road network as a weighted directed multigraph G = (V, E), where V represents physical intersections, transit interchange nodes, and road terminuses, and E represents directed street segments connecting these vertices. Each directed edge e = (u, v) in E possesses an intrinsic geographical length, denoted by dist(e), computed via the spherical Earth Haversine formulation over geographic coordinates.")
    add_body_paragraph(doc, "To integrate human perceived safety and empirical risk into the routing engine, each edge e is dynamically mapped to a multi-dimensional attribute vector comprising three primary risk and environmental indicators: (1) active crowdsourced incident density with exponential temporal decay, (2) verified street illumination and built-environment visibility, and (3) spatial accessibility to verified 24/7 civic safe havens. The global pathfinding objective is to discover a path R from origin vertex S to destination vertex D that minimizes a composite edge cost C(e) while maximizing an overall Route Safety Score.")

    add_subtopic_heading(doc, "4.2 MULTI-CRITERIA SAFETY COST FUNCTION & EDGE WEIGHTING")
    add_body_paragraph(doc, "For any directed street edge e in E, the composite routing impedance cost C(e) utilized by our modified Dijkstra / A* graph solver is mathematically defined as:")
    
    add_body_paragraph(doc, "C(e) = alpha * dist(e) + beta * P_hazard(e) - gamma * R_lit(e) - delta * R_haven(e)", bold_prefix="Equation (4.1): ")

    add_body_paragraph(doc, "where alpha, beta, gamma, and delta represent non-negative weighting scaling factors calibrated to balance pedestrian transit efficiency against risk aversion. In our production deployment, parameters are calibrated such that a lone pedestrian will accept up to a 20% distance elongation if the alternate route avoids active high-severity hazard clusters or unlit interior shortcuts.")
    add_body_paragraph(doc, "To provide an intuitive, human-interpretable metric for commuters, SafeCity computes a normalized Route Safety Score, denoted by Score(R), bounded strictly between 5 and 98 on an integer scale of 100:")

    add_body_paragraph(doc, "Score(R) = min( 98, max( 5, 100 - sum_{e in R} Omega_hazard(e) + sum_{e in R} Psi_haven(e) + Phi_illum(e) ) )", bold_prefix="Equation (4.2): ")

    add_body_paragraph(doc, "Capping the maximum score at 98 reinforces the ethical tenet that digital systems cannot guarantee absolute physical safety on dynamic public streets. Conversely, bounding the minimum score at 5 preserves algorithmic differentiation across high-risk corridors without inducing mathematical division-by-zero anomalies in pathfinding heuristics.")

    add_subtopic_heading(doc, "4.3 SPATIAL-TEMPORAL HAZARD PENALTY DECAY DYNAMICS")
    add_body_paragraph(doc, "A fundamental contribution of SafeCity is the integration of continuous exponential temporal decay for crowdsourced incident penalties. Each validated citizen incident i is characterized by an assigned severity level (Low, Medium, or High), an initial penalty weight w_sev(i), and a reporting timestamp t_0. The effective hazard penalty P_eff(i, t) at any subsequent query time t (measured in hours) decays according to the formulation:")

    add_body_paragraph(doc, "P_eff(i, t) = w_sev(i) * exp( - lambda * (t - t_0) )", bold_prefix="Equation (4.3): ")

    add_body_paragraph(doc, "The exponential decay constant lambda is derived directly from an institutional half-life parameter t_half:")

    add_body_paragraph(doc, "lambda = ln(2) / t_half", bold_prefix="Equation (4.4): ")

    add_body_paragraph(doc, "In the SafeCity platform, the half-life t_half is configured to 720 hours (equivalent to 30 calendar days). This ensures that while recent incidents exert substantial routing resistance, their influence diminishes smoothly over time unless reinforced by recurrent community reports. Baseline severity weights are defined as follows: High Severity (physical assault, stalking, active weapon threat) w_High = 20; Medium Severity (catcalling, verbal harassment, aggressive loitering) w_Medium = 8; and Low Severity (broken streetlamp, deserted transit corridor, physical road obstruction) w_Low = 4.")

    add_subtopic_heading(doc, "4.4 CORRIDOR ILLUMINATION & BUILT-ENVIRONMENT SAFETY SCORING")
    add_body_paragraph(doc, "Physical visibility and active street lighting represent paramount deterrents against predatory crimes. OpenStreetMap highway classification tags (e.g., primary, secondary, residential, service) are cross-referenced with crowdsourced street-lighting audits. For edges tagged as well-illuminated and featuring consistent commercial frontage, the routing engine assigns a positive illumination reward R_lit(e) = w_lit = 12. Conversely, street segments identified as dark, unlit, or bordered by vacant lots incur an illumination deficit penalty of 10 points.")

    add_subtopic_heading(doc, "4.5 VERIFIED SANCTUARY PROXIMITY REWARDS")
    add_body_paragraph(doc, "To provide proactive diversion capability, SafeCity integrates a spatial database of verified 24/7 civic safe havens—comprising all-night pharmacies, staffed fuel retail kiosks, hospital emergency casualty departments, and municipal police outposts. For any route edge e passing within an Euclidean buffer radius of r_buffer = 300 meters from a verified haven, an edge sanctuary reward R_haven(e) = w_haven = 15 is awarded. This actively incentivizes the pathfinding engine to route pedestrians along commercial arteries where emergency refuge is instantaneously accessible.")

    add_subtopic_heading(doc, "4.6 PRIVACY-PRESERVING 3-DECIMAL COORDINATE QUANTIZATION")
    add_body_paragraph(doc, "To safeguard citizen privacy and eliminate the threat of doorway-level deanonymization, SafeCity implements a client-side and API-level spatial quantization filter. When a commuter reports an incident, raw GPS coordinates (phi, lambda) are processed via three-decimal truncation:")

    add_body_paragraph(doc, "phi_quantized = round( phi * 10^3 ) * 10^(-3),    lambda_quantized = round( lambda * 10^3 ) * 10^(-3)", bold_prefix="Equation (4.5): ")

    add_body_paragraph(doc, "At Indian tropical latitudes (~13.0 degrees North in Bengaluru), three decimal places of latitude correspond to approximately 111.3 meters, and three decimal places of longitude correspond to approximately 108.5 meters. Consequently, each incident is mapped to a spatial bounding cell of approximately 110 m x 110 m (~1.2 hectares). This quantization completely obscures the specific building doorway, residential gate, or private alleyway of the contributor, guaranteeing k-anonymity while preserving sufficient spatial granularity for street-segment level route weighting. This implementation strictly adheres to the data minimization mandate articulated in Section 8(1) of the Indian Digital Personal Data Protection (DPDP) Act of 2023.")

    add_table_caption(doc, "Table 4.1", "Mathematical Parameters & Weighting Coefficients for Edge Cost")
    tbl_param = doc.add_table(rows=1, cols=4)
    tbl_param.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_param.autofit = False
    set_table_borders(tbl_param)
    col_w_param = [Inches(1.2), Inches(2.2), Inches(1.2), Inches(1.6)]
    param_headers = ["Parameter", "Description", "Value", "Operational Impact"]
    for c_i, h_txt in enumerate(param_headers):
        cell = tbl_param.rows[0].cells[c_i]
        cell.width = col_w_param[c_i]
        cell.text = h_txt
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(9); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    param_rows = [
        ["alpha", "Distance Impedance Weight", "1.0", "Maintains geographical efficiency"],
        ["beta", "Hazard Penalty Scaling Weight", "1.8", "Drives detour away from active crime clusters"],
        ["gamma", "Street Illumination Weight", "1.2", "Favors well-lit arterial roads over alleys"],
        ["delta", "Safe Haven Proximity Weight", "1.5", "Pulls route towards commercial sanctuaries"],
        ["w_High", "High Severity Base Weight", "20", "Assault, stalking, violent threats"],
        ["w_Medium", "Medium Severity Base Weight", "8", "Verbal catcalling, aggressive loitering"],
        ["w_Low", "Low Severity Base Weight", "4", "Dark spots, broken civic infrastructure"],
        ["t_half", "Temporal Penalty Half-Life", "720 hours", "Decays hazard penalties over 30 days"],
        ["r_buffer", "Safe Haven Buffer Radius", "300 meters", "Threshold for civic refuge bonus"],
        ["Delta_quant", "Coordinate Precision", "0.001 deg", "~110m grid cell for DPDP compliance"]
    ]
    for idx, r_data in enumerate(param_rows):
        row = tbl_param.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]
            cell.width = col_w_param[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 2] else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

def build_chapter_5(doc):
    add_chapter_heading(doc, "CHAPTER-5", "OBJECTIVES")

    add_subtopic_heading(doc, "5.1 PRIMARY RESEARCH OBJECTIVES")
    add_body_paragraph(doc, "The overarching research mission of SafeCity is to conceptualize, engineer, and validate an accessible, community-driven civic safety ecosystem that transforms passive citizen experiences into actionable spatial intelligence, mitigating transit risks for lone female commuters and vulnerable urban pedestrians.")

    add_subtopic_heading(doc, "5.2 SPECIFIC TECHNICAL OBJECTIVES")
    add_body_paragraph(doc, "To achieve this primary mission, the project defines five core technical and engineering objectives:")
    add_bullet_point(doc, "Develop and deploy an anonymous incident reporting pipeline that captures spatial hazard categories, severity ratings, and contextual narratives while enforcing 3-decimal coordinate quantization to guarantee citizen privacy.", "Objective 1: Privacy-First Ingestion:")
    add_bullet_point(doc, "Formulate a multi-criteria graph pathfinding algorithm that dynamically optimizes route selection by penalizing decayed hazard clusters and unlit streets while rewarding sanctuary proximity, executing within sub-200 ms latency.", "Objective 2: Proactive Safety Routing:")
    add_bullet_point(doc, "Construct an autonomous, zero-cognitive-load virtual escort watchdog ('Walk With Me') capable of detecting 180 seconds of unexplained stationary inactivity and triggering multi-stage acoustic and SMS distress escalation.", "Objective 3: Autonomous Escort Watchdog:")
    add_bullet_point(doc, "Implement a two-tier administrative moderation queue with role-based access control (RBAC) to review, verify, and filter incoming citizen reports, eliminating malicious spam and commercial disinformation.", "Objective 4: Community Verification & Moderation:")
    add_bullet_point(doc, "Architect and deploy a high-performance, cross-platform Progressive Web Application (PWA) with Service Worker offline shell caching, achieving seamless execution across Android and iOS mobile viewports without app-store installation friction.", "Objective 5: Cross-Platform PWA Deployment:")

    add_subtopic_heading(doc, "5.3 SOCIETAL AND REGULATORY ALIGNMENT OBJECTIVES")
    add_body_paragraph(doc, "Beyond technical milestones, SafeCity is engineered to fulfill critical regulatory and societal imperatives:")
    add_bullet_point(doc, "Ensure strict compliance with Section 8(1) of the Indian Digital Personal Data Protection (DPDP) Act of 2023 and the Information Technology Act of 2000 through zero-PII mandatory registration and local telemetry processing.", "DPDP Act 2023 Compliance:")
    add_bullet_point(doc, "Target 5.1 & 5.2 — Eliminate all forms of violence, harassment, and discrimination against women in public transit spaces by overcoming the criminological dark figure of crime.", "UN SDG 5 (Gender Equality):")
    add_bullet_point(doc, "Target 9.1 & 9.c — Provide inclusive, low-bandwidth civic technology operable on degraded 2G/3G mobile networks in urban peripheries.", "UN SDG 9 (Resilient Infrastructure):")
    add_bullet_point(doc, "Target 11.2 & 11.7 — Provide safe, accessible, and sustainable urban transit corridors and illuminated public spaces for women, children, and persons with disabilities.", "UN SDG 11 (Sustainable Cities):")
    add_bullet_point(doc, "Target 16.1 & 16.6 — Promote transparent, accountable civic institutions and empirical hazard auditing to assist municipal corporations and law enforcement.", "UN SDG 16 (Peace, Justice & Strong Institutions):")

    doc.add_page_break()

def build_chapter_6(doc):
    add_chapter_heading(doc, "CHAPTER-6", "SYSTEM DESIGN & IMPLEMENTATION")

    add_subtopic_heading(doc, "6.1 FOUR-TIER SYSTEM ARCHITECTURE")
    add_body_paragraph(doc, "SafeCity is engineered following a modular, four-tier microservice-inspired architecture designed for high availability, sub-second latency, and fault isolation. Figure 6.1 illustrates the end-to-end data pipeline and inter-tier service boundaries.")

    # Insert Architecture Diagram
    img_arch = r"C:\\Users\\AAHIL\\.gemini\\antigravity\\brain\\486918fb-9a46-4b06-97ff-51e77234ab28\\fig1_system_architecture.png"
    add_figure_with_caption(doc, img_arch, "Figure 6.1", "SafeCity Four-Tier End-to-End System Architecture", width_inches=6.0)

    add_body_paragraph(doc, "The four functional tiers operate as follows:")
    add_bullet_point(doc, "Progressive Web App (PWA) client rendered using HTML5, CSS3, Tailwind CSS, and Leaflet GIS mapping. Communicates over secure HTTPS using asynchronous fetch calls and WebSocket telemetry listeners.", "Tier 1: Client Presentation Layer:")
    add_bullet_point(doc, "Node.js and Express.js REST API providing authenticated endpoints, JSON Web Token (JWT) verification, CORS policies, express-rate-limit protection, and client input sanitization.", "Tier 2: Application API Layer:")
    add_bullet_point(doc, "Executes multi-criteria edge cost calculations, temporal hazard decay computations, 3-decimal coordinate quantization, and haven proximity buffer indexing.", "Tier 3: Spatial Analytics & Pathfinding Engine:")
    add_bullet_point(doc, "MySQL 8.0 relational database with spatial extensions and PostGIS-compatible vector schemas, utilizing GiST spatial indexes for sub-millisecond bounding box queries.", "Tier 4: Spatial Persistence Layer:")

    add_table_caption(doc, "Table 6.1", "SafeCity Technology Stack by Architectural Layer")
    tbl_tech = doc.add_table(rows=1, cols=4)
    tbl_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tech.autofit = False
    set_table_borders(tbl_tech)
    col_w_tech = [Inches(1.5), Inches(1.5), Inches(1.8), Inches(1.4)]
    tech_headers = ["Layer", "Technology", "Libraries / Tools", "Purpose"]
    for c_i, h_txt in enumerate(tech_headers):
        cell = tbl_tech.rows[0].cells[c_i]
        cell.width = col_w_tech[c_i]
        cell.text = h_txt
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(9); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    tech_rows = [
        ["Presentation (Client)", "HTML5 / ES6 JavaScript", "Leaflet 1.9, Service Workers, Tailwind", "Zero-install responsive PWA shell"],
        ["Application Server", "Node.js 18+ LTS", "Express.js, Helmet, CORS, Rate-Limit", "REST API endpoints, JWT authentication"],
        ["Spatial Analytics", "JavaScript / Python", "Turf.js, Haversine, Spatial Quantizer", "Multi-criteria pathfinding & decay engine"],
        ["Persistence (DB)", "MySQL 8.0 / Supabase", "Spatial Point Types, GiST Indexes, Knex", "Encrypted storage of reports & safe havens"],
        ["Emergency Dispatch", "Web Audio & SMS API", "Web Audio API (105dB), Twilio SMS SDK", "Autonomous distress siren & SMS broadcast"],
        ["Hosting & CDN", "Vercel Serverless / Cloud", "Vercel Edge Network, GitHub CI/CD", "Continuous deployment and global asset edge"]
    ]
    for idx, r_data in enumerate(tech_rows):
        row = tbl_tech.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]
            cell.width = col_w_tech[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    add_subtopic_heading(doc, "6.2 FRONTEND PROGRESSIVE WEB APPLICATION (PWA) IMPLEMENTATION")
    add_body_paragraph(doc, "The user-facing client is implemented as a Progressive Web Application. Unlike native mobile apps requiring 50+ MB downloads from app stores, SafeCity delivers an initial gzipped bundle payload of only 1.34 MB. A custom Service Worker registers caching strategies: core UI shell assets (HTML, CSS, core JS, map marker assets) are cached locally under a Cache-First policy, enabling instantaneous re-renders in sub-50 ms. Dynamic API requests (route calculations, haven queries) execute under a Network-First strategy with offline cache fallbacks.")

    add_subtopic_heading(doc, "6.3 BACKEND REST API & INGESTION PIPELINES")
    add_body_paragraph(doc, "The Express.js backend exposes structured RESTful endpoints. The incident ingestion endpoint (POST /api/incidents) accepts payload data comprising category, severity, narrative description, and coordinates. Upon reception, the server executes four operations: (1) schema validation and HTML tag sanitization to prevent XSS injection; (2) coordinate quantization via Equation (4.5); (3) assignment of moderation status ('PENDING'); and (4) asynchronous dispatch to the spatial index. Rate limiters restrict submissions to a maximum of 5 reports per IP per 10 minutes, neutralizing automated spam or denial-of-service attempts.")

    add_subtopic_heading(doc, "6.4 SPATIAL DATABASE SCHEMA & VECTOR INTEGRATION")
    add_body_paragraph(doc, "Spatial persistence utilizes MySQL 8.0 configured with spatial reference system identifier SRID 4326 (WGS 84). The core table schemas include:")
    add_bullet_point(doc, "Columns: id (UUID), category (VARCHAR), severity (ENUM: LOW, MEDIUM, HIGH), description (TEXT), location (POINT SRID 4326), status (ENUM: PENDING, VERIFIED, DISMISSED), created_at (TIMESTAMP).", "Incidents Table:")
    add_bullet_point(doc, "Columns: id (UUID), name (VARCHAR), type (ENUM: PHARMACY, FUEL_STATION, HOSPITAL, POLICE), is_24_7 (BOOLEAN), phone (VARCHAR), location (POINT SRID 4326), verified (BOOLEAN).", "Safe Havens Table:")
    add_bullet_point(doc, "Columns: id (UUID), session_token (VARCHAR), last_ping (TIMESTAMP), last_location (POINT SRID 4326), status (ENUM: ACTIVE, ESCALATED, RESOLVED).", "Escort Sessions Table:")

    add_subtopic_heading(doc, "6.5 'WALK WITH ME' VIRTUAL ESCORT STATE MACHINE")
    add_body_paragraph(doc, "The 'Walk With Me' module operates as a finite state machine managing commuter telemetry during nocturnal transit. Figure 6.2 illustrates the state transitions and autonomous timeout logic.")

    # State machine callout / workflow
    add_callout_box(doc, "Walk With Me Finite State Machine Workflow", [
        ("State 1: IDLE", "Escort inactive; client consumes minimal background geolocation telemetry."),
        ("State 2: ACTIVE_MONITORING", "User initiates journey; GPS watchdog samples coordinates at 10-second intervals and filters velocity jitter."),
        ("State 3: STATIONARY_WARNING", "Zero velocity displacement detected for 180 consecutive seconds outside verified havens; system sounds warning chime and presents 15-second 'I Am Safe' interactive dialog."),
        ("State 4: ESCALATED_SOS", "Timer expires without user confirmation; system triggers 105 dB local siren and broadcasts emergency SMS with GPS coordinates to registered emergency contacts.")
    ], border_color="059669", bg_color="ECFDF5")

    add_subtopic_heading(doc, "6.6 EMERGENCY SOS MULTI-STAGE DISPATCH ENGINE")
    add_body_paragraph(doc, "The SOS dispatch engine provides dual-mode activation: manual trigger via a high-contrast red emergency button, or autonomous trigger via the 180-second stationary watchdog. Upon triggering, the engine activates three parallel escalation actions: (1) Synthesizes a high-frequency alternating 105 dB acoustic siren through the Web Audio API to alert nearby pedestrians and disorient potential assailants; (2) Activates a high-frequency visual screen strobe for nocturnal visibility; and (3) Dispatches an automated SMS alert via Twilio / SMS Gateway API containing the victim\\'s last known quantized GPS coordinates and a direct reverse-geocoded Google Maps navigation link.")

    doc.add_page_break()
'''

print("Part 3: Chapters 4 to 6 code ready.")
