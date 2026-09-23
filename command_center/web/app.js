const { useState, useEffect, useRef } = React;


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

const App = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [globalSelectedContact, setGlobalSelectedContact] = useState(null);

  useEffect(() => {
    fetch('/api/contacts?limit=500')
      .then(res => res.json())
      .then(data => {
         const clist = data.contacts || [];
         setContacts(clist);
         
         // Parse URL for ?contact=id
         const urlParams = new URLSearchParams(window.location.search);
         const contactId = urlParams.get('contact');
         if (contactId) {
             const c = clist.find(x => x.id.toString() === contactId);
             if (c) setGlobalSelectedContact(c);
         }
      });
  }, []);
  
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:9000/api/sse');
    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);
    eventSource.onmessage = (e) => {
       console.log('SSE Message:', e.data);
    };
    return () => eventSource.close();
  }, []);

  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  
  const shareContact = (id) => {
      const url = window.location.origin + window.location.pathname + '?contact=' + id;
      navigator.clipboard.writeText(url).then(() => {
          showToast('Đã copy link học viên (Share cho Sales)');
      });
  };

  return (
    <div className="flex flex-col h-screen w-full">
       <header className="text-white p-4 flex justify-between items-center shadow-md" style={{backgroundColor: 'var(--primary-color)'}}>
          <div className="flex items-center gap-3">
             <div className="font-bold text-xl title-short">VIDEO COMMAND CENTER</div>
             <div title={isConnected ? "Đã kết nối máy chủ" : "Mất kết nối máy chủ"} className={`status-dot ${isConnected ? 'active' : 'error'}`}></div>
          </div>
          <div className="text-sm hidden sm:block">{new Date().toLocaleString('vi-VN')}</div>
       </header>

       <div className="cl-zebra--tint border-b px-4 py-2">
         <div className="tab-nav">
           <div className={`tab-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}><div className="flex items-center gap-2"><Icon name="inbox" /> Inbox Hub</div></div>
           <div className={`tab-item ${activeTab === 'led' ? 'active' : ''}`} onClick={() => setActiveTab('led')}><div className="flex items-center gap-2"><Icon name="phone" /> LED Board</div></div>
           <div className={`tab-item ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}><div className="flex items-center gap-2"><Icon name="users" /> Student Hub</div></div>
           <div className={`tab-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}><div className="flex items-center gap-2"><Icon name="chart" /> Báo Cáo</div></div>
           <div className={`tab-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}><div className="flex items-center gap-2"><Icon name="brain" /> Huấn Luyện AI</div></div>
         </div>
       </div>

       <main className="flex-1 overflow-auto relative cl-zebra--light">
         {activeTab === 'inbox' && <InboxTab showToast={showToast} />}
         {activeTab === 'led' && <LedBoardTab showToast={showToast} contacts={contacts} onSelectContact={setGlobalSelectedContact} />}
         {activeTab === 'student' && <StudentHubTab showToast={showToast} contacts={contacts} onSelectContact={setGlobalSelectedContact} />}
         {activeTab === 'reports' && <ReportsTab showToast={showToast} />}
         {activeTab === 'ai' && <AITrainingTab showToast={showToast} />}
       </main>

       {globalSelectedContact && (
           <ContactDrawer 
              contact={globalSelectedContact} 
              onClose={() => {
                  setGlobalSelectedContact(null);
                  window.history.pushState({}, document.title, window.location.pathname);
              }} 
              showToast={showToast} 
              onShare={() => shareContact(globalSelectedContact.id)}
           />
       )}

       <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
         {toasts.map(t => (
           <div key={t.id} className="bg-gray-800 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-fade-in text-sm font-medium">
             {t.msg}
           </div>
         ))}
       </div>
    </div>
  );
};

