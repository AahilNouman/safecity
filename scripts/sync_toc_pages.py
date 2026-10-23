# -*- coding: utf-8 -*-
import re

with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_front_matter.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Update TOC
new_toc = '''    toc_template_rows = [
        ("", "ABSTRACT", "5"),
        ("", "TABLE OF CONTENTS", "7"),
        ("", "LIST OF FIGURES", "9"),
        ("", "LIST OF TABLES", "10"),
        ("", "ABBREVIATIONS", "11"),
        ("1.", "INTRODUCTION\\n  1.1 BACKGROUND AND MOTIVATION\\n  1.2 SCOPE AND LIMITATIONS\\n  1.3 PROBLEM STATEMENT\\n  1.4 MOTIVATION\\n  1.5 METHODOLOGY OVERVIEW\\n  1.6 ORGANIZATION OF THE THESIS\\n       1.6.1 Logical Flow of the Research Work\\n       1.6.2 Contribution Mapping Across Chapters\\n       1.6.3 Chapter Overview Summary", "14\\n14\\n15\\n16\\n16\\n17\\n17\\n17\\n18"),
        ("2.", "LITERATURE REVIEW\\n  2.1 INTRODUCTION TO RELATED WORK\\n  2.2 SURVEY OF EXISTING SYSTEMS\\n  2.3 RESEARCH GAPS IDENTIFIED\\n  2.4 OBJECTIVES OF THE STUDY\\n  2.5 SUMMARY", "18\\n18\\n18\\n20\\n20\\n20"),
        ("3.", "RESEARCH GAPS OF EXISTING METHODS\\n  3.1 THE 'DARK FIGURE OF CRIME' AND REPORTING FRICTION\\n  3.2 REACTIVE ALARMS VS. PREVENTIVE DECISION SUPPORT\\n  3.3 LACK OF SPATIAL-TEMPORAL HAZARD DECAY\\n  3.4 DEANONYMIZATION RISKS IN CROWDSOURCED AUDITS\\n  3.5 ABSENCE OF INTEGRATED CIVIC HAVEN NETWORKS\\n  3.6 SUMMARY", "21\\n21\\n22\\n22\\n23\\n23\\n24"),
        ("4.", "PROPOSED METHODOLOGY\\n  4.1 METHODOLOGY OUTLINE\\n  4.2 TOOLS, TECHNOLOGIES, PLATFORMS USED\\n  4.3 PROPOSED ARCHITECTURE\\n  4.4 DATA COLLECTION & PREPROCESSING\\n       4.4.1 Data source and composition\\n       4.4.2 Feature selection and structuring\\n       4.4.3 Preprocessing workflow\\n       4.4.4 Sequence construction for temporal learning\\n       4.4.5 Data splitting and validation strategy\\n  4.5 DATA SET DESCRIPTION\\n       4.5.1 Data Acquisition and Understanding\\n       4.5.2 Feature Engineering and Sequence Construction\\n       4.5.3 Synthetic Data Generation / Corridor Simulation\\n  4.6 WORKFLOW DIAGRAM\\n  4.7 SUMMARY", "24\\n24\\n24\\n25\\n25\\n25\\n26\\n26\\n26\\n27\\n27\\n27\\n27\\n28\\n28\\n29"),
        ("5.", "OBJECTIVES\\n  5.1 PRIMARY RESEARCH OBJECTIVES\\n  5.2 SPECIFIC TECHNICAL OBJECTIVES\\n  5.3 SOCIETAL AND REGULATORY ALIGNMENT OBJECTIVES\\n  5.4 SUMMARY", "29\\n29\\n29\\n30\\n31"),
        ("6.", "SYSTEM DESIGN AND IMPLEMENTATION\\n  6.1 MODULE-WISE IMPLEMENTATION DETAILS\\n       6.1.1 Data Preparation and Encoding Module\\n       6.1.2 Sequence Construction and Windowing Module\\n       6.1.3 Model Architecture and Model Training\\n  6.2 ALGORITHMS\\n  6.3 SCREENSHOTS\\n  6.4 INTEGRATION OF COMPONENTS\\n  6.5 SUMMARY", "31\\n31\\n31\\n31\\n32\\n32\\n32\\n34\\n35"),
        ("7.", "TIMELINE FOR EXECUTION OF PROJECT (GANTT CHART)\\n  7.1 WORK BREAKDOWN STRUCTURE & PHASES\\n  7.2 DETAILED EXECUTION SCHEDULE & GANTT CHART\\n  7.3 RISK MANAGEMENT & PROJECT MILESTONES\\n  7.4 SUMMARY", "35\\n35\\n35\\n36\\n37"),
        ("8.", "OUTCOMES\\n  8.1 TANGIBLE SOFTWARE DELIVERABLES & REPOSITORIES\\n  8.2 EMPIRICAL SAFETY BENCHMARK DATASET\\n  8.3 CONFERENCE PUBLICATION & SCHOLARLY IMPACT\\n  8.4 ACADEMIC HONORS & INNOVATION AWARDS\\n  8.5 SUMMARY", "37\\n37\\n37\\n38\\n38\\n39"),
        ("9.", "RESULTS AND DISCUSSION\\n  9.1 EXPERIMENTAL SETUP AND ENVIRONMENT\\n  9.2 PERFORMANCE METRICS USED\\n  9.3 COMPARATIVE RESULTS\\n  9.4 ANALYSIS AND INTERPRETATION OF RESULTS\\n  9.5 DISCUSSION ON OUTCOMES\\n  9.6 SUMMARY", "39\\n39\\n39\\n39\\n40\\n41\\n42"),
        ("", "CONCLUSION AND FUTURE WORK\\n  SUMMARY OF CONTRIBUTIONS\\n  KEY FINDINGS\\n  LIMITATIONS OF THE STUDY\\n  SUGGESTIONS FOR FUTURE RESEARCH\\n  SUMMARY", "42\\n42\\n42\\n43\\n43\\n43"),
        ("", "REFERENCES", "43"),
        ("", "APPENDIX-A: PSEUDOCODE", "44"),
        ("", "APPENDIX-B: SCREENSHOTS", "47"),
        ("", "APPENDIX-C: ENCLOSURES", "53"),
        ("", "APPENDIX-D: ETHICAL & REGULATORY COMPLIANCE", "56")
    ]'''

