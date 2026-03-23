import os
import json
import re

MODULES_DIR = "../Training-Modules"
QUIZZES_DIR = "../clean-quizzes-md"
DATA_DIR = "src/data"

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def extract_module_id(filename):
    match = re.search(r'module-(\d+)', filename)
    if match: return match.group(1)
    match = re.search(r'accessibility-101', filename)
    if match: return "101"
    match = re.search(r'accessible-email', filename)
    if match: return "106"
    return None

modules_data = []

# Parse Modules
for filename in os.listdir(MODULES_DIR):
    if filename.endswith(".md") and "All-Training-Modules" not in filename:
        mod_id = extract_module_id(filename)
        if not mod_id:
            continue
            
        with open(os.path.join(MODULES_DIR, filename), 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract title from first line # Module 101: Title
        title_match = re.search(r'^#\s*(.*?)\n', content)
        title = title_match.group(1).replace(f"Module {mod_id}:", "").strip() if title_match else f"Module {mod_id}"
        
        modules_data.append({
            "id": mod_id,
            "title": title,
            "content": content
        })

modules_data.sort(key=lambda x: int(x["id"]))

with open(os.path.join(DATA_DIR, "modules.json"), 'w', encoding='utf-8') as f:
    json.dump(modules_data, f, indent=2)

print(f"Processed {len(modules_data)} modules.")

# Parse Quizzes
quizzes_data = {}

for filename in os.listdir(QUIZZES_DIR):
    if not filename.endswith(".md"): continue
    
    mod_id = re.search(r'Module_(\d+)', filename)
    if not mod_id: continue
    mod_id = mod_id.group(1)
    
    with open(os.path.join(QUIZZES_DIR, filename), 'r', encoding='utf-8') as f:
        content = f.read()
        
    questions = []
    
    # Split by ### Question
    q_blocks = re.split(r'###\s*Question\s*\d+', content)[1:]
    
    for block in q_blocks:
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        if not lines: continue
        
        question_text = ""
        options = []
        correct_answer = ""
        explanation = ""
        
        # Parse logic
        in_options = False
        for line in lines:
            if line.startswith('**Correct:**') or line.startswith('Correct Answer:'):
                correct_answer = line.split(':', 1)[1].strip().replace('*', '')
            elif line.startswith('**Explanation:**') or line.startswith('Explanation:'):
                explanation = line.split(':', 1)[1].strip()
            elif line.startswith('- A)') or line.startswith('- B)') or line.startswith('- C)') or line.startswith('- D)') or line.startswith('A.') or line.startswith('B.'):
                in_options = True
                # Clean up option
                opt = line
                if '✓' in opt:
                    opt = opt.replace('✓', '').strip()
                options.append(opt)
            elif not in_options and line.startswith('**') and line.endswith('**'):
                question_text = line.replace('**', '')
            elif not in_options and ('(Choice)' not in line and '(True/False)' not in line):
                question_text += " " + line

        questions.append({
            "question": question_text.strip(),
            "options": options,
            "correct_answer": correct_answer,
            "explanation": explanation
        })
        
    quizzes_data[mod_id] = questions

with open(os.path.join(DATA_DIR, "quizzes.json"), 'w', encoding='utf-8') as f:
    json.dump(quizzes_data, f, indent=2)

print(f"Processed {len(quizzes_data)} quizzes.")