// --- Contact Drawer (Global) ---
const ContactDrawer = ({ contact, onClose, showToast, onShare }) => {
    const isOnlineCourse = (contact.class_name && (contact.class_name.includes('Online') || contact.class_name.includes('Skool'))) || 
                           (contact.tags && contact.tags.includes('Khóa Online'));
                           
    let parsedNotes = [];
    try {
        if (typeof contact.notes === 'string') parsedNotes = JSON.parse(contact.notes);
        else if (Array.isArray(contact.notes)) parsedNotes = contact.notes;
    } catch(e) {}
    
    let parsedTags = [];
    try {
        if (typeof contact.tags === 'string') parsedTags = JSON.parse(contact.tags);
        else if (Array.isArray(contact.tags)) parsedTags = contact.tags;
    } catch(e) {}
    
    // Extract social links from notes & radar_override & facebook_url
    let socials = [];
    if (contact.facebook_url) socials.push({type: 'Facebook', url: contact.facebook_url});
    
    const combinedText = JSON.stringify(parsedNotes) + " " + (contact.radar_override || "");
    const tiktokMatch = combinedText.match(/https?:\/\/(www\.)?tiktok\.com\/@[^\s"']+/i);
    if (tiktokMatch) socials.push({type: 'TikTok', url: tiktokMatch[0]});
    
    // Check Apple Sync
    const isAppleSynced = contact.apple_contact_synced === 1 || contact.apple_contact_synced === "1";
    let appleName = contact.name;
    try {
        if (contact.radar_override) {
            const r = JSON.parse(contact.radar_override);
            if (r.name) appleName = r.name;
        }
    } catch(e) {}

    // Grouping Context/Notes
    const renderContext = (text) => {
        const lines = text.split('\n');
        return (
            <ul className="list-disc pl-5 space-y-1 mt-2">
                {lines.map((line, idx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return null;
                    return <li key={idx} className="text-sm text-gray-800 leading-relaxed cl-body">{cleanLine.replace(/^[-*[]+|]+$/g, '')}</li>;
                })}
            </ul>
        );
    };

    return (
        <>
          <div className={"drawer-overlay " + (contact ? "open" : "")} onClick={onClose}></div>
          <div className="drawer open apple-reveal is-visible" style={{width: '500px', maxWidth: '100vw'}}>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <div>
                   <h3 className="font-bold text-xl title-short text-gray-900">{contact.name}</h3>
                   <div className="flex gap-2 mt-1">
                      {isOnlineCourse && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded font-bold">🎓 Học viên Online</span>}
                      {isAppleSynced ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold">📱 Danh bạ: {appleName}</span>
                      ) : (
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded font-bold">📱 Chưa lưu danh bạ</span>
                      )}
                   </div>
               </div>
               <div className="flex gap-2">
                   <button onClick={onShare} className="text-gray-500 hover:text-blue-600 font-bold p-2 bg-white rounded shadow-sm border" title="Share link cho Sale">🔗 Share</button>
                   <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl p-1">&times;</button>
               </div>
            </div>
            
            <div className="p-5 flex-1 overflow-auto bg-gray-50">
               {/* Contact Info Block */}
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
                 <div className="flex justify-between items-start mb-3">
                     <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Điện Thoại</p>
                         <p className="text-xl font-bold text-gray-900">{contact.phone}</p>
                     </div>
                     <a href={"tel:"+contact.phone} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                         📞 Gọi Ngay
                     </a>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                     <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Ngành</p>
                         <p className="text-sm font-medium text-gray-800">{contact.industry || 'Chưa cập nhật'}</p>
                     </div>
                     <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Cập nhật cuối</p>
                         <p className="text-sm font-medium text-gray-800">{new Date(contact.updated_at).toLocaleString('vi-VN')}</p>
                     </div>
                 </div>

                 {parsedTags && parsedTags.length > 0 && (
                   <div className="mt-4 flex gap-1.5 flex-wrap">
                     {parsedTags.map((t, idx) => (
                       <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-1 rounded-full font-semibold">{t}</span>
                     ))}
                   </div>
                 )}
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                 <a href={"zalo://conversation?phone="+contact.phone} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition text-center shadow-sm">💬 Chat Zalo</a>
                 <a href={"sms:"+contact.phone} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold transition text-center shadow-sm">✉️ iMessage/SMS</a>
                 
                 {socials.map((s, idx) => (
                     <a key={idx} href={s.url} target="_blank" className="col-span-2 bg-gray-800 hover:bg-black text-white p-3 rounded-lg font-bold transition text-center shadow-sm flex justify-center items-center gap-2">
                        🌍 Mở {s.type} của học viên
                     </a>
                 ))}
               </div>

               {/* Context History */}
               <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">📝 Lịch sử bối cảnh</h4>
               {parsedNotes && parsedNotes.length > 0 ? (
                 <div className="space-y-4 mb-6">
                   {parsedNotes.map((note, idx) => (
                     <div key={idx} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-sm">
                       <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider bg-yellow-200 px-2 py-0.5 rounded-sm inline-block mb-2">Nguồn: {note.source}</span>
                       {renderContext(note.text)}
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-500 text-sm mb-6 italic bg-white p-4 rounded-xl border border-gray-100 text-center">Chưa có ghi chú nào.</p>
               )}
               
               <h4 className="font-bold text-gray-900 mb-3 text-lg">✏️ Thêm ghi chú mới</h4>
               <textarea className="w-full border border-gray-300 rounded-xl p-4 text-sm mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition resize-none" rows="3" placeholder="Nhập tóm tắt cuộc gọi vừa rồi..."></textarea>
               <button className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg transition" onClick={() => {showToast('Đã lưu'); onClose();}}>Lưu Ghi Chú</button>
            </div>
          </div>
        </>
    );
};

// --- TAB: LED Board (Kanban) ---
const LedBoardTab = ({showToast, contacts, onSelectContact}) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!contacts) return;
    const cols = [
      { id: 'col-1', title: 'Chưa Gọi (New)', count: 0, items: [] },
      { id: 'col-2', title: 'Đã Liên Hệ', count: 0, items: [] },
      { id: 'col-3', title: 'Đang Trao Đổi', count: 0, items: [] },
      { id: 'col-4', title: 'Đã Đăng Ký', count: 0, items: [] }
    ];
    
    contacts.forEach(c => {
      // Logic: If already in online course, hide from Telesale LED Board!
      const isOnlineCourse = (c.class_name && (c.class_name.includes('Online') || c.class_name.includes('Skool'))) || 
                             (c.tags && c.tags.includes('Khóa Online'));
      if (isOnlineCourse) return; // HIDDEN FROM LED BOARD
      
      let colId = 'col-1';
      if (c.stage === 'contacted') colId = 'col-2';
      else if (c.stage === 'negotiating') colId = 'col-3';
      else if (c.stage === 'enrolled') colId = 'col-4';
      
      let parsedNotes = [];
      try {
         if (typeof c.notes === 'string') parsedNotes = JSON.parse(c.notes);
         else if (Array.isArray(c.notes)) parsedNotes = c.notes;
      } catch(e) {}
      
      const item = {
        id: c.id.toString(),
        contact: c,
        name: c.name || 'Unknown',
        phone: c.phone || '',
        industry: c.industry || c.source || 'N/A',
        notes: parsedNotes,
        tags: c.tags ? (typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : c.tags) : []
      };
      
      const colIndex = parseInt(colId.replace('col-', '')) - 1;
      cols[colIndex].items.push(item);
      cols[colIndex].count++;
    });
    setColumns(cols);
  }, [contacts]);

  const handleDragStart = (e, cardId, colId) => { e.dataTransfer.setData('cardId', cardId); e.dataTransfer.setData('sourceColId', colId); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, destColId) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourceColId = e.dataTransfer.getData('sourceColId');
    if (sourceColId === destColId) return;
    
    let newStage = 'new';
    if (destColId === 'col-2') newStage = 'contacted';
    if (destColId === 'col-3') newStage = 'negotiating';
    if (destColId === 'col-4') newStage = 'enrolled';
    
    fetch('/api/contacts/' + cardId + '/stage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
    });
    showToast('Đã chuyển thẻ sang ' + destColId);
    
    setColumns(prev => {
      const newCols = [...prev];
      let cardToMove = null;
      for (const col of newCols) {
        if (col.id === sourceColId) {
          const idx = col.items.findIndex(c => c.id === cardId);
          if (idx > -1) {
            cardToMove = col.items[idx];
            col.items.splice(idx, 1);
            col.count--;
          }
        }
      }
      if (cardToMove) {
        const destIdx = parseInt(destColId.replace('col-', '')) - 1;
        newCols[destIdx].items.push(cardToMove);
        newCols[destIdx].count++;
      }
      return newCols;
    });
  };

  return (
    <div className="p-4 h-full flex flex-col cl-zebra--light">
      <h2 className="text-2xl font-bold mb-4 title-short"><div className="flex items-center gap-2"><Icon name="phone" /> LED Board</div> (Telesale)</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 kanban-board flex-1">
        {columns.map(col => (
          <div key={col.id} className="kanban-col" onDragOver={handleDragOver} onDrop={e => handleDrop(e, col.id)}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">{col.title}</h3>
              <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-bold">{col.count}</span>
            </div>
            {col.items.map(card => (
              <div key={card.id} className="kanban-card group" draggable
                   onDragStart={e => handleDragStart(e, card.id, col.id)}
                   onClick={() => onSelectContact(card.contact)}>
                <div className="font-bold text-sm mb-1 text-gray-900 group-hover:text-blue-700 transition">{card.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                   <a href={"tel:"+card.phone} className="text-blue-600 hover:underline font-bold" onClick={e => e.stopPropagation()}>{card.phone}</a>
                </div>
                {card.notes && card.notes.length > 0 && (
                  <div className="text-xs text-gray-700 bg-yellow-50 p-2 rounded mb-2 line-clamp-2 italic border border-yellow-200 shadow-sm">
                    {card.notes[0].text.replace(/^[-*[]+|]+$/g, '')}
                  </div>
                )}
                <div className="flex gap-1.5 flex-wrap">
                  {card.tags && card.tags.map((t, idx) => (
                    <span key={idx} className="badge bg-indigo-50 text-indigo-700 border border-indigo-100">{t}</span>
                  ))}
                  <span className="badge badge-yellow">{card.industry}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TAB: Student Hub ---
const StudentHubTab = ({showToast, contacts, onSelectContact}) => {
  const [filter, setFilter] = useState('all');
  
  const filteredContacts = (contacts || []).filter(c => {
      const isOnlineCourse = (c.class_name && (c.class_name.includes('Online') || c.class_name.includes('Skool'))) || (c.tags && c.tags.includes('Khóa Online'));
      if (filter === 'online') return isOnlineCourse;
      if (filter === 'offline') return !isOnlineCourse && (c.stage === 'enrolled' || c.source === 'direct');
      if (filter === 'all') return c.stage === 'enrolled' || c.source === 'direct' || isOnlineCourse;
      return false;
  });
  
  return (
    <div className="p-4 max-w-6xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold title-short" className="flex items-center gap-2"><Icon name="users" className="w-6 h-6" /> Kho Học Viên Toàn Hệ Thống ({filteredContacts.length})</h2>
      </div>
      
      <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
         <span onClick={() => setFilter('all')} className={"cursor-pointer px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition " + (filter==='all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border')}>Tất cả kho STU</span>
         <span onClick={() => setFilter('online')} className={"cursor-pointer px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition " + (filter==='online' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border')}>🎓 Đã học Khóa Online/Skool</span>
         <span onClick={() => setFilter('offline')} className={"cursor-pointer px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition " + (filter==='offline' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border')}>🎯 Khóa Offline (K1, K2...)</span>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 font-bold text-gray-700 tracking-wider uppercase text-xs">Họ và Tên</th>
              <th className="px-5 py-4 font-bold text-gray-700 tracking-wider uppercase text-xs">Lớp</th>
              <th className="px-5 py-4 font-bold text-gray-700 tracking-wider uppercase text-xs">Phân loại</th>
              <th className="px-5 py-4 font-bold text-gray-700 tracking-wider uppercase text-xs">SĐT</th>
              <th className="px-5 py-4 font-bold text-gray-700 tracking-wider uppercase text-xs">Liên hệ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredContacts.map(c => {
              const isOnlineCourse = (c.class_name && (c.class_name.includes('Online') || c.class_name.includes('Skool'))) || (c.tags && c.tags.includes('Khóa Online'));
              return (
              <tr key={c.id} className="hover:bg-blue-50 cursor-pointer transition" onClick={() => onSelectContact(c)}>
                <td className="px-5 py-4 font-bold text-gray-900">{c.name}</td>
                <td className="px-5 py-4">
                  {isOnlineCourse ? (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded font-bold">{c.class_name || 'Khóa Online Skool'}</span>
                  ) : (
                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded font-bold">{c.class_name || 'Khóa Offline'}</span>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-gray-700">{c.industry || 'N/A'}</td>
                <td className="px-5 py-4 font-bold text-blue-600">{c.phone}</td>
                <td className="px-5 py-4">
                   <div className="flex gap-2">
                       <a href={"tel:"+c.phone} className="text-gray-400 hover:text-green-500 transition" onClick={e => e.stopPropagation()}>📞 Gọi</a>
                       <a href={"zalo://conversation?phone="+c.phone} className="text-gray-400 hover:text-blue-500 transition" onClick={e => e.stopPropagation()}>💬 Zalo</a>
                   </div>
                </td>
              </tr>
            )})}
            {filteredContacts.length === 0 && (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500 font-medium">Không tìm thấy học viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const InboxTab = ({showToast}) => {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inbox?limit=50')
      .then(res => res.json())
      .then(data => {
        setInbox(data.conversations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto cl-zebra--light">
      <h2 className="text-2xl font-bold mb-4 title-short"><div className="flex items-center gap-2"><Icon name="inbox" /> Inbox Hub</div></h2>
      
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
           <div className="flex justify-between mb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
           </div>
           <div className="h-10 bg-gray-100 rounded w-full mb-4"></div>
        </div>
      )}

      {!loading && inbox.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
           📭 Không có tin nhắn mới nào.
        </div>
      )}

      {!loading && inbox.map(msg => (
        <div key={msg.id} className="bg-white rounded-lg shadow-sm border p-4 mb-4">
           <div className="flex justify-between mb-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {msg.contact_name || 'Khách'} 
                <span className={"badge " + (msg.channel === 'facebook' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>
                  {msg.channel}
                </span>
              </h3>
              <span className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleString('vi-VN')}</span>
           </div>
           <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded cl-body whitespace-pre-wrap">{msg.content}</p>
           
           {msg.ai_suggested_reply && (
             <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <div className="text-xs font-bold text-blue-800 mb-1">🤖 AI Gợi ý trả lời:</div>
                <p className="text-sm text-blue-900 whitespace-pre-wrap">{msg.ai_suggested_reply}</p>
             </div>
           )}
           
           <div className="flex flex-wrap gap-2">
              {msg.channel === 'facebook' && (
                <a href="https://business.facebook.com/latest/inbox/all" target="_blank" className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm font-medium transition" onClick={() => showToast('Đang mở Meta Suite...')}>Mở Chat Meta Suite</a>
              )}
              {msg.channel === 'imessage' && (
                <a href={"sms:" + msg.contact_phone} className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm font-medium transition">Mở iMessage</a>
              )}
              <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm font-medium transition" onClick={() => showToast('Chức năng copy chưa sẵn sàng')}>Copy Kịch Bản</button>
           </div>
        </div>
      ))}
    </div>
  );
};

// --- TAB: LED Board (Kanban) ---

const ReportsTab = ({showToast}) => {
  const [stats, setStats] = useState({ total: 0, stages: {} });

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(res => res.json())
      .then(data => setStats({ total: data.total_contacts, stages: data.stages || {} }));
  }, []);

  const triggerReport = () => {
    fetch('/api/reports/send-telegram', { method: 'POST' });
    showToast('Đã gửi báo cáo tổng hợp qua Telegram (Bot: @baoDuLieu_bot)');
  };

  return (
    <div className="p-4 max-w-5xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold title-short"><div className="flex items-center gap-2"><Icon name="chart" /> Báo Cáo</div> Hoạt Động</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                onClick={triggerReport}>
          Gửi Báo Cáo Telegram
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Tổng Leads</div>
           <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.total}</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Chưa Gọi (New)</div>
           <div className="text-3xl font-bold text-gray-600 mt-2">{stats.stages.new || 0}</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Đã Liên Hệ</div>
           <div className="text-3xl font-bold text-blue-600 mt-2">{stats.stages.contacted || 0}</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Đã Đăng Ký (STU)</div>
           <div className="text-3xl font-bold text-green-600 mt-2">{stats.stages.enrolled || 0}</div>
         </div>
      </div>
    </div>
  );
};

// --- TAB: Huấn Luyện AI ---

const AITrainingTab = ({showToast}) => {
  return (
    <div className="p-4 max-w-4xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold title-short"><div className="flex items-center gap-2"><Icon name="brain" /> Huấn Luyện AI</div></h2>
         <div className="flex gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border">
            <div className="text-sm"><span className="text-gray-500">Độ chính xác:</span> <strong className="text-green-600 ml-1">92.5%</strong></div>
            <div className="w-px bg-gray-300"></div>
            <div className="text-sm"><span className="text-gray-500">Tổng mẫu đã học:</span> <strong className="ml-1 text-gray-800">1,240</strong></div>
         </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-5 mb-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
               <h4 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                 👤 Tin nhắn của người dùng
               </h4>
               <div className="bg-gray-50 p-4 rounded-md text-sm border border-gray-200 text-gray-800 h-28 overflow-auto">
                 "Bao giờ thì khai giảng khóa thiết kế mới vậy add? Học phí thế nào?"
               </div>
            </div>
            <div>
               <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
                 🤖 AI Đề xuất phản hồi
               </h4>
               <textarea className="w-full bg-blue-50 border border-blue-200 p-4 rounded-md text-sm h-28 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300 transition resize-none" defaultValue="Chào bạn, khóa thiết kế offline mới dự kiến khai giảng vào đầu tháng sau. Học phí hiện tại đang được ưu đãi giảm 20% nếu đăng ký sớm ạ. Bạn muốn mình tư vấn thêm về lộ trình không?"></textarea>
            </div>
         </div>
         <div className="flex justify-end gap-3 pt-3 border-t">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium transition" onClick={() => showToast('Đã lưu mẫu tinh chỉnh để cập nhật model')}>Sửa & Duyệt (Fine-tune)</button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition" onClick={() => showToast('Đã đánh dấu là mẫu chuẩn (Approved)')}>Duyệt Mẫu Chuẩn</button>
         </div>
      </div>
      
      {/* Sample 2 */}
      <div className="bg-white rounded-lg shadow-sm border p-5 opacity-70">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
               <div className="bg-gray-50 p-4 rounded-md text-sm border border-gray-200 text-gray-800">
                 "Cho mình xin địa chỉ trung tâm"
               </div>
            </div>
            <div>
               <textarea className="w-full bg-blue-50 border border-blue-200 p-4 rounded-md text-sm text-blue-900 outline-none resize-none" defaultValue="Dạ địa chỉ trung tâm ở Tầng 3, tòa nhà..."></textarea>
            </div>
         </div>
         <div className="flex justify-end gap-3 pt-3 border-t">
            <button className="bg-gray-100 px-5 py-2 rounded-md text-sm font-medium" disabled>Sửa & Duyệt</button>
            <button className="bg-green-600 px-5 py-2 rounded-md text-sm font-bold text-white" disabled>Duyệt Mẫu Chuẩn</button>
         </div>
      </div>
    </div>
  );
};



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);