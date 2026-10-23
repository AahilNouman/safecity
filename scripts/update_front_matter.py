# -*- coding: utf-8 -*-
import re

with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\part1_front_matter.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_toc_pattern = r'    toc_entries = \[.*?    \]'
new_toc = '''    toc_entries = [
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
    ]'''

new_lof = '''    figures_data = [
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
    ]'''

new_lot = '''    tables_data = [
        ("1", "Table 2.1", "Positioning Relative to Related Navigation and Panic Solutions", "19"),
        ("2", "Table 4.1", "Mathematical Parameters & Weighting Coefficients for Edge Cost", "27"),
        ("3", "Table 6.1", "SafeCity Technology Stack by Architectural Layer", "31"),
        ("4", "Table 7.1", "Capstone Project Execution Phases, Work Packages and Deliverables", "35"),
        ("5", "Table 8.1", "Summary of Core Academic, Software, and Scholarly Outcomes", "38"),
        ("6", "Table 9.1", "Corridor Benchmarks in Bengaluru: Distance vs. Safety Trade-Off", "40"),
        ("7", "Table 9.2", "System Usability Scale (SUS) 10-Question Item Breakdown (N=30)", "41"),
        ("8", "Table C.1", "Detailed Mapping with UN Sustainable Development Goals (SDGs 5, 9, 11, 16)", "56")
    ]'''

text = re.sub(old_toc_pattern, new_toc, text, flags=re.DOTALL)
text = re.sub(r'    figures_data = \[.*?    \]', new_lof, text, flags=re.DOTALL)
text = re.sub(r'    tables_data = \[.*?    \]', new_lot, text, flags=re.DOTALL)

with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\part1_front_matter.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("part1_front_matter.py successfully updated with verified exact page numbers!")
