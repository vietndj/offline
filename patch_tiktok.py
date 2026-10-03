import sys

with open('src/content.ts', 'r') as f:
    content = f.read()

# Add tiktokUrl to interface
content = content.replace("fbUrl?: string;", "fbUrl?: string;\n      tiktokUrl?: string;")

# Add tiktokUrl to Tang Xinh
target_video = """        youtubeUrl: "https://youtu.be/QoFYOVrBl48",
        category: "expert_talkinghead","""
replacement_video = """        youtubeUrl: "https://youtu.be/QoFYOVrBl48",
        tiktokUrl: "https://www.tiktok.com/@tng.xinh75",
        category: "expert_talkinghead","""
content = content.replace(target_video, replacement_video)

with open('src/content.ts', 'w') as f:
    f.write(content)
print("Updated content.ts")
