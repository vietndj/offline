import re

with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

# Change limit(1) to limit(3)
content = content.replace("messages.limit(1)", "messages.limit(3)")

# Replace the parsing block
old_block = """            last_msg = messages[0]
            text = last_msg.get('message', '')
            sender = last_msg.get('from', {})
            sender_id = sender.get('id', '')
            sender_name = sender.get('name', 'Khách FB')
            created_time = last_msg.get('created_time')
            
            # Simple check if sender is the page itself
            direction = "outbound" if sender_id == PAGE_ID else "inbound"
            
            # Extract phone if any
            extracted_phone = None
            if direction == "inbound" and text:
                phones = phone_regex.findall(text)
                if phones:
                    # Normalize the first found phone
                    raw_p = phones[0]
                    p_digits = re.sub(r'\D', '', raw_p)
                    if p_digits.startswith('84'):
                        p_digits = '0' + p_digits[2:]
                    elif len(p_digits) == 9 and not p_digits.startswith('0'):
                        p_digits = '0' + p_digits
                    if len(p_digits) == 10:
                        extracted_phone = p_digits
            
            contact_phone = extracted_phone if extracted_phone else f"FB_{sender_id}"
            
            # Upsert contact based on extracted_phone or FB ID
            c_local.execute("SELECT id FROM contacts WHERE phone=?", (contact_phone,))
            contact = c_local.fetchone()
            
            if not contact:
                now = get_vn_time()
                c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                               (contact_phone, sender_name, now, now))
                contact_id = c_local.lastrowid
            else:
                contact_id = contact["id"]"""

new_block = """            last_msg = messages[0]
            sender = last_msg.get('from', {})
            sender_id = sender.get('id', '')
            sender_name = sender.get('name', 'Khách FB')
            created_time = last_msg.get('created_time')
            direction = "outbound" if sender_id == PAGE_ID else "inbound"
            
            combined_texts = []
            extracted_phone = None
            
            for m in reversed(messages[:3]):
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                prefix = "👤 " if m_sender != PAGE_ID else "🤖 "
                if msg_text:
                    combined_texts.append(f"{prefix}{msg_text}")
                
                if m_sender != PAGE_ID and msg_text and not extracted_phone:
                    phones = phone_regex.findall(msg_text)
                    if phones:
                        raw_p = phones[0]
                        p_digits = re.sub(r'\\D', '', raw_p)
                        if p_digits.startswith('84'): p_digits = '0' + p_digits[2:]
                        elif len(p_digits) == 9 and not p_digits.startswith('0'): p_digits = '0' + p_digits
                        if len(p_digits) == 10:
                            extracted_phone = p_digits

            text = "\\n".join(combined_texts)
            contact_phone = extracted_phone if extracted_phone else f"FB_{sender_id}"
            
            c_local.execute("SELECT id FROM contacts WHERE phone=?", (contact_phone,))
            contact = c_local.fetchone()
            
            if not contact and extracted_phone:
                # Try to upgrade existing FB contact
                c_local.execute("SELECT id FROM contacts WHERE phone=?", (f"FB_{sender_id}",))
                fb_contact = c_local.fetchone()
                if fb_contact:
                    c_local.execute("UPDATE contacts SET phone=? WHERE id=?", (extracted_phone, fb_contact['id']))
                    contact_id = fb_contact['id']
                else:
                    now = get_vn_time()
                    c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                                   (extracted_phone, sender_name, now, now))
                    contact_id = c_local.lastrowid
            elif not contact:
                now = get_vn_time()
                c_local.execute("INSERT INTO contacts (phone, name, source, stage, created_at, updated_at) VALUES (?, ?, 'facebook', 'new', ?, ?)",
                               (contact_phone, sender_name, now, now))
                contact_id = c_local.lastrowid
            else:
                contact_id = contact["id"]"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find old block")
