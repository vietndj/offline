import sqlite3
import json
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

DB_PATH = Path('/Users/vietmac/Documents/CODE/offline/command_center/fedu_command.db')

def get_vn_time():
    """Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)"""
    tz_vn = timezone(timedelta(hours=7))
    return datetime.now(tz_vn).isoformat()

def normalize_phone(phone):
    """Chuẩn hóa số điện thoại về định dạng 10 số, bắt đầu bằng 0"""
    if not phone:
        return None
    phone_str = str(phone)
    # Loại bỏ các ký tự không phải số
    digits = re.sub(r'\D', '', phone_str)
    
    # Xử lý các trường hợp phổ biến
    if digits.startswith('84'):
        digits = '0' + digits[2:]
    elif len(digits) == 9 and not digits.startswith('0'):
        digits = '0' + digits
        
    if len(digits) == 10 and digits.startswith('0'):
        return digits
    return None

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Khởi tạo cấu trúc cơ sở dữ liệu"""
    conn = get_connection()
    cursor = conn.cursor()

    # Bảng contacts
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE NOT NULL,
            name TEXT,
            email TEXT,
            industry TEXT,
            industry_slug TEXT,
            facebook_url TEXT,
            zalo_url TEXT,
            source TEXT DEFAULT 'unknown',
            stage TEXT DEFAULT 'new',
            class_name TEXT,
            class_date TEXT,
            completeness_score INTEGER DEFAULT 0,
            notes TEXT,
            tags TEXT,
            apple_contact_synced INTEGER DEFAULT 0,
            radar_override TEXT,
            created_at TEXT,
            updated_at TEXT
        )
    ''')

    # Bảng conversations
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER,
            channel TEXT NOT NULL,
            direction TEXT,
            content TEXT,
            attachments TEXT,
            ai_suggested_reply TEXT,
            human_approved_reply TEXT,
            replied_at TEXT,
            replied_by TEXT,
            fb_conversation_id TEXT,
            created_at TEXT,
            FOREIGN KEY(contact_id) REFERENCES contacts(id)
        )
    ''')

    # Bảng daily_reports
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS daily_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_date TEXT,
            report_time TEXT,
            summary_json TEXT,
            sent_via TEXT,
            created_at TEXT
        )
    ''')

    # Bảng ai_training
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ai_training (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER,
            original_message TEXT,
            ai_draft TEXT,
            human_edit TEXT,
            final_approved TEXT,
            feedback_score INTEGER,
            created_at TEXT,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id)
        )
    ''')

    conn.commit()
    conn.close()

def upsert_contact(**kwargs):
    """Thêm mới hoặc cập nhật liên hệ dựa trên số điện thoại"""
    phone = normalize_phone(kwargs.get('phone'))
    if not phone:
        raise ValueError("Số điện thoại không hợp lệ hoặc bị thiếu")
    
    kwargs['phone'] = phone
    now = get_vn_time()
    
    # Chuyển đổi list/dict sang JSON string nếu cần
    for key in ['notes', 'tags', 'radar_override']:
        if key in kwargs and not isinstance(kwargs[key], str):
            kwargs[key] = json.dumps(kwargs[key], ensure_ascii=False) if kwargs[key] is not None else None

    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id FROM contacts WHERE phone = ?', (phone,))
    existing = cursor.fetchone()
    
    if existing:
        kwargs['updated_at'] = now
        # Tạo câu lệnh UPDATE động dựa trên các tham số được cung cấp
        update_fields = [f"{k} = ?" for k in kwargs.keys() if k != 'phone']
        values = [kwargs[k] for k in kwargs.keys() if k != 'phone']
        values.append(phone)
        
        if update_fields:
            query = f"UPDATE contacts SET {', '.join(update_fields)} WHERE phone = ?"
            cursor.execute(query, values)
        contact_id = existing['id']
    else:
        kwargs['created_at'] = now
        kwargs['updated_at'] = now
        columns = ', '.join(kwargs.keys())
        placeholders = ', '.join(['?' for _ in kwargs])
        values = list(kwargs.values())
        
        query = f"INSERT INTO contacts ({columns}) VALUES ({placeholders})"
        cursor.execute(query, values)
        contact_id = cursor.lastrowid
        
    conn.commit()
    conn.close()
    return contact_id

def get_contact(phone):
    phone = normalize_phone(phone)
    if not phone:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts WHERE phone = ?', (phone,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_contact_by_id(contact_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts WHERE id = ?', (contact_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def list_contacts(stage=None, search=None, limit=50, offset=0):
    conn = get_connection()
    cursor = conn.cursor()
    query = 'SELECT * FROM contacts WHERE 1=1'
    params = []
    
    if stage:
        query += ' AND stage = ?'
        params.append(stage)
        
    if search:
        query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)'
        search_term = f'%{search}%'
        params.extend([search_term, search_term, search_term])
        
    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
    params.extend([limit, offset])
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_contact_stats():
    """Đếm số lượng liên hệ theo từng stage"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT stage, COUNT(*) as count FROM contacts GROUP BY stage')
    rows = cursor.fetchall()
    conn.close()
    return {row['stage']: row['count'] for row in rows}

