import os
import time
import json
import asyncio
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, UploadFile, File
from fastapi.responses import StreamingResponse, PlainTextResponse, JSONResponse
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
def list_contacts(background_tasks: BackgroundTasks, stage: Optional[str] = None, search: Optional[str] = None, limit: int = 50, offset: int = 0):
    try:
        from apple_contacts_sync import sync_realtime_calls_and_ab, batch_sync_contacts_to_apple
        changed_ids = sync_realtime_calls_and_ab(days=3, push_to_icloud=False)
        if changed_ids:
            background_tasks.add_task(batch_sync_contacts_to_apple, changed_ids)
    except Exception as e:
        print(f"Realtime sync warning: {e}")

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
    query += """
        ORDER BY
            CASE WHEN phone LIKE 'FB_%' OR phone IS NULL OR phone = '' THEN 1 ELSE 0 END ASC,
            CASE WHEN stage = 'new' THEN substr(created_at, 1, 19) ELSE substr(updated_at, 1, 19) END DESC,
            CASE WHEN source = 'offline.fedu.vn' THEN 0 ELSE 1 END ASC,
            id DESC
        LIMIT ? OFFSET ?
    """
    params.extend([limit, offset])
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return {"contacts": [dict(r) for r in rows]}

@app.get("/api/contacts/{id}")
def get_contact(id: int, background_tasks: BackgroundTasks):
    try:
        from apple_contacts_sync import sync_realtime_calls_and_ab, batch_sync_contacts_to_apple
        changed_ids = sync_realtime_calls_and_ab(contact_id=id, days=7, push_to_icloud=False)
        if changed_ids:
            background_tasks.add_task(batch_sync_contacts_to_apple, changed_ids)
    except Exception:
        pass

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

    conv_dict = dict(conv)
    phone = req.phone or conv_dict.get('phone') or ''
    channel = req.channel or conv_dict.get('channel')
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

    elif channel == 'facebook':
        # Send via Facebook Graph API (Page Send API)
        try:
            from scanner_daemon import PAGE_ID, TOKEN
            import requests as req_lib

            recipient_id = None
            if phone and phone.startswith('FB_'):
                recipient_id = phone.replace('FB_', '').strip()

            fb_conv_id = conv_dict.get('fb_conversation_id')
            if not recipient_id and fb_conv_id:
                p_url = f"https://graph.facebook.com/v21.0/{fb_conv_id}"
                p_resp = req_lib.get(p_url, params={"fields": "participants", "access_token": TOKEN}, timeout=10)
                if p_resp.status_code == 200:
                    participants = p_resp.json().get("participants", {}).get("data", [])
                    for p in participants:
                        if str(p.get("id")) != str(PAGE_ID):
                            recipient_id = str(p.get("id"))
                            break

            if not recipient_id:
                error_msg = "Không tìm thấy PSID người nhận trên Facebook"
            else:
                url = f"https://graph.facebook.com/v21.0/{PAGE_ID}/messages"
                payload = {
                    "recipient": {"id": recipient_id},
                    "message": {"text": message},
                    "messaging_type": "RESPONSE"
                }
                resp = req_lib.post(url, json=payload, params={"access_token": TOKEN}, timeout=15)
                if resp.status_code != 200:
                    # Fallback HUMAN_AGENT / ACCOUNT_UPDATE tag if outside 24h window
                    for tag in ["HUMAN_AGENT", "ACCOUNT_UPDATE", "CONFIRMED_EVENT_UPDATE"]:
                        payload_tag = {
                            "recipient": {"id": recipient_id},
                            "message": {"text": message},
                            "messaging_type": "MESSAGE_TAG",
                            "tag": tag
                        }
                        resp_tag = req_lib.post(url, json=payload_tag, params={"access_token": TOKEN}, timeout=15)
                        if resp_tag.status_code == 200:
                            resp = resp_tag
                            break
                sent = resp.status_code == 200
                if not sent:
                    try:
                        err_json = resp.json().get("error", {})
                        error_msg = err_json.get("message") or resp.text[:200]
                    except Exception:
                        error_msg = resp.text[:200]
        except Exception as e:
            error_msg = str(e)

    elif channel == 'zalo':
        try:
            z_uid = str(conv_dict.get('zalo_uid') or '').strip()
            if not z_uid and conv_dict.get('contact_id'):
                c.execute("SELECT zalo_uid FROM contacts WHERE id = ?", (conv_dict['contact_id'],))
                zr = c.fetchone()
                if zr and zr['zalo_uid']:
                    z_uid = str(zr['zalo_uid']).strip()
            if not z_uid or z_uid == 'NOT_FOUND':
                error_msg = "Chưa có Zalo UID của học viên/lead này"
            else:
                now_iso = datetime.now().isoformat()
                c.execute(
                    """
                    INSERT INTO zalo_outbox_queue (action_type, target_uid, contact_id, payload_json, status, created_at, updated_at)
                    VALUES ('SEND_MESSAGE', ?, ?, ?, 'PENDING', ?, ?)
                    """,
                    (z_uid, conv_dict.get('contact_id'), json.dumps({"text": message}, ensure_ascii=False), now_iso, now_iso)
                )
                conn.commit()
                sent = True
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
async def api_register(request: Request, data: dict, background_tasks: BackgroundTasks):
    name = data.get("name", "")
    phone = data.get("phone", "")
    email = data.get("email", "")
    occupation = data.get("occupation", "")
    reason = data.get("reason", "")
    source = data.get("source", "offline.fedu.vn")
    skip_tg = (
        request.headers.get("X-Skip-Telegram") == "1"
        or str(source).lower().startswith("offline.fedu.vn")
        or bool(data.get("suggestedScript"))
    )

    if phone:
        phone = phone.replace(" ", "").replace(".", "")
        if phone.startswith("84"):
            phone = "0" + phone[2:]
        if len(phone) == 9 and not phone.startswith("0"):
            phone = "0" + phone
            
    from fedu_command_db import get_vn_time
    conn = get_connection()
    c = conn.cursor()
    now = get_vn_time()
    contact_id = None
    is_fb_ads = (source == "offline.fedu.vn") or ("fb" in str(data.get("url") or "").lower())
    tags_val = json.dumps(["🔥 QC Facebook"], ensure_ascii=False) if is_fb_ads else json.dumps([], ensure_ascii=False)
    try:
        notes_val = json.dumps([{"text": reason, "source": "landing_register", "author": "Khách tự điền", "timestamp": now, "attachments": []}], ensure_ascii=False) if reason else None
        c.execute('''
            INSERT INTO contacts (name, phone, email, industry, notes, tags, source, stage, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
        ''', (name, phone, email, occupation, notes_val, tags_val, source, now, now))
        contact_id = c.lastrowid
    except Exception as e:
        c.execute("SELECT id, stage, notes, tags FROM contacts WHERE phone=?", (phone,))
        r_existing = c.fetchone()
        if r_existing:
            contact_id = r_existing['id']
            old_stage = r_existing['stage'] or 'new'
            from apple_contacts_sync import parse_notes_safely
            existing_notes = parse_notes_safely(r_existing['notes'])
            existing_tags = []
            try:
                existing_tags = json.loads(r_existing['tags'] or '[]')
            except Exception:
                existing_tags = []
            if is_fb_ads and "🔥 QC Facebook" not in existing_tags:
                existing_tags.append("🔥 QC Facebook")

            if old_stage in ('unqualified', 'archived_unqualified') or "🚫 Loại trừ Ads" in existing_tags:
                if "⚠️ SĐT Từng Loại Trừ" not in existing_tags:
                    existing_tags.insert(0, "⚠️ SĐT Từng Loại Trừ")
                existing_notes.insert(0, {
                    "text": f"⚠️ [NHẬN DIỆN SĐT CŨ TỪNG LOẠI TRỪ - Đăng ký lại]: {reason or 'Không ghi lý do'}",
                    "source": "landing_register",
                    "author": "Hệ thống nhận diện SĐT",
                    "timestamp": now,
                    "attachments": []
                })
                # Đưa vào Cột 5 (Chờ duyệt) để anh Việt kiểm tra thay vì trộn lẫn vào Cột 1
                next_stage = 'unqualified'
            else:
                if reason:
                    existing_notes.insert(0, {
                        "text": reason,
                        "source": "landing_register",
                        "author": "Khách tự điền",
                        "timestamp": now,
                        "attachments": []
                    })
                next_stage = old_stage if old_stage == 'enrolled' else 'new'

            c.execute('''
                UPDATE contacts SET 
                    name=?, email=?, industry=?, source=?, stage=?, notes=?, tags=?, updated_at=?
                WHERE id=?
            ''', (
                name, email, occupation, source, next_stage,
                json.dumps(existing_notes, ensure_ascii=False),
                json.dumps(existing_tags, ensure_ascii=False),
                now, contact_id
            ))
    conn.commit()
    conn.close()

    if contact_id:
        from apple_contacts_sync import sync_single_contact_to_apple
        background_tasks.add_task(sync_single_contact_to_apple, contact_id)
    if not skip_tg:
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

