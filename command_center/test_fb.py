import requests, json
PAGE_ID = "839755019212216"
TOKEN = "EAAegdQqWEkwBSQxUkVrG1rHI2DmOaH2JPlUi6WMfQmjZBaVEmheVnXXC4etBFtxiA0od4qS3YAs8Dph2MxlXBAGx5bgAqOmZBgjJVKxv6559xhx0aw6B6ld6NmzE8wlFJZCUzAisoKFg2QwwSVY3eDK11vK07jmSRggQyXuoVHkU71YT0EY04ydQWQpYZBUUOEWZCeWYofP5naLsf2bcZD"
url = f"https://graph.facebook.com/v21.0/{PAGE_ID}/conversations?fields=id,updated_time,messages.limit(5){{message,from,created_time}}&limit=10&access_token={TOKEN}"
r = requests.get(url).json()
for c in r.get('data', []):
    for m in c.get('messages', {}).get('data', []):
        if 'Thuỷ' in m.get('from', {}).get('name', ''):
            print(json.dumps(c, indent=2, ensure_ascii=False))
            break
