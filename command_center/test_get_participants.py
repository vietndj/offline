import requests
TOKEN = "EAAegdQqWEkwBSQxUkVrG1rHI2DmOaH2JPlUi6WMfQmjZBaVEmheVnXXC4etBFtxiA0od4qS3YAs8Dph2MxlXBAGx5bgAqOmZBgjJVKxv6559xhx0aw6B6ld6NmzE8wlFJZCUzAisoKFg2QwwSVY3eDK11vK07jmSRggQyXuoVHkU71YT0EY04ydQWQpYZBUUOEWZCeWYofP5naLsf2bcZD"
url = f"https://graph.facebook.com/v21.0/t_1523220236292812?fields=participants&access_token={TOKEN}"
r = requests.get(url)
print(r.status_code, r.text)
