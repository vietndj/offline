#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LED Hub Fast Server (telesale_server.py)
Backend API & Real-time SSE Broadcaster phục vụ giao diện LED Hub:
- Cổng: localhost:8888
- Live Watcher: Theo dõi CallHistory, chat.db và CẢ APPLE CONTACTS (AddressBook WAL)
- Realtime 2-Way Sync: Đồng bộ 2 chiều tức thì giữa iPhone/Mac và Web LED Hub
- Kéo thả Kanban, Lưu kho STU, Undo & Ngày đăng ký
"""

import os
import sys
import json
import time
import glob
import asyncio
import subprocess
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import telesale_engine as engine

app = FastAPI(title="LED Hub", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HTML_FILE = os.path.join(os.path.dirname(__file__), "telesale_cockpit.html")
SALE_HTML_FILE = os.path.join(os.path.dirname(__file__), "sale_call_list.html")

sse_clients: List[asyncio.Queue] = []

last_mtimes = {
    "call": 0.0,
    "msg": 0.0,
    "cache": 0.0,
    "leads": 0.0,
    "ab": 0.0
}


def get_file_mtime(path: str) -> float:
    try:
        return os.path.getmtime(path) if os.path.exists(path) else 0.0
    except Exception:
        return 0.0


def get_latest_addressbook_mtime() -> float:
    """Quét tất cả các file sqlite và wal của Apple Contacts AddressBook (loại trừ -shm)"""
    latest = 0.0
    for p in glob.glob(os.path.expanduser('~/Library/Application Support/AddressBook/Sources/*/*')):
        if any(p.endswith(k) for k in ['AddressBook-v22.abcddb', 'AddressBook-v22.abcddb-wal', 'SyncAnchor']):
            mt = get_file_mtime(p)
            if mt > latest:
                latest = mt
    return latest


async def broadcast_event(event_type: str, data: Any = None):
    payload = f"event: {event_type}\ndata: {json.dumps(data or {}, ensure_ascii=False)}\n\n"
    for queue in list(sse_clients):
        try:
            await queue.put(payload)
        except Exception:
            if queue in sse_clients:
                sse_clients.remove(queue)


# REALTIME SYSTEM WATCHER LOOP
async def system_watcher_loop():
    while True:
        try:
            call_mtime = get_file_mtime(engine.CALL_DB)
            msg_mtime = get_file_mtime(engine.MSG_DB)
            leads_mtime = get_file_mtime(engine.OFFLINE_LEADS_JSON)
            cache_mtime = get_file_mtime(engine.LOCAL_RADAR_CACHE)
            ab_mtime = get_latest_addressbook_mtime()

            changed = False
            source_changed = []

            if last_mtimes["call"] > 0 and call_mtime > last_mtimes["call"]:
                changed = True
                source_changed.append("CallHistory")
            if last_mtimes["msg"] > 0 and msg_mtime > last_mtimes["msg"]:
                changed = True
                source_changed.append("chat.db")
            if last_mtimes["leads"] > 0 and leads_mtime > last_mtimes["leads"]:
                changed = True
                source_changed.append("leads.json")
            if last_mtimes["cache"] > 0 and cache_mtime > last_mtimes["cache"]:
                changed = True
                source_changed.append("radar_cache")
            if last_mtimes["ab"] > 0 and ab_mtime > last_mtimes["ab"]:
                changed = True
                source_changed.append("AppleContacts")

            last_mtimes["call"] = call_mtime
            last_mtimes["msg"] = msg_mtime
            last_mtimes["leads"] = leads_mtime
            last_mtimes["cache"] = cache_mtime
            last_mtimes["ab"] = ab_mtime

            if changed:
                print(f"⚡ [RADAR-EVENT] Phát hiện biến động từ {', '.join(source_changed)}! Đang gửi SSE reload...")
                await broadcast_event("refresh", {"sources": source_changed, "timestamp": time.time()})

        except Exception as e:
            print(f"Watcher error: {e}")

        await asyncio.sleep(2.5)


@app.on_event("startup")
async def on_startup():
    last_mtimes["call"] = get_file_mtime(engine.CALL_DB)
    last_mtimes["msg"] = get_file_mtime(engine.MSG_DB)
    last_mtimes["leads"] = get_file_mtime(engine.OFFLINE_LEADS_JSON)
    last_mtimes["cache"] = get_file_mtime(engine.LOCAL_RADAR_CACHE)
    last_mtimes["ab"] = get_latest_addressbook_mtime()
    asyncio.create_task(system_watcher_loop())
    print("🚀 LED Hub v1.1 đã khởi động tại: http://localhost:8888")


# -------------------------------------------------------------
# REST API ENDPOINTS
# -------------------------------------------------------------

@app.get("/", response_class=HTMLResponse)
async def serve_cockpit_ui():
    if os.path.exists(HTML_FILE):
        with open(HTML_FILE, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>LED Hub UI đang tải...</h1>")


@app.get("/sale", response_class=HTMLResponse)
@app.get("/sale_call_list.html", response_class=HTMLResponse)
async def serve_sale_ui():
    if os.path.exists(SALE_HTML_FILE):
        with open(SALE_HTML_FILE, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Danh sách sale đang được tải...</h1>")


@app.get("/api/leads")
async def get_all_leads():
    loop = asyncio.get_event_loop()
    leads = await loop.run_in_executor(None, engine.aggregate_all_leads)
    return {"leads": leads, "total": len(leads), "updated_at": datetime.now(engine.VN_TZ).strftime("%H:%M:%S")}


@app.get("/api/stats")
async def get_stats():
    loop = asyncio.get_event_loop()
    leads = await loop.run_in_executor(None, engine.aggregate_all_leads)
    
    # Chỉ tính stats cho các lead chưa lưu kho (active leads)
    active_leads = [l for l in leads if not l.get("is_archived")]
    archived_count = sum(1 for l in leads if l.get("is_archived"))

    total = len(active_leads)
    paid = sum(1 for l in active_leads if l["status"] == "paid")
    considering = sum(1 for l in active_leads if l["status"] == "considering")
    called = sum(1 for l in active_leads if l["status"] == "called")
    contacted = sum(1 for l in active_leads if l["status"] == "contacted")
    new_leads = sum(1 for l in active_leads if l["status"] == "new")
    unqualified = sum(1 for l in active_leads if l["status"] == "unqualified")
    sale_consulted = sum(1 for l in active_leads if l.get("is_sale_consulted") or (l.get("tags") and any("sale" in t.lower() for t in l.get("tags", []))))
    
    total_talk_seconds = sum(l["call_info"]["total_duration"] for l in leads)
    total_calls_count = sum(l["call_info"]["total_calls"] for l in leads)

    return {
        "total": total,
        "paid": paid,
        "considering": considering,
        "called": called,
        "contacted": contacted,
        "new": new_leads,
        "unqualified": unqualified,
        "sale_consulted": sale_consulted,
        "archived_count": archived_count,
        "total_talk_formatted": engine.format_duration(total_talk_seconds),
        "total_calls_count": total_calls_count
    }


class UpdateLeadRequest(BaseModel):
    phone: str
    status: Optional[str] = None
    note: Optional[str] = None
    tags: Optional[List[str]] = None
    name: Optional[str] = None


@app.post("/api/leads/update")
async def update_lead_endpoint(req: UpdateLeadRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    res = await loop.run_in_executor(
        None,
        engine.update_lead,
        req.phone,
        req.status,
        req.note,
        req.tags,
        req.name
    )
    background_tasks.add_task(broadcast_event, "lead_updated", {"phone": req.phone, "status": req.status})
    return res


class SaveContactRequest(BaseModel):
    phone: str
    name: Optional[str] = None
    note: Optional[str] = ""


@app.post("/api/leads/save-contact")
async def save_contact_endpoint(req: SaveContactRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    leads = await loop.run_in_executor(None, engine.aggregate_all_leads)
    lead = next((l for l in leads if l["id"] == clean_phone or l["phone"] == clean_phone), None)

    name = req.name
    if not name or name.strip() in ["Học viên", ""]:
        name = (lead.get("name") if lead else "") or "Học viên"

    email = (lead.get("email") if lead else "") or ""
    occ = (lead.get("occupation") if lead else "") or ""
    reason = (lead.get("reason") if lead else "") or ""
    default_note = f"{occ} | Nút thắt: {reason} | Lớp Offline 19-20/09 Hà Nội".strip(" |")
    note = req.note or (lead.get("note") if lead else "") or default_note

    success = await loop.run_in_executor(
        None,
        engine.create_or_update_apple_contact,
        name,
        clean_phone,
        email,
        note
    )
    if success:
        background_tasks.add_task(broadcast_event, "lead_updated", {"phone": clean_phone})
    return {"success": success, "phone": clean_phone, "name": name}


class ArchiveSTURequest(BaseModel):
    phone: str
    final_note: Optional[str] = ""
    stu_class: Optional[str] = "Offline 3 (Đã CK)"
    status: Optional[str] = "Đã cọc / Hoàn thành"
    category: Optional[str] = "paid"


@app.post("/api/leads/archive-stu")
async def archive_stu_endpoint(req: ArchiveSTURequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    if not clean_phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    res = await loop.run_in_executor(
        None,
        engine.archive_lead_to_stu,
        clean_phone,
        req.final_note,
        req.stu_class,
        req.status,
        req.category
    )
    if res.get("success"):
        background_tasks.add_task(broadcast_event, "refresh", {"phone": clean_phone, "action": "archive"})
    return res


class UnarchiveRequest(BaseModel):
    phone: str


@app.post("/api/leads/unarchive")
async def unarchive_endpoint(req: UnarchiveRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    if not clean_phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    res = await loop.run_in_executor(
        None,
        engine.unarchive_lead,
        clean_phone
    )
    if res.get("success"):
        background_tasks.add_task(broadcast_event, "refresh", {"phone": clean_phone, "action": "unarchive"})
    return res


class TriggerCallRequest(BaseModel):
    phone: str


@app.post("/api/leads/call")
async def trigger_call_endpoint(req: TriggerCallRequest):
    phone = engine.normalize_phone(req.phone)
    if not phone:
        return {"success": False, "error": "Số điện thoại không hợp lệ"}

    try:
        subprocess.run(["open", f"tel:{phone}"], check=True)
        return {"success": True, "phone": phone}
    except Exception as e:
        return {"success": False, "error": str(e)}


class SendSMSRequest(BaseModel):
    phone: str
    message: Optional[str] = None


@app.post("/api/leads/send-sms")
async def send_sms_endpoint(req: SendSMSRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    if not msg:
        cache = engine.load_local_cache()
        lead_cache = cache.get(clean_phone, {})
        lead_name = lead_cache.get("name", "")
        lead_occ = lead_cache.get("occupation", "")
        _, greeting, _ = engine.detect_salutation(lead_name, lead_occ)
        msg = lead_cache.get("suggested_script") or f"{greeting}, em là Việt bên lớp Video Marketing Offline 19-20/09 đây ạ."

    # Gửi tin nhắn qua Messages.app (nhanh, không nghẽn)
    res = await loop.run_in_executor(None, engine.send_imessage_or_sms, clean_phone, msg)

    # Chuyển việc ghi danh bạ và đồng bộ Google Sheets sang background task để UI mượt mà, không bị đơ
    if res.get("success"):
        def background_sync(phone: str):
            now_str = datetime.now(engine.VN_TZ).strftime("%H:%M %d/%m")
            sms_note = f"[💬 Đã gửi SMS lúc {now_str}]"
            cache = engine.load_local_cache()
            user_override = cache.get(phone, {})
            existing_note = user_override.get("note", "")
            new_note = f"{existing_note} {sms_note}".strip() if sms_note not in existing_note else existing_note
            new_status = "contacted" if user_override.get("status") == "new" else None
            name = user_override.get("name")
            engine.update_lead(phone, new_status, new_note, None, name)

        background_tasks.add_task(background_sync, clean_phone)
        background_tasks.add_task(broadcast_event, "lead_updated", {"phone": clean_phone})

    return res


class LogCallRequest(BaseModel):
    phone: str
    result: str  # 'answered' | 'no_answer' | 'callback'
    note: Optional[str] = None


@app.post("/api/leads/log-call")
async def log_call_endpoint(req: LogCallRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    leads = await loop.run_in_executor(None, engine.aggregate_all_leads)
    lead = next((l for l in leads if l["id"] == clean_phone or l["phone"] == clean_phone), None)
    now_str = datetime.now(engine.VN_TZ).strftime("%H:%M %d/%m")

    existing_note = lead.get("note", "") if lead else ""
    if req.result == "answered":
        tag = f"[📞 Đã gọi trao đổi lúc {now_str}]"
        new_status = "called"
    elif req.result == "no_answer":
        tag = f"[📵 Gọi nhỡ/thuê bao lúc {now_str}]"
        new_status = lead.get("status") if lead else "new"
    elif req.result == "callback":
        tag = f"[🔄 Hẹn gọi lại lúc {now_str}]"
        new_status = "considering"
    else:
        tag = f"[📞 Cuộc gọi lúc {now_str}]"
        new_status = None

    if req.note:
        tag += f" {req.note}"

    new_note = f"{existing_note} {tag}".strip()
    await loop.run_in_executor(None, engine.update_lead, clean_phone, new_status, new_note, None, lead.get("name") if lead else None)
    background_tasks.add_task(broadcast_event, "lead_updated", {"phone": clean_phone})
    return {"success": True, "phone": clean_phone, "status": new_status, "note": new_note}


class SendEmailRequest(BaseModel):
    phone: str
    email: Optional[str] = None
    name: Optional[str] = None
    custom_script: Optional[str] = None


@app.post("/api/leads/send-email")
async def send_email_endpoint(req: SendEmailRequest, background_tasks: BackgroundTasks):
    loop = asyncio.get_event_loop()
    clean_phone = engine.normalize_phone(req.phone)
    leads = await loop.run_in_executor(None, engine.aggregate_all_leads)
    lead = next((l for l in leads if l["id"] == clean_phone or l["phone"] == clean_phone), None)

    to_email = req.email or (lead.get("email") if lead else "")
    name = req.name or (lead.get("name") if lead else "Học viên")
    script = req.custom_script or (lead.get("suggested_script") if lead else "")
    occ = lead.get("occupation", "") if lead else ""
    reason = lead.get("reason", "") if lead else ""

    if not to_email or "@" not in to_email:
        return {"success": False, "error": "Học viên chưa có email hoặc email không hợp lệ"}

    res = await loop.run_in_executor(
        None,
        engine.send_consultation_email,
        to_email,
        name,
        script,
        occ,
        reason
    )

    if res.get("success"):
        # Cập nhật ghi chú và tag vào cache
        now_str = datetime.now(engine.VN_TZ).strftime("%H:%M %d/%m")
        mail_note = f"[✉️ Đã gửi Mail lúc {now_str}]"
        existing_note = lead.get("note", "") if lead else ""
        new_note = f"{existing_note} {mail_note}".strip() if mail_note not in existing_note else existing_note
        await loop.run_in_executor(None, engine.update_lead, clean_phone, None, new_note, None, name)
        background_tasks.add_task(broadcast_event, "lead_updated", {"phone": clean_phone})

    return res


@app.get("/api/events")
async def sse_events(request: Request):
    queue = asyncio.Queue()
    sse_clients.append(queue)

    async def event_generator():
        try:
            yield f"event: connected\ndata: {json.dumps({'time': time.time()})}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    msg = await asyncio.wait_for(queue.get(), timeout=12.0)
                    yield msg
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            if queue in sse_clients:
                sse_clients.remove(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/stu/stats")
async def stu_stats():
    stats = engine.get_stu_stats()
    return JSONResponse(content=stats)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("telesale_server:app", host="0.0.0.0", port=8888, reload=False)
