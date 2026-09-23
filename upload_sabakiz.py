#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script upload video lên YouTube cho kênh Sabakiz.
Sử dụng token_sabakiz.pickle đã được xác thực quyền sở hữu kênh.
"""

import os
import sys
import time
import pickle
import argparse
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request

TOKEN_PATH = '/Users/vietmac/Documents/CODE/videoOffline/token_sabakiz.pickle'

def get_sabakiz_service():
    if not os.path.exists(TOKEN_PATH):
        print(f"❌ Chưa có token của kênh Sabakiz tại: {TOKEN_PATH}")
        print("👉 Vui lòng chạy lệnh sau để đăng nhập và cấp quyền lần đầu:")
        print("   python3 /Users/vietmac/Documents/CODE/videoOffline/auth_sabakiz.py")
        sys.exit(1)

    with open(TOKEN_PATH, 'rb') as token_file:
        creds = pickle.load(token_file)

    if creds.expired and creds.refresh_token:
        print("🔄 Đang làm mới access token...")
        creds.refresh(Request())
        with open(TOKEN_PATH, 'wb') as token_file:
            pickle.dump(creds, token_file)

    return build('youtube', 'v3', credentials=creds)

def upload_to_sabakiz(video_path, title, description="", privacy_status="unlisted", tags=None):
    if not os.path.exists(video_path):
        print(f"❌ Không tìm thấy file video: {video_path}")
        sys.exit(1)

    youtube = get_sabakiz_service()

    if tags is None:
        tags = ['sabakiz', 'video']

    body = {
        'snippet': {
            'title': title[:100],
            'description': description,
            'tags': tags,
            'categoryId': '22'  # People & Blogs
        },
        'status': {
            'privacyStatus': privacy_status,
            'selfDeclaredMadeForKids': False
        }
    }

    print(f"\n🚀 Bắt đầu upload lên kênh Sabakiz ({privacy_status}): {title}")
    media = MediaFileUpload(video_path, chunksize=20*1024*1024, resumable=True)
    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )

    response = None
    retry_count = 0
    max_retries = 10
    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                print(f"  ⏳ Tiến độ tải lên: {int(status.progress() * 100)}%")
            retry_count = 0
        except Exception as e:
            retry_count += 1
            if retry_count > max_retries:
                raise e
            print(f"  ⚠️ Mạng gián đoạn, đang thử lại lần {retry_count}/{max_retries}: {e}")
            time.sleep(min(30, 2 ** retry_count))

    video_id = response['id']
    watch_url = f"https://www.youtube.com/watch?v={video_id}"
    short_url = f"https://youtu.be/{video_id}"

    print(f"\n🎉 UPLOAD THÀNH CÔNG LÊN SABAKIZ!")
    print(f"  ✅ Video ID : {video_id}")
    print(f"  ✅ Link xem  : {watch_url}")
    print(f"  ✅ Short Link: {short_url}")
    return video_id

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Upload video lên kênh YouTube Sabakiz")
    parser.add_argument('--file', required=True, help="Đường dẫn file video (.mp4, .mov)")
    parser.add_argument('--title', required=True, help="Tiêu đề video")
    parser.add_argument('--desc', default="", help="Mô tả video")
    parser.add_argument('--privacy', default="unlisted", choices=["public", "unlisted", "private"], help="Chế độ hiển thị")
    parser.add_argument('--tags', default="", help="Danh sách tags, phân tách bằng dấu phẩy")

    args = parser.parse_args()
    tags_list = [t.strip() for t in args.tags.split(',') if t.strip()] if args.tags else None
    upload_to_sabakiz(args.file, args.title, args.desc, args.privacy, tags_list)