@app.post("/api/internal/broadcast-refresh")
def internal_broadcast_refresh():
    broadcast_sse("refresh")
    return {"success": True}

class AppleSyncRequest(BaseModel):
    apple_name: Optional[str] = None

@app.post("/api/contacts/{contact_id}/sync-apple")
async def sync_apple_contact(contact_id: int, req: AppleSyncRequest):
    from apple_contacts_sync import sync_single_contact_to_apple, sync_realtime_calls_and_ab
    try:
        sync_realtime_calls_and_ab(contact_id=contact_id, days=7, push_to_icloud=False)
    except Exception:
        pass
    res = sync_single_contact_to_apple(contact_id, custom_apple_name=req.apple_name)
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "Sync failed"))
    broadcast_sse("refresh")
    return {
        "status": "success",
        "apple_name": res["apple_name"],
        "clean_name": res["clean_name"],
        "stage": res.get("stage"),
        "updated_at": res.get("updated_at"),
        "radar_override": res.get("radar_override"),
        "note": res["note"]
    }


def detect_followup_from_text(text: str, timestamp_str: str = "", author: str = "") -> Optional[Dict[str, Any]]:
    """
    Tự động nhận diện ý định Hẹn gọi lại / Nhắn Zalo / Chờ cọc / Báo lịch từ nội dung ghi chú Telesale.
    Bỏ qua các câu phủ định ('ko phù hợp', 'không phù hợp', 'khó chốt', 'sai tệp', 'đã chăm rồi').
    """
    import re
    if not text:
        return None
    low = text.lower().strip()
    # Loại trừ các trường hợp từ chối / không phù hợp / đã hoàn tất
    if re.search(r"(ko\s+phù\s+hợp|không\s+phù\s+hợp|khó\s+chốt|sai\s+tệp|chăm\s+rồi|chăm\s+rôi|đã\s+cọc\s+trước|loại\s+trừ)", low):
        return None

    has_hen = bool(re.search(r"\b(hẹn|gọi\s+lại|nhắn\s+lại|báo\s+lại|add\s+zalo|kết\s+bạn\s+zalo|check\s+lại\s+lịch|chuyển\s+khoản\s+cọc|chờ\s+cọc)\b", low))
    if not has_hen:
        return None

    has_zalo = bool(re.search(r"\b(zalo|nhắn|ib|inbox)\b", low))
    has_call = bool(re.search(r"\b(gọi|call|alo|điện)\b", low))
    has_deposit = bool(re.search(r"\b(cọc|chuyển\s+khoản|ck)\b", low))

    if has_zalo and has_call:
        ftype = "call_zalo"
    elif has_deposit:
        ftype = "deposit"
    elif has_zalo:
        ftype = "zalo"
    elif has_call:
        ftype = "call"
    else:
        ftype = "callback"

    when_label = "Cần liên hệ lại"
    due_bucket = "today"
    if re.search(r"(tối.*hoặc\s+mai|tôi\s+gọi\s+lại\s+hoặc\s+mai|tối\s+nay\s+hoặc\s+mai)", low):
        when_label = "Tối nay hoặc Ngày mai"
        due_bucket = "today"
    elif re.search(r"\b(tối\s+nay|tối\s+gọi|tôi\s+gọi)\b", low):
        when_label = "Tối nay"
        due_bucket = "today"
    elif re.search(r"\b(chiều\s+nay|chiều\s+gọi)\b", low):
        when_label = "Chiều nay"
        due_bucket = "today"
    elif re.search(r"\b(sáng\s+mai)\b", low):
        when_label = "Sáng mai"
        due_bucket = "tomorrow"
    elif re.search(r"\b(ngày\s+mai|mai\s+gọi|hẹn\s+mai|mai\b)", low):
        when_label = "Ngày mai"
        due_bucket = "tomorrow"
    elif re.search(r"\b(cuối\s+tuần|thứ\s+[2-7]|chủ\s+nhật)\b", low):
        m = re.search(r"(cuối\s+tuần|thứ\s+[2-7]|chủ\s+nhật)", low)
        when_label = f"Hẹn {m.group(1).title()}" if m else "Trong tuần"
        due_bucket = "upcoming"
    elif re.search(r"\b(cuối\s+tháng|\d{1,2}/\d{1,2})\b", low):
        m = re.search(r"(cuối\s+tháng|\d{1,2}/\d{1,2}(?:-\d{1,2}/\d{1,2})?)", low)
        when_label = f"Mốc {m.group(1)}" if m else "Sắp tới"
        due_bucket = "upcoming"

    return {
        "active": True,
        "pinned": due_bucket in ("today", "tomorrow"),
        "type": ftype,
        "when_label": when_label,
        "due_bucket": due_bucket,
        "note": text.strip(),
        "author": author or "Anh Việt",
        "updated_at": timestamp_str or datetime.now().isoformat(),
    }


class NoteRequest(BaseModel):
    text: str
    author: str
    attachments: Optional[List[str]] = []
    followup: Optional[Dict[str, Any]] = None
    pinned: Optional[bool] = None


class FollowupUpdateRequest(BaseModel):
    active: Optional[bool] = None
    pinned: Optional[bool] = None
    type: Optional[str] = None
    when_label: Optional[str] = None
    due_bucket: Optional[str] = None
    due_at: Optional[str] = None
    note: Optional[str] = None
    author: Optional[str] = None


@app.post("/api/contacts/{contact_id}/followup")
async def update_contact_followup(contact_id: int, req: FollowupUpdateRequest):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT radar_override, stage, notes FROM contacts WHERE id=?", (contact_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")

    override = {}
    if row["radar_override"]:
        try:
            override = json.loads(row["radar_override"])
        except Exception:
            override = {}

    cur_f = override.get("followup") if isinstance(override.get("followup"), dict) else {}
    now_str = datetime.now().isoformat()

    if req.active is not None:
        cur_f["active"] = req.active
        if not req.active:
            cur_f["resolved_at"] = now_str
    elif "active" not in cur_f:
        cur_f["active"] = True

    if req.type is not None:
        cur_f["type"] = req.type
    if req.when_label is not None:
        cur_f["when_label"] = req.when_label
    if req.due_bucket is not None:
        cur_f["due_bucket"] = req.due_bucket
    if req.due_at is not None:
        cur_f["due_at"] = req.due_at
    if req.note is not None:
        cur_f["note"] = req.note
    if req.author is not None:
        cur_f["author"] = req.author
    cur_f["updated_at"] = now_str

    if req.pinned is not None:
        override["pinned"] = req.pinned
        cur_f["pinned"] = req.pinned
    elif req.active is False:
        override["pinned"] = False
        cur_f["pinned"] = False

    override["followup"] = cur_f
    override_json = json.dumps(override, ensure_ascii=False)

    c.execute(
        "UPDATE contacts SET radar_override=?, updated_at=? WHERE id=?",
        (override_json, now_str, contact_id),
    )
    conn.commit()
    conn.close()
    broadcast_sse("refresh")
    return {
        "status": "success",
        "contact_id": contact_id,
        "radar_override": override_json,
        "followup": cur_f,
        "pinned": override.get("pinned", False),
        "updated_at": now_str,
    }


