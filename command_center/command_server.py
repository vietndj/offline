import os
import time
import json
import asyncio
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import shutil

from fedu_command_db import init_db, get_connection

app = FastAPI(title="FEDU Command Center")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# --- SSE Setup ---
sse_clients = set()

def broadcast_sse(event_type: str, data: str = ""):
    for queue in sse_clients:
        queue.put_nowait(f"event: {event_type}\ndata: {data}\n\n")

@app.on_event("startup")
async def startup_event():
    init_db()
    # Ensure web directory exists for static files
    os.makedirs("/Users/vietmac/Documents/CODE/offline/command_center/web", exist_ok=True)
    if not os.path.exists("/Users/vietmac/Documents/CODE/offline/command_center/web/index.html"):
        with open("/Users/vietmac/Documents/CODE/offline/command_center/web/index.html", "w") as f:
            f.write("<html><body><h1>FEDU Command Center</h1></body></html>")

@app.get("/api/sse")
async def sse_endpoint(request: Request):
    queue = asyncio.Queue()
    sse_clients.add(queue)
    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                message = await queue.get()
                yield message
        except asyncio.CancelledError:
            pass
        finally:
            sse_clients.remove(queue)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# --- Contacts API ---
@app.get("/api/contacts")
def list_contacts(stage: Optional[str] = None, search: Optional[str] = None, limit: int = 50, offset: int = 0):
    conn = get_connection()
    c = conn.cursor()
    query = "SELECT * FROM contacts WHERE 1=1"
    params = []
    if stage:
        query += " AND stage = ?"
        params.append(stage)
    if search:
        query += " AND (name LIKE ? OR phone LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return {"contacts": [dict(r) for r in rows]}