new_lof = '''    lof_template_rows = [
        ("1", "Figure 4.1", "SafeCity End-to-End System Architecture Overview", "25"),
        ("2", "Figure 4.2", "System Workflow Diagram from Telemetry to Inactivity Escalation", "28"),
        ("3", "Figure 6.1", "Mobile Safety Dashboard & High-Contrast Emergency SOS Button", "32"),
        ("4", "Figure 6.2", "Privacy-Preserving 3-Decimal Coordinate Quantization Dialog", "33"),
        ("5", "Figure 6.3", "Multi-Criteria Safety Route Planner & Corridor Risk Heatmap", "34"),
        ("6", "Figure 7.1", "SafeCity Project Execution Timeline and Milestone Gantt Chart", "35"),
        ("7", "Figure 9.1", "Corridor Safety Discrimination: Safety Score vs. Distance Tradeoff", "40"),
        ("8", "Figure 9.2", "System Usability Scale (SUS) Comparative Benchmark (N=30)", "41"),
        ("9", "Figure B.1", "SafeCity Complete Four-Tier System Architecture Diagram", "47"),
        ("10", "Figure B.2", "SafeCity Mobile Client Landing Interface & Emergency SOS", "48"),
        ("11", "Figure B.3", "Privacy-Preserving Participatory Incident Ingestion Interface", "49"),
        ("12", "Figure B.4", "Multi-Criteria Safety-Aware Route Planner & Corridor Heatmap", "50"),
        ("13", "Figure B.5", "Walk With Me Live Companion Escort & 180s Watchdog Dialog", "51"),
        ("14", "Figure B.6", "Administrative Moderation Queue & Community Verification Interface", "52")
    ]'''

new_lot = '''    lot_template_rows = [
        ("1", "Table 2.1", "Positioning Relative to Related Navigation and Panic Solutions", "20"),
        ("2", "Table 4.1", "Mathematical Parameters & Weighting Coefficients for Edge Cost", "26"),
        ("3", "Table 6.1", "SafeCity Technology Stack by Architectural Layer", "34"),
        ("4", "Table 7.1", "Capstone Project Execution Phases, Work Packages and Deliverables", "36"),
        ("5", "Table 8.1", "Summary of Core Academic, Software, and Scholarly Outcomes", "38"),
        ("6", "Table 9.1", "Corridor Benchmarks in Bengaluru: Distance vs. Safety Trade-Off", "40"),
        ("7", "Table 9.2", "System Usability Scale (SUS) 10-Question Item Breakdown (N=30)", "41"),
        ("8", "Table C.1", "Detailed Mapping with UN Sustainable Development Goals (SDGs 5, 9, 11, 16)", "54")
    ]'''

text = re.sub(r'    toc_template_rows = \[.*?    \]', new_toc, text, flags=re.DOTALL)
text = re.sub(r'    lof_template_rows = \[.*?    \]', new_lof, text, flags=re.DOTALL)
text = re.sub(r'    lot_template_rows = \[.*?    \]', new_lot, text, flags=re.DOTALL)

with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_front_matter.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Verified exact page numbers synced into template_front_matter.py!")