@app.post("/api/contacts/{contact_id}/notes")
async def add_contact_note(contact_id: int, req: NoteRequest):
    from apple_contacts_sync import parse_notes_safely, sync_single_contact_to_apple, sync_realtime_calls_and_ab
    try:
        sync_realtime_calls_and_ab(contact_id=contact_id, days=7, push_to_icloud=False)
    except Exception:
        pass

    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT notes, stage, radar_override FROM contacts WHERE id=?", (contact_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
        
    notes = parse_notes_safely(row['notes'])
            
    # Add new note
    now_str = datetime.now().isoformat()
    if req.text and req.text.strip():
        notes.insert(0, {
            "text": req.text,
            "source": "telesale",
            "author": req.author,
            "timestamp": now_str,
            "attachments": req.attachments or []
        })
        notes.sort(key=lambda x: str(x.get("timestamp") or "")[:19], reverse=True)
    
    # Nếu stage đang là 'new' và có ghi chú telesale -> tự động chuyển sang 'contacted'
    new_stage = row['stage']
    if new_stage == 'new':
        new_stage = 'contacted'

    # Xử lý followup & pin (từ UI truyền lên hoặc tự động bóc tách từ câu ghi chú)
    override = {}
    if row["radar_override"]:
        try:
            override = json.loads(row["radar_override"])
        except Exception:
            override = {}

    if req.followup is not None:
        f_obj = dict(req.followup)
        f_obj["updated_at"] = now_str
        if not f_obj.get("note") and req.text:
            f_obj["note"] = req.text.strip()
        if not f_obj.get("author") and req.author:
            f_obj["author"] = req.author
        override["followup"] = f_obj
        if "pinned" in f_obj:
            override["pinned"] = bool(f_obj["pinned"])
    else:
        auto_f = detect_followup_from_text(req.text, now_str, req.author)
        if auto_f:
            override["followup"] = auto_f
            if auto_f.get("pinned"):
                override["pinned"] = True

    if req.pinned is not None:
        override["pinned"] = req.pinned
        if isinstance(override.get("followup"), dict):
            override["followup"]["pinned"] = req.pinned

    # Update DB
    c.execute(
        "UPDATE contacts SET notes=?, stage=?, radar_override=?, updated_at=? WHERE id=?",
        (json.dumps(notes, ensure_ascii=False), new_stage, json.dumps(override, ensure_ascii=False), now_str, contact_id)
    )
    conn.commit()
    conn.close()

    # Tự động đồng bộ & đổi tên trên Apple Contacts (offline4 - [Tên] - việt đã gọi / Nhi đã gọi)
    sync_res = sync_single_contact_to_apple(contact_id)
    broadcast_sse("refresh")
    return {
        "status": "success",
        "notes": notes,
        "stage": sync_res.get("stage") or new_stage,
        "updated_at": sync_res.get("updated_at") or now_str,
        "radar_override": sync_res.get("radar_override") or json.dumps(override, ensure_ascii=False),
        "apple_contact_synced": 1 if sync_res.get("success") else 0,
        "apple_name": sync_res.get("apple_name"),
        "clean_name": sync_res.get("clean_name"),
    }

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


class NhiAgentSyncRequest(BaseModel):
    calls: Optional[List[Dict[str, Any]]] = []
    ab_contacts: Optional[List[Dict[str, Any]]] = []


@app.get("/api/agent/nhi-leads")
async def get_nhi_leads():
    """Trả về danh sách toàn bộ Lead có SĐT để máy Mac Air của Nhi tự động nạp vào Danh bạ ngay khi bật máy."""
    from apple_contacts_sync import build_contact_name_and_note
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM contacts WHERE phone IS NOT NULL AND phone NOT LIKE 'FB_%' AND id >= 200 ORDER BY id DESC")
    rows = [dict(r) for r in c.fetchall()]
    leads_out = []
    for r in rows:
        if "30 ngày học" in (r.get("name") or "").lower():
            continue
        c.execute("SELECT * FROM conversations WHERE contact_id = ? ORDER BY created_at DESC", (r["id"],))
        convs = [dict(x) for x in c.fetchall()]
        custom_name = None
        if r.get("radar_override"):
            try:
                ov = json.loads(r["radar_override"])
                custom_name = ov.get("name")
            except Exception:
                pass
        apple_name, clean_name, full_note = build_contact_name_and_note(r, convs, custom_apple_name=custom_name)
        leads_out.append({
            "id": r["id"],
            "name": clean_name,
            "apple_name": apple_name,
            "phone": r.get("phone") or "",
            "email": r.get("email") or "",
            "note": full_note,
            "stage": r.get("stage") or "new",
            "updated_at": r.get("updated_at") or "",
        })
    conn.close()
    return {"leads": leads_out}


