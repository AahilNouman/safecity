# -*- coding: utf-8 -*-
import os

files = [
    r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_front_matter.py',
    r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_chapters_1_to_4.py',
    r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_chapters_5_to_9.py',
    r'C:\Users\AAHIL\OneDrive\Pictures\DOCUMENTS\astrasafe-fullstack\scripts\template_appendices.py'
]

for p in files:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace \\" with '
    fixed = content.replace('\\"', "'")
    # Also replace \\' with '
    fixed = fixed.replace("\\'", "'")
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(fixed)
    print(f'Fixed quotes in {os.path.basename(p)}')
