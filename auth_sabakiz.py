#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script xác thực OAuth 2.0 cho kênh YouTube Sabakiz.
Tự động mở trình duyệt để người dùng đăng nhập/chọn kênh Sabakiz và lưu token_sabakiz.pickle.
"""

import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

CLIENT_SECRETS_FILE = '/Users/vietmac/Documents/CODE/videoOffline/client_secrets.json'
TOKEN_OUTPUT = '/Users/vietmac/Documents/CODE/videoOffline/token_sabakiz.pickle'
SCOPES = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.upload'
]

def authenticate_sabakiz():
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"❌ Không tìm thấy file: {CLIENT_SECRETS_FILE}")
        return

    print("🚀 Đang khởi động luồng xác thực Google OAuth...")
    print("👉 Trình duyệt sẽ tự động mở ra. Vui lòng chọn tài khoản/kênh YouTube Sabakiz.")
    
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    creds = flow.run_local_server(port=0)

    with open(TOKEN_OUTPUT, 'wb') as token_file:
        pickle.dump(creds, token_file)
    print(f"\n✅ Đã lưu token thành công tại: {TOKEN_OUTPUT}")

    # Nghiệm thu thông tin kênh vừa kết nối
    try:
        service = build('youtube', 'v3', credentials=creds)
        res = service.channels().list(part='snippet', mine=True).execute()
        items = res.get('items', [])
        if items:
            channel = items[0]
            print(f"🎉 Kênh đã kết nối thành công:")
            print(f"   - Tên kênh: {channel['snippet'].get('title')}")
            print(f"   - Handle: {channel['snippet'].get('customUrl', 'N/A')}")
            print(f"   - Channel ID: {channel.get('id')}")
        else:
            print("⚠️ Không tìm thấy thông tin kênh.")
    except Exception as e:
        print(f"⚠️ Lỗi kiểm tra thông tin kênh: {e}")

if __name__ == '__main__':
    authenticate_sabakiz()