@app.post("/api/agent/nhi-sync")
async def post_nhi_sync(req: NhiAgentSyncRequest):
    """
    Nhận dữ liệu thời gian thực từ máy Mac Air của Nhi:
      1. Lịch sử cuộc gọi trên máy Mac Air / iPhone của Nhi (CallHistory.storedata)
      2. Thay đổi tên / trạng thái liên hệ trong Danh bạ trên máy Mac Air của Nhi (AddressBook-v22.abcddb)
    Tự động chuyển vị trí cột (stage), cập nhật tên '- Nhi đã gọi', ghi vào Lịch Sử Bối Cảnh và đồng bộ sang máy anh Việt.
    """
    from apple_contacts_sync import (
        clean_base_name,
        format_duration_vn,
        parse_notes_safely,
        batch_sync_contacts_to_apple,
    )
    import re
    conn = get_connection()
    c = conn.cursor()
    changed_ids: List[int] = []

    # 1. Xử lý cuộc gọi từ máy Mac Air của Nhi
    for call in (req.calls or []):
        raw_phone = str(call.get("phone") or "")
        digits = re.sub(r"\D", "", raw_phone)
        if len(digits) < 9:
            continue
        last9 = digits[-9:]
        c.execute("SELECT * FROM contacts WHERE phone LIKE ?", (f"%{last9}%",))
        matched = [dict(r) for r in c.fetchall()]
        if not matched:
            continue

        dur_sec = float(call.get("duration") or 0)
        answered = int(call.get("answered") or 0)
        originated = int(call.get("originated") or 0)
        call_time_str = str(call.get("call_time") or "")
        try:
            start_dt = datetime.fromisoformat(call_time_str.replace(" ", "T"))
        except Exception:
            start_dt = datetime.now()
        end_dt = datetime.fromtimestamp(start_dt.timestamp() + dur_sec)
        iso_start = start_dt.isoformat()
        call_key = start_dt.strftime("%Y-%m-%d %H:%M")

        if dur_sec > 0 or answered == 1:
            call_note_text = (
                f"📞 Đàm thoại {format_duration_vn(dur_sec)} "
                f"({start_dt.strftime('%H:%M:%S')} → {end_dt.strftime('%H:%M:%S')}) — Sale Nhi đã gọi"
            )
        elif originated == 1:
            call_note_text = f"📞 Sale Nhi gọi đi lúc {start_dt.strftime('%H:%M:%S')} — Không nghe máy"
        else:
            call_note_text = f"📞 Cuộc gọi nhỡ (máy Nhi) lúc {start_dt.strftime('%H:%M:%S')}"

        for ct in matched:
            cid = ct["id"]
            notes_list = parse_notes_safely(ct.get("notes"))
            exists = any(
                n.get("source") == "call" and (n.get("call_key") == call_key or start_dt.strftime("%H:%M:%S") in str(n.get("text") or ""))
                for n in notes_list
            )
            if not exists:
                notes_list.insert(0, {
                    "text": call_note_text,
                    "source": "call",
                    "author": "Sale Nhi (Mac Call)",
                    "timestamp": iso_start,
                    "call_key": call_key,
                    "duration": round(dur_sec, 1),
                    "attachments": [],
                })
                notes_list.sort(key=lambda x: str(x.get("timestamp") or ""), reverse=True)
                new_stage = ct.get("stage") or "new"
                if new_stage == "new":
                    new_stage = "contacted"
                override = {}
                if ct.get("radar_override"):
                    try:
                        override = json.loads(ct["radar_override"])
                    except Exception:
                        override = {}
                prefix, base_name = clean_base_name(ct.get("name") or "")
                override["name"] = f"{prefix}{base_name} - Nhi đã gọi"
                c.execute(
                    "UPDATE contacts SET notes=?, stage=?, radar_override=?, updated_at=? WHERE id=?",
                    (json.dumps(notes_list, ensure_ascii=False), new_stage, json.dumps(override, ensure_ascii=False), datetime.now().isoformat(), cid),
                )
                if cid not in changed_ids:
                    changed_ids.append(cid)

    # 2. Xử lý thay đổi tên Danh bạ từ máy Mac Air của Nhi
    for ab in (req.ab_contacts or []):
        raw_phone = str(ab.get("phone") or "")
        ab_name = str(ab.get("ab_name") or "").strip()
        digits = re.sub(r"\D", "", raw_phone)
        if len(digits) < 9 or not ab_name:
            continue
        if not re.search(r"(?i)(đã\s+gọi|nhi\s+gọi|gọi\s+rồi|đã\s+lh|ko\s+nghe|k\s+nghe|thuê\s+bao|đang\s+trao\s+đổi|hẹn\s+gọi|đã\s+cọc|đã\s+đk)", ab_name):
            continue
        last9 = digits[-9:]
        c.execute("SELECT * FROM contacts WHERE phone LIKE ?", (f"%{last9}%",))
        for r in c.fetchall():
            ct = dict(r)
            cid = ct["id"]
            override = {}
            if ct.get("radar_override"):
                try:
                    override = json.loads(ct["radar_override"])
                except Exception:
                    override = {}
            cur_ov_name = (override.get("name") or "").strip()
            old_stage = ct.get("stage") or "new"
            low_ab = ab_name.lower()
            if old_stage in ("unqualified", "archived_unqualified", "archived_stu") and not re.search(r"\b(đã\s+cọc|đã\s+đk|đã\s+đăng\s+ký|đã\s+ck)\b", low_ab):
                continue
            new_stage = old_stage
            if re.search(r"\b(đã\s+cọc|đã\s+đk|đã\s+đăng\s+ký|đã\s+ck)\b", low_ab):
                new_stage = "enrolled"
            elif re.search(r"\b(ko\s+phù\s+hợp|không\s+phù\s+hợp|sai\s+tệp|loại\s+trừ)\b", low_ab):
                new_stage = "unqualified"
            elif re.search(r"\b(đang\s+trao\s+đổi|tiềm\s+năng|cân\s+nhắc|hẹn\s+gọi)\b", low_ab) and old_stage in ("new", "contacted"):
                new_stage = "negotiating"
            elif old_stage == "new":
                new_stage = "contacted"

            if ab_name != cur_ov_name or new_stage != old_stage:
                _, base_name = clean_base_name(ab_name)
                override["name"] = ab_name
                notes_list = parse_notes_safely(ct.get("notes"))
                if not any(ab_name.lower() in str(n.get("text") or "").lower() for n in notes_list):
                    notes_list.insert(0, {
                        "text": f"📇 Cập nhật từ Danh bạ máy Nhi: {ab_name}",
                        "source": "call",
                        "author": "Sale Nhi (Danh bạ)",
                        "timestamp": datetime.now().isoformat(),
                        "attachments": [],
                    })
                c.execute(
                    "UPDATE contacts SET name=?, stage=?, notes=?, radar_override=?, updated_at=? WHERE id=?",
                    (base_name, new_stage, json.dumps(notes_list, ensure_ascii=False), json.dumps(override, ensure_ascii=False), datetime.now().isoformat(), cid),
                )
                if cid not in changed_ids:
                    changed_ids.append(cid)

    conn.commit()
    conn.close()

    if changed_ids:
        try:
            batch_sync_contacts_to_apple(changed_ids)
        except Exception:
            pass
        broadcast_sse("refresh")

    return {"success": True, "changed_ids": changed_ids}


@app.get("/api/agent/nhi-daemon.py", response_class=PlainTextResponse)
def download_nhi_daemon_script():
    script_path = "/Users/vietmac/Documents/CODE/LED STU/sync_nhi_contacts.py"
    if os.path.exists(script_path):
        with open(script_path, "r", encoding="utf-8") as f:
            return f.read()
    return "# Script not found"


@app.get("/api/agent/install-nhi.sh", response_class=PlainTextResponse)
def download_nhi_installer():
    return """#!/bin/bash
set -e
mkdir -p "$HOME/.fedu_nhi_sync"
curl -fsSL "https://led.fedu.vn/api/agent/nhi-daemon.py" -o "$HOME/.fedu_nhi_sync/sync_nhi_contacts.py"
chmod +x "$HOME/.fedu_nhi_sync/sync_nhi_contacts.py"

cat << 'EOF' > "$HOME/Library/LaunchAgents/com.fedu.nhi.sync.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.fedu.nhi.sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>__HOME__/.fedu_nhi_sync/sync_nhi_contacts.py</string>
        <string>--daemon</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>__HOME__/.fedu_nhi_sync/sync.log</string>
    <key>StandardErrorPath</key>
    <string>__HOME__/.fedu_nhi_sync/sync.err</string>
</dict>
</plist>
EOF
sed -i '' "s|__HOME__|$HOME|g" "$HOME/Library/LaunchAgents/com.fedu.nhi.sync.plist"
launchctl unload "$HOME/Library/LaunchAgents/com.fedu.nhi.sync.plist" 2>/dev/null || true
launchctl load -w "$HOME/Library/LaunchAgents/com.fedu.nhi.sync.plist"
echo "✅ Đã cài đặt và khởi chạy tự động Đồng bộ Danh bạ & Cuộc gọi FEDU cho máy Mac Air của Nhi!"
"""


class ExcludeSTURequest(BaseModel):
    reason: Optional[str] = "Không còn phù hợp / Đưa vào tệp loại trừ Ads"
    author: Optional[str] = "Anh Việt"
    category: Optional[str] = "unqualified"


class BatchExcludeSTURequest(BaseModel):
    contact_ids: List[int]
    reason: Optional[str] = "Không còn phù hợp (Duyệt hàng loạt từ cột Chờ Duyệt)"
    author: Optional[str] = "Anh Việt"


