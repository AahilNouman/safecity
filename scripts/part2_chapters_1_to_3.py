# -*- coding: utf-8 -*-
"""
Part 2: Chapters 1, 2, and 3 for SafeCity Capstone Thesis
"""

part2_text = '''
def build_chapter_1(doc):
    add_chapter_heading(doc, "CHAPTER-1", "INTRODUCTION")

    add_subtopic_heading(doc, "1.1 BACKGROUND AND MOTIVATION")
    add_body_paragraph(doc, "The rapid pace of global urbanization has profoundly transformed metropolitan landscapes, expanding industrial, economic, and technological hubs across emerging economies. In Indian metropolitan agglomerations such as Bengaluru, Mumbai, and Delhi-NCR, women constitute an increasingly substantial and vital proportion of the formal and informal workforce, particularly in the information technology, business process outsourcing, healthcare, and retail sectors. According to recent surveys by the National Sample Survey Office (NSSO), women\\'s participation in urban evening-shift and night-shift employment has grown by over 34% across major technological corridors in the past decade. However, this demographic transformation has underscored acute disparities in urban infrastructure and mobility safety.")
    add_body_paragraph(doc, "Freedom of movement within public spaces represents a fundamental human right and a core determinant of socioeconomic empowerment. When female commuters, university students, and lone pedestrians perceive urban streets and public transit interchanges as hostile or unpredictable, their educational opportunities, employment horizons, and civic engagement become severely circumscribed. Criminological studies consistently demonstrate that urban safety cannot be quantified solely through official police crime statistics. In reality, the vast majority of street-level transgressions—including catcalling, persistent following, verbal intimidation, unsolicited physical contact, and poorly lit transit ambushes—remain entirely unrecorded. Criminologists refer to this vast disparity between actual victim experiences and formal police registrations as the 'dark figure of crime'.")
    add_body_paragraph(doc, "Official crime registries, such as First Information Reports (FIRs) filed under the National Crime Records Bureau (NCRB), capture fewer than 15% of daily street harassment incidents. This severe under-reporting stems from systemic friction: mandatory in-person station visits, complex legal verbiage, pervasive societal stigma, fear of secondary victimization, and justified anxiety over retaliatory stalking. In the absence of an accessible, non-stigmatizing, and anonymous reporting mechanism, municipal corporations (such as the Bruhat Bengaluru Mahanagara Palike - BBMP) and law enforcement authorities operate within an empirical vacuum. Consequently, hazardous street-level deficiencies—such as defunct streetlights, deserted bus stops, broken surveillance cameras, and secluded alleys—remain unaddressed for months or years.")
    add_body_paragraph(doc, "At the same time, existing personal safety applications suffer from a catastrophic conceptual flaw: they are almost entirely reactive. Commercial safety applications and wearable panic hardware depend on the victim actively recognizing an imminent physical attack and triggering a distress beacon while under extreme duress. Human-computer interaction (HCI) and trauma psychology demonstrate that sudden confrontations induce severe sympathetic nervous system arousal ('cognitive freeze'), rendering victims incapable of retrieving, unlocking, and operating a smartphone interface. Therefore, true physical protection requires proactive, preventive decision support—guiding pedestrians along well-lit, populated, and sanctuary-rich corridors before high-risk zones are entered.")

    add_subtopic_heading(doc, "1.2 SCOPE AND LIMITATIONS")
    add_body_paragraph(doc, "The primary scope of the SafeCity platform encompasses the design, mathematical modeling, full-stack implementation, and empirical validation of an end-to-end, community-driven civic safety ecosystem. Specifically, the system scope includes:")
    add_bullet_point(doc, "A cross-platform Progressive Web Application (PWA) shell accessible instantaneously across diverse mobile operating systems (Android, iOS) without app-store installation barriers.", "Universal Accessibility:")
    add_bullet_point(doc, "A privacy-preserving incident ingestion pipeline that strips device identifiers and quantizes GPS coordinates to three decimal places (~110 m spatial cell resolution) in compliance with the Indian Digital Personal Data Protection (DPDP) Act of 2023.", "Privacy by Design:")
    add_bullet_point(doc, "A multi-criteria pathfinding engine that dynamically penalizes unlit corridors and active crime clusters while rewarding proximity to verified 24/7 civic havens.", "Proactive Route Optimization:")
    add_bullet_point(doc, "A 'Walk With Me' autonomous virtual escort watchdog that continuously monitors commuter telemetry and automatically triggers multi-stage distress escalation upon detecting 180 seconds of unexplained stationary inactivity.", "Zero-Cognitive-Load Escort:")
    add_bullet_point(doc, "An administrative moderation queue enabling vetted community overseers to filter spam, verify reports, and eliminate reporting bias.", "Crowdsourced Integrity:")

    add_body_paragraph(doc, "Notwithstanding these robust capabilities, the operational scope is bounded by certain realistic technical limitations. First, SafeCity relies on the positioning accuracy of client-side GPS hardware; severe urban canyons or deep subterranean transit basements can introduce coordinate drift exceeding 15 meters. Second, the proactive routing model depends on the participatory density of citizen reports within a given municipal ward; newly onboarded suburban sectors may experience a 'cold-start' data scarcity phase prior to community adoption. Finally, while SafeCity provides automated distress SMS and acoustic sirens, physical intervention remains dependent on the responsiveness of registered emergency contacts and local emergency services.")

    add_subtopic_heading(doc, "1.3 PROBLEM STATEMENT")
    add_body_paragraph(doc, "Modern urban commuters face a dual failure in digital safety and navigation systems. On one hand, ubiquitous commercial mapping engines (e.g., Google Maps, Apple Maps) optimize exclusively for vehicular travel time or Euclidean distance, routinely directing lone pedestrians through unlit, unmonitored interior alleys that present severe safety hazards. On the other hand, commercial personal safety applications rely entirely on reactive panic alarms requiring explicit physical intervention during active assaults, ignoring the psychological reality of cognitive freeze and failing to prevent danger before it materializes.")
    add_body_paragraph(doc, "Compounding this challenge is the complete absence of a privacy-preserving civic platform that bridges the 'dark figure of crime' without compromising victim safety. Existing crowdsourced mapping initiatives either collect intrusive personally identifiable information (PII) or publish high-precision GPS coordinates that inadvertently expose users\\' domestic and professional doorways to stalkers. There is an urgent, unmet societal need for an intelligent, cross-platform civic framework that synthesizes anonymous community hazard intelligence, applies mathematical spatial-temporal decay, enforces strict data minimization under the DPDP Act 2023, and delivers proactive, safety-aware navigation alongside autonomous inactivity monitoring.")

    add_subtopic_heading(doc, "1.4 METHODOLOGY OVERVIEW")
    add_body_paragraph(doc, "To resolve the identified challenges, SafeCity formulates a comprehensive four-tier system architecture integrating modern participatory sensing, multi-objective graph optimization, and mobile telemetry analysis. The presentation layer employs a responsive Progressive Web Application built with React.js, Leaflet GIS, and Service Workers, ensuring sub-second UI responsiveness and offline capability. The application layer leverages a Node.js and Express RESTful API protected by JSON Web Tokens (JWT) and strict CORS/rate-limiting policies.")
    add_body_paragraph(doc, "Geospatial incident ingestion enforces spatial quantization by truncating latitude and longitude coordinates to three decimal places, collapsing location precision into a privacy-preserving ~110 m x 110 m bounding grid. The routing engine models the street network as a directed graph where edge costs reflect not merely physical distance, but a composite safety penalty incorporating temporally decayed historical crime reports, built-environment street lighting scores, and spatial proximity to verified 24/7 civic sanctuaries (hospitals, fuel stations, police kiosks, and 24-hour retail stores). Complementing pre-trip navigation, the 'Walk With Me' virtual escort runs an autonomous telemetry state machine that monitors commuter velocity; if a commuter remains stationary in an unverified location for 180 seconds, the system initiates a two-tier acoustic and SMS distress escalation sequence without requiring user intervention.")

    add_subtopic_heading(doc, "1.5 ORGANIZATION OF THE THESIS")
    add_sub_subtopic_heading(doc, "1.5.1 Logical Flow of the Research Work")
    add_body_paragraph(doc, "The research and engineering workflow underlying SafeCity progresses systematically from problem identification through theoretical formulation, architectural design, full-stack implementation, and rigorous empirical validation. Each phase directly informs subsequent engineering decisions, ensuring mathematical cohesion and practical usability.")

    add_sub_subtopic_heading(doc, "1.5.2 Contribution Mapping Across Chapters")
    add_body_paragraph(doc, "The contributions of this capstone thesis are systematically mapped across nine core chapters:")
    add_bullet_point(doc, "Establishes urban mobility disparities, criminological motivation, project scope, and problem formulation.", "Chapter 1 (Introduction):")
    add_bullet_point(doc, "Surveys existing literature across participatory GIS, safety routing, panic hardware, and spatial clustering, establishing a comparative taxonomy.", "Chapter 2 (Literature Survey):")
    add_bullet_point(doc, "Formulates the technical and psychological deficiencies of legacy systems, focusing on reporting friction and cognitive freeze.", "Chapter 3 (Research Gaps):")
    add_bullet_point(doc, "Details the mathematical cost functions, exponential temporal decay modeling, haven proximity rewards, and 3-decimal quantization.", "Chapter 4 (Proposed Methodology):")
    add_bullet_point(doc, "Defines primary, secondary, technical, and regulatory project objectives.", "Chapter 5 (Objectives):")
    add_bullet_point(doc, "Explicates the four-tier architectural implementation, PWA interface, Express API, spatial schema, and virtual escort state machine.", "Chapter 6 (System Design & Implementation):")
    add_bullet_point(doc, "Documents the 8-month project execution schedule and Gantt chart across six distinct engineering phases.", "Chapter 7 (Project Timeline):")
    add_bullet_point(doc, "Summarizes deliverables, benchmark datasets, IEEE publication proof, and student innovation awards.", "Chapter 8 (Outcomes):")
    add_bullet_point(doc, "Presents empirical latency benchmarks, corridor routing evaluations in Bengaluru, battery overhead, and SUS usability scores (82.4/100).", "Chapter 9 (Results and Discussions):")

    add_sub_subtopic_heading(doc, "1.5.3 Chapter Overview Summary")
    add_body_paragraph(doc, "Following the technical chapters, the thesis provides a comprehensive Conclusion and Future Work chapter synthesizing findings and outlining long-term roadmaps, followed by standard IEEE References, Appendix-A (Pseudocode Algorithms), Appendix-B (System Screenshots and Walkthroughs), and Appendix-C (Enclosures including paper registration proof, awards, 4.2% plagiarism check report, and UN SDG alignment matrix).")

    doc.add_page_break()

def build_chapter_2(doc):
    add_chapter_heading(doc, "CHAPTER-2", "LITERATURE SURVEY")

    add_subtopic_heading(doc, "2.1 PARTICIPATORY SAFETY SENSING & CROWDSOURCED AUDITS")
    add_body_paragraph(doc, "Participatory Geographic Information Systems (PGIS) and mobile crowdsourcing have emerged as foundational paradigms for capturing subjective citizen perceptions of the urban built environment. Early pioneering work by Viswanath and Basu (2015) introduced 'SafetiPin', a mobile audit platform that evaluates urban corridors across nine physical and social parameters, including lighting, openness, sightlines, security presence, and demographic diversity. SafetiPin demonstrated that subjective perceptions of safety correlate strongly with objective environmental features, such as active street frontages and consistent illumination. However, SafetiPin operates primarily as an analytical audit tool for urban planners rather than a real-time navigational decision support system. Users are required to complete lengthy audit questionnaires, creating high cognitive friction that discourages rapid reporting during daily commutes.")
    add_body_paragraph(doc, "Similarly, Abdelmonem (2015) analyzed 'HarassMap', an SMS- and web-based crowdsourcing deployment in Cairo designed to document street-level sexual harassment. HarassMap proved highly effective in breaking cultural taboos and demonstrating that harassment occurs in broad daylight across diverse socio-economic strata. Nevertheless, HarassMap and related crowdsourced portals (such as Hollaback!) lack algorithmic integration with pathfinding graph solvers; incidents are plotted as static map pins without informing pre-trip routing or triggering autonomous emergency safeguards. Furthermore, early crowdsourced portals published unquantized GPS coordinates, inadvertently introducing privacy risks where victims\\' exact home addresses or daily bus stops could be reverse-engineered by malicious third parties.")

    add_subtopic_heading(doc, "2.2 SAFETY-AWARE & MULTI-OBJECTIVE NAVIGATION SYSTEMS")
    add_body_paragraph(doc, "Traditional routing algorithms, rooted in Dijkstra\\'s shortest path formulation and the A* heuristic search algorithm, optimize strictly for time-delay minimization or physical distance. In pedestrian contexts, however, minimizing distance frequently conflicts with personal safety. Galbrun et al. (2016) proposed a dual-objective pathfinding framework that balances route length against cumulative crime density scores extracted from historical police precinct records. Their work demonstrated that pedestrians are consistently willing to accept a modest distance penalty (between 10% and 25%) in exchange for a substantial reduction in subjective risk exposure.")
    add_body_paragraph(doc, "Shah et al. (2020) advanced this paradigm by incorporating OpenStreetMap (OSM) spatial tags, such as street illumination, sidewalk presence, and road classification, into an automated edge cost calculation. While theoretically sound, existing safety-aware navigation research exhibits two critical deficiencies. First, historical crime data is treated as static; a violent incident that occurred three years ago incurs the exact same routing penalty as an incident reported three hours ago, leading to permanent algorithmic stigmatization of gentrifying or newly patrolled neighborhoods. Second, prior navigation models treat the urban graph as an isolated topology, completely failing to incorporate positive environmental attractors—specifically, verified 24/7 civic sanctuaries (pharmacies, hospital emergency rooms, staffed fuel stations, and police outposts) where a distressed commuter can seek immediate refuge.")

    add_subtopic_heading(doc, "2.3 MOBILE PANIC HARDWARE & WEARABLE SOS SYSTEMS")
    add_body_paragraph(doc, "To mitigate street-level violence, industry and academia have explored personal emergency hardware, ranging from dedicated Bluetooth Low Energy (BLE) panic buttons (e.g., smart rings, key fobs, and bracelets) to smartphone gesture-recognition applications. Bhardwaj et al. (2018) designed an IoT-enabled wearable safety band incorporating an accelerometer, pulse-rate sensor, and GSM/GPS module, programmed to dispatch distress coordinates upon detecting sudden shock or abnormal tachycardia.")
    add_body_paragraph(doc, "Despite engineering sophistication, hardware-based panic devices suffer from severe real-world failure modes. Human factors and psychological evaluations reveal that victims confronted with sudden physical ambush experience acute sympathetic nervous system freeze. In high-stress ambush situations, victims frequently drop their devices, have their phones forcefully snatched, or are physically restrained from pressing a panic key. Furthermore, sensor-driven wearable alarms exhibit unacceptably high false-positive rates during ordinary vigorous physical activity (e.g., running for a bus or dropping a handbag), leading users to permanently disable them. Most critically, panic buttons provide zero preventive utility: they do nothing to prevent a commuter from entering a dark, deserted alley in the first place.")

    add_subtopic_heading(doc, "2.4 SPATIAL CLUSTERING & HAZARD ANALYTICS")
    add_body_paragraph(doc, "In the domain of spatial crime analytics, point pattern analysis relies heavily on Kernel Density Estimation (KDE) and Density-Based Spatial Clustering of Applications with Noise (DBSCAN), first formalized by Ester et al. (1996). Unlike centroid-based algorithms such as k-Means, DBSCAN excels in urban geospatial analytics because it discovers clusters of arbitrary geometric shape (such as linear crime hot-strips along unlit transit corridors) and effectively isolates outlier noise points without requiring pre-specification of the cluster count. However, deploying DBSCAN in real-time web architectures introduces latency overheads. SafeCity circumvents this limitation by coupling spherical Haversine distance computations with spatial grid cell quantization, achieving sub-second hotspot identification suitable for client-side interactive rendering.")

    add_subtopic_heading(doc, "2.5 POSITIONING RELATIVE TO RELATED WORK")
    add_body_paragraph(doc, "To rigorously establish the academic and technological positioning of SafeCity, Table 2.1 provides a comparative feature matrix evaluating existing commercial and academic platforms against our proposed solution across seven critical engineering dimensions.")

    add_table_caption(doc, "Table 2.1", "Positioning Relative to Related Navigation and Panic Solutions")
    tbl_comp = doc.add_table(rows=1, cols=5)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_comp.autofit = False
    set_table_borders(tbl_comp)
    col_w_comp = [Inches(1.5), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.4)]
    comp_headers = ["Evaluation Metric", "Commercial Nav (Google Maps)", "SafetiPin Audits", "Wearable SOS (bSafe/Life360)", "SafeCity (Proposed)"]
    for c_i, h_txt in enumerate(comp_headers):
        cell = tbl_comp.rows[0].cells[c_i]
        cell.width = col_w_comp[c_i]
        cell.text = h_txt
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"; run.font.size = Pt(8.5); run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

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
        row = tbl_comp.add_row()
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c_i, t_val in enumerate(r_data):
            cell = row.cells[c_i]
            cell.width = col_w_comp[c_i]
            cell.text = t_val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=50, right=50)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i > 0 else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"; run.font.size = Pt(8.5)
                if c_i == 4:
                    run.font.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

def build_chapter_3(doc):
    add_chapter_heading(doc, "CHAPTER-3", "RESEARCH GAPS OF EXISTING METHODS")

    add_subtopic_heading(doc, "3.1 THE 'DARK FIGURE OF CRIME' AND REPORTING FRICTION")
    add_body_paragraph(doc, "The most pervasive barrier to urban safety management is the structural under-reporting of non-lethal street harassment. In conventional municipal and police architectures, lodging a formal complaint requires the victim to physically visit a police station, reveal sensitive personal identity details, submit to adversarial bureaucratic scrutiny, and risk societal stigmatization. For working women, university students, and marginalized commuters, this procedural friction is prohibitive.")
    add_body_paragraph(doc, "As a direct consequence, municipal authorities possess almost zero spatial intelligence regarding micro-level hazards—such as persistent catcalling near a particular railway underpass, broken streetlights across a 300-meter residential lane, or aggressive loitering outside an unmonitored bus shelter. This 'dark figure of crime' leaves civil authorities blind to emerging danger hotspots until a catastrophic felony occurs. Existing digital systems have failed to provide a zero-friction, anonymous reporting mechanism that decouples civic hazard reporting from personal identification.")

    add_subtopic_heading(doc, "3.2 REACTIVE ALARMS VS. PREVENTIVE DECISION SUPPORT")
    add_body_paragraph(doc, "Contemporary commercial mobile safety solutions (e.g., bSafe, Life360, personal SOS alarms) suffer from a critical flaw: they are entirely reactive. They operate on the assumption that safety is adequately served if a victim can push a button while an assault is underway. This assumption violates fundamental principles of cognitive ergonomics and trauma psychology.")
    add_body_paragraph(doc, "Under acute terror or sudden physical ambush, the sympathetic nervous system triggers intense vasoconstriction, motor tremor, and severe cognitive freeze. Victims are frequently physically restrained, have their devices stripped from their hands, or are unable to remember pin codes and unlock gestures. By the time a reactive panic alarm is successfully sounded, physical violence has already commenced. Existing systems offer zero preventive guidance: they do not help a lone commuter evaluate route alternatives or steer clear of deserted, unlit corridors prior to embarking on a journey.")

    add_subtopic_heading(doc, "3.3 LACK OF SPATIAL-TEMPORAL HAZARD DECAY DYNAMICS")
    add_body_paragraph(doc, "A critical mathematical deficiency in existing crime-mapping and academic safety-navigation platforms is the treatment of incident data as static, immutable points. In dynamic urban environments, spatial risk is highly transient. A deserted corner where a harassment incident occurred four weeks ago may undergo intense municipal rectification—such as the installation of high-mast LED floodlights, establishment of a police beat kiosk, or increased pedestrian footfall from new commercial establishments.")
    add_body_paragraph(doc, "Conversely, an area historically considered safe may experience sudden streetlight power failure or temporary construction blockades that drastically elevate vulnerability. Existing systems lack an exponential temporal decay function that systematically discounts historical incident penalties over time while dynamically incorporating real-time community reports. Without continuous mathematical decay, routing algorithms permanently stigmatize urban neighborhoods, misallocating civic concern and misguiding pedestrian commuters.")

    add_subtopic_heading(doc, "3.4 DEANONYMIZATION VULNERABILITIES IN CROWDSOURCED AUDITS")
    add_body_paragraph(doc, "While participatory GIS platforms encourage public submissions, they introduce severe privacy vulnerabilities when naive GPS logging is implemented. When a commuter submits an incident report with full 6-decimal raw GPS coordinates (which resolves to sub-meter spatial precision), the report pinpoint accurately identifies the specific apartment building doorway, residential gate, or exact bus boarding spot of the victim.")
    add_body_paragraph(doc, "In cases of localized stalking or neighborhood harassment, the perpetrator can monitor public crowdsourced feeds, identify the timestamp and exact coordinate pin, and retaliate against the victim with high certainty. This risk of doorway-level deanonymization severely discourages honest community participation. Prior systems lack privacy-preserving spatial obfuscation techniques—such as coordinate quantization or k-anonymity—that protect individual victim anonymity while preserving macro-level spatial utility for routing.")

    add_subtopic_heading(doc, "3.5 ABSENCE OF INTEGRATED CIVIC HAVEN NETWORKS")
    add_body_paragraph(doc, "Finally, current navigation platforms treat the urban environment strictly as a passive topological network of nodes (intersections) and edges (road segments). They overlook the transformative safety value of active, illuminated, and populated third-party civic sanctuaries. When a lone pedestrian experiences discomfort, following, or perceived threat, the most effective survival strategy is not running along an open road, but diverting into a verified 24/7 safe haven—such as a 24-hour pharmacy, staffed fuel station, all-night hospital emergency lobby, or police beat station.")
    add_body_paragraph(doc, "Existing routing algorithms fail to incorporate verified haven locations into their cost functions. They do not reward paths that run adjacent to verified sanctuaries, nor do they provide one-click emergency diversion routing to guide a frightened commuter to the nearest illuminated haven. SafeCity directly resolves this architectural gap by incorporating a verified civic haven layer into both pre-trip pathfinding and active emergency diversion.")

    doc.add_page_break()
'''

print("Part 2: Chapters 1 to 3 code ready.")
