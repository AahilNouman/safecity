# -*- coding: utf-8 -*-
"""
Part 1: Front Matter for SafeCity Capstone Thesis
Presidency University, Bengaluru
"""

part1_front_matter = '''
def build_front_matter(doc):
    # 1. Title Page
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
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(20)
    r = p_title.add_run("SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM")
    r.font.name = "Times New Roman"; r.font.size = Pt(18); r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_subm = doc.add_paragraph()
    p_subm.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subm.paragraph_format.space_before = Pt(0)
    p_subm.paragraph_format.space_after = Pt(18)
    p_subm.paragraph_format.line_spacing = 1.3
    r = p_subm.add_run("Submitted in partial fulfillment of the requirements\\nfor the award of the degree of\\n")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.italic = True
    r2 = p_subm.add_run("BACHELOR OF TECHNOLOGY\\nIN\\nCOMPUTER SCIENCE AND ENGINEERING")
    r2.font.name = "Times New Roman"; r2.font.size = Pt(13); r2.font.bold = True
    r2.font.color.rgb = RGBColor(15, 23, 42)

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(10)
    p_by.paragraph_format.space_after = Pt(4)
    r = p_by.add_run("Submitted by:")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.italic = True

    p_auth = doc.add_paragraph()
    p_auth.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_auth.paragraph_format.space_before = Pt(0)
    p_auth.paragraph_format.space_after = Pt(24)
    p_auth.paragraph_format.line_spacing = 1.4
    authors_data = [
        ("MOHAMMED AAHIL NOUMAN", "20231CSE0663"),
        ("AKSHAT SINGH", "20231CSE0609"),
        ("SIDDIQ", "20231CSE0475")
    ]
    for name, usn in authors_data:
        r_n = p_auth.add_run(f"{name} (USN: {usn})\\n")
        r_n.font.name = "Times New Roman"; r_n.font.size = Pt(12); r_n.font.bold = True
        r_n.font.color.rgb = RGBColor(30, 41, 59)

    p_sup = doc.add_paragraph()
    p_sup.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sup.paragraph_format.space_before = Pt(0)
    p_sup.paragraph_format.space_after = Pt(4)
    r = p_sup.add_run("Under the Supervision and Guidance of:")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.italic = True

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_before = Pt(0)
    p_guide.paragraph_format.space_after = Pt(24)
    r_g1 = p_guide.add_run("MR. MUTHURAJU V.\\n")
    r_g1.font.name = "Times New Roman"; r_g1.font.size = Pt(13); r_g1.font.bold = True
    r_g1.font.color.rgb = RGBColor(15, 23, 42)
    r_g2 = p_guide.add_run("Assistant Professor\\nDepartment of Computer Science and Engineering\\nPresidency University, Bengaluru")
    r_g2.font.name = "Times New Roman"; r_g2.font.size = Pt(11)
    r_g2.font.color.rgb = RGBColor(71, 85, 105)

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_year.paragraph_format.space_before = Pt(10)
    p_year.paragraph_format.space_after = Pt(0)
    r = p_year.add_run("ACADEMIC YEAR 2025–2026 | OCTOBER 2026")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.bold = True
    r.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_page_break()

    # 2. Bonafide Certificate
    p_cert_title = doc.add_paragraph()
    p_cert_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_title.paragraph_format.space_before = Pt(24)
    p_cert_title.paragraph_format.space_after = Pt(18)
    r = p_cert_title.add_run("BONAFIDE CERTIFICATE")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    add_body_paragraph(doc, "This is to certify that the Capstone Project Report entitled \\"SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM\\" is a bonafide record of work carried out by MOHAMMED AAHIL NOUMAN (USN: 20231CSE0663), AKSHAT SINGH (USN: 20231CSE0609), and SIDDIQ (USN: 20231CSE0475) in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Computer Science and Engineering by Presidency University, Bengaluru during the academic year 2025–2026.")
    add_body_paragraph(doc, "The project report has been approved as it satisfies the academic requirements prescribed for the degree of Bachelor of Technology in Computer Science and Engineering. The results embodied in this report have not been submitted to any other university or institute for the award of any degree or diploma.")

    p_sig_space = doc.add_paragraph()
    p_sig_space.paragraph_format.space_before = Pt(36)
    p_sig_space.paragraph_format.space_after = Pt(0)

    tbl_sig = doc.add_table(rows=2, cols=3)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sig.autofit = False
    col_w = [Inches(2.0), Inches(2.0), Inches(2.0)]
    sig_data = [
        ["________________________\\nMr. Muthuraju V.\\nAssistant Professor\\nProject Guide",
         "________________________\\nDr. Head of Department\\nProfessor & HOD\\nDepartment of CSE",
         "________________________\\nDr. Dean, SOE\\nDean, School of Engineering\\nPresidency University"],
        ["\\n\\nExternal Examiner 1:\\nSignature: ________________\\nDate: ____________________",
         "",
         "\\n\\nExternal Examiner 2:\\nSignature: ________________\\nDate: ____________________"]
    ]
    for r_i, row in enumerate(tbl_sig.rows):
        for c_i, cell in enumerate(row.cells):
            cell.width = col_w[c_i]
            cell.text = sig_data[r_i][c_i]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.2
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(10)

    doc.add_page_break()

    # 3. Student Declaration
    p_decl = doc.add_paragraph()
    p_decl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_decl.paragraph_format.space_before = Pt(24)
    p_decl.paragraph_format.space_after = Pt(18)
    r = p_decl.add_run("DECLARATION")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    add_body_paragraph(doc, "We, the undersigned students of the Department of Computer Science and Engineering, School of Computer Science and Engineering, Presidency University, Bengaluru, hereby declare that the capstone project work entitled \\"SafeCity: SMART COMMUNITY-BASED WOMEN PROTECTION AND INCIDENT REPORTING PLATFORM\\" submitted by us is an authentic record of our own research and engineering implementation carried out under the supervision of Mr. Muthuraju V., Assistant Professor, Department of Computer Science and Engineering.")
    add_body_paragraph(doc, "We further declare that to the best of our knowledge, this work contains no plagiarized material, and all concepts, algorithms, frameworks, and literature references drawn from external academic and open-source sources have been duly credited and cited according to IEEE standards. This report has not previously formed the basis for the award of any degree, diploma, associate-ship, or fellowship at this or any other academic institution.")

    p_sig_space2 = doc.add_paragraph()
    p_sig_space2.paragraph_format.space_before = Pt(40)
    p_sig_space2.paragraph_format.space_after = Pt(0)

    tbl_dec = doc.add_table(rows=1, cols=3)
    tbl_dec.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_dec.autofit = False
    dec_students = [
        "________________________\\nMohammed Aahil Nouman\\nUSN: 20231CSE0663",
        "________________________\\nAkshat Singh\\nUSN: 20231CSE0609",
        "________________________\\nSiddiq\\nUSN: 20231CSE0475"
    ]
    for c_i, cell in enumerate(tbl_dec.rows[0].cells):
        cell.width = Inches(2.0)
        cell.text = dec_students[c_i]
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.2
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(10)

    p_date = doc.add_paragraph()
    p_date.paragraph_format.space_before = Pt(30)
    p_date.paragraph_format.space_after = Pt(0)
    r = p_date.add_run("Place: Bengaluru\\nDate: October 23, 2026")
    r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.italic = True

    doc.add_page_break()

    # 4. Acknowledgments
    p_ack = doc.add_paragraph()
    p_ack.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack.paragraph_format.space_before = Pt(24)
    p_ack.paragraph_format.space_after = Pt(18)
    r = p_ack.add_run("ACKNOWLEDGMENTS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    add_body_paragraph(doc, "The completion of this capstone research and engineering endeavor would not have been possible without the intellectual guidance, technical encouragement, and material support extended by numerous individuals and institutional bodies at Presidency University, Bengaluru.")
    add_body_paragraph(doc, "First and foremost, we express our deep sense of gratitude and profound indebtedness to our project guide and supervisor, Mr. Muthuraju V., Assistant Professor, Department of Computer Science and Engineering, for his relentless guidance, incisive critique, and patient mentoring throughout the conceptualization, system modeling, threat analysis, and experimental evaluation of the SafeCity platform.")
    add_body_paragraph(doc, "We extend our sincere thanks to the Head of the Department of Computer Science and Engineering, and the Dean of the School of Computer Science and Engineering, for providing the necessary infrastructural resources, laboratory facilities, and institutional ecosystem that enabled the execution and empirical validation of this project.")
    add_body_paragraph(doc, "We also express our heartfelt appreciation to the faculty review committee, laboratory technical staff, and our student peers who volunteered as human evaluators in our System Usability Scale (SUS) field trials across Bengaluru's urban corridors. Finally, we thank our parents and families for their unfailing encouragement, emotional support, and understanding throughout the course of our B.Tech program.")

    doc.add_page_break()

    # 5. Abstract
    p_abs = doc.add_paragraph()
    p_abs.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs.paragraph_format.space_before = Pt(24)
    p_abs.paragraph_format.space_after = Pt(18)
    r = p_abs.add_run("ABSTRACT")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    add_body_paragraph(doc, "This capstone project presents SafeCity, a privacy-first, community-driven civic safety and proactive navigation platform engineered to address the critical vulnerabilities faced by lone women and vulnerable commuters in dynamic metropolitan environments. Urban safety literature and criminological data reveal that over 70% of street-level harassment, stalking, and intimidation incidents constitute a 'dark figure of crime' that goes unrecorded due to station-level reporting friction, fear of reprisal, and social stigma. Existing commercial emergency mobile tools rely almost exclusively on reactive panic alarms triggered after an assault has already commenced, exhibiting severe failure modes during acute cognitive freeze. Furthermore, standard navigation systems optimize strictly for vehicular transit duration or geographical distance, routinely guiding pedestrians through poorly illuminated, unpopulated shortcuts.")
    add_body_paragraph(doc, "SafeCity bridges this gap through a four-tier architecture featuring multi-criteria pathfinding with spatial-temporal hazard decay, an autonomous 180-second stationary virtual escort watchdog ('Walk With Me'), and a verified 24/7 civic safe haven network. To guarantee citizen safety against doorway-level re-identification, our ingestion pipeline enforces 3-decimal GPS coordinate quantization (~110 m spatial cell resolution) in strict compliance with Section 8(1) of the Indian Digital Personal Data Protection (DPDP) Act of 2023. Real-time pathfinding evaluates edges based on lighting status (bonus weight w_lit = 12), refuge proximity (bonus weight w_haven = 15), and temporally decayed hazard penalties. Empirical benchmarks conducted across high-density Bengaluru corridors (Hebbal–Manyata–Nagavara) demonstrate sub-150 ms route computation latency, a 48.9% risk reduction compared to baseline shortest paths, and a battery overhead of under 2.4% per hour. Human evaluation via Brooke's standardized 10-item System Usability Scale (SUS) across 30 evaluators yielded an exceptional mean score of 82.4/100 ('Excellent' / Grade A). SafeCity concretely demonstrates how privacy-preserving participatory GIS and proactive edge weighting empower civic resilience and align with UN Sustainable Development Goals 5, 9, 11, and 16.")

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(8)
    p_kw.paragraph_format.space_after = Pt(0)
    r_kwt = p_kw.add_run("Keywords: ")
    r_kwt.font.name = "Times New Roman"; r_kwt.font.size = Pt(11); r_kwt.font.bold = True
    r_kwv = p_kw.add_run("Participatory GIS, Safety-Aware Pathfinding, Spatial-Temporal Decay, DPDP Act 2023, Women Safety, Virtual Escort, Autonomous Watchdog, System Usability Scale.")
    r_kwv.font.name = "Times New Roman"; r_kwv.font.size = Pt(11); r_kwv.font.italic = True

    doc.add_page_break()

    # 6. Table of Contents
    p_toc = doc.add_paragraph()
    p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc.paragraph_format.space_before = Pt(24)
    p_toc.paragraph_format.space_after = Pt(18)
    r = p_toc.add_run("TABLE OF CONTENTS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_toc = doc.add_table(rows=1, cols=3)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_toc.autofit = False
    set_table_borders(tbl_toc)
    col_w_toc = [Inches(1.2), Inches(4.3), Inches(0.8)]
    headers_toc = ["CHAPTER NO", "TITLE", "PAGE NO"]
    for c_i, h_text in enumerate(headers_toc):
        cell = tbl_toc.rows[0].cells[c_i]
        cell.width = col_w_toc[c_i]
        cell.text = h_text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    toc_entries = [
        ("", "ABSTRACT", "5"),
        ("", "TABLE OF CONTENTS", "6"),
        ("", "LIST OF FIGURES", "8"),
        ("", "LIST OF TABLES", "9"),
        ("", "ABBREVIATIONS", "10"),
        ("1.", "INTRODUCTION\\n  1.1 BACKGROUND AND MOTIVATION\\n  1.2 SCOPE AND LIMITATIONS\\n  1.3 PROBLEM STATEMENT\\n  1.4 METHODOLOGY OVERVIEW\\n  1.5 ORGANIZATION OF THE THESIS\\n       1.5.1 Logical Flow of the Research Work\\n       1.5.2 Contribution Mapping Across Chapters\\n       1.5.3 Chapter Overview Summary", "12\\n12\\n13\\n14\\n14\\n15\\n15\\n15\\n16"),
        ("2.", "LITERATURE SURVEY\\n  2.1 PARTICIPATORY SAFETY SENSING & CROWDSOURCED AUDITS\\n  2.2 SAFETY-AWARE & MULTI-OBJECTIVE NAVIGATION\\n  2.3 MOBILE PANIC HARDWARE & WEARABLE SOS SYSTEMS\\n  2.4 SPATIAL CLUSTERING & HAZARD ANALYTICS\\n  2.5 POSITIONING RELATIVE TO RELATED WORK", "17\\n17\\n17\\n18\\n19\\n19"),
        ("3.", "RESEARCH GAPS OF EXISTING METHODS\\n  3.1 THE 'DARK FIGURE OF CRIME' AND REPORTING FRICTION\\n  3.2 REACTIVE ALARMS VS. PREVENTIVE DECISION SUPPORT\\n  3.3 LACK OF SPATIAL-TEMPORAL HAZARD DECAY\\n  3.4 DEANONYMIZATION RISKS IN CROWDSOURCED AUDITS\\n  3.5 ABSENCE OF INTEGRATED CIVIC HAVEN NETWORKS", "21\\n21\\n21\\n22\\n22\\n23"),
        ("4.", "PROPOSED METHODOLOGY\\n  4.1 SYSTEM OVERVIEW & THEORETICAL FORMULATION\\n  4.2 MULTI-CRITERIA SAFETY COST FUNCTION & EDGE WEIGHTING\\n  4.3 SPATIAL-TEMPORAL HAZARD PENALTY DECAY DYNAMICS\\n  4.4 CORRIDOR ILLUMINATION & BUILT-ENVIRONMENT SCORING\\n  4.5 VERIFIED SANCTUARY PROXIMITY REWARDS\\n  4.6 PRIVACY-PRESERVING 3-DECIMAL QUANTIZATION", "24\\n24\\n24\\n25\\n26\\n26\\n26"),
        ("5.", "OBJECTIVES\\n  5.1 PRIMARY RESEARCH OBJECTIVES\\n  5.2 SPECIFIC TECHNICAL OBJECTIVES\\n  5.3 SOCIETAL AND REGULATORY ALIGNMENT OBJECTIVES", "28\\n28\\n28\\n29"),
        ("6.", "SYSTEM DESIGN & IMPLEMENTATION\\n  6.1 FOUR-TIER SYSTEM ARCHITECTURE\\n  6.2 FRONTEND PROGRESSIVE WEB APPLICATION (PWA)\\n  6.3 BACKEND REST API & INGESTION PIPELINES\\n  6.4 SPATIAL DATABASE SCHEMA & VECTOR INTEGRATION\\n  6.5 'WALK WITH ME' VIRTUAL ESCORT STATE MACHINE\\n  6.6 EMERGENCY SOS MULTI-STAGE DISPATCH ENGINE", "30\\n30\\n31\\n31\\n32\\n32\\n33"),
        ("7.", "TIMELINE FOR EXECUTION OF PROJECT (GANTT CHART)\\n  7.1 WORK BREAKDOWN STRUCTURE & PHASES\\n  7.2 DETAILED EXECUTION SCHEDULE & GANTT CHART\\n  7.3 RISK MANAGEMENT & PROJECT MILESTONES", "34\\n34\\n35\\n36"),
        ("8.", "OUTCOMES\\n  8.1 TANGIBLE SOFTWARE DELIVERABLES & REPOSITORIES\\n  8.2 EMPIRICAL SAFETY BENCHMARK DATASET\\n  8.3 CONFERENCE PUBLICATION & SCHOLARLY IMPACT\\n  8.4 ACADEMIC HONORS & INNOVATION AWARDS", "37\\n37\\n37\\n37\\n38"),
        ("9.", "RESULTS AND DISCUSSIONS\\n  9.1 EXPERIMENTAL SETUP & BENGALURU URBAN TESTBED\\n  9.2 ROUTE COMPUTATION LATENCY ANALYSIS\\n  9.3 SAFETY DISCRIMINATION & CORRIDOR BENCHMARKS\\n  9.4 MOBILE RESOURCE OVERHEAD & BATTERY UTILIZATION\\n  9.5 SYSTEM USABILITY SCALE (SUS) EVALUATION\\n  9.6 COMPARATIVE BENCHMARK WITH EXISTING SYSTEMS", "39\\n39\\n39\\n39\\n40\\n41\\n42"),
        ("", "CONCLUSION AND FUTURE WORK\\n  SUMMARY OF CONTRIBUTIONS\\n  KEY FINDINGS & PRACTICAL TAKEAWAYS\\n  LIMITATIONS OF THE STUDY\\n  SUGGESTIONS FOR FUTURE RESEARCH", "43\\n43\\n44\\n44\\n44"),
        ("", "REFERENCES", "45"),
        ("", "APPENDIX-A: PSEUDOCODE", "46"),
        ("", "APPENDIX-B: SCREENSHOTS", "49"),
        ("", "APPENDIX-C: ENCLOSURES", "55")
    ]

    for idx, (c_num, title, p_no) in enumerate(toc_entries):
        row = tbl_toc.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([c_num, title, p_no]):
            cell = row.cells[c_i]
            cell.width = col_w_toc[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else (WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else WD_ALIGN_PARAGRAPH.LEFT)
            p.paragraph_format.line_spacing = 1.2
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_num != "" or c_i != 1:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 7. List of Figures
    p_lof = doc.add_paragraph()
    p_lof.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lof.paragraph_format.space_before = Pt(24)
    p_lof.paragraph_format.space_after = Pt(18)
    r = p_lof.add_run("LIST OF FIGURES")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_lof = doc.add_table(rows=1, cols=4)
    tbl_lof.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_lof.autofit = False
    set_table_borders(tbl_lof)
    col_w_lof = [Inches(0.8), Inches(1.3), Inches(3.4), Inches(0.8)]
    headers_lof = ["Sl. No.", "Figure Name", "Caption", "Page No."]
    for c_i, h_text in enumerate(headers_lof):
        cell = tbl_lof.rows[0].cells[c_i]
        cell.width = col_w_lof[c_i]
        cell.text = h_text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    figures_data = [
        ("1", "Figure 6.1", "SafeCity Four-Tier End-to-End System Architecture", "30"),
        ("2", "Figure 7.1", "Project Execution Timeline and Milestone Gantt Chart", "35"),
        ("3", "Figure 9.1", "Corridor Safety Discrimination: Safety Score vs. Distance Tradeoff", "40"),
        ("4", "Figure 9.2", "System Usability Scale (SUS) Comparative Benchmark (N=30)", "41"),
        ("5", "Figure B.1", "SafeCity End-to-End System Architecture Overview", "49"),
        ("6", "Figure B.2", "Mobile Application Safety Dashboard & Emergency SOS Button", "50"),
        ("7", "Figure B.3", "Privacy-Preserving Participatory Incident Ingestion Modal", "51"),
        ("8", "Figure B.4", "Multi-Criteria Safety-Aware Route Planner & Corridor Heatmap", "52"),
        ("9", "Figure B.5", "Walk With Me Live Companion Escort & 180s Watchdog Dialog", "53"),
        ("10", "Figure B.6", "Administrative Moderation Queue & Community Verification Interface", "54")
    ]
    for idx, (sl, f_name, f_cap, p_no) in enumerate(figures_data):
        row = tbl_lof.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([sl, f_name, f_cap, p_no]):
            cell = row.cells[c_i]
            cell.width = col_w_lof[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 1:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 8. List of Tables
    p_lot = doc.add_paragraph()
    p_lot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lot.paragraph_format.space_before = Pt(24)
    p_lot.paragraph_format.space_after = Pt(18)
    r = p_lot.add_run("LIST OF TABLES")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_lot = doc.add_table(rows=1, cols=4)
    tbl_lot.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_lot.autofit = False
    set_table_borders(tbl_lot)
    col_w_lot = [Inches(0.8), Inches(1.3), Inches(3.4), Inches(0.8)]
    headers_lot = ["Sl. No.", "Table Name", "Table Caption", "Page No."]
    for c_i, h_text in enumerate(headers_lot):
        cell = tbl_lot.rows[0].cells[c_i]
        cell.width = col_w_lot[c_i]
        cell.text = h_text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    tables_data = [
        ("1", "Table 2.1", "Positioning Relative to Related Navigation and Panic Solutions", "19"),
        ("2", "Table 4.1", "Mathematical Parameters & Weighting Coefficients for Edge Cost", "27"),
        ("3", "Table 6.1", "SafeCity Technology Stack by Architectural Layer", "31"),
        ("4", "Table 7.1", "Capstone Project Execution Phases, Work Packages and Deliverables", "35"),
        ("5", "Table 8.1", "Summary of Core Academic, Software, and Scholarly Outcomes", "38"),
        ("6", "Table 9.1", "Corridor Benchmarks in Bengaluru: Distance vs. Safety Trade-Off", "40"),
        ("7", "Table 9.2", "System Usability Scale (SUS) 10-Question Item Breakdown (N=30)", "41"),
        ("8", "Table C.1", "Detailed Mapping with UN Sustainable Development Goals (SDGs 5, 9, 11, 16)", "56")
    ]
    for idx, (sl, t_name, t_cap, p_no) in enumerate(tables_data):
        row = tbl_lot.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([sl, t_name, t_cap, p_no]):
            cell = row.cells[c_i]
            cell.width = col_w_lot[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 1:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # 9. List of Abbreviations
    p_abb = doc.add_paragraph()
    p_abb.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abb.paragraph_format.space_before = Pt(24)
    p_abb.paragraph_format.space_after = Pt(18)
    r = p_abb.add_run("ABBREVIATIONS")
    r.font.name = "Times New Roman"; r.font.size = Pt(16); r.font.bold = True

    tbl_abb = doc.add_table(rows=1, cols=2)
    tbl_abb.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_abb.autofit = False
    set_table_borders(tbl_abb)
    col_w_abb = [Inches(2.0), Inches(4.3)]
    headers_abb = ["Abbreviation", "Full Form"]
    for c_i, h_text in enumerate(headers_abb):
        cell = tbl_abb.rows[0].cells[c_i]
        cell.width = col_w_abb[c_i]
        cell.text = h_text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(10); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    abbreviations_data = [
        ("API", "Application Programming Interface"),
        ("BBMP", "Bruhat Bengaluru Mahanagara Palike (Municipal Corporation)"),
        ("BESCOM", "Bangalore Electricity Supply Company Limited"),
        ("BLE", "Bluetooth Low Energy"),
        ("CDN", "Content Delivery Network"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("CSS", "Cascading Style Sheets"),
        ("DBSCAN", "Density-Based Spatial Clustering of Applications with Noise"),
        ("DPDP Act", "Digital Personal Data Protection Act (India, 2023)"),
        ("FIR", "First Information Report"),
        ("GIS", "Geographic Information System"),
        ("GPS", "Global Positioning System"),
        ("HCI", "Human-Computer Interaction"),
        ("HTML", "HyperText Markup Language"),
        ("HTTP", "HyperText Transfer Protocol"),
        ("HTTPS", "HyperText Transfer Protocol Secure"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("IoT", "Internet of Things"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("KDE", "Kernel Density Estimation"),
        ("NSSO", "National Sample Survey Office"),
        ("OSM", "OpenStreetMap"),
        ("PWA", "Progressive Web Application"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SDG", "Sustainable Development Goal (United Nations)"),
        ("SMS", "Short Message Service"),
        ("SOS", "Save Our Souls (Emergency Distress Signal)"),
        ("SPA", "Single Page Application"),
        ("SQL", "Structured Query Language"),
        ("SUS", "System Usability Scale"),
        ("UI", "User Interface"),
        ("URI", "Uniform Resource Identifier"),
        ("URL", "Uniform Resource Locator"),
        ("USN", "University Seat Number"),
        ("UX", "User Experience"),
        ("W3C", "World Wide Web Consortium")
    ]
    for idx, (abbr, full) in enumerate(abbreviations_data):
        row = tbl_abb.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate([abbr, full]):
            cell = row.cells[c_i]
            cell.width = col_w_abb[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=40, bottom=40, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(9.5)
                if c_i == 0:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()
'''

print("part1_front_matter.py cleanly written.")