def _sync_exclusion_to_stu_master(
    contact_row: Dict[str, Any],
    header_line: str,
    reason_text: str,
    now_iso: str,
    now_vn: str,
) -> bool:
    """
    Ghi trực tiếp dòng Header [LOẠI TRỪ ADS / KHÔNG PHÙ HỢP] lên ĐẦU NOTE trên hệ thống STU:
      - /Users/vietmac/Documents/CODE/Quản gia/data/students_master.json
      - /Users/vietmac/Documents/CODE/facebook, skool/students.json
      - /Users/vietmac/Documents/CODE/stu.fedu.vn/functions/_data/students_data.js
    """
    import re
    stu_paths = [
        "/Users/vietmac/Documents/CODE/Quản gia/data/students_master.json",
        "/Users/vietmac/Documents/CODE/facebook, skool/students.json",
    ]
    cf_js_path = "/Users/vietmac/Documents/CODE/stu.fedu.vn/functions/_data/students_data.js"

    students = []
    loaded_path = None
    for p in stu_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    students = json.load(f)
                loaded_path = p
                break
            except Exception:
                pass

    if loaded_path is None:
        return False

    raw_phone = str(contact_row.get("phone") or "").strip()
    digits = re.sub(r"\D", "", raw_phone)
    last9 = digits[-9:] if len(digits) >= 9 else ""
    clean_name = str(contact_row.get("name") or "Khách hàng").strip()
    clean_name = re.sub(r"(?i)^(?:❌\s*k\.?\s*phù\s+hợp\s*-\s*|offline[34]\s*-\s*)+", "", clean_name).strip()
    industry = str(contact_row.get("industry") or "Chưa phân loại").strip()
    source = str(contact_row.get("source") or "offline.fedu.vn").strip()

    target_stu = None
    if last9:
        for s in students:
            s_digits = re.sub(r"\D", "", str(s.get("phone") or ""))
            if len(s_digits) >= 9 and s_digits[-9:] == last9:
                target_stu = s
                break

    if target_stu is None:
        for s in students:
            if str(s.get("name") or "").strip().lower() == clean_name.lower():
                target_stu = s
                break

    if target_stu is not None:
        old_notes = str(target_stu.get("notes") or "").strip()
        # Bỏ dòng header loại trừ cũ nếu đã có để cập nhật dòng mới nhất lên đầu
        old_lines = [
            ln for ln in old_notes.split("\n")
            if not ln.strip().startswith("🚫 [LOẠI TRỪ ADS / KHÔNG PHÙ HỢP")
        ]
        cleaned_old = "\n".join(old_lines).strip()
        target_stu["notes"] = f"{header_line}\n{cleaned_old}".strip() if cleaned_old else header_line
        target_stu["ad_exclusion"] = True
        target_stu["lead_status"] = "unqualified"
        target_stu["excluded_reason"] = reason_text
        target_stu["excluded_at"] = now_iso
        target_stu["updated_at"] = now_iso
        target_stu["last_updated_vn"] = now_vn
        if not target_stu.get("class") or "Tư Vấn" in str(target_stu.get("class")):
            target_stu["class"] = "Tệp Loại Trừ Ads (Không phù hợp)"
    else:
        slug_base = re.sub(r"[^a-z0-9]+", "_", clean_name.lower()).strip("_") or f"excl_{last9 or int(time.time())}"
        existing_ids = {s.get("id") for s in students}
        sid = slug_base
        idx = 2
        while sid in existing_ids:
            sid = f"{slug_base}_{idx}"
            idx += 1

        # Lấy tóm tắt các ghi chú cũ từ fedu_command.db
        from apple_contacts_sync import parse_notes_safely
        parsed_old = parse_notes_safely(contact_row.get("notes"))
        old_history_lines = []
        for n in parsed_old:
            txt = str(n.get("text") or "").strip()
            if txt and not txt.startswith("🚫 [LOẠI TRỪ ADS"):
                old_history_lines.append(f"• {txt}")
        combined_notes = header_line
        if old_history_lines:
            combined_notes += "\n" + "\n".join(old_history_lines)

        new_stu = {
            "id": sid,
            "name": clean_name,
            "class": "Tệp Loại Trừ Ads (Không phù hợp)",
            "industry": industry,
            "industry_slug": re.sub(r"[^a-z0-9]+", "_", industry.lower()).strip("_") or "general",
            "avatar_url": "assets/avatar_vietnd.png",
            "thumbnail_url": "assets/avatar_vietnd.png",
            "drive_folder_url": "",
            "local_folder_path": "",
            "phone": raw_phone if not raw_phone.startswith("FB_") else None,
            "zalo_url": raw_phone if not raw_phone.startswith("FB_") else None,
            "facebook_url": contact_row.get("facebook_url") or None,
            "reference_channels": [],
            "videos": [],
            "consultations": [
                {
                    "id": f"cst_{sid}_excluded",
                    "date": now_vn,
                    "channel": "led_board",
                    "topic": "🚫 Đưa vào Tệp Loại Trừ Quảng Cáo & Nhận Diện SĐT",
                    "student_inquiry": reason_text,
                    "marketing_use": "Loại trừ Custom Audience (Facebook/TikTok Ads) & Nhận diện SĐT khi gọi/nhắn lại."
                }
            ],
            "notes": combined_notes,
            "ad_exclusion": True,
            "lead_status": "unqualified",
            "excluded_reason": reason_text,
            "excluded_at": now_iso,
            "contact_source": source,
            "contact_source_label": source,
            "created_at": now_iso,
            "updated_at": now_iso,
            "last_updated_vn": now_vn,
            "completeness_score": 40,
            "health_status": "excluded",
            "missing_items": [],
        }
        students.append(new_stu)

    for p in stu_paths:
        if os.path.exists(os.path.dirname(p)):
            try:
                with open(p, "w", encoding="utf-8") as f:
                    json.dump(students, f, ensure_ascii=False, indent=2)
            except Exception:
                pass

    if os.path.exists(os.path.dirname(os.path.dirname(cf_js_path))):
        try:
            os.makedirs(os.path.dirname(cf_js_path), exist_ok=True)
            with open(cf_js_path, "w", encoding="utf-8") as f:
                f.write("export const STUDENTS_DATA = ")
                json.dump(students, f, ensure_ascii=False, indent=2)
                f.write(";\n")
        except Exception:
            pass

    return True


def _exclude_single_contact_logic(
    conn,
    contact_id: int,
    reason: str,
    author: str,
) -> Optional[Dict[str, Any]]:
    from apple_contacts_sync import parse_notes_safely, clean_base_name
    c = conn.cursor()
    c.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,))
    row = c.fetchone()
    if not row:
        return None

    ct = dict(row)
    now_dt = datetime.now()
    now_iso = now_dt.isoformat()
    now_vn = now_dt.strftime("%d/%m/%Y %H:%M")

    _, base_name = clean_base_name(ct.get("name") or "")
    phone_val = ct.get("phone") or ""
    source_val = ct.get("source") or "offline.fedu.vn"
    reason_clean = (reason or "Không còn phù hợp / Đưa vào tệp loại trừ Ads").strip()

    # Chuẩn hóa dòng ĐẦU NOTE trên hệ thống STU và LED Hub
    header_line = (
        f"🚫 [LOẠI TRỪ ADS / KHÔNG PHÙ HỢP - {now_vn}] "
        f"Lý do: {reason_clean} | SĐT: {phone_val} | Nguồn: {source_val} | Duyệt bởi: {author}"
    )

    notes_list = parse_notes_safely(ct.get("notes"))
    # Xóa dòng header loại trừ cũ nếu đã có để tránh trùng lặp
    notes_list = [
        n for n in notes_list
        if not str(n.get("text") or "").strip().startswith("🚫 [LOẠI TRỪ ADS / KHÔNG PHÙ HỢP")
    ]
    notes_list.insert(0, {
        "text": header_line,
        "source": "stu_exclusion",
        "author": author or "Anh Việt",
        "timestamp": now_iso,
        "attachments": [],
    })

    # Cập nhật tags
    tags_list = []
    try:
        if isinstance(ct.get("tags"), str) and ct.get("tags"):
            tags_list = json.loads(ct["tags"])
        elif isinstance(ct.get("tags"), list):
            tags_list = ct["tags"]
    except Exception:
        tags_list = []
    if "🚫 Loại trừ Ads" not in tags_list:
        tags_list.insert(0, "🚫 Loại trừ Ads")

    # Cập nhật radar_override
    override = {}
    if ct.get("radar_override"):
        try:
            override = json.loads(ct["radar_override"])
        except Exception:
            override = {}
    override["is_archived"] = True
    override["archive_category"] = "unqualified"
    override["ad_exclusion"] = True
    override["excluded_reason"] = reason_clean
    override["excluded_at"] = now_iso
    override["status"] = "unqualified"
    override["name"] = f"❌ K.Phù hợp - {base_name}"

    notes_json = json.dumps(notes_list, ensure_ascii=False)
    tags_json = json.dumps(tags_list, ensure_ascii=False)
    override_json = json.dumps(override, ensure_ascii=False)

    c.execute(
        """
        UPDATE contacts
        SET name = ?, stage = 'archived_unqualified', notes = ?, tags = ?, radar_override = ?, updated_at = ?
        WHERE id = ?
        """,
        (base_name, notes_json, tags_json, override_json, now_iso, contact_id),
    )

    # Đồng bộ vào hệ thống STU (students_master.json & stu.fedu.vn)
    stu_synced = _sync_exclusion_to_stu_master(ct, header_line, reason_clean, now_iso, now_vn)

    return {
        "id": contact_id,
        "name": base_name,
        "phone": phone_val,
        "stage": "archived_unqualified",
        "notes": notes_list,
        "tags": tags_list,
        "radar_override": override_json,
        "header_line": header_line,
        "stu_synced": stu_synced,
        "updated_at": now_iso,
    }


