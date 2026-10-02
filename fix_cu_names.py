import sqlite3
import json
import re
import os

DB_PATH = 'customer_hub/fedu_customer_hub.db'
CU_HTML_PATH = 'command_center/web/cu.html'

def get_name_from_db(phone):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM customers WHERE phone = ?", (phone,))
    row = cursor.fetchone()
    conn.close()
    if row and row[0]:
        return row[0].strip()
    return None

with open(CU_HTML_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the JSON array
match = re.search(r'window\.STATIC_LEADS\s*=\s*(\[.*?\]);', content, flags=re.DOTALL)
if not match:
    print("Could not find window.STATIC_LEADS array.")
    exit(1)

json_str = match.group(1)
leads = json.loads(json_str)

updated_count = 0
for lead in leads:
    if not lead.get('name'):
        phone = lead.get('phone')
        if phone:
            db_name = get_name_from_db(phone)
            if db_name:
                lead['name'] = db_name
                updated_count += 1
                print(f"Updated {phone} -> {db_name}")

if updated_count > 0:
    new_json_str = json.dumps(leads, ensure_ascii=False)
    # Replace in file
    new_content = content[:match.start(1)] + new_json_str + content[match.end(1):]
    with open(CU_HTML_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully updated {updated_count} names in cu.html!")
else:
    print("No names needed updating or none found in DB.")

