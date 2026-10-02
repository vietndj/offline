with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "r") as f:
    content = f.read()

content = content.replace("messages.limit(3)", "messages.limit(10)")

old_loop = """            for m in reversed(messages[:3]):
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                prefix = "👤 " if m_sender != PAGE_ID else "🤖 "
                if msg_text:
                    combined_texts.append(f"{prefix}{msg_text}")
                
                if m_sender != PAGE_ID and msg_text and not extracted_phone:
                    phones = phone_regex.findall(msg_text)
                    if phones:"""

new_loop = """            for m in messages:
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                if m_sender != PAGE_ID and msg_text and not extracted_phone:
                    phones = phone_regex.findall(msg_text)
                    if phones:
                        raw_p = phones[0]
                        p_digits = __import__('re').sub(r'\\D', '', raw_p)
                        if p_digits.startswith('84'): p_digits = '0' + p_digits[2:]
                        elif len(p_digits) == 9 and not p_digits.startswith('0'): p_digits = '0' + p_digits
                        if len(p_digits) == 10:
                            extracted_phone = p_digits

            for m in reversed(messages[:5]):
                msg_text = m.get('message', '')
                m_sender = m.get('from', {}).get('id', '')
                prefix = "👤 " if m_sender != PAGE_ID else "🤖 "
                if msg_text:
                    combined_texts.append(f"{prefix}{msg_text}")
                
                if False: # Dummy to keep the regex block matching below
                    if phones:"""

if old_loop in content:
    content = content.replace(old_loop, new_loop)
    with open("/Users/vietmac/Documents/CODE/offline/command_center/scanner_daemon.py", "w") as f:
        f.write(content)
    print("Success")
else:
    print("Failed")
