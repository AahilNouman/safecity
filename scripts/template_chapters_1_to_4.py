# -*- coding: utf-8 -*-
"""
Chapters 1, 2, 3, and 4 for SafeCity B.Tech Capstone Thesis
Structured according to Presidency University Template
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def build_chapter_1(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-1", "INTRODUCTION")

    helper.add_subtopic_heading(doc, "1.1 BACKGROUND AND MOTIVATION")
    helper.add_body_paragraph(doc, "The rapid pace of global urbanization has profoundly altered the spatial, social, and economic dynamics of major metropolitan regions across emerging economies. In Indian technology hubs such as Bengaluru, women now represent an indispensable and expanding proportion of the formal and informal workforce, especially across the information technology (IT), biotechnology, healthcare, and retail sectors. According to recent surveys by the National Sample Survey Office (NSSO), female employment during non-standard hours (evening and night shifts) has expanded by more than 34% over the past decade. However, this demographic progress has underscored persistent disparities in urban transport infrastructure, street illumination, and nocturnal pedestrian safety.")
    helper.add_body_paragraph(doc, "Autonomous mobility in public spaces constitutes a foundational prerequisite for gender equity and societal development. When lone female commuters and students perceive city streets and transit interchanges as hazardous, unpredictable, or intimidating, their economic horizons and educational opportunities become severely restricted. Urban safety cannot be measured solely through formal police records. In reality, the vast majority of street-level offences—including persistent stalking, catcalling, verbal aggression, unsolicited physical proximity, and poorly lit transit ambushes—remain unrecorded. Criminologists refer to this critical discrepancy as the 'dark figure of crime'.")

    helper.add_subtopic_heading(doc, "1.2 SCOPE AND LIMITATIONS")
    helper.add_body_paragraph(doc, "The primary scope of the SafeCity platform encompasses the architectural modeling, full-stack software implementation, mathematical pathfinding formulation, and empirical validation of an end-to-end community safety ecosystem. Specifically, the system scope includes:")
    helper.add_bullet_point(doc, "A universal Progressive Web Application (PWA) operable on any modern mobile smartphone browser without app-store installation friction.", "Universal Accessibility:")
    helper.add_bullet_point(doc, "An anonymous incident intake pipeline enforcing 3-decimal GPS coordinate quantization (~110 m spatial cell resolution) in compliance with Section 8(1) of the Indian Digital Personal Data Protection (DPDP) Act of 2023.", "Privacy by Design:")
    helper.add_bullet_point(doc, "A multi-criteria Dijkstra/A* pathfinding solver that penalizes temporally decayed crime clusters while rewarding street illumination and sanctuary proximity.", "Proactive Safety Navigation:")
    helper.add_bullet_point(doc, "A 'Walk With Me' autonomous virtual escort watchdog that monitors velocity telemetry and escalates to acoustic alarms and SMS broadcasts upon 180 seconds of unexplained immobility.", "Autonomous Inactivity Escort:")
    helper.add_bullet_point(doc, "A two-tier community moderation queue enabling verified community overseers to eliminate malicious spam and commercial bias.", "Crowdsourced Data Integrity:")

    helper.add_body_paragraph(doc, "The platform is bounded by realistic operational limitations: client positioning accuracy depends on smartphone GPS hardware, which can experience multipath drift in narrow urban canyons; newly onboarded suburban sectors experience an initial cold-start data scarcity phase prior to community adoption; and emergency SMS dispatch remains contingent on mobile network operator coverage.")

    helper.add_subtopic_heading(doc, "1.3 PROBLEM STATEMENT")
    helper.add_body_paragraph(doc, "Urban commuters face a fundamental structural deficiency in digital navigation and personal safety systems. Commercial mapping platforms (such as Google Maps) optimize purely for geographical distance or vehicular throughput, routinely guiding lone pedestrians through unlit, deserted shortcuts that present acute physical hazards. Concurrently, commercial mobile safety applications rely almost exclusively on reactive panic alarms requiring explicit physical intervention during an active assault. Under sudden physical terror, acute sympathetic nervous system arousal induces cognitive freeze, rendering victims incapable of retrieving or operating mobile devices. There is an urgent, unmet societal need for an intelligent, privacy-first platform that translates crowdsourced community hazard reports into proactive, safety-aware navigation and autonomous inactivity safeguards.")

    helper.add_subtopic_heading(doc, "1.4 MOTIVATION")
    helper.add_body_paragraph(doc, "This research is driven by three core imperatives: First, the urgent humanitarian need to safeguard women and vulnerable citizens navigating urban streets after dark. Second, the technical challenge of bridging the 'dark figure of crime' without compromising victim privacy or violating statutory data protection frameworks (such as the Indian DPDP Act of 2023). Third, the realization that preventive navigation—avoiding high-risk streets before entering them—is vastly more effective at preserving life and dignity than reactive post-incident alarms.")

    helper.add_subtopic_heading(doc, "1.5 METHODOLOGY OVERVIEW")
    helper.add_body_paragraph(doc, "SafeCity formulates a comprehensive four-tier system architecture integrating modern participatory sensing, multi-objective graph optimization, and mobile telemetry analysis. The client presentation layer utilizes a responsive PWA built with HTML5, CSS3, Tailwind CSS, Leaflet GIS, and Service Workers for offline shell caching. The backend API layer is engineered in Node.js and Express.js, protected by JSON Web Tokens (JWT), CORS policies, and rate limiters.")
    helper.add_body_paragraph(doc, "Geospatial incident ingestion enforces spatial quantization by truncating latitude and longitude to three decimal places, collapsing precision into a privacy-preserving ~110 m x 110 m grid cell. Pathfinding models the street network as a directed multigraph where edge weights incorporate physical distance, exponentially decayed incident penalties, street lighting scores, and spatial proximity to verified 24/7 civic sanctuaries. Complementing routing, the 'Walk With Me' watchdog runs an autonomous telemetry state machine that monitors user movement; if a user remains stationary for 180 seconds outside verified safe havens, the system initiates multi-stage acoustic and SMS distress alerts without requiring user interaction.")

    helper.add_subtopic_heading(doc, "1.6 ORGANIZATION OF THE THESIS")
    helper.add_sub_subtopic_heading(doc, "1.6.1 Logical Flow of the Research Work")
    helper.add_body_paragraph(doc, "The research work progresses systematically from problem identification through theoretical formulation, architectural design, full-stack implementation, and rigorous empirical validation. Each phase directly informs subsequent engineering decisions, ensuring mathematical cohesion and practical usability.")

    helper.add_sub_subtopic_heading(doc, "1.6.2 Contribution Mapping Across Chapters")
    helper.add_body_paragraph(doc, "The thesis contributions are mapped across nine core chapters:")
    helper.add_bullet_point(doc, "Establishes urban mobility disparities, criminological motivation, scope, and problem formulation.", "Chapter 1 (Introduction):")
    helper.add_bullet_point(doc, "Surveys existing literature across participatory GIS, safety routing, panic hardware, and spatial clustering.", "Chapter 2 (Literature Review):")
    helper.add_bullet_point(doc, "Formulates the technical and psychological deficiencies of legacy systems, focusing on reporting friction and cognitive freeze.", "Chapter 3 (Research Gaps):")
    helper.add_bullet_point(doc, "Details the mathematical cost functions, exponential decay dynamics, data preprocessing, and workflow architecture.", "Chapter 4 (Proposed Methodology):")
    helper.add_bullet_point(doc, "Defines primary, secondary, technical, and regulatory project objectives.", "Chapter 5 (Objectives):")
    helper.add_bullet_point(doc, "Explicates module-wise implementation, algorithms, user interface screenshots, and component integration.", "Chapter 6 (System Design & Implementation):")
    helper.add_bullet_point(doc, "Presents the 8-month project execution schedule and Gantt chart across six distinct engineering phases.", "Chapter 7 (Project Timeline):")
    helper.add_bullet_point(doc, "Summarizes deliverables, benchmark datasets, IEEE publication proof, and student innovation awards.", "Chapter 8 (Outcomes):")
    helper.add_bullet_point(doc, "Presents empirical latency benchmarks, corridor routing evaluations in Bengaluru, battery overhead, and SUS usability scores (82.4/100).", "Chapter 9 (Results and Discussion):")

    helper.add_sub_subtopic_heading(doc, "1.6.3 Chapter Overview Summary")
    helper.add_body_paragraph(doc, "Following the technical chapters, the thesis provides a comprehensive Conclusion and Future Work chapter synthesizing findings and outlining long-term roadmaps, followed by standard IEEE References, Appendix-A (Pseudocode), Appendix-B (Screenshots), Appendix-C (Enclosures), and Appendix-D (Ethical and Regulatory Compliance).")

    doc.add_page_break()

def build_chapter_2(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-2", "LITERATURE REVIEW")

    helper.add_subtopic_heading(doc, "2.1 INTRODUCTION TO RELATED WORK")
    helper.add_body_paragraph(doc, "Personal safety in urban transit environments has been investigated across multiple academic disciplines, including geographic information science, human-computer interaction, criminology, and intelligent transportation systems. This chapter provides a rigorous taxonomy of related systems, examining participatory safety sensing, multi-objective pathfinding, mobile panic hardware, and spatial clustering algorithms.")

    helper.add_subtopic_heading(doc, "2.2 SURVEY OF EXISTING SYSTEMS")
    helper.add_body_paragraph(doc, "Early pioneering work by Viswanath and Basu (2015) introduced 'SafetiPin', a mobile audit platform that evaluates urban corridors across nine physical parameters, including illumination, openness, sightlines, security presence, and demographic diversity. SafetiPin established that subjective perceptions of safety correlate strongly with objective environmental features. However, SafetiPin operates primarily as an analytical tool for urban planners rather than a real-time navigational decision support system, requiring lengthy audit questionnaires that commuters cannot complete during daily transit.")
    helper.add_body_paragraph(doc, "Abdelmonem (2015) analyzed 'HarassMap', a crowdsourcing deployment in Cairo designed to document street-level harassment. HarassMap proved highly effective in breaking cultural taboos, but lacked algorithmic integration with pathfinding solvers; incidents are plotted as static pins without informing pre-trip routing. In the routing domain, Galbrun et al. (2016) proposed a dual-objective pathfinding framework balancing route length against historical crime density. Shah et al. (2020) incorporated OpenStreetMap spatial tags (lighting, sidewalk presence) into an edge cost calculation. However, both treated crime data as static and failed to model positive environmental attractors, such as verified 24/7 safe havens.")
    helper.add_body_paragraph(doc, "In mobile hardware, Bhardwaj et al. (2018) designed wearable IoT safety bands with accelerometers and GSM/GPS modules. However, human factors evaluations show that sudden physical ambush induces acute cognitive freeze, preventing victims from pressing panic keys. Furthermore, sensor alarms exhibit high false-positive rates during ordinary vigorous physical movements.")

    helper.add_subtopic_heading(doc, "2.3 RESEARCH GAPS IDENTIFIED")
    helper.add_body_paragraph(doc, "Synthesizing prior literature reveals five critical research gaps: (1) high reporting friction leaving over 70% of street harassment unrecorded; (2) reliance on reactive alarms rather than preventive routing; (3) lack of exponential temporal decay dynamics for transient hazard risks; (4) doorway-level deanonymization risks in crowdsourced GPS logging; and (5) the complete absence of integrated civic haven networks in pathfinding graph solvers.")

    helper.add_subtopic_heading(doc, "2.4 OBJECTIVES OF THE STUDY")
    helper.add_body_paragraph(doc, "In response to these identified gaps, this capstone study formulates an integrated, privacy-first civic platform that unifies anonymous 3-decimal coordinate reporting, multi-criteria pathfinding with exponential decay modeling, an autonomous 180s virtual escort watchdog, and a verified 24/7 safe haven network.")

    helper.add_subtopic_heading(doc, "2.5 SUMMARY")
    helper.add_body_paragraph(doc, "Table 2.1 summarizes the academic and technological positioning of SafeCity relative to existing commercial and academic solutions across seven critical engineering dimensions.")

    helper.add_table_caption(doc, "Table 2.1", "Positioning Relative to Related Navigation and Panic Solutions")
    tbl_comp = doc.add_table(rows=1, cols=5)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_comp.autofit = False
    helper.set_table_borders(tbl_comp)
    col_w_comp = [Inches(1.5), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.4)]
    comp_headers = ["Evaluation Metric", "Commercial Nav (Google Maps)", "SafetiPin Audits", "Wearable SOS (bSafe/Life360)", "SafeCity (Proposed)"]
    for c_i, h_txt in enumerate(comp_headers):
        cell = tbl_comp.rows[0].cells[c_i]; cell.width = col_w_comp[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    comp_rows = [
        ["Routing Optimization", "Shortest / Fastest Distance", "Static Audit Overlay Only", "No Routing Engine", "Multi-Criteria Safety & Illumination"],
        ["Spatial-Temporal Decay", "None (Traffic Only)", "None (Static Annual Scores)", "None", "Continuous Exponential Half-Life"],
        ["Incident Ingestion", "Traffic/Accidents Only", "Manual Survey Forms", "No Incident Reporting", "Anonymous 3-Decimal Quantization"],
        ["Inactivity Escort", "None", "None", "Manual Live Tracking Only", "Autonomous 180s Watchdog & SOS"],
        ["Sanctuary Routing", "Commercial Points of Interest", "None", "None", "Verified 24/7 Civic Safe Havens"],
        ["Privacy & DPDP 2023", "Account & GPS Required", "Audit Contributor Profile", "Full Telemetry Tracking", "Zero-PII Anonymous Quantization"],
        ["Deployment Model", "Native App / Web", "Native Mobile App Only", "Native App / Subscription", "Cross-Platform Zero-Install PWA"]
    ]
    for idx, r_data in enumerate(comp_rows):
        row = tbl_comp.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_comp[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i > 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 4: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

def build_chapter_3(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-3", "RESEARCH GAPS OF EXISTING METHODS")

    helper.add_subtopic_heading(doc, "3.1 THE 'DARK FIGURE OF CRIME' AND UNDER-REPORTING FRICTION")
    helper.add_body_paragraph(doc, "The most pervasive barrier to urban safety management is the structural under-reporting of non-lethal street harassment. In conventional municipal and police architectures, lodging a formal complaint requires the victim to physically visit a police station, reveal sensitive personal identity details, submit to adversarial bureaucratic scrutiny, and risk societal stigmatization. For working women, university students, and marginalized commuters, this procedural friction is prohibitive.")
    helper.add_body_paragraph(doc, "As a direct consequence, municipal authorities possess almost zero spatial intelligence regarding micro-level hazards—such as persistent catcalling near a particular railway underpass, broken streetlights across a 300-meter residential lane, or aggressive loitering outside an unmonitored bus shelter. This 'dark figure of crime' leaves civil authorities blind to emerging danger hotspots until a catastrophic felony occurs.")

    helper.add_subtopic_heading(doc, "3.2 REACTIVE PANIC BUTTONS VS. PREVENTIVE DECISION SUPPORT")
    helper.add_body_paragraph(doc, "Contemporary commercial mobile safety solutions (e.g., bSafe, Life360, personal SOS alarms) suffer from a critical flaw: they are entirely reactive. They operate on the assumption that safety is adequately served if a victim can push a button while an assault is underway. This assumption violates fundamental principles of cognitive ergonomics and trauma psychology.")
    helper.add_body_paragraph(doc, "Under acute terror or sudden physical ambush, the sympathetic nervous system triggers intense vasoconstriction, motor tremor, and severe cognitive freeze. Victims are frequently physically restrained, have their devices stripped from their hands, or are unable to remember pin codes and unlock gestures. By the time a reactive panic alarm is successfully sounded, physical violence has already commenced. Existing systems offer zero preventive guidance: they do not help a lone commuter evaluate route alternatives or steer clear of deserted, unlit corridors prior to embarking on a journey.")

    helper.add_subtopic_heading(doc, "3.3 LACK OF SPATIAL-TEMPORAL HAZARD DECAY DYNAMICS")
    helper.add_body_paragraph(doc, "A critical mathematical deficiency in existing crime-mapping and academic safety-navigation platforms is the treatment of incident data as static, immutable points. In dynamic urban environments, spatial risk is highly transient. A deserted corner where a harassment incident occurred four weeks ago may undergo intense municipal rectification—such as the installation of high-mast LED floodlights, establishment of a police beat kiosk, or increased pedestrian footfall from new commercial establishments.")
    helper.add_body_paragraph(doc, "Conversely, an area historically considered safe may experience sudden streetlight power failure or temporary construction blockades that drastically elevate vulnerability. Existing systems lack an exponential temporal decay function that systematically discounts historical incident penalties over time while dynamically incorporating real-time community reports. Without continuous mathematical decay, routing algorithms permanently stigmatize urban neighborhoods, misallocating civic concern and misguiding pedestrian commuters.")

    helper.add_subtopic_heading(doc, "3.4 DEANONYMIZATION VULNERABILITIES IN CROWDSOURCED AUDITS")
    helper.add_body_paragraph(doc, "While participatory GIS platforms encourage public submissions, they introduce severe privacy vulnerabilities when naive GPS logging is implemented. When a commuter submits an incident report with full 6-decimal raw GPS coordinates (which resolves to sub-meter spatial precision), the report pinpoint accurately identifies the specific apartment building doorway, residential gate, or exact bus boarding spot of the victim.")
    helper.add_body_paragraph(doc, "In cases of localized stalking or neighborhood harassment, the perpetrator can monitor public crowdsourced feeds, identify the timestamp and exact coordinate pin, and retaliate against the victim with high certainty. This risk of doorway-level deanonymization severely discourages honest community participation. Prior systems lack privacy-preserving spatial obfuscation techniques—such as coordinate quantization or k-anonymity—that protect individual victim anonymity while preserving macro-level spatial utility for routing.")

    helper.add_subtopic_heading(doc, "3.5 ABSENCE OF INTEGRATED CIVIC HAVEN NETWORKS")
    helper.add_body_paragraph(doc, "Finally, current navigation platforms treat the urban environment strictly as a passive topological network of nodes (intersections) and edges (road segments). They overlook the transformative safety value of active, illuminated, and populated third-party civic sanctuaries. When a lone pedestrian experiences discomfort, following, or perceived threat, the most effective survival strategy is not running along an open road, but diverting into a verified 24/7 safe haven—such as a 24-hour pharmacy, staffed fuel station, all-night hospital emergency lobby, or police beat station.")
    helper.add_body_paragraph(doc, "Existing routing algorithms fail to incorporate verified haven locations into their cost functions. They do not reward paths that run adjacent to verified sanctuaries, nor do they provide one-click emergency diversion routing to guide a frightened commuter to the nearest illuminated haven. SafeCity directly resolves this architectural gap by incorporating a verified civic haven layer into both pre-trip pathfinding and active emergency diversion.")

    helper.add_subtopic_heading(doc, "3.6 SUMMARY")
    helper.add_body_paragraph(doc, "Addressing these five interrelated research gaps requires moving beyond siloed panic apps and distance-only navigation engines toward a unified, proactive, privacy-preserving civic ecosystem.")

    doc.add_page_break()

def build_chapter_4(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-4", "PROPOSED METHODOLOGY")

    helper.add_subtopic_heading(doc, "4.1 METHODOLOGY OUTLINE")
    helper.add_body_paragraph(doc, "The proposed SafeCity methodology formulates pedestrian urban transit as a multi-criteria optimization problem over a directed multigraph G = (V, E). The global objective is to discover a path R from origin S to destination D that balances physical transit duration against composite environmental and social risk indicators.")

    helper.add_subtopic_heading(doc, "4.2 TOOLS, TECHNOLOGIES, PLATFORMS USED")
    helper.add_body_paragraph(doc, "The implementation leverages modern open-source web and geospatial technologies: HTML5, CSS3, Tailwind CSS, and Leaflet 1.9 for the client presentation layer; Node.js 18 LTS and Express.js for the RESTful application layer; MySQL 8.0 with spatial extensions and PostGIS-compatible schemas for persistence; Turf.js and client-side JavaScript for spatial-temporal decay math and 3-decimal coordinate quantization; and Twilio SMS SDK alongside the Web Audio API for autonomous multi-stage emergency escalation.")

    helper.add_subtopic_heading(doc, "4.3 PROPOSED ARCHITECTURE")
    helper.add_body_paragraph(doc, "Figure 4.1 illustrates the end-to-end architecture of SafeCity across four functional layers: Client Presentation, Application API, Spatial Analytics & Pathfinding, and Spatial Persistence.")

    img_arch = r"C:\\Users\\AAHIL\\.gemini\\antigravity\\brain\\486918fb-9a46-4b06-97ff-51e77234ab28\\fig1_system_architecture.png"
    helper.add_figure_with_caption(doc, img_arch, "Figure 4.1", "SafeCity End-to-End System Architecture Overview", width_inches=6.0)

    helper.add_subtopic_heading(doc, "4.4 DATA COLLECTION & PREPROCESSING")
    helper.add_sub_subtopic_heading(doc, "4.4.1 Data Source and Composition")
    helper.add_body_paragraph(doc, "Geospatial basemaps are extracted from OpenStreetMap (OSM) road network vectors. Street-level incident data is crowdsourced through anonymous citizen submissions, recording category, severity, narrative, and coordinates. Civic safe havens (pharmacies, fuel stations, hospitals, police kiosks) are curated from verified municipal open datasets and physically verified by community moderators.")

    helper.add_sub_subtopic_heading(doc, "4.4.2 Feature Selection and Structuring")
    helper.add_body_paragraph(doc, "Each road edge e = (u, v) is assigned an attribute vector comprising: geographical edge length dist(e), street lighting classification (illuminated vs unlit), active verified haven count within a 300 m buffer radius, and active incident records falling within the segment\'s spatial buffer.")

    helper.add_sub_subtopic_heading(doc, "4.4.3 Preprocessing Workflow")
    helper.add_body_paragraph(doc, "Upon intake, client coordinates (phi, lambda) are processed via three-decimal quantization:")
    helper.add_body_paragraph(doc, "phi_quantized = round( phi * 10^3 ) * 10^(-3),    lambda_quantized = round( lambda * 10^3 ) * 10^(-3)", bold_prefix="Equation (4.1): ")
    helper.add_body_paragraph(doc, "This bounds spatial precision to a ~110 m x 110 m grid cell, guaranteeing k-anonymity and eliminating doorway-level re-identification under Section 8(1) of the Indian DPDP Act of 2023.")

    helper.add_sub_subtopic_heading(doc, "4.4.4 Sequence Construction for Temporal Learning")
    helper.add_body_paragraph(doc, "To model risk transience, incident penalties are continuously discounted via an exponential half-life decay formulation:")
    helper.add_body_paragraph(doc, "P_eff(i, t) = w_sev(i) * exp( - lambda * (t - t_0) )", bold_prefix="Equation (4.2): ")
    helper.add_body_paragraph(doc, "where lambda = ln(2) / t_half with half-life t_half = 720 hours (30 calendar days). Initial severity weights are: High Severity w_High = 20, Medium Severity w_Medium = 8, and Low Severity w_Low = 4. The composite routing edge cost C(e) utilized by our Dijkstra solver is defined as:")
    helper.add_body_paragraph(doc, "C(e) = alpha * dist(e) + beta * P_hazard(e) - gamma * R_lit(e) - delta * R_haven(e)", bold_prefix="Equation (4.3): ")
    helper.add_body_paragraph(doc, "with alpha = 1.0, beta = 1.8, gamma = 1.2, delta = 1.5, street illumination bonus R_lit(e) = 12, and sanctuary reward R_haven(e) = 15. The normalized Route Safety Score is bounded between 5 and 98:")
    helper.add_body_paragraph(doc, "Score(R) = min( 98, max( 5, 100 - sum(Omega_hazard) + sum(Psi_haven) + Phi_illum ) )", bold_prefix="Equation (4.4): ")

    helper.add_sub_subtopic_heading(doc, "4.4.5 Data Splitting and Validation Strategy")
    helper.add_body_paragraph(doc, "The spatial road network was divided into 120 distinct benchmark segments across North Bengaluru. Algorithmic outputs were validated by comparing predicted safety scores against ground-truth municipal lighting audits and empirical corridor surveys.")

    helper.add_subtopic_heading(doc, "4.5 DATA SET DESCRIPTION")
    helper.add_sub_subtopic_heading(doc, "4.5.1 Data Acquisition and Understanding")
    helper.add_body_paragraph(doc, "The validation testbed encompasses a 3.4 km arterial and residential corridor connecting Hebbal Railway Station to Manyata Embassy Business Park in North Bengaluru. Ground-truth attributes include 120 verified road segments, 14 verified 24/7 safe havens, and 45 crowdsourced incident reports.")

    helper.add_sub_subtopic_heading(doc, "4.5.2 Feature Engineering and Sequence Construction")
    helper.add_body_paragraph(doc, "Attributes were extracted into normalized GeoJSON feature collections, encoding segment IDs, street lighting flags, haven proximity counts, and time-decayed hazard densities.")

    helper.add_sub_subtopic_heading(doc, "4.5.3 Synthetic Data Generation / Corridor Simulation")
    helper.add_body_paragraph(doc, "To stress-test pathfinding scalability under dense reporting loads, 1,000 synthetic incident reports were generated across the corridor topology, evaluating edge cost re-weighting speed and route stability.")

    helper.add_subtopic_heading(doc, "4.6 WORKFLOW DIAGRAM")
    helper.add_body_paragraph(doc, "Figure 4.2 illustrates the end-to-end operational workflow of SafeCity—from client telemetry ingestion through multi-criteria pathfinding, live virtual escort monitoring, and autonomous 180s inactivity escalation.")

    helper.add_callout_box(doc, "SafeCity End-to-End Operational Workflow", [
        ("Step 1: Commuter Session Start", "User launches PWA; Service Worker loads cached shell; GPS establishes client fix."),
        ("Step 2: Proactive Safety Pathfinding", "User inputs destination; API queries spatial graph, applies temporal decay, evaluates illumination and havens, and returns safest route with 0-100 safety score."),
        ("Step 3: 'Walk With Me' Escort Mode", "User activates escort; telemetry loop monitors velocity at 10-second intervals; verifies user progress along the corridor."),
        ("Step 4: Autonomous 180s Watchdog", "If user remains stationary for 180 consecutive seconds in an unverified zone, system sounds warning chime and presents 15s 'I Am Safe' prompt."),
        ("Step 5: Multi-Stage Emergency Escalation", "If prompt expires without confirmation, system sounds 105 dB local siren and broadcasts distress SMS with quantized GPS coordinates to registered emergency contacts.")
    ], border_color="0284C7", bg_color="F0F9FF")

    helper.add_subtopic_heading(doc, "4.7 SUMMARY")
    helper.add_body_paragraph(doc, "The SafeCity methodology provides a mathematically sound, privacy-preserving, and computationally efficient framework for proactive pedestrian safety navigation and autonomous emergency watchdog monitoring.")

    doc.add_page_break()
