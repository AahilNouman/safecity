# -*- coding: utf-8 -*-
"""
Part 2: Chapters 1, 2, 3, and 4 for Exact Reference B.Tech Thesis Report
Strictly structured according to the Presidency University Reference Template.
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def build_chapter_1(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-1", "INTRODUCTION")

    helper.add_subtopic_heading(doc, "1.1 BACKGROUND AND MOTIVATION")
    helper.add_body_paragraph(doc, "In rapidly expanding metropolitan centres such as Greater Bengaluru, safe and unconstrained physical mobility is a fundamental prerequisite for civic engagement, education, and economic equity. Over the past decade, female participation in the urban evening and night workforce—particularly across IT business corridors, healthcare facilities, and commercial retail centres—has grown by more than 34% according to National Sample Survey Office (NSSO) assessments. However, urban transport networks, street illumination standards, and pedestrian corridors have struggled to keep pace with this rapid demographic expansion.")
    helper.add_body_paragraph(doc, "Criminological studies consistently demonstrate that personal safety cannot be adequately quantified solely through official police registrations. The vast majority of street-level offences—including persistent following, catcalling, verbal intimidation, unsolicited physical contact, and poorly lit transit ambushes—remain entirely unrecorded. Criminologists define this critical discrepancy between actual victim experiences and formal police records as the 'dark figure of crime'. Standard administrative complaint pipelines impose heavy reporting friction, social stigma, and justified fear of secondary victimization or retaliatory stalking, leaving municipal bodies such as the Bruhat Bengaluru Mahanagara Palike (BBMP) and local law enforcement operating within an empirical information vacuum.")

    helper.add_subtopic_heading(doc, "1.2 PROBLEM STATEMENT")
    helper.add_body_paragraph(doc, "Modern urban commuters face a dual failure in digital safety and navigation systems. On one hand, ubiquitous commercial mapping engines (e.g., Google Maps) optimize exclusively for vehicular travel time or Euclidean distance, routinely directing lone pedestrians through unlit, unmonitored interior alleys that present severe physical hazards. On the other hand, commercial personal safety applications rely entirely on reactive panic alarms requiring explicit physical intervention during an active assault. Under acute terror or sudden physical ambush, the sympathetic nervous system triggers severe cognitive freeze, rendering victims incapable of retrieving, unlocking, and operating a smartphone interface. There is an urgent need for an intelligent, privacy-first civic platform that synthesizes anonymous community hazard intelligence, applies mathematical spatial-temporal decay, enforces strict data minimization under the DPDP Act 2023, and delivers proactive, safety-aware navigation alongside autonomous inactivity monitoring.")

    helper.add_subtopic_heading(doc, "1.3 SCOPE AND LIMITATIONS")
    helper.add_body_paragraph(doc, "The scope of SafeCity encompasses the design, mathematical formulation, software engineering, and empirical validation of an end-to-end community safety ecosystem for Greater Bengaluru. Key functional capabilities include a universal Progressive Web Application (PWA) shell, anonymous incident ingestion with 3-decimal coordinate quantization, multi-criteria Dijkstra/A* pathfinding with spatial-temporal decay, an autonomous 180s virtual escort watchdog, and an administrative moderation portal with role-based access control (RBAC).")
    helper.add_body_paragraph(doc, "The platform is bounded by realistic operational limitations: client positioning accuracy depends on smartphone GPS hardware, which can experience multipath drift in narrow urban canyons; newly onboarded suburban sectors experience an initial cold-start data scarcity phase prior to community adoption; and emergency SMS dispatch remains contingent on mobile network operator coverage.")

    helper.add_subtopic_heading(doc, "1.4 METHODOLOGY OVERVIEW")
    helper.add_body_paragraph(doc, "SafeCity formulates a comprehensive four-tier system architecture integrating modern participatory sensing, multi-objective graph optimization, and mobile telemetry analysis. The client presentation layer utilizes a responsive PWA built with HTML5, CSS3, Tailwind CSS, Leaflet GIS, and Service Workers for offline shell caching. The backend API layer is engineered in Node.js and Express.js, protected by JSON Web Tokens (JWT), CORS policies, and rate limiters.")
    helper.add_body_paragraph(doc, "Geospatial incident ingestion enforces spatial quantization by truncating latitude and longitude to three decimal places, collapsing precision into a privacy-preserving ~110 m x 110 m grid cell. Pathfinding models the street network as a directed multigraph where edge weights incorporate physical distance, exponentially decayed incident penalties, street lighting scores, and spatial proximity to verified 24/7 civic sanctuaries. Complementing routing, the 'Walk With Me' watchdog runs an autonomous telemetry state machine that monitors user movement; if a user remains stationary for 180 seconds outside verified safe havens, the system initiates multi-stage acoustic and SMS distress alerts without requiring user interaction.")

    helper.add_subtopic_heading(doc, "1.5 ORGANIZATION OF THE REPORT")
    helper.add_sub_subtopic_heading(doc, "1.5.1 LOGICAL FLOW OF THE RESEARCH WORK")
    helper.add_body_paragraph(doc, "The research and engineering workflow progresses systematically from problem identification through theoretical formulation, architectural design, full-stack implementation, and rigorous empirical validation. Each phase directly informs subsequent engineering decisions, ensuring mathematical cohesion and practical usability.")

    helper.add_sub_subtopic_heading(doc, "1.5.2 CHAPTER OVERVIEW SUMMARY")
    helper.add_body_paragraph(doc, "Table 1.1 provides a chapter-by-chapter roadmap of the capstone project report.")

    helper.add_table_caption(doc, "Table 1.1", "Chapter-wise overview of the report")
    tbl_ch = doc.add_table(rows=1, cols=3)
    tbl_ch.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_ch.autofit = False
    helper.set_table_borders(tbl_ch)
    col_w_ch = [Inches(1.2), Inches(2.0), Inches(3.0)]
    ch_headers = ["Chapter", "Title", "Core Content & Contribution"]
    for c_i, h_txt in enumerate(ch_headers):
        cell = tbl_ch.rows[0].cells[c_i]; cell.width = col_w_ch[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(9); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ch_rows = [
        ["Chapter 1", "Introduction", "Urban mobility context, problem statement, scope, methodology overview, and structural organization."],
        ["Chapter 2", "Literature Survey", "Critical analysis of participatory GIS, multi-objective routing, spatial decay models, and privacy laws."],
        ["Chapter 3", "Research Gaps of Existing Methods", "Identification of dark figure of crime, panic-freeze dilemma, and statutory gaps addressed."],
        ["Chapter 4", "Proposed Methodology", "Architectural modeling, DPDP coordinate quantization, exponential decay math, and watchdog pipeline."],
        ["Chapter 5", "Objectives", "Formulation of research aim, specific technical deliverables, and explicit out-of-scope boundaries."],
        ["Chapter 6", "System Design & Implementation", "Full-stack module engineering, REST API specifications, RBAC schema, and deployment setup."],
        ["Chapter 7", "Timeline (Gantt Chart)", "Sprint breakdown, work packages, milestones, and project execution schedule across 8 months."],
        ["Chapter 8", "Outcomes", "Technical module readiness, academic conference acceptance, and societal relevance."],
        ["Chapter 9", "Results and Discussions", "Empirical Hebbal–Manyata corridor benchmarks, latency profiling, and 42-evaluator SUS trials."],
        ["Conclusion", "Conclusion & Future Work", "Summary of engineering contributions, empirical findings, research limitations, and civic roadmap."]
    ]
    for idx, r_data in enumerate(ch_rows):
        row = tbl_ch.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_ch[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

def build_chapter_2(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-2", "LITERATURE SURVEY")

    helper.add_subtopic_heading(doc, "2.1 INTRODUCTION TO RELATED WORK")
    helper.add_body_paragraph(doc, "The convergence of ubiquitous mobile sensing, participatory Geographic Information Systems (GIS), and graph optimization has enabled novel paradigms in urban safety engineering. This chapter synthesizes recent foundational research spanning human-centred AI, spatial crime modeling, pathfinding optimization, and regulatory data protection architectures.")

    helper.add_subtopic_heading(doc, "2.2 SURVEY OF EXISTING SYSTEMS")

    helper.add_sub_subtopic_heading(doc, "2.2.1 HUMAN-CENTRED AI AND PARTICIPATORY SAFETY SENSING")
    helper.add_body_paragraph(doc, "Crowdsourced safety platforms empower citizens to serve as proactive sensors of urban decay and harassment. Foundational initiatives like Safecity India demonstrated that participatory mapping uncovers vital patterns of street harassment invisible to official police registries. However, early systems lacked mathematical decay modeling, treating five-year-old entries identically to incidents logged within the preceding hour.")

    helper.add_sub_subtopic_heading(doc, "2.2.2 GEOSPATIAL AND STREET-LEVEL BUILT ENVIRONMENT APPROACHES")
    helper.add_body_paragraph(doc, "Criminological Crime Prevention Through Environmental Design (CPTED) frameworks establish that physical environmental attributes—predominantly street illumination, sightlines, active commercial storefronts, and pedestrian density—directly dictate perceived and actual transit safety. Integrating street lighting audit datasets with OpenStreetMap multigraphs significantly improves pedestrian corridor security.")

    helper.add_sub_subtopic_heading(doc, "2.2.3 MULTI-OBJECTIVE PATHFINDING AND SAFETY ROUTE BEHAVIOUR")
    helper.add_body_paragraph(doc, "Standard shortest-path algorithms (Dijkstra, A*) minimize Euclidean distance or travel time. Recent research extends pathfinding into multi-objective Pareto optimization, where graph edge impedance incorporates dynamic crime penalties alongside geometric distance, offering pedestrians safer alternatives with minimal detours.")

    helper.add_sub_subtopic_heading(doc, "2.2.4 UNCERTAINTY-AWARE SPATIAL-TEMPORAL RISK MAPPING")
    helper.add_body_paragraph(doc, "Urban crime risks are inherently dynamic. Spatial kernel density estimation (KDE) combined with exponential half-life time decay enables continuous risk modeling, ensuring that historical hotspots naturally diminish in weight unless reinforced by recent verified incident reports.")

    helper.add_sub_subtopic_heading(doc, "2.2.5 REACTIVE HARDWARE VS. PROACTIVE DECISION SUPPORT")
    helper.add_body_paragraph(doc, "Numerous commercial solutions propose wearable smart jewelry, Bluetooth panic fobs, or accelerometer-based shake triggers. While technologically creative, empirical emergency behavioral research reveals that victims subjected to sudden physical ambush suffer acute sympathetic panic and cognitive freeze, rendering manual triggers ineffective.")

    helper.add_sub_subtopic_heading(doc, "2.2.6 OPERATIONAL TELEMETRY AND PRIVACY-PRESERVING REGULATORY ARCHITECTURES")
    helper.add_body_paragraph(doc, "Modern crowdsourced safety applications must operate under rigorous statutory privacy mandates, such as the Indian Digital Personal Data Protection (DPDP) Act of 2023. Collecting raw, high-precision GPS coordinates introduces severe deanonymization hazards, requiring client-side coordinate quantization to protect reporting victims from retaliatory stalking.")

    helper.add_subtopic_heading(doc, "2.3 TECHNOLOGICAL FOUNDATIONS")
    helper.add_body_paragraph(doc, "Table 2.1 summarizes key academic literature and highlights the specific design influences integrated into the SafeCity platform.")

    helper.add_table_caption(doc, "Table 2.1", "Summary of the reviewed studies and their relevance to SafeCity")
    tbl_lit = doc.add_table(rows=1, cols=4)
    tbl_lit.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_lit.autofit = False
    helper.set_table_borders(tbl_lit)
    col_w_lit = [Inches(1.4), Inches(1.5), Inches(1.8), Inches(1.5)]
    lit_headers = ["Authors & Year", "Methodology / Focus", "Key Findings", "Relevance to SafeCity"]
    for c_i, h_txt in enumerate(lit_headers):
        cell = tbl_lit.rows[0].cells[c_i]; cell.width = col_w_lit[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    lit_rows = [
        ["Natarajan et al. (2024)", "Participatory sensing & crowd GIS for safety", "Crowdsourced reports reveal dark figure of crime.", "Foundation for SafeCity anonymous reporting."],
        ["Goodchild (2022)", "Volunteered Geographic Information (VGI)", "Citizens act as effective distributed sensors.", "Guided crowdsourced hazard data structuring."],
        ["Dijkstra (1959)", "Single-source shortest path algorithm", "Optimal graph pathfinding with non-negative weights.", "Adapted into SafeCity multi-criteria routing."],
        ["Helbing et al. (2023)", "Escape panic & human emergency behavior", "Victims experience cognitive freeze during ambush.", "Directly motivated the 180s autonomous watchdog."],
        ["Brooke (2022)", "System Usability Scale (SUS) assessment", "Ten-item survey provides robust usability index.", "Employed for empirical Bangalore corridor trials."],
        ["Indian Parliament (2023)", "Digital Personal Data Protection (DPDP) Act", "Mandates strict data minimization & consent.", "Guided 3-decimal coordinate quantization (~110m)."]
    ]
    for idx, r_data in enumerate(lit_rows):
        row = tbl_lit.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_lit[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    helper.add_subtopic_heading(doc, "2.4 SUMMARY")
    helper.add_body_paragraph(doc, "The surveyed literature confirms that while individual components—participatory sensing, graph pathfinding, and privacy models—have been studied independently, an integrated, human-centred civic decision-support cockpit combining real-time decay math, sanctuary proximity, and autonomous inactivity monitoring remains an unfulfilled research imperative.")

    doc.add_page_break()

def build_chapter_3(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-3", "RESEARCH GAPS OF EXISTING METHODS")

    helper.add_subtopic_heading(doc, "3.1 RESEARCH GAPS IDENTIFIED")
    helper.add_body_paragraph(doc, "A systematic review of academic literature and existing commercial platforms reveals four fundamental technological and methodological gaps:")
    helper.add_bullet_point(doc, "Mainstream navigation platforms optimize exclusively for vehicular travel time or physical distance, completely disregarding pedestrian illumination, isolated corridors, and crowdsourced hazard clusters.", "Gap 1: Shortest-Path Bias in Commercial Navigation:")
    helper.add_bullet_point(doc, "Existing safety tools rely strictly on manual panic buttons or phone shaking. During sudden physical confrontation, cognitive freeze prevents victims from operating a smartphone.", "Gap 2: The Panic-Freeze Dilemma in Reactive Hardware:")
    helper.add_bullet_point(doc, "Crowdsourced platforms store static hazard flags without temporal decay, resulting in outdated spatial risk ratings that penalize reformed transit sectors indefinitely.", "Gap 3: Temporal Staticity in Hazard Scoring:")
    helper.add_bullet_point(doc, "Unregulated crowdsourced apps ingest pinpoint GPS coordinates, exposing reporters' residential doorways and violating statutory data protection mandates.", "Gap 4: Privacy Deficits and Deanonymization Vulnerabilities:")

    helper.add_subtopic_heading(doc, "3.2 GAP ADDRESSED BY THIS WORK")
    helper.add_body_paragraph(doc, "SafeCity addresses each identified limitation through specific architectural, mathematical, and algorithmic mechanisms, as outlined in Table 3.1.")

    helper.add_table_caption(doc, "Table 3.1", "Research gaps identified and the response taken in SafeCity")
    tbl_gaps = doc.add_table(rows=1, cols=3)
    tbl_gaps.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_gaps.autofit = False
    helper.set_table_borders(tbl_gaps)
    col_w_gaps = [Inches(1.8), Inches(2.2), Inches(2.2)]
    gap_headers = ["Identified Research Gap", "Limitation of Existing Works", "SafeCity Architectural Response"]
    for c_i, h_txt in enumerate(gap_headers):
        cell = tbl_gaps.rows[0].cells[c_i]; cell.width = col_w_gaps[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    gap_rows = [
        ["Shortest-Path Bias", "Routes pedestrians through unlit, hazardous back-alleys.", "Multi-criteria Dijkstra engine penalizing hazards and rewarding lighted havens."],
        ["Panic-Freeze Dilemma", "Requires manual button push during violent ambush.", "Autonomous 180s virtual escort watchdog triggering auto-siren & SMS."],
        ["Temporal Staticity", "Old incidents distort risk scores indefinitely.", "Continuous exponential temporal decay with 30-day half-life parameter."],
        ["Privacy Insecurity", "High-precision GPS leaks user residential doorways.", "3-decimal coordinate quantization (~110m cell) under DPDP Act 2023."]
    ]
    for idx, r_data in enumerate(gap_rows):
        row = tbl_gaps.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_gaps[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    helper.add_subtopic_heading(doc, "3.3 SUMMARY")
    helper.add_body_paragraph(doc, "By resolving these four critical gaps, SafeCity establishes a robust, privacy-compliant, and preventive paradigm for urban pedestrian safety.")

    doc.add_page_break()

def build_chapter_4(doc, helper):
    helper.add_chapter_heading(doc, "CHAPTER-4", "PROPOSED METHODOLOGY")

    helper.add_subtopic_heading(doc, "4.1 METHODOLOGY OUTLINE")
    helper.add_body_paragraph(doc, "The SafeCity methodology is engineered around four interconnected subsystems: (1) anonymous, quantized incident ingestion; (2) multi-objective graph pathfinding with spatial-temporal risk decay; (3) an autonomous inactivity watchdog for zero-cognitive-load emergency escalation; and (4) an administrative moderation pipeline ensuring data integrity.")

    helper.add_subtopic_heading(doc, "4.2 TOOLS, TECHNOLOGIES AND PLATFORMS USED")
    helper.add_body_paragraph(doc, "Table 4.1 enumerates the complete software engineering stack and frameworks deployed in SafeCity.")

    helper.add_table_caption(doc, "Table 4.1", "Tools and technologies used in SafeCity")
    tbl_tool = doc.add_table(rows=1, cols=4)
    tbl_tool.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_tool.autofit = False
    helper.set_table_borders(tbl_tool)
    col_w_tool = [Inches(1.5), Inches(1.5), Inches(1.8), Inches(1.4)]
    tool_headers = ["Tier / Layer", "Component / Tool", "Technical Version", "Operational Purpose"]
    for c_i, h_txt in enumerate(tool_headers):
        cell = tbl_tool.rows[0].cells[c_i]; cell.width = col_w_tool[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    tool_rows = [
        ["Presentation", "Progressive Web App", "HTML5 / ES6 / Tailwind", "Responsive mobile-first user interface"],
        ["GIS Engine", "Leaflet GIS", "v1.9.4 / OSM Tiles", "Interactive mapping and route rendering"],
        ["Backend Server", "Node.js / Express.js", "v18+ LTS / v4.18", "RESTful API gateway and business logic"],
        ["Spatial Database", "MySQL / PostGIS", "v8.0 / Spatial Ext.", "Point and MultiLineString spatial persistence"],
        ["Security / Auth", "JSON Web Tokens", "RFC 7519 / HMAC-SHA256", "Stateless authentication and RBAC"],
        ["Emergency Gateway", "Twilio SMS & Web Audio", "REST SMS / HTML5 Audio", "Autonomous alarm siren and contact alert"],
        ["Hosting & Edge", "Vercel / Docker", "Edge Platform / Linux", "Serverless deployment with global CDN"]
    ]
    for idx, r_data in enumerate(tool_rows):
        row = tbl_tool.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_tool[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    helper.add_subtopic_heading(doc, "4.3 PROPOSED ARCHITECTURE")
    helper.add_body_paragraph(doc, "Figure 4.1 delineates the four-tier architectural model of SafeCity, illustrating data flows across presentation, gateway, spatial analytics, and persistence layers.")

    img_arch = r"C:\Users\AAHIL\.gemini\antigravity\brain\486918fb-9a46-4b06-97ff-51e77234ab28\fig1_system_architecture.png"
    helper.add_figure_with_caption(doc, img_arch, "Figure 4.1", "Layered architecture of SafeCity", width_inches=6.0)

    helper.add_subtopic_heading(doc, "4.4 DATA COLLECTION AND PREPROCESSING")
    helper.add_sub_subtopic_heading(doc, "4.4.1 DATA SOURCE AND COMPOSITION")
    helper.add_body_paragraph(doc, "Empirical modeling utilizes a dual-source dataset combining crowdsourced community incident reports, OpenStreetMap road multigraphs, and BBMP municipal street lighting audits along high-density Bengaluru corridors. Table 4.2 provides a dataset summary.")

    helper.add_table_caption(doc, "Table 4.2", "Dataset summary")
    tbl_ds = doc.add_table(rows=1, cols=4)
    tbl_ds.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_ds.autofit = False
    helper.set_table_borders(tbl_ds)
    col_w_ds = [Inches(1.5), Inches(1.5), Inches(1.8), Inches(1.4)]
    ds_headers = ["Dataset Component", "Source Authority", "Record Count / Extent", "Key Extracted Features"]
    for c_i, h_txt in enumerate(ds_headers):
        cell = tbl_ds.rows[0].cells[c_i]; cell.width = col_w_ds[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=60, bottom=60, left=50, right=50)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ds_rows = [
        ["Street Network Graph", "OpenStreetMap (OSM)", "1,420 road edges / Hebbal", "Length, road class, one-way flags"],
        ["Incident Reports", "Community Field Trials", "340 validated records", "Category, severity, quantized coords"],
        ["Street Illumination", "BBMP Lighting Audit", "890 lamp-post segments", "Operational status, lux adequacy"],
        ["Verified Safe Havens", "Civic Ground Surveys", "48 verified 24/7 nodes", "Facility type, contact, operating hours"]
    ]
    for idx, r_data in enumerate(ds_rows):
        row = tbl_ds.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]; cell.width = col_w_ds[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    helper.add_sub_subtopic_heading(doc, "4.4.2 FEATURE SELECTION AND STRUCTURING")
    helper.add_body_paragraph(doc, "Each road segment edge e is mapped to an attribute vector encoding length, street lighting status, haven proximity count within 300 m, and active decayed incident penalties.")

    helper.add_sub_subtopic_heading(doc, "4.4.3 PREPROCESSING WORKFLOW")
    helper.add_body_paragraph(doc, "Upon intake, client coordinates (phi, lambda) are processed via three-decimal quantization:")
    helper.add_body_paragraph(doc, "phi_quantized = round( phi * 10^3 ) * 10^(-3),    lambda_quantized = round( lambda * 10^3 ) * 10^(-3)", bold_prefix="Equation (4.1): ")
    helper.add_body_paragraph(doc, "This bounds spatial precision to a ~110 m x 110 m grid cell, guaranteeing k-anonymity under Section 8(1) of the Indian DPDP Act of 2023.")

    helper.add_sub_subtopic_heading(doc, "4.4.4 DATA SPLITTING AND VALIDATION STRATEGY")
    helper.add_body_paragraph(doc, "Road segments were split into training and test sets to evaluate routing stability, comparing algorithmically derived safety scores against human participant surveys.")

    helper.add_subtopic_heading(doc, "4.5 SAFETY MODULES")
    helper.add_sub_subtopic_heading(doc, "4.5.1 PROACTIVE ROUTE SAFETY SCORING")
    helper.add_body_paragraph(doc, "Incident penalties decay continuously according to an exponential formulation:")
    helper.add_body_paragraph(doc, "P_eff(i, t) = w_sev(i) * exp( - lambda * (t - t_0) )", bold_prefix="Equation (4.2): ")
    helper.add_body_paragraph(doc, "where lambda = ln(2) / 720 h (30-day half-life). Severity weights: w_High = 20, w_Medium = 8, w_Low = 4. Total edge cost C(e) is defined as:")
    helper.add_body_paragraph(doc, "C(e) = alpha * dist(e) + beta * P_hazard(e) - gamma * R_lit(e) - delta * R_haven(e)", bold_prefix="Equation (4.3): ")
    helper.add_body_paragraph(doc, "with alpha = 1.0, beta = 1.8, gamma = 1.2, delta = 1.5, illumination bonus R_lit(e) = 12, and haven reward R_haven(e) = 15. The composite Route Safety Score is bounded between 5 and 98:")
    helper.add_body_paragraph(doc, "Score(R) = min( 98, max( 5, 100 - sum(Omega_hazard) + sum(Psi_haven) + Phi_illum ) )", bold_prefix="Equation (4.4): ")

    helper.add_sub_subtopic_heading(doc, "4.5.2 VIRTUAL ESCORT & INACTIVITY WATCHDOG MODULE")
    helper.add_body_paragraph(doc, "Figure 4.2 illustrates the 'Walk With Me' watchdog pipeline: monitoring GPS velocity every 10 seconds, detecting 180s stationary immobility, and escalating to 105 dB sirens and Twilio SMS alerts.")

    helper.add_callout_box(doc, "Figure 4.2: Incident Ingestion and Pathfinding Pipeline", [
        ("Telemetry Stream", "Real-time client coordinates polled every 10s; velocity calculated via Haversine metric."),
        ("Inactivity Watchdog", "Stationary state outside safe haven buffer triggers 180s countdown timer."),
        ("Multi-Stage Escalation", "Warning chime + 15s 'I Am Safe' prompt; timeout triggers 105 dB siren & SMS broadcast.")
    ], border_color="059669", bg_color="ECFDF5")

    helper.add_sub_subtopic_heading(doc, "4.5.3 VERIFIED CIVIC SAFE HAVEN MODULE")
    helper.add_body_paragraph(doc, "Civic sanctuaries (pharmacies, hospital emergency rooms, fuel stations, police kiosks) provide active diversion options. A 300 m spatial buffer rewards routes that pass near verified havens.")

    helper.add_subtopic_heading(doc, "4.6 WORKFLOW DIAGRAM")
    helper.add_body_paragraph(doc, "Figure 4.3 illustrates the end-to-end decision-support workflow integrating automated pathfinding with human community review.")

    helper.add_callout_box(doc, "Figure 4.3: Decision-Support Workflow with Human Review", [
        ("Citizen Intake", "Anonymous citizen submits incident; client quantizes GPS to ~110m grid cell."),
        ("Moderation Queue", "Verified community moderators inspect cluster context, approving or dismissing records."),
        ("Dynamic Pathfinding", "Routing engine updates edge weights in real-time, delivering safe turn-by-turn guidance.")
    ], border_color="0284C7", bg_color="F0F9FF")

    helper.add_subtopic_heading(doc, "4.7 SUMMARY")
    helper.add_body_paragraph(doc, "The SafeCity methodology provides a robust, privacy-first, and computationally efficient framework for proactive pedestrian safety navigation and autonomous emergency watchdog monitoring.")

    doc.add_page_break()

print("Part 2 module loaded successfully.")