@app.post("/api/contacts/{contact_id}/exclude-stu")
async def exclude_contact_to_stu(contact_id: int, req: ExcludeSTURequest, background_tasks: BackgroundTasks):
    """
    Nút 'Quyết Loại (Lưu STU & Ẩn)':
      1. Chuyển stage -> 'archived_unqualified' (ẩn khỏi toàn bộ các cột trên LED Board).
      2. Ghi dòng chuẩn hóa '🚫 [LOẠI TRỪ ADS / KHÔNG PHÙ HỢP...]' vào ĐẦU NOTE trong fedu_command.db & STU Master JSON.
      3. Đổi tên trên Danh bạ iCloud thành '❌ K.Phù hợp - [Tên]' để nhận diện SĐT về sau.
    """
    from apple_contacts_sync import sync_single_contact_to_apple
    conn = get_connection()
    res = _exclude_single_contact_logic(
        conn,
        contact_id=contact_id,
        reason=req.reason or "Không còn phù hợp / Đưa vào tệp loại trừ Ads",
        author=req.author or "Anh Việt",
    )
    if not res:
        conn.close()
        raise HTTPException(status_code=404, detail="Contact not found")
    conn.commit()
    conn.close()

    background_tasks.add_task(sync_single_contact_to_apple, contact_id)
    broadcast_sse("refresh")
    return {"success": True, "contact": res}


@app.post("/api/contacts/exclude-stu-batch")
async def exclude_contacts_batch_to_stu(req: BatchExcludeSTURequest, background_tasks: BackgroundTasks):
    """
    Nút 'Quyết Tất Cả Cột Này': Duyệt loại trừ hàng loạt các hồ sơ trong cột Không Phù Hợp (Chờ Duyệt).
    """
    from apple_contacts_sync import batch_sync_contacts_to_apple
    if not req.contact_ids:
        return {"success": True, "count": 0, "contacts": []}

    conn = get_connection()
    results = []
    for cid in req.contact_ids:
        r = _exclude_single_contact_logic(
            conn,
            contact_id=cid,
            reason=req.reason or "Không còn phù hợp (Duyệt hàng loạt từ cột Chờ Duyệt)",
            author=req.author or "Anh Việt",
        )
        if r:
            results.append(r)
    conn.commit()
    conn.close()

    if req.contact_ids:
        background_tasks.add_task(batch_sync_contacts_to_apple, req.contact_ids)
    broadcast_sse("refresh")
    return {"success": True, "count": len(results), "contacts": results}


class RestoreContactRequest(BaseModel):
    target_stage: Optional[str] = "contacted"


@app.post("/api/contacts/{contact_id}/restore")
async def restore_excluded_contact(contact_id: int, req: RestoreContactRequest, background_tasks: BackgroundTasks):
    """Khôi phục hồ sơ từ cột Không Phù Hợp / Tệp Loại Trừ về lại Bàn Gọi."""
    from apple_contacts_sync import sync_single_contact_to_apple
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Contact not found")

    ct = dict(row)
    now_iso = datetime.now().isoformat()
    target_stage = req.target_stage or "contacted"

    override = {}
    if ct.get("radar_override"):
        try:
            override = json.loads(ct["radar_override"])
        except Exception:
            override = {}
    override["is_archived"] = False
    override["ad_exclusion"] = False
    override["status"] = target_stage

    tags_list = []
    try:
        if isinstance(ct.get("tags"), str) and ct.get("tags"):
            tags_list = json.loads(ct["tags"])
        elif isinstance(ct.get("tags"), list):
            tags_list = ct["tags"]
    except Exception:
        tags_list = []
    tags_list = [t for t in tags_list if t != "🚫 Loại trừ Ads"]

    c.execute(
        "UPDATE contacts SET stage = ?, tags = ?, radar_override = ?, updated_at = ? WHERE id = ?",
        (target_stage, json.dumps(tags_list, ensure_ascii=False), json.dumps(override, ensure_ascii=False), now_iso, contact_id),
    )
    conn.commit()
    conn.close()

    background_tasks.add_task(sync_single_contact_to_apple, contact_id)
    broadcast_sse("refresh")
    return {"success": True, "id": contact_id, "stage": target_stage, "updated_at": now_iso}


@app.get("/api/exclusion/export-csv", response_class=PlainTextResponse)
@app.get("/api/contacts/export-exclusion-csv", response_class=PlainTextResponse)
def export_exclusion_csv():
    """
    Xuất file CSV chuẩn định dạng Facebook / TikTok Custom Audience Exclusion
    gồm tất cả các hồ sơ ở trạng thái 'unqualified' và 'archived_unqualified'.
    """
    import csv
    import io
    import re
    from apple_contacts_sync import parse_notes_safely

    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "SELECT * FROM contacts WHERE stage IN ('unqualified', 'archived_unqualified') ORDER BY updated_at DESC"
    )
    rows = [dict(r) for r in c.fetchall()]
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["phone", "phone_e164", "email", "fn", "industry", "source", "stage", "top_note", "updated_at"])

    for r in rows:
        raw_phone = str(r.get("phone") or "").strip()
        digits = re.sub(r"\D", "", raw_phone)
        phone_e164 = ""
        if len(digits) >= 9 and not raw_phone.startswith("FB_"):
            phone_e164 = "+84" + digits[-9:]
        notes = parse_notes_safely(r.get("notes"))
        top_note = str(notes[0].get("text") or "").replace("\n", " ") if notes else ""
        writer.writerow([
            raw_phone,
            phone_e164,
            r.get("email") or "",
            r.get("name") or "",
            r.get("industry") or "",
            r.get("source") or "",
            r.get("stage") or "",
            top_note[:200],
            r.get("updated_at") or "",
        ])

    return PlainTextResponse(
        content=output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=fedu_ads_exclusion_leads.csv"},
    )


