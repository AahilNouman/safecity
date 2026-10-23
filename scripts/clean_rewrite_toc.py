# -*- coding: utf-8 -*-
with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_front_matter.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'toc_template_rows = [' in line:
        skip = True
        new_lines.append(line)
        toc_items = [
            '        ("", "ABSTRACT", "5"),\n',
            '        ("", "TABLE OF CONTENTS", "7"),\n',
            '        ("", "LIST OF FIGURES", "9"),\n',
            '        ("", "LIST OF TABLES", "10"),\n',
            '        ("", "ABBREVIATIONS", "11"),\n',
            '        ("1.", "INTRODUCTION\\n  1.1 BACKGROUND AND MOTIVATION\\n  1.2 SCOPE AND LIMITATIONS\\n  1.3 PROBLEM STATEMENT\\n  1.4 MOTIVATION\\n  1.5 METHODOLOGY OVERVIEW\\n  1.6 ORGANIZATION OF THE THESIS\\n       1.6.1 Logical Flow of the Research Work\\n       1.6.2 Contribution Mapping Across Chapters\\n       1.6.3 Chapter Overview Summary", "14\\n14\\n15\\n16\\n16\\n17\\n17\\n17\\n18"),\n',
            '        ("2.", "LITERATURE REVIEW\\n  2.1 INTRODUCTION TO RELATED WORK\\n  2.2 SURVEY OF EXISTING SYSTEMS\\n  2.3 RESEARCH GAPS IDENTIFIED\\n  2.4 OBJECTIVES OF THE STUDY\\n  2.5 SUMMARY", "18\\n18\\n18\\n20\\n20\\n20"),\n',
            '        ("3.", "RESEARCH GAPS OF EXISTING METHODS\\n  3.1 THE \'DARK FIGURE OF CRIME\' AND REPORTING FRICTION\\n  3.2 REACTIVE ALARMS VS. PREVENTIVE DECISION SUPPORT\\n  3.3 LACK OF SPATIAL-TEMPORAL HAZARD DECAY\\n  3.4 DEANONYMIZATION RISKS IN CROWDSOURCED AUDITS\\n  3.5 ABSENCE OF INTEGRATED CIVIC HAVEN NETWORKS\\n  3.6 SUMMARY", "21\\n21\\n22\\n22\\n23\\n23\\n24"),\n',
            '        ("4.", "PROPOSED METHODOLOGY\\n  4.1 METHODOLOGY OUTLINE\\n  4.2 TOOLS, TECHNOLOGIES, PLATFORMS USED\\n  4.3 PROPOSED ARCHITECTURE\\n  4.4 DATA COLLECTION & PREPROCESSING\\n       4.4.1 Data source and composition\\n       4.4.2 Feature selection and structuring\\n       4.4.3 Preprocessing workflow\\n       4.4.4 Sequence construction for temporal learning\\n       4.4.5 Data splitting and validation strategy\\n  4.5 DATA SET DESCRIPTION\\n       4.5.1 Data Acquisition and Understanding\\n       4.5.2 Feature Engineering and Sequence Construction\\n       4.5.3 Synthetic Data Generation / Corridor Simulation\\n  4.6 WORKFLOW DIAGRAM\\n  4.7 SUMMARY", "24\\n24\\n24\\n25\\n25\\n25\\n26\\n26\\n26\\n27\\n27\\n27\\n27\\n28\\n28\\n29"),\n',
            '        ("5.", "OBJECTIVES\\n  5.1 PRIMARY RESEARCH OBJECTIVES\\n  5.2 SPECIFIC TECHNICAL OBJECTIVES\\n  5.3 SOCIETAL AND REGULATORY ALIGNMENT OBJECTIVES\\n  5.4 SUMMARY", "29\\n29\\n29\\n30\\n31"),\n',
            '        ("6.", "SYSTEM DESIGN AND IMPLEMENTATION\\n  6.1 MODULE-WISE IMPLEMENTATION DETAILS\\n       6.1.1 Data Preparation and Encoding Module\\n       6.1.2 Sequence Construction and Windowing Module\\n       6.1.3 Model Architecture and Model Training\\n  6.2 ALGORITHMS\\n  6.3 SCREENSHOTS\\n  6.4 INTEGRATION OF COMPONENTS\\n  6.5 SUMMARY", "31\\n31\\n31\\n31\\n32\\n32\\n32\\n34\\n35"),\n',
            '        ("7.", "TIMELINE FOR EXECUTION OF PROJECT (GANTT CHART)\\n  7.1 WORK BREAKDOWN STRUCTURE & PHASES\\n  7.2 DETAILED EXECUTION SCHEDULE & GANTT CHART\\n  7.3 RISK MANAGEMENT & PROJECT MILESTONES\\n  7.4 SUMMARY", "35\\n35\\n35\\n36\\n37"),\n',
            '        ("8.", "OUTCOMES\\n  8.1 TANGIBLE SOFTWARE DELIVERABLES & REPOSITORIES\\n  8.2 EMPIRICAL SAFETY BENCHMARK DATASET\\n  8.3 CONFERENCE PUBLICATION & SCHOLARLY IMPACT\\n  8.4 ACADEMIC HONORS & INNOVATION AWARDS\\n  8.5 SUMMARY", "37\\n37\\n37\\n38\\n38\\n39"),\n',
            '        ("9.", "RESULTS AND DISCUSSION\\n  9.1 EXPERIMENTAL SETUP AND ENVIRONMENT\\n  9.2 PERFORMANCE METRICS USED\\n  9.3 COMPARATIVE RESULTS\\n  9.4 ANALYSIS AND INTERPRETATION OF RESULTS\\n  9.5 DISCUSSION ON OUTCOMES\\n  9.6 SUMMARY", "39\\n39\\n39\\n39\\n40\\n41\\n42"),\n',
            '        ("", "CONCLUSION AND FUTURE WORK\\n  SUMMARY OF CONTRIBUTIONS\\n  KEY FINDINGS\\n  LIMITATIONS OF THE STUDY\\n  SUGGESTIONS FOR FUTURE RESEARCH\\n  SUMMARY", "42\\n42\\n42\\n43\\n43\\n43"),\n',
            '        ("", "REFERENCES", "43"),\n',
            '        ("", "APPENDIX-A: PSEUDOCODE", "44"),\n',
            '        ("", "APPENDIX-B: SCREENSHOTS", "47"),\n',
            '        ("", "APPENDIX-C: ENCLOSURES", "53"),\n',
            '        ("", "APPENDIX-D: ETHICAL & REGULATORY COMPLIANCE", "56")\n',
            '    ]\n'
        ]
        new_lines.extend(toc_items)
        continue
    if skip:
        if line.strip() == ']' or line.strip() == '];':
            skip = False
        continue
    new_lines.append(line)

with open(r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_front_matter.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("TOC cleanly rewritten with proper escape sequences!")
