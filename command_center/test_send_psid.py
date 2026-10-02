import requests
TOKEN = "EAAegdQqWEkwBSQxUkVrG1rHI2DmOaH2JPlUi6WMfQmjZBaVEmheVnXXC4etBFtxiA0od4qS3YAs8Dph2MxlXBAGx5bgAqOmZBgjJVKxv6559xhx0aw6B6ld6NmzE8wlFJZCUzAisoKFg2QwwSVY3eDK11vK07jmSRggQyXuoVHkU71YT0EY04ydQWQpYZBUUOEWZCeWYofP5naLsf2bcZD"
url = f"https://graph.facebook.com/v21.0/me/messages?access_token={TOKEN}"
payload = {
    "recipient": {"id": "28622470007407169"},
    "message": {"text": "Test nhắn tin trực tiếp từ LED Center"}
}
r = requests.post(url, json=payload)
print(r.status_code, r.text)
