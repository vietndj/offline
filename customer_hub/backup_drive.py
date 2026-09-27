#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FEDU Customer Hub — Daily Backup to Google Drive
Backup fedu_customer_hub.db → Google Drive (30TB) + giữ 30 bản gần nhất.
Chạy tự động hàng ngày 02:00 AM qua launchd.
"""

import os
import shutil
import glob
from datetime import datetime, timedelta

# Paths
DB_PATH = '/Users/vietmac/Documents/CODE/offline/customer_hub/fedu_customer_hub.db'
DRIVE_BASE = '/Users/vietmac/Library/CloudStorage/GoogleDrive-vietnd5@gmail.com/My Drive'
BACKUP_DIR = os.path.join(DRIVE_BASE, 'FEDU_Customer_Hub_Backup')
MAX_BACKUPS = 30  # Giữ 30 bản (30 ngày)


def backup():
    """Copy DB file to Google Drive with timestamp."""
    # Create backup dir
    os.makedirs(BACKUP_DIR, exist_ok=True)

    # Check DB exists
    if not os.path.exists(DB_PATH):
        print(f"❌ Database không tồn tại: {DB_PATH}")
        return False

    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d_%H%M')
    db_size = os.path.getsize(DB_PATH)
    backup_name = f"fedu_customer_hub_{timestamp}.db"
    backup_path = os.path.join(BACKUP_DIR, backup_name)

    # Copy (including WAL if exists)
    print(f"📦 Backing up to Google Drive...")
    print(f"   Source: {DB_PATH} ({db_size / 1024:.0f} KB)")
    print(f"   Dest:   {backup_path}")

    shutil.copy2(DB_PATH, backup_path)

    # Also copy WAL if exists (for consistency)
    wal_path = DB_PATH + '-wal'
    if os.path.exists(wal_path):
        shutil.copy2(wal_path, backup_path + '-wal')

    print(f"   ✅ Backup OK: {backup_name}")

    # Cleanup old backups (keep MAX_BACKUPS)
    existing = sorted(glob.glob(os.path.join(BACKUP_DIR, 'fedu_customer_hub_*.db')))
    if len(existing) > MAX_BACKUPS:
        to_delete = existing[:len(existing) - MAX_BACKUPS]
        for old in to_delete:
            os.remove(old)
            # Remove WAL too
            if os.path.exists(old + '-wal'):
                os.remove(old + '-wal')
            print(f"   🗑️  Deleted old backup: {os.path.basename(old)}")

    # Summary
    remaining = sorted(glob.glob(os.path.join(BACKUP_DIR, 'fedu_customer_hub_*.db')))
    print(f"\n📊 Backup Summary:")
    print(f"   Total backups: {len(remaining)}")
    if remaining:
        oldest = os.path.basename(remaining[0])
        newest = os.path.basename(remaining[-1])
        print(f"   Oldest: {oldest}")
        print(f"   Newest: {newest}")

    return True


def restore(date_str: str = None):
    """
    Khôi phục DB từ Google Drive backup.
    Usage: python3 backup_drive.py restore 2026-09-27
    """
    if not os.path.exists(BACKUP_DIR):
        print("❌ Không tìm thấy thư mục backup")
        return False

    backups = sorted(glob.glob(os.path.join(BACKUP_DIR, 'fedu_customer_hub_*.db')))
    if not backups:
        print("❌ Không có backup nào")
        return False

    if date_str:
        # Find backup matching date
        matches = [b for b in backups if date_str in os.path.basename(b)]
        if not matches:
            print(f"❌ Không tìm thấy backup cho ngày {date_str}")
            print(f"   Có sẵn: {[os.path.basename(b) for b in backups]}")
            return False
        chosen = matches[-1]  # Latest backup of that date
    else:
        chosen = backups[-1]  # Latest overall

    print(f"🔄 Restoring from: {os.path.basename(chosen)}")
    print(f"   → {DB_PATH}")

    # Backup current DB first
    if os.path.exists(DB_PATH):
        emergency = DB_PATH + '.before_restore'
        shutil.copy2(DB_PATH, emergency)
        print(f"   💾 Current DB saved to: {emergency}")

    shutil.copy2(chosen, DB_PATH)
    print(f"   ✅ Restore OK!")
    return True


def list_backups():
    """List all available backups."""
    if not os.path.exists(BACKUP_DIR):
        print("Chưa có backup nào.")
        return

    backups = sorted(glob.glob(os.path.join(BACKUP_DIR, 'fedu_customer_hub_*.db')))
    print(f"📋 {len(backups)} backups on Google Drive:")
    for b in backups:
        size = os.path.getsize(b) / 1024
        print(f"   {os.path.basename(b)} ({size:.0f} KB)")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == 'restore':
            date = sys.argv[2] if len(sys.argv) > 2 else None
            restore(date)
        elif cmd == 'list':
            list_backups()
        else:
            print(f"Usage: python3 backup_drive.py [backup|restore <date>|list]")
    else:
        backup()
