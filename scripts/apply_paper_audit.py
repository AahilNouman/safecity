# -*- coding: utf-8 -*-
"""
Applies IEEE research paper audit corrections to build_ieee_twocol_paper.py
"""

script_path = "scripts/build_ieee_twocol_paper.py"

with open(script_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update Table II tech stack
old_tech = """t2_rows = [
    ["Frontend Web", "Next.js 14, React 18, Tailwind CSS, Lucide Icons"],
    ["Mobile Client", "React Native (Expo SDK 52), TypeScript"],
    ["Mapping / GIS", "Leaflet, OpenStreetMap, Overpass API, Turf.js"],
    ["Backend / DB", "Node.js, Express, Supabase (PostgreSQL + RLS)"],
    ["Escort Telemetry", "W3C Geolocation API, Web Audio API, Web Workers"],
    ["Tooling & CI", "Git, GitHub, Vitest, ESLint, VS Code"]
]"""

new_tech = """t2_rows = [
    ["Frontend Web", "HTML5, ES6+, Tailwind CSS, Leaflet 1.9"],
    ["Mobile Runtime", "Capacitor 8.5 (@capacitor/android, @capacitor/geolocation)"],
    ["Mapping / GIS", "Leaflet 1.9.4, OpenStreetMap, Turf.js"],
    ["Backend / DB", "Node.js 18+ LTS, Express 4.19, MySQL 8.0 (Spatial)"],
    ["Escort Telemetry", "W3C Geolocation API, Web Audio API (105 dB Siren)"],
    ["Tooling & CI", "Git, GitHub, ESLint, VS Code"]
]"""

if old_tech in text:
    text = text.replace(old_tech, new_tech)
    print("Table II successfully updated.")
else:
    print("Notice: old Table II text not matched verbatim.")

with open(script_path, "w", encoding="utf-8") as f:
    f.write(text)

print("build_ieee_twocol_paper.py fully updated.")
