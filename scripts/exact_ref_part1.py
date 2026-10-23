# -*- coding: utf-8 -*-
"""
Part 1: Front Matter for Exact Reference B.Tech Thesis Report
Strictly structured according to the Presidency University Reference Template.
Synchronized with exact verified PDF page numbers.
"""

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def build_front_matter(doc, helper):
    # 1. Title / Cover Page
    p_univ = doc.add_paragraph()
    p_univ.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_univ.paragraph_format.space_before = Pt(36)
    p_univ.paragraph_format.space_after = Pt(2)
    r = p_univ.add_run("PRESIDENCY UNIVERSITY, BENGALURU")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sch = doc.add_paragraph()
    p_sch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sch.paragraph_format.space_before = Pt(0)
    p_sch.paragraph_format.space_after = Pt(2)
    r = p_sch.add_run("SCHOOL OF COMPUTER SCIENCE AND ENGINEERING")
    r.font.name = "Times New Roman"; r.font.size = Pt(13); r.font.bold = True
    r.font.color.rgb = RGBColor(51, 65, 85)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(0)
    p_dept.paragraph_format.space_after = Pt(36)
    r = p_dept.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.font.bold = True
    r.font.color.rgb = RGBColor(71, 85, 105)

    p_rep = doc.add_paragraph()
    p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rep.paragraph_format.space_before = Pt(0)
    p_rep.paragraph_format.space_after = Pt(14)
    r = p_rep.add_run("A CAPSTONE PROJECT REPORT ON")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.font.italic = True
    r.font.color.rgb = RGBColor(100, 116, 139)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(16)
    r = p_title.add_run("SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM")
    r.font.name = "Times New Roman"; r.font.size = Pt(18); r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(12)
    p_sub.paragraph_format.space_after = Pt(18)
    r = p_sub.add_run("Submitted in partial fulfillment of the requirements for the award of the degree of\nBACHELOR OF TECHNOLOGY\nIN\nCOMPUTER SCIENCE AND ENGINEERING")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.bold = True
    r.font.color.rgb = RGBColor(51, 65, 85)

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(16)
    p_by.paragraph_format.space_after = Pt(4)
    r = p_by.add_run("Submitted by:")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.bold = True; r.font.underline = True

    # Authors Table
    tbl_auth = doc.add_table(rows=1, cols=3)
    tbl_auth.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_auth.autofit = False
    col_w = [Inches(2.1), Inches(2.1), Inches(2.1)]
    auth_data = [
        ("MOHAMMED AAHIL NOUMAN\n(USN: 20231CSE0663)\nProject Lead"),
        ("AKSHAT SINGH\n(USN: 20231CSE0609)\nCore Contributor"),
        ("SIDDIQ\n(USN: 20231CSE0475)\nCore Contributor")
    ]
    for c_i, cell in enumerate(tbl_auth.rows[0].cells):
        cell.width = col_w[c_i]; cell.text = auth_data[c_i]
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True

    p_sup = doc.add_paragraph()
    p_sup.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sup.paragraph_format.space_before = Pt(28)
    p_sup.paragraph_format.space_after = Pt(4)
    r = p_sup.add_run("Under the Supervision of:")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.bold = True; r.font.underline = True

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_before = Pt(2)
    p_guide.paragraph_format.space_after = Pt(28)
    r = p_guide.add_run("Mr. Muthuraju V.\nAssistant Professor, School of Computer Science and Engineering\nPresidency University, Bengaluru, India")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.bold = True

    p_dt = doc.add_paragraph()
    p_dt.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dt.paragraph_format.space_before = Pt(12)
    r = p_dt.add_run("OCTOBER 2026")
    r.font.name = "Times New Roman"; r.font.size = Pt(12); r.font.bold = True

    doc.add_page_break()

    # 2. Bonafide Certificate
    p_cert = doc.add_paragraph()
    p_cert.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert.paragraph_format.space_before = Pt(24); p_cert.paragraph_format.space_after = Pt(18)
    r = p_cert.add_run("BONAFIDE CERTIFICATE")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    helper.add_body_paragraph(doc, "This is to certify that the Capstone Project Report entitled 'SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM' is a bonafide record of work carried out by MOHAMMED AAHIL NOUMAN (USN: 20231CSE0663), AKSHAT SINGH (USN: 20231CSE0609), and SIDDIQ (USN: 20231CSE0475) in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering by Presidency University, Bengaluru during the academic year 2025–2026.")
    helper.add_body_paragraph(doc, "The project report has been approved as it satisfies the academic requirements prescribed for the degree of Bachelor of Technology in Computer Science and Engineering. The results embodied in this report have not been submitted to any other university or institute for the award of any degree or diploma.")

    p_sp = doc.add_paragraph(); p_sp.paragraph_format.space_before = Pt(36)
    tbl_sig = doc.add_table(rows=2, cols=3)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_sig.autofit = False
    col_w_sig = [Inches(2.0), Inches(2.0), Inches(2.0)]
    sig_data = [
        ["________________________\nMr. Muthuraju V.\nAssistant Professor\nProject Guide",
         "________________________\nDr. Head of Department\nProfessor & HOD\nDepartment of CSE",
         "________________________\nDr. Dean, SOE\nDean, School of Engineering\nPresidency University"],
        ["\n\nExternal Examiner 1:\nSignature: ________________\nDate: ____________________", "",
         "\n\nExternal Examiner 2:\nSignature: ________________\nDate: ____________________"]
    ]
    for r_i, row in enumerate(tbl_sig.rows):
        for c_i, cell in enumerate(row.cells):
            cell.width = col_w_sig[c_i]; cell.text = sig_data[r_i][c_i]
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.line_spacing = 1.2
            for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10)

    doc.add_page_break()

    # 3. Student Declaration
    p_dec = doc.add_paragraph()
    p_dec.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec.paragraph_format.space_before = Pt(24); p_dec.paragraph_format.space_after = Pt(18)
    r = p_dec.add_run("DECLARATION")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    helper.add_body_paragraph(doc, "We, the undersigned students of the Department of Computer Science and Engineering, School of Computer Science and Engineering, Presidency University, Bengaluru, hereby declare that the capstone project work entitled 'SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM' submitted by us is an authentic record of our own research and engineering implementation carried out under the supervision of Mr. Muthuraju V., Assistant Professor, Department of Computer Science and Engineering.")
    helper.add_body_paragraph(doc, "We further declare that to the best of our knowledge, this work contains no plagiarized material, and all concepts, algorithms, frameworks, and literature references drawn from external academic and open-source sources have been duly credited and cited according to IEEE standards. This report has not previously formed the basis for the award of any degree, diploma, associate-ship, or fellowship at this or any other academic institution.")

    p_sp2 = doc.add_paragraph(); p_sp2.paragraph_format.space_before = Pt(40)
    tbl_dec = doc.add_table(rows=1, cols=3)
    tbl_dec.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_dec.autofit = False
    dec_students = [
        "________________________\nMohammed Aahil Nouman\nUSN: 20231CSE0663",
        "________________________\nAkshat Singh\nUSN: 20231CSE0609",
        "________________________\nSiddiq\nUSN: 20231CSE0475"
    ]
    for c_i, cell in enumerate(tbl_dec.rows[0].cells):
        cell.width = Inches(2.0); cell.text = dec_students[c_i]
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.line_spacing = 1.2
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10)

    p_dt2 = doc.add_paragraph(); p_dt2.paragraph_format.space_before = Pt(30)
    r = p_dt2.add_run("Place: Bengaluru\nDate: October 23, 2026")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.italic = True

    doc.add_page_break()

    # 4. Acknowledgments
    p_ack = doc.add_paragraph()
    p_ack.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack.paragraph_format.space_before = Pt(24); p_ack.paragraph_format.space_after = Pt(18)
    r = p_ack.add_run("ACKNOWLEDGMENTS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    helper.add_body_paragraph(doc, "The completion of this capstone research and engineering endeavor would not have been possible without the intellectual guidance, technical encouragement, and material support extended by numerous individuals and institutional bodies at Presidency University, Bengaluru.")
    helper.add_body_paragraph(doc, "First and foremost, we express our deep sense of gratitude and profound indebtedness to our project guide and supervisor, Mr. Muthuraju V., Assistant Professor, Department of Computer Science and Engineering, for his relentless guidance, incisive critique, and patient mentoring throughout the conceptualization, system modeling, threat analysis, and experimental evaluation of the SafeCity platform.")
    helper.add_body_paragraph(doc, "We extend our sincere thanks to the Head of the Department of Computer Science and Engineering, and the Dean of the School of Computer Science and Engineering, for providing the necessary infrastructural resources, laboratory facilities, and institutional ecosystem that enabled the execution and empirical validation of this project.")
    helper.add_body_paragraph(doc, "We also express our heartfelt appreciation to the faculty review committee, laboratory technical staff, and our student peers who volunteered as human evaluators in our System Usability Scale (SUS) field trials across Bengaluru's urban corridors. Finally, we thank our parents and families for their unfailing encouragement, emotional support, and understanding throughout the course of our B.Tech program.")

    doc.add_page_break()

    # 5. Abstract (Adapted with exact reference style & tone)
    p_abs = doc.add_paragraph()
    p_abs.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs.paragraph_format.space_before = Pt(24); p_abs.paragraph_format.space_after = Pt(18)
    r = p_abs.add_run("ABSTRACT")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    helper.add_body_paragraph(doc, "This project presents SafeCity, a web-based, human-centred smart community-based women protection and proactive incident reporting platform for Greater Bengaluru (Project ID PRJ_544). Street-level harassment, stalking and poorly lit transit ambushes are pervasive urban vulnerabilities, yet environmental hazard reporting, safety-aware navigation, telemetry monitoring and emergency decision support are frequently studied and deployed in isolation. SafeCity brings selected capabilities together in a single decision-support cockpit, developed as the applied realisation of an integration opportunity identified from modern participatory GIS and criminological literature. The system combines a responsive Progressive Web Application (PWA) frontend, a Node.js/Express.js backend, JWT-based authentication with role-based access control (RBAC), a MySQL 8.0 / PostGIS spatial data layer and a Leaflet/OpenStreetMap geospatial interface.")
    helper.add_body_paragraph(doc, "For the urban safety hazard, a proactive multi-criteria pathfinding engine was developed using spatial-temporal decay modeling, street illumination scoring, and verified safe haven proximity rewards, evaluated along the high-density Hebbal–Manyata Tech Park corridor; a modified Dijkstra solver with exponential penalty discounting is the model served through the REST API. A privacy-preserving coordinate quantization filter (~110 m spatial cell resolution) and an autonomous 180-second stationary virtual escort watchdog were also established. The report states the implementation status transparently: the routing engine is a safety-scoring prototype that balances distance against empirical hazard reports rather than an absolute security guarantee, while crowdsourced civic integrations, regional vernacular NLP, and smart-pole IoT fusion remain future work. SafeCity is intended strictly as an AI-assisted civic decision-support tool operating with human community oversight, complementing law enforcement agencies and municipal corporations such as BBMP.")

    doc.add_page_break()

    # 6. Table of Contents (Matching Reference Structure with Exact PDF Pages)
    p_toc = doc.add_paragraph()
    p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc.paragraph_format.space_before = Pt(24); p_toc.paragraph_format.space_after = Pt(18)
    r = p_toc.add_run("TABLE OF CONTENTS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_toc = doc.add_table(rows=1, cols=3)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_toc.autofit = False
    helper.set_table_borders(tbl_toc)
    col_w_toc = [Inches(1.2), Inches(4.3), Inches(0.8)]
    headers_toc = ["CHAPTER NO", "TITLE", "PAGE NO"]
    for c_i, h_txt in enumerate(headers_toc):
        cell = tbl_toc.rows[0].cells[c_i]; cell.width = col_w_toc[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ref_toc_rows = [
        ("", "ABSTRACT", "5"),
        ("", "TABLE OF CONTENTS", "6"),
        ("", "LIST OF FIGURES", "10"),
        ("", "LIST OF TABLES", "11"),
        ("", "ABBREVIATIONS", "12"),
        ("1.", "INTRODUCTION", "14"),
        ("", "  1.1 BACKGROUND AND MOTIVATION", "14"),
        ("", "  1.2 PROBLEM STATEMENT", "14"),
        ("", "  1.3 SCOPE AND LIMITATIONS", "15"),
        ("", "  1.4 METHODOLOGY OVERVIEW", "15"),
        ("", "  1.5 ORGANIZATION OF THE REPORT", "16"),
        ("", "       1.5.1 LOGICAL FLOW OF THE RESEARCH WORK", "16"),
        ("", "       1.5.2 CHAPTER OVERVIEW SUMMARY", "16"),
        ("2.", "LITERATURE SURVEY", "18"),
        ("", "  2.1 INTRODUCTION TO RELATED WORK", "18"),
        ("", "  2.2 SURVEY OF EXISTING SYSTEMS", "18"),
        ("", "       2.2.1 HUMAN-CENTRED AI AND PARTICIPATORY SAFETY SENSING", "18"),
        ("", "       2.2.2 GEOSPATIAL AND STREET-LEVEL BUILT ENVIRONMENT APPROACHES", "18"),
        ("", "       2.2.3 MULTI-OBJECTIVE PATHFINDING AND SAFETY ROUTE BEHAVIOUR", "18"),
        ("", "       2.2.4 UNCERTAINTY-AWARE SPATIAL-TEMPORAL RISK MAPPING", "19"),
        ("", "       2.2.5 REACTIVE HARDWARE VS. PROACTIVE DECISION SUPPORT", "19"),
        ("", "       2.2.6 OPERATIONAL TELEMETRY AND PRIVACY-PRESERVING REGULATORY ARCHITECTURES", "19"),
        ("", "  2.3 TECHNOLOGICAL FOUNDATIONS", "19"),
        ("", "  2.4 SUMMARY", "20"),
        ("3.", "RESEARCH GAPS OF EXISTING METHODS", "21"),
        ("", "  3.1 RESEARCH GAPS IDENTIFIED", "21"),
        ("", "  3.2 GAP ADDRESSED BY THIS WORK", "21"),
        ("", "  3.3 SUMMARY", "22"),
        ("4.", "PROPOSED METHODOLOGY", "23"),
        ("", "  4.1 METHODOLOGY OUTLINE", "23"),
        ("", "  4.2 TOOLS, TECHNOLOGIES AND PLATFORMS USED", "23"),
        ("", "  4.3 PROPOSED ARCHITECTURE", "24"),
        ("", "  4.4 DATA COLLECTION AND PREPROCESSING", "24"),
        ("", "       4.4.1 DATA SOURCE AND COMPOSITION", "24"),
        ("", "       4.4.2 FEATURE SELECTION AND STRUCTURING", "25"),
        ("", "       4.4.3 PREPROCESSING WORKFLOW", "25"),
        ("", "       4.4.4 DATA SPLITTING AND VALIDATION STRATEGY", "25"),
        ("", "  4.5 SAFETY MODULES", "25"),
        ("", "       4.5.1 PROACTIVE ROUTE SAFETY SCORING", "25"),
        ("", "       4.5.2 VIRTUAL ESCORT & INACTIVITY WATCHDOG MODULE", "26"),
        ("", "       4.5.3 VERIFIED CIVIC SAFE HAVEN MODULE", "26"),
        ("", "  4.6 WORKFLOW DIAGRAM", "26"),
        ("", "  4.7 SUMMARY", "27"),
        ("5.", "OBJECTIVES", "28"),
        ("", "  5.1 AIM", "28"),
        ("", "  5.2 SPECIFIC OBJECTIVES", "28"),
        ("", "  5.3 OUT-OF-SCOPE ITEMS", "29"),
        ("6.", "SYSTEM DESIGN & IMPLEMENTATION", "30"),
        ("", "  6.1 MODULE-WISE IMPLEMENTATION DETAILS", "30"),
        ("", "       6.1.1 FRONTEND INTERFACE", "30"),
        ("", "       6.1.2 BACKEND AND API", "30"),
        ("", "       6.1.3 MACHINE-LEARNING & SPATIAL DECAY MODULE", "31"),
        ("", "       6.1.4 DATABASE", "31"),
        ("", "       6.1.5 GEOSPATIAL INTERFACE", "31"),
        ("", "       6.1.6 AUTHENTICATION AND ROLE-BASED ACCESS CONTROL", "31"),
        ("", "  6.2 ALGORITHMS", "31"),
        ("", "  6.3 SCREENSHOTS", "32"),
        ("", "  6.4 INTEGRATION OF COMPONENTS", "32"),
        ("", "  6.5 DEPLOYMENT", "32"),
        ("", "  6.6 SUMMARY", "33"),
        ("7.", "TIMELINE FOR EXECUTION OF PROJECT (GANTT CHART)", "34"),
        ("", "  7.1 PROJECT PHASES", "34"),
        ("", "  7.2 GANTT CHART", "34"),
        ("8.", "OUTCOMES", "36"),
        ("", "  8.1 TECHNICAL OUTCOMES", "36"),
        ("", "  8.2 ACADEMIC OUTCOMES", "36"),
        ("", "  8.3 SOCIETAL RELEVANCE", "37"),
        ("9.", "RESULTS AND DISCUSSIONS", "38"),
        ("", "  9.1 EXPERIMENTAL SETUP AND ENVIRONMENT", "38"),
        ("", "  9.2 PERFORMANCE METRICS USED", "38"),
        ("", "  9.3 COMPARATIVE RESULTS", "38"),
        ("", "  9.4 ANALYSIS AND INTERPRETATION OF RESULTS", "39"),
        ("", "  9.5 DISCUSSION ON OUTCOMES", "40"),
        ("", "  9.6 SUMMARY", "40"),
        ("", "CONCLUSION AND FUTURE WORK", "41"),
        ("", "  SUMMARY OF CONTRIBUTIONS", "41"),
        ("", "  KEY FINDINGS", "41"),
        ("", "  LIMITATIONS OF THE STUDY", "41"),
        ("", "  SUGGESTIONS FOR FUTURE RESEARCH", "42"),
        ("", "  SUMMARY", "42"),
        ("", "REFERENCES", "43"),
        ("", "APPENDIX-A: PSEUDOCODE", "44"),
        ("", "APPENDIX-B: SCREENSHOTS", "47"),
        ("", "APPENDIX-C: ENCLOSURES", "53")
    ]
    for idx, (c_num, title, p_no) in enumerate(ref_toc_rows):
        row = tbl_toc.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([c_num, title, p_no]):
            cell = row.cells[c_i]; cell.width = col_w_toc[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else (WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else WD_ALIGN_PARAGRAPH.LEFT)
            p.paragraph_format.line_spacing = 1.2
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_num != "" or c_i != 1: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 7. List of Figures (Exact Reference Table Format with Exact Pages)
    p_lof = doc.add_paragraph()
    p_lof.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lof.paragraph_format.space_before = Pt(24); p_lof.paragraph_format.space_after = Pt(18)
    r = p_lof.add_run("LIST OF FIGURES")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_lof = doc.add_table(rows=1, cols=4)
    tbl_lof.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_lof.autofit = False
    helper.set_table_borders(tbl_lof)
    col_w_lof = [Inches(0.8), Inches(1.3), Inches(3.4), Inches(0.8)]
    headers_lof = ["Sl. No.", "Figure Name", "Caption", "Page No."]
    for c_i, h_txt in enumerate(headers_lof):
        cell = tbl_lof.rows[0].cells[c_i]; cell.width = col_w_lof[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ref_lof_rows = [
        ("1", "Figure 4.1", "Layered architecture of SafeCity", "24"),
        ("2", "Figure 4.2", "Incident ingestion and pathfinding pipeline", "26"),
        ("3", "Figure 4.3", "Decision-support workflow with human review", "26"),
        ("4", "Figure 6.1", "Request flow for a safety route calculation", "32"),
        ("5", "Figure 7.1", "Indicative Gantt chart of the project", "34"),
        ("6", "Figure B.1", "SafeCity complete four-tier system architecture diagram", "47"),
        ("7", "Figure B.2", "Mobile dashboard and emergency SOS screen", "48"),
        ("8", "Figure B.3", "Privacy-preserving incident reporting modal", "49"),
        ("9", "Figure B.4", "Route planner and corridor heatmap screen", "50"),
        ("10", "Figure B.5", "Walk With Me companion escort screen", "51"),
        ("11", "Figure B.6", "Moderation queue & verification screen", "52")
    ]
    for idx, (sl, f_name, f_cap, p_no) in enumerate(ref_lof_rows):
        row = tbl_lof.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([sl, f_name, f_cap, p_no]):
            cell = row.cells[c_i]; cell.width = col_w_lof[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 1: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 8. List of Tables (Exact Reference Table Format with Exact Pages)
    p_lot = doc.add_paragraph()
    p_lot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lot.paragraph_format.space_before = Pt(24); p_lot.paragraph_format.space_after = Pt(18)
    r = p_lot.add_run("LIST OF TABLES")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_lot = doc.add_table(rows=1, cols=4)
    tbl_lot.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_lot.autofit = False
    helper.set_table_borders(tbl_lot)
    col_w_lot = [Inches(0.8), Inches(1.3), Inches(3.4), Inches(0.8)]
    headers_lot = ["Sl. No.", "Table Name", "Caption", "Page No."]
    for c_i, h_txt in enumerate(headers_lot):
        cell = tbl_lot.rows[0].cells[c_i]; cell.width = col_w_lot[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ref_lot_rows = [
        ("1", "Table 1.1", "Chapter-wise overview of the report", "16"),
        ("2", "Table 2.1", "Summary of the reviewed studies and their relevance to SafeCity", "19"),
        ("3", "Table 3.1", "Research gaps identified and the response taken in SafeCity", "21"),
        ("4", "Table 4.1", "Tools and technologies used in SafeCity", "23"),
        ("5", "Table 4.2", "Dataset summary", "24"),
        ("6", "Table 6.1", "Functional groups of backend endpoints", "30"),
        ("7", "Table 6.2", "User roles in SafeCity", "31"),
        ("8", "Table 8.1", "Current module status", "36"),
        ("9", "Table 9.1", "Corridor route evaluation (Hebbal–Manyata corridor)", "38"),
        ("10", "Table C.1", "Mapping of SafeCity to the Sustainable Development Goals", "54")
    ]
    for idx, (sl, t_name, t_cap, p_no) in enumerate(ref_lot_rows):
        row = tbl_lot.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([sl, t_name, t_cap, p_no]):
            cell = row.cells[c_i]; cell.width = col_w_lot[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 1: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 9. Abbreviations (Exact Reference Table Format)
    p_abb = doc.add_paragraph()
    p_abb.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abb.paragraph_format.space_before = Pt(24); p_abb.paragraph_format.space_after = Pt(18)
    r = p_abb.add_run("ABBREVIATIONS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_abb = doc.add_table(rows=1, cols=2)
    tbl_abb.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl_abb.autofit = False
    helper.set_table_borders(tbl_abb)
    col_w_abb = [Inches(1.8), Inches(4.5)]
    headers_abb = ["Abbreviation", "Full Form"]
    for c_i, h_txt in enumerate(headers_abb):
        cell = tbl_abb.rows[0].cells[c_i]; cell.width = col_w_abb[c_i]; cell.text = h_txt
        helper.set_cell_background(cell, "0F172A")
        helper.set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs: run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True; run.font.color.rgb = RGBColor(255, 255, 255)

    ref_abb_rows = [
        ("AI", "Artificial Intelligence"),
        ("API", "Application Programming Interface"),
        ("BBMP", "Bruhat Bengaluru Mahanagara Palike"),
        ("CCTV", "Closed-Circuit Television"),
        ("CDN", "Content Delivery Network"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("DPDP", "Digital Personal Data Protection (Act of 2023)"),
        ("GIS", "Geographic Information System"),
        ("GPS", "Global Positioning System"),
        ("HMAC", "Hash-Based Message Authentication Code"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("IoT", "Internet of Things"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("K-Anonymity", "Statistical Privacy Ingestion Guarantee Model"),
        ("NCRB", "National Crime Records Bureau"),
        ("NLP", "Natural Language Processing"),
        ("OSM", "OpenStreetMap"),
        ("PWA", "Progressive Web Application"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("RSS", "Route Safety Score"),
        ("SDG", "Sustainable Development Goal"),
        ("SMS", "Short Message Service"),
        ("SOS", "Save Our Souls (Emergency Distress Broadcast)"),
        ("SUS", "System Usability Scale"),
        ("TLS", "Transport Layer Security"),
        ("UI", "User Interface"),
        ("USN", "University Seat Number")
    ]
    for idx, (abb, ff) in enumerate(ref_abb_rows):
        row = tbl_abb.add_row(); bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([abb, ff]):
            cell = row.cells[c_i]; cell.width = col_w_abb[c_i]; cell.text = t_val
            helper.set_cell_background(cell, bg)
            helper.set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 0: run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

print("Part 1 module loaded successfully.")