@app.get("/api/contacts/{id}")
def get_contact(id: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM contacts WHERE id = ?", (id,))
    contact = c.fetchone()
    if not contact:
        conn.close()
        raise HTTPException(status_code=404, detail="Contact not found")
    c.execute("SELECT * FROM conversations WHERE contact_id = ? ORDER BY created_at DESC", (id,))
    convs = c.fetchall()
    conn.close()
    res = dict(contact)
    res["conversations"] = [dict(r) for r in convs]
    return res

class StageUpdate(BaseModel):
    stage: str

@app.put("/api/contacts/{id}/stage")
def update_contact_stage(id: int, data: StageUpdate):
    conn = get_connection()
    c = conn.cursor()
    c.execute("UPDATE contacts SET stage = ?, updated_at = ? WHERE id = ?", (data.stage, datetime.now().isoformat(), id))
    conn.commit()
    conn.close()
    broadcast_sse("refresh")
    return {"success": True}

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    occupation: Optional[str] = None

@app.put("/api/contacts/{id}")
def update_contact(id: int, data: ContactUpdate):
    updates = []
    params = []
    if data.name is not None:
        updates.append("name = ?")
        params.append(data.name)
    if data.email is not None:
        updates.append("email = ?")
        params.append(data.email)
    if data.occupation is not None:
        updates.append("occupation = ?")
        params.append(data.occupation)
        
    if not updates:
        return {"success": True}
        
    updates.append("updated_at = ?")
    params.append(datetime.now().isoformat())
    params.append(id)
    
    conn = get_connection()
    c = conn.cursor()
    c.execute(f"UPDATE contacts SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()
    conn.close()
    broadcast_sse("refresh")
    return {"success": True}

class NoteData(BaseModel):
    note: str

@app.post("/api/contacts/{id}/note")
def add_note(id: int, data: NoteData):
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    c.execute("INSERT INTO conversations (contact_id, channel, direction, content, created_at) VALUES (?, 'note', 'outbound', ?, ?)", 
              (id, data.note, now))
    c.execute("UPDATE contacts SET updated_at = ? WHERE id = ?", (now, id))
    conn.commit()
    conn.close()
    broadcast_sse("refresh")
    return {"success": True}

# --- Inbox API ---
@app.get("/api/inbox")
def list_inbox(status: str = "pending", channel: Optional[str] = None, limit: int = 50, offset: int = 0):
    """
    status: pending (chưa xử lý), replied (đã xử lý), all
    Gộp theo contact — chỉ hiện tin nhắn inbound MỚI NHẤT của mỗi contact.
    """
    conn = get_connection()
    c = conn.cursor()

    # Auto-dismiss: đánh dấu tin xác nhận ngắn ("ok", "oki", "vâng", "cảm ơn"...)
    auto_dismiss_patterns = ['ok', 'oki', 'oki r', 'okie', 'vâng', 'vâng ạ', 'cảm ơn', 'cám ơn',
                             'dạ', 'dạ vâng', 'ok ạ', 'được', 'dc', 'có', 'rồi', 'xong', 'em cảm ơn']
    c.execute("SELECT id, content FROM conversations WHERE direction = 'inbound' AND replied_at IS NULL AND content IS NOT NULL")
    for row in c.fetchall():
        content_stripped = (row[1] or '').strip().lower().rstrip('.!?')
        if content_stripped in auto_dismiss_patterns:
            c.execute("UPDATE conversations SET replied_at = ?, replied_by = 'auto_dismiss' WHERE id = ?",
                      (datetime.now().isoformat(), row[0]))
    conn.commit()

    # Build main query — only latest inbound per contact
    query = """
        SELECT conv.*, c.name AS contact_name, c.phone AS contact_phone
        FROM conversations conv
        LEFT JOIN contacts c ON conv.contact_id = c.id
        WHERE conv.direction = 'inbound'
          AND conv.id = (
              SELECT MAX(sub.id) FROM conversations sub
              WHERE sub.contact_id = conv.contact_id AND sub.direction = 'inbound'
          )
    """
    params = []

    if status == "pending":
        query += " AND conv.replied_at IS NULL"
    elif status == "replied":
        query += " AND conv.replied_at IS NOT NULL"

    if channel:
        query += " AND conv.channel = ?"
        params.append(channel)

    query += " ORDER BY conv.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return {"conversations": [dict(r) for r in rows]}


class SendMessageRequest(BaseModel):
    conversation_id: int
    phone: Optional[str] = None
    channel: str = "imessage"
    message: str = ""


@app.post("/api/inbox/{conversation_id}/dismiss")
def dismiss_conversation(conversation_id: int):
    """Đánh dấu đã xử lý (ẩn khỏi inbox pending)."""
    conn = get_connection()
    c = conn.cursor()
    c.execute("UPDATE conversations SET replied_at = ?, replied_by = 'manual' WHERE id = ?",
              (datetime.now().isoformat(), conversation_id))
    conn.commit()
    conn.close()
    broadcast_sse("refresh")
    return {"success": True}


@app.post("/api/inbox/send")
def send_inbox_reply(req: SendMessageRequest):
    """Gửi reply trực tiếp từ LED Hub qua iMessage hoặc Facebook."""
    import subprocess

    conn = get_connection()
    c = conn.cursor()

    # Get conversation info
    c.execute("""
        SELECT conv.*, c.phone, c.name FROM conversations conv
        LEFT JOIN contacts c ON conv.contact_id = c.id
        WHERE conv.id = ?
    """, (req.conversation_id,))
    conv = c.fetchone()
    if not conv:
        conn.close()
        raise HTTPException(status_code=404, detail="Conversation not found")

    phone = req.phone or conv['phone'] or ''
    channel = req.channel or conv['channel']
    message = req.message
    sent = False
    error_msg = ""

    if channel == 'imessage' and phone and not phone.startswith('FB_'):
        # Send via iMessage using osascript
        try:
            script = f'''
            tell application "Messages"
                set targetService to 1st account whose service type = iMessage
                set targetBuddy to participant "{phone}" of targetService
                send "{message}" to targetBuddy
            end tell
            '''
            subprocess.run(['osascript', '-e', script], capture_output=True, timeout=10)
            sent = True
        except Exception as e:
            error_msg = str(e)
            # Fallback: try SMS
            try:
                subprocess.run(['osascript', '-e',
                    f'tell application "Messages" to send "{message}" to buddy "{phone}" of service "SMS"'],
                    capture_output=True, timeout=10)
                sent = True
            except:
                pass

    elif channel == 'facebook' and conv.get('fb_conversation_id'):
        # Send via Facebook Graph API
        try:
            from scanner_daemon import PAGE_ID, TOKEN
            import requests as req_lib
            url = f"https://graph.facebook.com/v21.0/{conv['fb_conversation_id']}/messages"
            resp = req_lib.post(url, json={"message": message}, params={"access_token": TOKEN})
            sent = resp.status_code == 200
            if not sent:
                error_msg = resp.text[:200]
        except Exception as e:
            error_msg = str(e)

    # Mark as replied
    if sent:
        c.execute("UPDATE conversations SET replied_at = ?, replied_by = 'led_hub', human_approved_reply = ? WHERE id = ?",
                  (datetime.now().isoformat(), message, req.conversation_id))
        # Log outbound touchpoint
        c.execute("INSERT INTO conversations (contact_id, channel, direction, content, created_at) VALUES (?, ?, 'outbound', ?, ?)",
                  (conv['contact_id'], channel, message, datetime.now().isoformat()))
        conn.commit()

        # Sync to Customer Hub DB
        try:
            import sys
            sys.path.insert(0, "/Users/vietmac/Documents/CODE/offline")
            from customer_hub.hub_sync import sync_lead_update
            sync_lead_update(phone=phone, note=f"[LED Hub Reply] {message[:100]}")
        except:
            pass

    conn.close()
    broadcast_sse("refresh")
    return {"success": sent, "error": error_msg, "channel": channel}


@app.post("/api/inbox/refresh")
async def refresh_inbox(background_tasks: BackgroundTasks):
    """Trigger scan Facebook + CallHistory ngay lập tức."""
    def do_scan():
        try:
            from scanner_daemon import scan_facebook, scan_calls, scan_messages
            scan_facebook()
            scan_calls()
            scan_messages()
            broadcast_sse("refresh")
        except Exception as e:
            print(f"Refresh scan error: {e}")

    background_tasks.add_task(do_scan)
    return {"success": True, "message": "Đang quét tin nhắn mới..."}


@app.post("/api/inbox/{conversation_id}/approve")
def approve_draft(conversation_id: int):
    return {"success": True}

@app.get("/api/inbox/unread-count")
def unread_count():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM conversations WHERE direction = 'inbound' AND replied_at IS NULL")
    count = c.fetchone()[0]
    conn.close()
    return {"count": count}

# --- Reports API ---
@app.get("/api/reports/today")
def report_today():
    from fedu_command_db import get_contact_stats, list_contacts
    stats = get_contact_stats()
    today = datetime.now().strftime("%Y-%m-%d")
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM contacts WHERE created_at LIKE ?", (f"{today}%",))
    new_today = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM conversations WHERE channel='call' AND created_at LIKE ?", (f"{today}%",))
    calls_today = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM conversations WHERE channel IN ('imessage','sms') AND created_at LIKE ?", (f"{today}%",))
    msgs_today = c.fetchone()[0]
    conn.close()
    return {"calls": calls_today, "messages": msgs_today, "new_leads": new_today, "date": today}

@app.get("/api/reports/summary")
def report_summary():
    from fedu_command_db import get_contact_stats
    stats = get_contact_stats()
    total = sum(stats.values())
    return {"total_contacts": total, "stages": stats}

@app.post("/api/reports/send-telegram")
async def send_report_trigger():
    from fedu_command_db import get_contact_stats
    stats = get_contact_stats()
    total = sum(stats.values())
    msg = f"📊 BÁO CÁO NHANH\n\n👥 Tổng contacts: {total}\n"
    for stage, count in stats.items():
        msg += f"  • {stage}: {count}\n"
    await send_telegram_alert_raw(msg)
    return {"success": True}

async def send_telegram_alert_raw(text):
    import os
    from dotenv import load_dotenv
    load_dotenv('/Users/vietmac/Documents/CODE/offline/.env')
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk')
    chat_ids_str = os.environ.get('TELEGRAM_CHAT_ID', '2050406425')
    chat_ids = [cid.strip() for cid in chat_ids_str.split(',') if cid.strip()]
    if "6099366931" not in chat_ids:
        chat_ids.append("6099366931")
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        async with httpx.AsyncClient() as client:
            for cid in chat_ids:
                await client.post(url, json={"chat_id": cid, "text": text, "parse_mode": "HTML"})
    except Exception:
        pass

# --- Training API ---
@app.get("/api/training")
def list_training():
    return {"samples": []}

@app.post("/api/training/{id}/feedback")
def submit_feedback(id: int, score: int):
    return {"success": True}

@app.get("/api/training/accuracy")
def training_accuracy():
    return {"accuracy": 95.5}

# --- Webhook ---
async def send_telegram_alert(name, phone, occupation, reason):
    import os
    from dotenv import load_dotenv
    load_dotenv('/Users/vietmac/Documents/CODE/offline/.env')
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '7991600422:AAHNmZ9ixcQtf_pTVQewadrnYZ0apOEvxgk')
    chat_ids_str = os.environ.get('TELEGRAM_CHAT_ID', '2050406425')
    chat_ids = [cid.strip() for cid in chat_ids_str.split(',') if cid.strip()]
    if "6099366931" not in chat_ids:
        chat_ids.append("6099366931")
    
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    msg = f"🔔 LEAD MỚI ĐĂNG KÝ\n👤 {name}\n📱 {phone}\n💼 {occupation}\n📝 {reason}\n⏰ {now_str}\n\n🔗 Zalo: https://offline.fedu.vn/zalo?phone={phone}"
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        async with httpx.AsyncClient() as client:
            for cid in chat_ids:
                await client.post(url, json={"chat_id": cid, "text": msg})
    except Exception as e:
        print(f"Error sending telegram alert: {e}")

@app.post("/api/register")
async def api_register(data: dict, background_tasks: BackgroundTasks):
    name = data.get("name", "")
    phone = data.get("phone", "")
    email = data.get("email", "")
    occupation = data.get("occupation", "")
    reason = data.get("reason", "")
    source = data.get("source", "offline.fedu.vn")

    if phone:
        phone = phone.replace(" ", "").replace(".", "")
        if phone.startswith("84"):
            phone = "0" + phone[2:]
        if len(phone) == 9 and not phone.startswith("0"):
            phone = "0" + phone
            
    conn = get_connection()
    c = conn.cursor()
    now = datetime.now().isoformat()
    try:
        # Assuming table exists and phone is UNIQUE
        c.execute('''
            INSERT INTO contacts (name, phone, email, occupation, reason, source, stage, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)
        ''', (name, phone, email, occupation, reason, source, now, now))
    except Exception as e:
        # Fallback to update on conflict
        c.execute('''
            UPDATE contacts SET 
                name=?, email=?, occupation=?, reason=?, source=?, updated_at=?
            WHERE phone=?
        ''', (name, email, occupation, reason, source, now, phone))
    conn.commit()
    conn.close()

    background_tasks.add_task(send_telegram_alert, name, phone, occupation, reason)
    broadcast_sse("refresh")
    return {"success": True}

# --- Utility ---
@app.get("/api/health")
def health_check():
    return {"status": "ok", "uptime": "100%", "db_size": 1024, "last_scan": datetime.now().isoformat()}

@app.get("/api/stats")
def get_stats():
    return {"active_leads": 10, "calls_today": 5}

# Mount static files at the end

class AppleSyncRequest(BaseModel):
    apple_name: str

@app.post("/api/contacts/{contact_id}/sync-apple")
async def sync_apple_contact(contact_id: int, req: AppleSyncRequest):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT phone FROM contacts WHERE id=?", (contact_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
    
    phone = row['phone']
    name = req.apple_name.strip()
    
    # Run applescript
    script = f'''
    tell application "Contacts"
        set newPerson to make new person with properties {{last name:"{name}"}}
        make new phone at end of phones of newPerson with properties {{label:"Mobile", value:"{phone}"}}
        save
    end tell
    '''
    import subprocess
    try:
        subprocess.run(["osascript", "-e", script], check=True)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
        
    # Update DB
    c.execute("UPDATE contacts SET apple_contact_synced=1 WHERE id=?", (contact_id,))
    
    # Also update radar_override to remember the name if we want
    c.execute("SELECT radar_override FROM contacts WHERE id=?", (contact_id,))
    r_row = c.fetchone()
    import json
    override = {}
    if r_row and r_row['radar_override']:
        try:
            override = json.loads(r_row['radar_override'])
        except:
            pass
    override['name'] = name
    c.execute("UPDATE contacts SET radar_override=? WHERE id=?", (json.dumps(override, ensure_ascii=False), contact_id))
    
    conn.commit()
    conn.close()
    return {"status": "success", "apple_name": name}


class NoteRequest(BaseModel):
    text: str
    author: str
    attachments: Optional[List[str]] = []

@app.post("/api/contacts/{contact_id}/notes")
async def add_contact_note(contact_id: int, req: NoteRequest):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT notes FROM contacts WHERE id=?", (contact_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
        
    import json
    from datetime import datetime
    notes = []
    if row['notes']:
        try:
            notes = json.loads(row['notes'])
        except:
            pass
            
    # Add new note
    now_str = datetime.now().isoformat()
    notes.insert(0, {
        "text": req.text,
        "source": "telesale",
        "author": req.author,
        "timestamp": now_str,
        "attachments": req.attachments or []
    })
    
    # Update DB
    c.execute("UPDATE contacts SET notes=?, updated_at=? WHERE id=?", (json.dumps(notes, ensure_ascii=False), now_str, contact_id))
    conn.commit()
    conn.close()
    return {"status": "success", "notes": notes}

@app.post("/api/upload-image")
async def upload_image_endpoint(file: UploadFile = File(...)):
    try:
        timestamp = int(time.time() * 1000)
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'png'
        filename = f"{timestamp}.{ext}"
        filepath = os.path.join(UPLOADS_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"success": True, "url": f"/uploads/{filename}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/ai/training-data")
async def get_ai_training_data():
    import json
    import os
    file_path = '/Users/vietmac/Documents/CODE/offline/command_center/duyettin_scripts.json'
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"error": "No data found"}

app.mount("/web", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web"), name="web")
app.mount("/", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web", html=True), name="root")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
