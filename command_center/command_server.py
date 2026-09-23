import os
import time
import json
import asyncio
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

from fedu_command_db import init_db, get_connection

app = FastAPI(title="FEDU Command Center")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def list_inbox(contact_id: Optional[int] = None, channel: Optional[str] = None, limit: int = 50, offset: int = 0):
    conn = get_connection()
    c = conn.cursor()
    query = "SELECT * FROM conversations WHERE 1=1"
    params = []
    if contact_id:
        query += " AND contact_id = ?"
        params.append(contact_id)
    if channel:
        query += " AND channel = ?"
        params.append(channel)
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return {"conversations": [dict(r) for r in rows]}

@app.post("/api/inbox/{conversation_id}/approve")
def approve_draft(conversation_id: int):
    # Dummy implementation for training draft
    return {"success": True}

@app.get("/api/inbox/unread-count")
def unread_count():
    # Mock logic for unread count
    return {"count": 0}

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
    token = "8392893959:AAF79Uc6dI4rliweE0BvhnBJ06eV5EJdi-Y"
    chat_id = "2050406425"
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        async with httpx.AsyncClient() as client:
            await client.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"})
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
    token = "8392893959:AAF79Uc6dI4rliweE0BvhnBJ06eV5EJdi-Y"
    chat_id = "2050406425"
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    msg = f"🔔 LEAD MỚI ĐĂNG KÝ\n👤 {name}\n📱 {phone}\n💼 {occupation}\n📝 {reason}\n⏰ {now_str}\n\n🔗 Zalo: https://offline.fedu.vn/zalo?phone={phone}"
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        async with httpx.AsyncClient() as client:
            await client.post(url, json={"chat_id": chat_id, "text": msg})
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
app.mount("/web", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web"), name="web")
app.mount("/", StaticFiles(directory="/Users/vietmac/Documents/CODE/offline/command_center/web", html=True), name="root")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