@app.post("/api/shortcut-analyze")
@app.get("/api/shortcut-analyze")
@app.post("/sendMessage")
@app.post("/bot{bot_token}/sendMessage")
async def shortcut_analyze_webhook(request: Request, bot_token: Optional[str] = None):
    """
    Webhook nhận link video (Instagram / TikTok / Facebook / YouTube) từ iOS Shortcut (Master_Action / Gửi Analyze Video).
    Hỗ trợ giữ nguyên format Telegram sendMessage JSON {"chat_id": "2050406425", "text": "<URL>"}
    -> Tự động nạp thẳng vào analyze_video_queue.json trên Mac VÀ bắn thông báo xác nhận vào Telegram @phantichVideoInsta_bot.
    """
    import fcntl
    import re
    import uuid

    raw_text = ""
    user_note_param = ""
    chat_id = "2050406425"

    try:
        if request.method == "POST":
            body_bytes = await request.body()
            if body_bytes:
                try:
                    payload = json.loads(body_bytes.decode("utf-8"))
                    if isinstance(payload, dict):
                        raw_text = str(payload.get("text") or payload.get("url") or "").strip()
                        user_note_param = str(payload.get("note") or payload.get("caption") or "").strip()
                        chat_id = str(payload.get("chat_id") or "2050406425").strip()
                except Exception:
                    raw_text = body_bytes.decode("utf-8", errors="ignore").strip()
        if not raw_text:
            q_params = dict(request.query_params)
            raw_text = str(q_params.get("text") or q_params.get("url") or "").strip()
            user_note_param = str(q_params.get("note") or q_params.get("caption") or "").strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {e}")

    if not raw_text:
        return {"ok": False, "error": "Empty text/url"}

    urls = re.findall(r'https?://[^\s<>"]+', raw_text)
    if not urls:
        return {"ok": False, "error": "No URL found in text", "text": raw_text}

    note_from_text = re.sub(r'https?://[^\s<>"]+', '', raw_text).strip(" \n\r\t,-|:")
    final_note = user_note_param or note_from_text

    queue_file = "/Users/vietmac/Documents/CODE/Quản gia/analyze_video_queue.json"
    os.makedirs(os.path.dirname(queue_file), exist_ok=True)
    enqueued_urls = []

    with open(queue_file + ".lock", "a") as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        try:
            q_data = []
            if os.path.exists(queue_file):
                try:
                    with open(queue_file, "r", encoding="utf-8") as qf:
                        q_data = json.load(qf)
                except Exception:
                    q_data = []
            for u in urls:
                task_id = f"shortcut_{int(time.time())}_{uuid.uuid4().hex[:6]}"
                q_data.append({
                    "id": task_id,
                    "type": "url",
                    "target": u,
                    "title": "",
                    "user_note": final_note,
                    "status": "PENDING",
                    "created_at": datetime.now().isoformat()
                })
                enqueued_urls.append(u)
            tmp_q = f"{queue_file}.tmp.{os.getpid()}"
            with open(tmp_q, "w", encoding="utf-8") as qf:
                json.dump(q_data, qf, ensure_ascii=False, indent=2)
            os.replace(tmp_q, queue_file)
        finally:
            fcntl.flock(lk, fcntl.LOCK_UN)

    # Bắn tin nhắn xác nhận về đúng bot @phantichVideoInsta_bot để anh Việt thấy ngay trên Telegram
    tg_token = "8580173238:AAFEZjjnH_J3d0RzfeY3pak4z3CI6kbPWWM"
    note_line = f"\n📝 <b>Ghi chú/Tag:</b> {final_note}" if final_note else ""
    links_str = "\n".join(f"🔗 {u}" for u in enqueued_urls)
    msg_text = (
        f"⚡ <b>[Shortcut iPhone] Đã nhận {len(enqueued_urls)} link video!</b>\n"
        f"{links_str}{note_line}\n\n"
        f"⏳ Đã nạp thẳng vào hàng đợi bóc tách OpenCV & AI Vision → <code>ytuong.fedu.vn</code>"
    )
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                f"https://api.telegram.org/bot{tg_token}/sendMessage",
                json={"chat_id": chat_id, "text": msg_text, "parse_mode": "HTML"}
            )
    except Exception as e_tg:
        print(f"Warning send telegram shortcut ack: {e_tg}")

    return {"ok": True, "enqueued": enqueued_urls, "user_note": final_note}


def _sync_ytuong_after_edit(target_key: str):
    """Chạy nền sau khi sửa phân loại trên web: build_ideas_bank + deploy Cloudflare Pages + git push."""
    import subprocess
    ytuong_repo = "/Users/vietmac/Documents/CODE/ytuong-fedu-vn"
    portal_repo = "/Users/vietmac/Documents/CODE/vietndj.github.io"
    try:
        subprocess.run(["python3", f"{ytuong_repo}/build_ideas_bank.py"], cwd=ytuong_repo, timeout=180)
        subprocess.run(["python3", f"{portal_repo}/build_ideas_bank.py"], cwd=portal_repo, timeout=180)
        cf_cred = "/Users/vietmac/.gemini/config/cloudflare_credentials.json"
        env = os.environ.copy()
        if os.path.exists(cf_cred):
            with open(cf_cred, "r", encoding="utf-8") as f:
                tok = json.load(f).get("api_token")
                if tok:
                    env["CLOUDFLARE_API_TOKEN"] = tok
        subprocess.run(
            ["npx", "wrangler", "pages", "deploy", "dist", "--project-name", "ytuong-fedu-vn-pages"],
            cwd=ytuong_repo, env=env, timeout=180
        )
        subprocess.run(
            f'git add master_classifications.json curation_config.json LEARNED_PATTERNS.json ideas_data.js reports/ dist/ && '
            f'git commit -m "[Web Edit] Cập nhật phân loại & tự học: {target_key}" && '
            f'git pull --rebase --autostash origin main && git push origin main',
            shell=True, cwd=ytuong_repo, timeout=180
        )
        subprocess.run(
            f'git add master_classifications.json curation_config.json ideas_data.js reports/ && '
            f'git commit -m "[Web Edit] Cập nhật phân loại: {target_key}" && '
            f'git pull --rebase --autostash origin master && git push origin master',
            shell=True, cwd=portal_repo, timeout=180
        )
    except Exception as e:
        print(f"Warning background sync after edit: {e}")


