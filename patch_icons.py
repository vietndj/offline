import re

with open('command_center/web/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

icon_component = """
const Icon = ({ name, className="w-5 h-5 inline-block" }) => {
    const icons = {
        inbox: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>,
        phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
        users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        chart: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
        brain: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>
    };
    return icons[name] || null;
};
"""

# Inject the component right after imports
if "const Icon =" not in content:
    content = content.replace('const App = () => {', icon_component + '\nconst App = () => {')

# Replace Tab strings
content = content.replace("📨 Inbox Hub", "<div className=\"flex items-center gap-2\"><Icon name=\"inbox\" /> Inbox Hub</div>")
content = content.replace("📞 LED Board", "<div className=\"flex items-center gap-2\"><Icon name=\"phone\" /> LED Board</div>")
content = content.replace("👨‍🎓 Student Hub", "<div className=\"flex items-center gap-2\"><Icon name=\"users\" /> Student Hub</div>")
content = content.replace("📊 Báo Cáo", "<div className=\"flex items-center gap-2\"><Icon name=\"chart\" /> Báo Cáo</div>")
content = content.replace("🧠 Huấn Luyện AI", "<div className=\"flex items-center gap-2\"><Icon name=\"brain\" /> Huấn Luyện AI</div>")

# Other instances
content = content.replace(">📞 LED Board (Telesale)<", " className=\"flex items-center gap-2\"><Icon name=\"phone\" className=\"w-6 h-6\" /> LED Board (Telesale)<")
content = content.replace(">👨‍🎓 Kho Học Viên Toàn Hệ Thống", " className=\"flex items-center gap-2\"><Icon name=\"users\" className=\"w-6 h-6\" /> Kho Học Viên Toàn Hệ Thống")
content = content.replace(">📨 Inbox Hub<", " className=\"flex items-center gap-2\"><Icon name=\"inbox\" className=\"w-6 h-6\" /> Inbox Hub<")
content = content.replace(">📊 Báo Cáo Hoạt Động<", " className=\"flex items-center gap-2\"><Icon name=\"chart\" className=\"w-6 h-6\" /> Báo Cáo Hoạt Động<")
content = content.replace(">🧠 Huấn Luyện AI<", " className=\"flex items-center gap-2\"><Icon name=\"brain\" className=\"w-6 h-6\" /> Huấn Luyện AI<")

with open('command_center/web/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added icons successfully.")