def update_stage(phone, new_stage):
    phone = normalize_phone(phone)
    if not phone:
        return False
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE contacts SET stage = ?, updated_at = ? WHERE phone = ?',
        (new_stage, get_vn_time(), phone)
    )
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def add_conversation(contact_id, channel, direction, content, **kwargs):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Xử lý attachments
    if 'attachments' in kwargs and not isinstance(kwargs['attachments'], str):
        kwargs['attachments'] = json.dumps(kwargs['attachments'], ensure_ascii=False)
        
    kwargs.update({
        'contact_id': contact_id,
        'channel': channel,
        'direction': direction,
        'content': content,
        'created_at': get_vn_time()
    })
    
    columns = ', '.join(kwargs.keys())
    placeholders = ', '.join(['?' for _ in kwargs])
    values = list(kwargs.values())
    
    query = f"INSERT INTO conversations ({columns}) VALUES ({placeholders})"
    cursor.execute(query, values)
    conv_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return conv_id

def get_conversations(contact_id=None, channel=None, limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    query = 'SELECT * FROM conversations WHERE 1=1'
    params = []
    
    if contact_id is not None:
        query += ' AND contact_id = ?'
        params.append(contact_id)
        
    if channel is not None:
        query += ' AND channel = ?'
        params.append(channel)
        
    query += ' ORDER BY created_at DESC LIMIT ?'
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_training_sample(conversation_id, original_message, **kwargs):
    conn = get_connection()
    cursor = conn.cursor()
    
    kwargs.update({
        'conversation_id': conversation_id,
        'original_message': original_message,
        'created_at': get_vn_time()
    })
    
    columns = ', '.join(kwargs.keys())
    placeholders = ', '.join(['?' for _ in kwargs])
    values = list(kwargs.values())
    
    query = f"INSERT INTO ai_training ({columns}) VALUES ({placeholders})"
    cursor.execute(query, values)
    training_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return training_id

def get_training_samples(limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM ai_training ORDER BY created_at DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_daily_report(report_date, report_time, summary_json, sent_via):
    conn = get_connection()
    cursor = conn.cursor()
    
    if not isinstance(summary_json, str):
        summary_json = json.dumps(summary_json, ensure_ascii=False)
        
    cursor.execute('''
        INSERT INTO daily_reports (report_date, report_time, summary_json, sent_via, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (report_date, report_time, summary_json, sent_via, get_vn_time()))
    
    report_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return report_id

def get_reports(date=None):
    conn = get_connection()
    cursor = conn.cursor()
    
    if date:
        cursor.execute('SELECT * FROM daily_reports WHERE report_date = ? ORDER BY created_at DESC', (date,))
    else:
        cursor.execute('SELECT * FROM daily_reports ORDER BY created_at DESC LIMIT 50')
        
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Khởi tạo db khi module được import lần đầu nếu db chưa tồn tại
if not DB_PATH.exists():
    init_db()
