import os
import sqlite3
from datetime import datetime, timezone, timedelta

APPLE_EPOCH = datetime(2001, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
VN_TZ = timezone(timedelta(hours=7))
CALL_DB = os.path.expanduser("~/Library/Application Support/CallHistoryDB/CallHistory.storedata")

if not os.path.exists(CALL_DB):
    print("Call history DB not found")
    exit(1)

try:
    conn = sqlite3.connect(f"file:{CALL_DB}?mode=ro", uri=True)
    cur = conn.cursor()
    cur.execute("""
        SELECT ZADDRESS, ZDATE, ZDURATION, ZANSWERED
        FROM ZCALLRECORD
        ORDER BY ZDATE DESC
        LIMIT 20
    """)
    rows = cur.fetchall()
    conn.close()

    for r in rows:
        phone, date_offset, duration, answered = r
        call_time = (APPLE_EPOCH + timedelta(seconds=date_offset)).astimezone(VN_TZ)
        print(f"Phone: {phone}, Time: {call_time.strftime('%Y-%m-%d %H:%M:%S')}, Duration: {duration}s, Answered: {answered}")
except Exception as e:
    print(e)