@app.post("/edit-classification")
@app.post("/api/edit-classification")
async def api_edit_classification(request: Request, background_tasks: BackgroundTasks):
    """Endpoint nhận lệnh Sửa Phân Loại từ báo cáo ytuong.fedu.vn (/api/edit) hoặc trực tiếp từ trình duyệt."""
    import sys
    import fcntl
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    password = str(body.get("password") or "0070").strip()
    if password not in ("0070", "fedu", "vietmac"):
        return JSONResponse(status_code=403, content={"error": "Sai mật khẩu"})

    entry_key = str(body.get("entryKey") or body.get("video_id") or "").strip()
    updates = body.get("updates") or body
    if not entry_key:
        return JSONResponse(status_code=400, content={"error": "Thiếu entryKey"})

    ytuong_repo = "/Users/vietmac/Documents/CODE/ytuong-fedu-vn"
    if ytuong_repo not in sys.path:
        sys.path.insert(0, ytuong_repo)

    try:
        from feedback_learner import apply_feedback
        ind_raw = updates.get("industry") or updates.get("new_industries")
        if isinstance(ind_raw, dict):
            ind_raw = ind_raw.get("id") or ind_raw.get("name")
        elif isinstance(ind_raw, list):
            ind_raw = ", ".join(str(x.get("id") if isinstance(x, dict) else x) for x in ind_raw)

        sty_raw = updates.get("shooting_style") or updates.get("new_style")
        if isinstance(sty_raw, dict):
            sty_raw = sty_raw.get("id") or sty_raw.get("name")

        tags_raw = updates.get("tech_tags") or updates.get("tags") or updates.get("new_tags")
        if isinstance(tags_raw, list):
            tags_raw = ", ".join(str(x) for x in tags_raw if x)

        res = apply_feedback(
            video_id=entry_key,
            new_industries_raw=str(ind_raw).strip() if ind_raw else None,
            new_style_raw=str(sty_raw).strip() if sty_raw else None,
            new_tags_raw=str(tags_raw).strip() if tags_raw else None,
            reason=str(updates.get("purpose") or updates.get("reason") or "Hiệu chỉnh trực tiếp trên báo cáo Web").strip(),
            rebuild=False,
        )

        # Cập nhật thêm purpose / quick_takeaway và đồng bộ sang HTML báo cáo nếu có
        mc_path = os.path.join(ytuong_repo, "master_classifications.json")
        updated_entry = {}
        target_folder = entry_key
        with open(mc_path, "r", encoding="utf-8") as mf:
            mc_data = json.load(mf)
        for k, v in mc_data.items():
            if k == entry_key or (isinstance(v, dict) and v.get("id") == entry_key) or (len(entry_key) >= 8 and entry_key in k):
                if v.get("id"):
                    target_folder = v["id"]
                if updates.get("purpose"):
                    v["purpose"] = str(updates["purpose"]).strip()
                if updates.get("quick_takeaway"):
                    v["quick_takeaway"] = str(updates["quick_takeaway"]).strip()
                updated_entry = v

        if updates.get("purpose") or updates.get("quick_takeaway"):
            tmp_mc = f"{mc_path}.tmp.{os.getpid()}"
            with open(tmp_mc, "w", encoding="utf-8") as mf:
                json.dump(mc_data, mf, ensure_ascii=False, indent=2)
            os.replace(tmp_mc, mc_path)

        # Cập nhật ngay badge & CLASSIFICATION_DATA trong file HTML báo cáo
        for html_p in [
            os.path.join(ytuong_repo, "reports", f"{target_folder}.html"),
            os.path.join(ytuong_repo, "dist", "reports", f"{target_folder}.html"),
            os.path.join("/Users/vietmac/Documents/CODE/vietndj.github.io", "reports", f"{target_folder}.html"),
        ]:
            if os.path.exists(html_p) and updated_entry:
                try:
                    with open(html_p, "r", encoding="utf-8") as hf:
                        htxt = hf.read()
                    ind_name = (updated_entry.get("industry") or {}).get("name", "")
                    sty_name = (updated_entry.get("shooting_style") or {}).get("name", "")
                    if ind_name and sty_name:
                        htxt = re.sub(
                            r'(<div class="header-badges">)[\s\S]*?(</div>)',
                            rf'\1<span class="badge">{ind_name}</span> <span class="badge badge-alt">{sty_name}</span>\2',
                            htxt,
                            count=1,
                        )
                    htxt = re.sub(
                        r'var CLASSIFICATION_DATA = \{.*?\};',
                        f'var CLASSIFICATION_DATA = {json.dumps(updated_entry, ensure_ascii=False)};',
                        htxt,
                        count=1,
                    )
                    with open(html_p, "w", encoding="utf-8") as hf:
                        hf.write(htxt)
                except Exception:
                    pass

        background_tasks.add_task(_sync_ytuong_after_edit, target_folder)
        return {
            "success": True,
            "message": f"Đã cập nhật & tự học thành công: {target_folder}",
            "commit": "self-learned",
            "updatedEntry": updated_entry,
            "learnerResult": res,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Lỗi xử lý: {e}"})


# =========================================================================
# ZALO PARALLEL SHADOW DB & 12 WORKFLOW ENDPOINTS
# =========================================================================

class ZaloIgnoreRequest(BaseModel):
    query: str
    unignore: Optional[bool] = False


class ZaloSendRequest(BaseModel):
    target: str
    message: str


class ZaloAddK4Request(BaseModel):
    target: str


@app.get("/api/zalo/dashboard")
def api_zalo_dashboard():
    """Trả về toàn bộ Dashboard Cơ sở dữ liệu song song Zalo (Unanswered Radar, Online Dot, Media Vault, Extracted Links, K4 Group Reconciliation)."""
    from zalo_vault_cli import get_dashboard_summary
    return get_dashboard_summary()


@app.get("/api/zalo/search")
def api_zalo_search(q: str = ""):
    """Tìm kiếm toàn văn FTS5 (< 5ms) trong toàn bộ tin nhắn, link kênh và kho media Zalo."""
    from zalo_vault_cli import search_vault
    if not q.strip():
        return {"query": "", "messages_count": 0, "messages": [], "links": [], "media": []}
    return search_vault(q.strip())


@app.get("/api/zalo/card/{query}")
def api_zalo_student_card(query: str):
    """Lấy Thẻ Nhớ Bối Cảnh 3 Giây (3-Second Context Card) của Học viên / Lead trên Zalo Shadow DB."""
    from zalo_vault_cli import get_student_context_card_3s
    return get_student_context_card_3s(query)


@app.post("/api/zalo/ignore")
def api_zalo_ignore(req: ZaloIgnoreRequest):
    """Đánh dấu loại bỏ nhóm/cuộc trò chuyện linh tinh khỏi Zalo Shadow DB (hoặc khôi phục)."""
    from zalo_vault_cli import set_ignore_conversation
    res = set_ignore_conversation(req.query, ignore=(not req.unignore))
    broadcast_sse("refresh")
    return res


@app.post("/api/zalo/send")
def api_zalo_send(req: ZaloSendRequest, background_tasks: BackgroundTasks):
    """Gửi tin nhắn Zalo 1 chạm (hoặc báo cáo khám kênh) tới Học viên / Lead."""
    from zalo_vault_cli import enqueue_zalo_action
    res = enqueue_zalo_action("SEND_MESSAGE", req.target, message=req.message)

    def _trigger_fast_sync():
        import subprocess
        try:
            subprocess.run(
                ["python3", "/Users/vietmac/Documents/CODE/offline/command_center/zalo_bridge_daemon.py", "--once"],
                timeout=25,
            )
            broadcast_sse("refresh")
        except Exception:
            pass

    if res.get("ok"):
        background_tasks.add_task(_trigger_fast_sync)
    return res


@app.post("/api/zalo/add-k4")
def api_zalo_add_k4(req: ZaloAddK4Request, background_tasks: BackgroundTasks):
    """Mời / thêm 1 chạm Học viên đã đóng tiền vào nhóm Zalo OFFLINE k4."""
    from zalo_vault_cli import enqueue_zalo_action
    res = enqueue_zalo_action("ADD_TO_K4", req.target)

    def _trigger_fast_sync():
        import subprocess
        try:
            subprocess.run(
                ["python3", "/Users/vietmac/Documents/CODE/offline/command_center/zalo_bridge_daemon.py", "--once"],
                timeout=25,
            )
            broadcast_sse("refresh")
        except Exception:
            pass

    if res.get("ok"):
        background_tasks.add_task(_trigger_fast_sync)
    return res


@app.post("/api/zalo/sync-now")
def api_zalo_sync_now(background_tasks: BackgroundTasks, deep: bool = False):
    """Kích hoạt quét đồng bộ Zalo Shadow DB ngay lập tức."""
    def _run_sync():
        import subprocess
        cmd = ["python3", "/Users/vietmac/Documents/CODE/offline/command_center/zalo_bridge_daemon.py", "--once"]
        if deep:
            cmd.append("--deep")
        try:
            subprocess.run(cmd, timeout=60)
            broadcast_sse("refresh")
        except Exception as e:
            print(f"Zalo sync-now error: {e}")

    background_tasks.add_task(_run_sync)
    return {"ok": True, "message": "Đang đồng bộ Zalo Shadow DB..."}


app.mount("/web", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web"), name="web")
app.mount("/", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web", html=True), name="root")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)


