import re

with open('command_center/web/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace FEDU with VIDEO
content = content.replace('FEDU Command Center', 'VIDEO COMMAND CENTER')
content = content.replace('FEDU', 'VIDEO')

# 2. Update Typography for headers
content = content.replace('className="text-2xl font-bold mb-4"', 'className="text-2xl font-bold mb-4 title-short"')
content = content.replace('className="text-2xl font-bold mb-6"', 'className="text-2xl font-bold mb-6 title-short"')
content = content.replace('className="text-2xl font-bold"', 'className="text-2xl font-bold title-short"')
content = content.replace('font-bold text-xl', 'font-bold text-xl title-short')

# 3. Update body text
content = content.replace('text-gray-700 mb-4 bg-gray-50 p-3 rounded', 'text-gray-700 mb-4 bg-gray-50 p-3 rounded cl-body')
content = content.replace('text-gray-800 leading-relaxed', 'text-gray-800 leading-relaxed cl-body')

# 4. Zebra striping for tabs
content = content.replace('bg-white border-b px-4 py-2', 'cl-zebra--tint border-b px-4 py-2')
content = content.replace('className="flex-1 overflow-auto relative"', 'className="flex-1 overflow-auto relative cl-zebra--light"')
content = content.replace('className="p-4 h-full flex flex-col"', 'className="p-4 h-full flex flex-col cl-zebra--light"')
content = content.replace('className="p-4 max-w-6xl mx-auto"', 'className="p-4 max-w-6xl mx-auto cl-zebra--light"')
content = content.replace('className="p-4 max-w-4xl mx-auto"', 'className="p-4 max-w-4xl mx-auto cl-zebra--light"')
content = content.replace('className="p-4 max-w-5xl mx-auto"', 'className="p-4 max-w-5xl mx-auto cl-zebra--light"')

# 5. Drawer overlay
content = content.replace('className="drawer-overlay"', 'className={"drawer-overlay " + (contact ? "open" : "")}')
content = content.replace('<div className="drawer open"', '<div className="drawer open apple-reveal is-visible"')

with open('command_center/web/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched app.js successfully.")
