const { useState, useEffect, useRef } = React;
const BrandIcon = window.BrandIcon || (({ name, className="w-4 h-4 inline-block" }) => <span>●</span>);

const App = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [globalSelectedContact, setGlobalSelectedContact] = useState(null);
  const [salesIdentity, setSalesIdentity] = useState(localStorage.getItem('fedu_sales_id') || '');
  const [showIdentityModal, setShowIdentityModal] = useState(!localStorage.getItem('fedu_sales_id'));

  const saveIdentity = (name) => {
      localStorage.setItem('fedu_sales_id', name);
      setSalesIdentity(name);
      setShowIdentityModal(false);
  };

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
    const eventSource = new EventSource('/api/sse');
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
       <header className="brand-header text-white px-5 py-3.5 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
                <BrandIcon name="radar-scanner" className="w-5 h-5 text-amber-400" />
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <div className="font-bold text-xl title-short text-white tracking-tight">LED CENTER</div>
                   <div title={isConnected ? "Đã kết nối SSE thời gian thực" : "Mất kết nối máy chủ"} className={`status-dot ${isConnected ? 'active' : 'error'}`}></div>
                </div>
                <div className="text-[10px] text-gray-400 uppercase font-mono tracking-widest -mt-0.5">FEDU COMMAND HUB • TELESALE RADAR</div>
             </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
             <div className="bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full cursor-pointer transition flex items-center gap-2 font-semibold text-white shadow-sm" onClick={() => setShowIdentityModal(true)}>
                 <BrandIcon name="user-single" className="w-3.5 h-3.5 text-amber-400" />
                 <span>{salesIdentity || 'Chọn người trực'}</span>
                 <BrandIcon name="chevron-down" className="w-3 h-3 text-gray-400" />
             </div>
             <div className="text-gray-400 hidden sm:block font-mono text-[11px]">{new Date().toLocaleTimeString('vi-VN')}</div>
          </div>
       </header>

       <div className="cl-zebra--tint border-b px-5 py-2">
         <div className="tab-nav">
           <div className={`tab-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
             <BrandIcon name="message-sms" className="w-4 h-4" /> <span>Inbox Hub</span>
           </div>
           <div className={`tab-item ${activeTab === 'led' ? 'active' : ''}`} onClick={() => setActiveTab('led')}>
             <BrandIcon name="radar-scanner" className="w-4 h-4 text-amber-500" /> <span>LED Board</span>
           </div>
           <div className={`tab-item ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>
             <BrandIcon name="users-group" className="w-4 h-4" /> <span>Student Hub</span>
           </div>
           <div className={`tab-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
             <BrandIcon name="trending-up" className="w-4 h-4" /> <span>Báo Cáo</span>
           </div>
           <div className={`tab-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
             <BrandIcon name="book-poem" className="w-4 h-4" /> <span>Thư Viện Kịch Bản</span>
           </div>
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
              salesIdentity={salesIdentity}
           />
       )}

       {showIdentityModal && (
           <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-w-[90vw] border border-gray-100">
                   <div className="flex items-center gap-2 mb-2">
                       <BrandIcon name="user-single" className="w-6 h-6 text-gray-800" />
                       <h2 className="text-xl font-bold title-short text-gray-900">Đăng Nhập Ca Trực</h2>
                   </div>
                   <p className="text-gray-500 mb-5 text-xs cl-body">Chọn hoặc nhập tên của bạn để ghi nhận nhật ký bốc máy & ghi chú khách hàng.</p>
                   
                   <div className="grid grid-cols-2 gap-3 mb-4">
                       <button onClick={() => saveIdentity('Anh Việt')} className="bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 p-3 rounded-xl font-bold text-gray-800 transition flex items-center justify-center gap-2 text-sm">
                          <BrandIcon name="user-single" className="w-4 h-4 text-amber-600" /> Anh Việt
                       </button>
                       <button onClick={() => saveIdentity('Sale Nhi')} className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 p-3 rounded-xl font-bold text-gray-800 transition flex items-center justify-center gap-2 text-sm">
                          <BrandIcon name="user-single" className="w-4 h-4 text-blue-600" /> Sale Nhi
                       </button>
                   </div>
                   
                   <div className="flex items-center gap-2 mb-3">
                       <div className="h-px bg-gray-200 flex-1"></div>
                       <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">HOẶC NHẬP TÊN</span>
                       <div className="h-px bg-gray-200 flex-1"></div>
                   </div>
                   
                   <form onSubmit={e => { e.preventDefault(); saveIdentity(e.target.name.value); }}>
                       <input name="name" type="text" placeholder="Nhập tên nhân sự trực..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 mb-3" required />
                       <button type="submit" className="w-full btn-fedu btn-fedu-primary py-2.5 rounded-xl text-sm font-bold shadow-md">
                          Bắt đầu nhận ca
                       </button>
                   </form>
               </div>
           </div>
       )}
       
       <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
         {toasts.map(t => (
           <div key={t.id} className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-fade-in text-xs font-semibold border border-white/10">
             <BrandIcon name="check-circle" className="w-4 h-4 text-green-400" />
             <span>{t.msg}</span>
           </div>
         ))}
       </div>
    </div>
  );
};

// --- Contact Drawer (Global) ---
const ContactDrawer = ({ contact, onClose, showToast, onShare, salesIdentity }) => {
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteAttachments, setNewNoteAttachments] = useState([]);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isEditingApple, setIsEditingApple] = useState(false);
    
    const handleImageUpload = async (files) => {
        if (!files || !files.length) return;
        showToast("Đang tải ảnh lên...", "⏳");
        const newAtts = [...newNoteAttachments];
        for (const file of Array.from(files)) {
            if (!file.type.startsWith('image/')) continue;
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) newAtts.push(data.url);
            } catch (err) { console.error("Upload error", err); }
        }
        setNewNoteAttachments(newAtts);
        showToast("Đã tải ảnh lên!", "✅");
    };

    let initialAppleName = contact.name || "";
    try {
        if (contact.radar_override) {
            const r = JSON.parse(contact.radar_override);
            if (r.name) initialAppleName = r.name;
        }
    } catch(e) {}
    if (!initialAppleName.startsWith("offline3 - ")) {
       initialAppleName = "offline3 - " + initialAppleName;
    }
    
    const [appleNameInput, setAppleNameInput] = useState(initialAppleName);
    const [isSynced, setIsSynced] = useState(contact.apple_contact_synced === 1 || contact.apple_contact_synced === "1");
    const [displayAppleName, setDisplayAppleName] = useState(initialAppleName);
    
    const handleSyncApple = async () => {
        try {
            const res = await fetch('/api/contacts/'+contact.id+'/sync-apple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apple_name: appleNameInput })
            });
            if (res.ok) {
                setIsSynced(true);
                setDisplayAppleName(appleNameInput);
                setIsEditingApple(false);
                showToast('Đã đồng bộ lên Danh bạ iCloud!');
                contact.apple_contact_synced = 1;
            } else {
                showToast('Lỗi lưu danh bạ!');
            }
        } catch(e) { showToast('Lỗi kết nối máy chủ!'); }
    };

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
    
    let socials = [];
    if (contact.facebook_url) socials.push({type: 'Facebook', url: contact.facebook_url, icon: 'brand-facebook'});
    
    const combinedText = JSON.stringify(parsedNotes) + " " + (contact.radar_override || "");
    const tiktokMatch = combinedText.match(/https?:\/\/(www\.)?tiktok\.com\/@[^\s"']+/i);
    if (tiktokMatch) socials.push({type: 'TikTok', url: tiktokMatch[0], icon: 'brand-tiktok'});

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
          <div className="drawer open" style={{width: '520px', maxWidth: '100vw'}}>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/80">
               <div>
                   <h3 className="font-bold text-xl title-short text-gray-900">{contact.name}</h3>
                   <div className="flex gap-2 mt-1.5 flex-wrap items-center">
                      {isOnlineCourse && <span className="badge badge-purple">Khóa Online</span>}
                      {isSynced ? (
                          <span className="badge badge-green flex items-center gap-1">
                             <BrandIcon name="brand-apple" className="w-3 h-3 text-green-700" /> iCloud: {displayAppleName}
                          </span>
                      ) : (
                          isEditingApple ? (
                              <div className="flex items-center gap-1.5">
                                  <input type="text" value={appleNameInput} onChange={e => setAppleNameInput(e.target.value)} className="border border-gray-300 rounded px-2 py-0.5 text-xs outline-none focus:border-amber-500 w-44 font-medium" placeholder="Tên danh bạ..." autoFocus />
                                  <button onClick={handleSyncApple} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1 rounded font-bold shadow-sm transition">Lưu</button>
                                  <button onClick={() => setIsEditingApple(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded font-bold transition">Hủy</button>
                              </div>
                          ) : (
                              <span onClick={() => setIsEditingApple(true)} className="badge bg-gray-100 text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-200 transition flex items-center gap-1">
                                 <BrandIcon name="brand-apple" className="w-3 h-3 text-gray-500" /> Chưa lưu iCloud (Bấm sửa)
                              </span>
                          )
                      )}
                   </div>
               </div>
               <div className="flex gap-2 items-center">
                   <button onClick={onShare} className="text-gray-600 hover:text-blue-600 font-bold p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-1 text-xs" title="Share link cho Sale">
                      <BrandIcon name="share-link" className="w-4 h-4" /> Share
                   </button>
                   <button onClick={onClose} className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition" title="Đóng">
                      <BrandIcon name="x-close" className="w-5 h-5" />
                   </button>
               </div>
            </div>
            
            <div className="p-5 flex-1 overflow-auto bg-gray-50/50">
               {/* Contact Info Block */}
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
                 <div className="flex justify-between items-start mb-3">
                     <div>
                         <p className="text-[11px] text-gray-500 font-mono uppercase tracking-wider font-bold mb-1">Số Điện Thoại</p>
                         <p className="text-xl font-bold font-mono text-gray-900 tracking-wide">{contact.phone}</p>
                     </div>
                     <a href={"tel:"+contact.phone} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-2 text-sm">
                         <BrandIcon name="phone-call" className="w-4 h-4" /> Gọi Ngay
                     </a>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                     <div>
                         <p className="text-[11px] text-gray-500 font-mono uppercase tracking-wider font-bold mb-1">Ngành Nghề</p>
                         <p className="text-sm font-medium text-gray-800">{contact.industry || 'Chưa cập nhật'}</p>
                     </div>
                     <div>
                         <p className="text-[11px] text-gray-500 font-mono uppercase tracking-wider font-bold mb-1">Cập Nhật Cuối</p>
                         <p className="text-xs font-mono text-gray-600">{new Date(contact.updated_at).toLocaleString('vi-VN')}</p>
                     </div>
                 </div>

                 {parsedTags && parsedTags.length > 0 && (
                   <div className="mt-4 flex gap-1.5 flex-wrap">
                     {parsedTags.map((t, idx) => (
                       <span key={idx} className="badge badge-blue">
                         <BrandIcon name="tag-label" className="w-3 h-3 text-blue-500" /> {t}
                       </span>
                     ))}
                   </div>
                 )}
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                 {contact.phone && contact.phone.startsWith('FB_') ? (
                     <a href={"https://business.facebook.com/latest/inbox/all?selected_item_id=" + contact.phone.replace('FB_', '')} target="_blank" className="col-span-2 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-xl font-bold transition text-center shadow-sm flex items-center justify-center gap-2 text-sm">
                        <BrandIcon name="brand-facebook" className="w-4 h-4" /> Mở Inbox FB Page
                     </a>
                 ) : (
                     <>
                         <a href={"zalo://conversation?phone="+contact.phone} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition text-center shadow-sm flex items-center justify-center gap-2 text-sm">
                            <BrandIcon name="brand-zalo" className="w-4 h-4" /> Chat Zalo
                         </a>
                         <a href={"sms:"+contact.phone} className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-xl font-bold transition text-center shadow-sm flex items-center justify-center gap-2 text-sm">
                            <BrandIcon name="message-sms" className="w-4 h-4" /> iMessage / SMS
                         </a>
                     </>
                 )}
                 
                 {socials.map((s, idx) => (
                     <a key={idx} href={s.url} target="_blank" className="col-span-2 bg-gray-900 hover:bg-black text-white p-3 rounded-xl font-bold transition text-center shadow-sm flex justify-center items-center gap-2 text-sm">
                        <BrandIcon name={s.icon} className="w-4 h-4 text-amber-400" /> Mở {s.type} của học viên
                     </a>
                 ))}
               </div>

               {/* Context History */}
               <div className="flex items-center gap-2 mb-3">
                 <BrandIcon name="history-clock" className="w-4 h-4 text-amber-500" />
                 <h4 className="font-bold text-gray-900 text-base">Lịch Sử Bối Cảnh</h4>
               </div>
               
               {parsedNotes && parsedNotes.length > 0 ? (
                 <div className="space-y-4 mb-6">
                   {parsedNotes.map((note, idx) => (
                     <div key={idx} className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl shadow-sm">
                       <div className="flex justify-between items-center mb-2">
                           <span className="badge badge-yellow">
                              <BrandIcon name="tag-label" className="w-3 h-3 text-amber-600" /> {note.source}
                           </span>
                           <span className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                               {note.author ? <span className="font-sans font-bold text-gray-800 bg-white/80 px-1.5 py-0.5 rounded border border-gray-200">{note.author}</span> : ''}
                               {note.timestamp ? new Date(note.timestamp).toLocaleString('vi-VN') : ''}
                           </span>
                       </div>
                       {renderContext(note.text)}
                       {note.attachments && note.attachments.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2">
                           {note.attachments.map((url, idx) => (
                             <img key={idx} src={url} className="w-20 h-20 object-cover rounded-lg border shadow-sm cursor-pointer" onClick={() => window.open(url, '_blank')} />
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-500 text-sm mb-6 italic bg-white p-4 rounded-xl border border-gray-100 text-center">Chưa có ghi chú nào.</p>
               )}
               
               <div className="flex items-center gap-2 mb-3">
                 <BrandIcon name="edit-pencil" className="w-4 h-4 text-indigo-500" />
                 <h4 className="font-bold text-gray-900 text-base">Thêm Ghi Chú Mới</h4>
               </div>
               
               <div 
                 className="relative mb-3"
                 onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('ring-2', 'ring-indigo-500'); }}
                 onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('ring-2', 'ring-indigo-500'); }}
                 onDrop={e => {
                   e.preventDefault();
                   e.currentTarget.classList.remove('ring-2', 'ring-indigo-500');
                   if (e.dataTransfer?.files) handleImageUpload(e.dataTransfer.files);
                 }}
               >
                 <textarea 
                   value={newNoteText} 
                   onChange={e => setNewNoteText(e.target.value)} 
                   onPaste={e => {
                     const items = e.clipboardData?.items;
                     if (!items) return;
                     const files = [];
                     for (let i = 0; i < items.length; i++) {
                       if (items[i].type.startsWith('image/')) files.push(items[i].getAsFile());
                     }
                     if (files.length > 0) {
                       e.preventDefault();
                       handleImageUpload(files);
                     }
                   }}
                   className="w-full border border-gray-300 rounded-xl p-3.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 shadow-sm transition resize-none cl-body mb-0 pb-10" 
                   rows="3" 
                   placeholder={`Nhập tóm tắt cuộc gọi (Ghi nhận dưới tên: ${salesIdentity || 'Chưa định danh'}). Hỗ trợ Paste/Kéo thả ảnh...`}
                 ></textarea>
                 
                 <div className="absolute bottom-2 left-2 flex items-center gap-2">
                   <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300 flex items-center gap-1 transition">
                     <span>📎 Ảnh</span>
                     <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(e.target.files)} />
                   </label>
                 </div>
               </div>

               {newNoteAttachments.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-3">
                   {newNoteAttachments.map((url, idx) => (
                     <div key={idx} className="relative group">
                       <img src={url} className="w-16 h-16 object-cover rounded-lg border shadow-sm cursor-pointer" onClick={() => window.open(url, '_blank')} />
                       <button onClick={() => setNewNoteAttachments(newNoteAttachments.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hidden group-hover:flex">✕</button>
                     </div>
                   ))}
                 </div>
               )}

               <button disabled={isSavingNote || (!newNoteText.trim() && newNoteAttachments.length === 0)} className="w-full btn-fedu btn-fedu-primary py-3 rounded-xl font-bold shadow-md transition flex justify-center items-center gap-2 text-sm disabled:opacity-50" 
                       onClick={async () => {
                           if (!salesIdentity) {
                               showToast('Vui lòng chọn người trực trước khi ghi chú!');
                               return;
                           }
                           setIsSavingNote(true);
                           try {
                               const res = await fetch('/api/contacts/'+contact.id+'/notes', {
                                   method: 'POST',
                                   headers: {'Content-Type': 'application/json'},
                                   body: JSON.stringify({text: newNoteText, author: salesIdentity, attachments: newNoteAttachments})
                               });
                               if (res.ok) {
                                   const data = await res.json();
                                   contact.notes = data.notes;
                                   setNewNoteText('');
                                   setNewNoteAttachments([]);
                                   showToast('Đã lưu ghi chú thành công!');
                               } else { showToast('Lỗi lưu ghi chú'); }
                           } catch(e) { showToast('Lỗi kết nối máy chủ'); }
                           setIsSavingNote(false);
                       }}>
                   <BrandIcon name="save-disk" className="w-4 h-4" />
                   <span>{isSavingNote ? 'Đang lưu...' : 'Lưu Ghi Chú'}</span>
               </button>
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
      { id: 'col-4', title: 'Đã Đăng Ký (STU)', count: 0, items: [] }
    ];
    
    contacts.forEach(c => {
      const isOnlineCourse = (c.class_name && (c.class_name.includes('Online') || c.class_name.includes('Skool'))) || 
                             (c.tags && c.tags.includes('Khóa Online'));
      if (isOnlineCourse) return;
      
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
    showToast('Đã chuyển trạng thái sang ' + destColId);
    
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
    <div className="p-5 h-full flex flex-col cl-zebra--light">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold title-short flex items-center gap-2.5">
           <BrandIcon name="radar-scanner" className="w-6 h-6 text-amber-500" />
           <span>LED Board</span>
           <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">Telesale Radar</span>
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 kanban-board flex-1">
        {columns.map(col => (
          <div key={col.id} className="kanban-col" onDragOver={handleDragOver} onDrop={e => handleDrop(e, col.id)}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-gray-800">{col.title}</h3>
              <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs font-mono font-bold border border-gray-200 shadow-sm">{col.count}</span>
            </div>
            {col.items.map(card => (
              <div key={card.id} className="kanban-card group" draggable
                   onDragStart={e => handleDragStart(e, card.id, col.id)}
                   onClick={() => onSelectContact(card.contact)}>
                <div className="flex justify-between items-start mb-1">
                   <div className="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition">{card.name}</div>
                   {card.contact.apple_contact_synced === 1 && (
                      <span title="Đã đồng bộ iCloud" className="text-green-600">
                         <BrandIcon name="brand-apple" className="w-3.5 h-3.5 inline" />
                      </span>
                   )}
                </div>
                <div className="text-xs text-gray-500 mb-2 font-mono">
                   <a href={"tel:"+card.phone} className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <BrandIcon name="phone-call" className="w-3 h-3 text-blue-500" /> {card.phone}
                   </a>
                </div>
                {card.notes && card.notes.length > 0 && (
                  <div className="text-xs text-gray-700 bg-amber-50/70 p-2.5 rounded-lg mb-2 line-clamp-2 cl-body italic border border-amber-200/80 shadow-sm">
                    {card.notes[0].text.replace(/^[-*[]+|]+$/g, '')}
                  </div>
                )}
                <div className="flex gap-1.5 flex-wrap">
                  {card.tags && card.tags.map((t, idx) => (
                    <span key={idx} className="badge badge-blue">
                       <BrandIcon name="tag-label" className="w-2.5 h-2.5 text-blue-500" /> {t}
                    </span>
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
    <div className="p-5 max-w-6xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold title-short flex items-center gap-2.5">
             <BrandIcon name="database-stack" className="w-6 h-6 text-blue-600" />
             <span>Kho Học Viên Toàn Hệ Thống</span>
             <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">{filteredContacts.length}</span>
          </h2>
      </div>
      
      <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
         <span onClick={() => setFilter('all')} className={"cursor-pointer px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition shadow-sm flex items-center gap-2 " + (filter==='all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200')}>
            <BrandIcon name="users-group" className="w-3.5 h-3.5" /> Tất cả kho STU
         </span>
         <span onClick={() => setFilter('online')} className={"cursor-pointer px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition shadow-sm flex items-center gap-2 " + (filter==='online' ? 'bg-purple-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200')}>
            <BrandIcon name="award-medal" className="w-3.5 h-3.5 text-purple-400" /> Đã học Khóa Online/Skool
         </span>
         <span onClick={() => setFilter('offline')} className={"cursor-pointer px-4 py-2 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition shadow-sm flex items-center gap-2 " + (filter==='offline' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200')}>
            <BrandIcon name="target-goal" className="w-3.5 h-3.5 text-green-400" /> Khóa Offline (K1, K2...)
         </span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-4">Họ và Tên</th>
              <th className="px-5 py-4">Lớp Học</th>
              <th className="px-5 py-4">Phân Loại / Ngành</th>
              <th className="px-5 py-4">Số Điện Thoại</th>
              <th className="px-5 py-4">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredContacts.map(c => {
              const isOnlineCourse = (c.class_name && (c.class_name.includes('Online') || c.class_name.includes('Skool'))) || (c.tags && c.tags.includes('Khóa Online'));
              return (
              <tr key={c.id} className="hover:bg-amber-50/40 cursor-pointer transition" onClick={() => onSelectContact(c)}>
                <td className="px-5 py-4 font-bold text-gray-900">{c.name}</td>
                <td className="px-5 py-4">
                  {isOnlineCourse ? (
                      <span className="badge badge-purple">{c.class_name || 'Khóa Online Skool'}</span>
                  ) : (
                      <span className="badge badge-green">{c.class_name || 'Khóa Offline'}</span>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-gray-700">{c.industry || 'N/A'}</td>
                <td className="px-5 py-4 font-bold font-mono text-blue-600">{c.phone}</td>
                <td className="px-5 py-4">
                   <div className="flex gap-3">
                       <a href={"tel:"+c.phone} className="text-gray-500 hover:text-green-600 transition inline-flex items-center gap-1 font-semibold text-xs" onClick={e => e.stopPropagation()}>
                          <BrandIcon name="phone-call" className="w-3.5 h-3.5 text-green-500" /> Gọi
                       </a>
                       <a href={"zalo://conversation?phone="+c.phone} className="text-gray-500 hover:text-blue-600 transition inline-flex items-center gap-1 font-semibold text-xs" onClick={e => e.stopPropagation()}>
                          <BrandIcon name="brand-zalo" className="w-3.5 h-3.5 text-blue-500" /> Zalo
                       </a>
                   </div>
                </td>
              </tr>
            )})}
            {filteredContacts.length === 0 && (
              <tr><td colSpan="5" className="text-center py-12 text-gray-500 font-medium">Không tìm thấy học viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- TAB: Inbox Hub ---
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
    <div className="p-5 max-w-4xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold title-short flex items-center gap-2.5">
           <BrandIcon name="message-sms" className="w-6 h-6 text-indigo-600" />
           <span>Inbox Hub</span>
        </h2>
      </div>
      
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border p-5 animate-pulse">
           <div className="flex justify-between mb-3">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
           </div>
           <div className="h-12 bg-gray-100 rounded w-full mb-4"></div>
        </div>
      )}

      {!loading && inbox.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-500">
           <BrandIcon name="check-circle" className="w-10 h-10 text-gray-400 mx-auto mb-3" />
           <p className="font-semibold">Hộp thư trống. Không có tin nhắn chưa đọc.</p>
        </div>
      )}

      {!loading && inbox.map(msg => (
        <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4">
           <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>{msg.contact_name || 'Khách Hàng'}</span> 
                <span className={"badge " + (msg.channel === 'facebook' ? 'badge-blue' : 'badge-green')}>
                  <BrandIcon name={msg.channel === 'facebook' ? 'brand-facebook' : 'message-sms'} className="w-3 h-3" />
                  {msg.channel}
                </span>
                {msg.contact_phone && !msg.contact_phone.startsWith('FB_') && (
                  <span className="badge badge-red ml-2 border border-red-500 shadow-sm animate-pulse">
                    <BrandIcon name="phone" className="w-3 h-3" /> {msg.contact_phone}
                  </span>
                )}
              </h3>
              <span className="text-xs font-mono text-gray-500">{new Date(msg.created_at).toLocaleString('vi-VN')}</span>
           </div>
           <p className={`text-gray-800 mb-4 bg-gray-50/80 p-3.5 rounded-xl cl-body whitespace-pre-wrap border border-gray-100 ${!msg.content ? 'italic text-gray-400' : ''}`}>
             {msg.content || '[Khách hàng gửi Hình ảnh / Tệp đính kèm / Sticker]'}
           </p>
           
           {msg.ai_suggested_reply && (
             <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 mb-4">
                <div className="text-xs font-bold font-mono uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
                   <BrandIcon name="sparkles-ai" className="w-3.5 h-3.5 text-blue-600" />
                   <span>AI Gợi Ý Trả Lời:</span>
                </div>
                <p className="text-sm text-blue-950 cl-body whitespace-pre-wrap">{msg.ai_suggested_reply}</p>
             </div>
           )}
           
           <div className="flex flex-wrap gap-2.5">
              {msg.channel === 'facebook' && (
                <a href="https://business.facebook.com/latest/inbox/all" target="_blank" className="btn-fedu bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold" onClick={() => showToast('Đang mở Meta Business Suite...')}>
                   <BrandIcon name="brand-facebook" className="w-3.5 h-3.5 text-blue-600" /> Mở Chat Meta Suite
                </a>
              )}
              {msg.channel === 'imessage' && (
                <a href={"sms:" + msg.contact_phone} className="btn-fedu bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold">
                   <BrandIcon name="message-sms" className="w-3.5 h-3.5 text-green-600" /> Mở iMessage
                </a>
              )}
              <button className="btn-fedu bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold" onClick={() => {
                  if (msg.ai_suggested_reply) {
                      navigator.clipboard.writeText(msg.ai_suggested_reply);
                      showToast('Đã copy gợi ý trả lời');
                  } else {
                      showToast('Không có nội dung gợi ý để copy');
                  }
              }}>
                 <BrandIcon name="copy-clipboard" className="w-3.5 h-3.5" /> Copy Kịch Bản
              </button>
           </div>
        </div>
      ))}
    </div>
  );
};

// --- TAB: Reports Tab ---
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
    <div className="p-5 max-w-5xl mx-auto cl-zebra--light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold title-short flex items-center gap-2.5">
           <BrandIcon name="trending-up" className="w-6 h-6 text-blue-600" />
           <span>Báo Cáo Hoạt Động</span>
        </h2>
        <button className="btn-fedu bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md font-bold text-xs" onClick={triggerReport}>
          <BrandIcon name="brand-telegram" className="w-4 h-4 text-white" /> Gửi Báo Cáo Telegram
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <div className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
              <BrandIcon name="radar-scanner" className="w-3.5 h-3.5 text-indigo-500" /> Tổng Leads
           </div>
           <div className="text-3xl font-bold font-mono text-indigo-600 mt-2">{stats.total}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <div className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
              <BrandIcon name="phone-missed" className="w-3.5 h-3.5 text-gray-500" /> Chưa Gọi (New)
           </div>
           <div className="text-3xl font-bold font-mono text-gray-700 mt-2">{stats.stages.new || 0}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <div className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
              <BrandIcon name="phone-call" className="w-3.5 h-3.5 text-blue-500" /> Đã Liên Hệ
           </div>
           <div className="text-3xl font-bold font-mono text-blue-600 mt-2">{stats.stages.contacted || 0}</div>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <div className="text-gray-500 text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
              <BrandIcon name="check-circle" className="w-3.5 h-3.5 text-green-500" /> Đã Đăng Ký (STU)
           </div>
           <div className="text-3xl font-bold font-mono text-green-600 mt-2">{stats.stages.enrolled || 0}</div>
         </div>
      </div>
    </div>
  );
};

// --- TAB: Thư Viện Kịch Bản ---
const AITrainingTab = ({showToast}) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
     fetch('/api/ai/training-data')
       .then(res => res.json())
       .then(d => {
          if (!d.error) setData(d);
       });
  }, []);

  if (!data) return (
     <div className="p-8 text-center mt-20 text-gray-500 font-mono font-bold flex flex-col items-center gap-3">
        <BrandIcon name="book-poem" className="w-8 h-8 text-amber-500 animate-pulse" />
        <span>Đang tải thư viện kịch bản...</span>
     </div>
  );

  return (
    <div className="p-5 max-w-4xl mx-auto cl-zebra--light pb-20">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold title-short flex items-center gap-2.5">
            <BrandIcon name="book-poem" className="w-6 h-6 text-emerald-600" />
            <span>Thư Viện Kịch Bản</span>
            <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">Duyệt Tin Fanpage</span>
         </h2>
         <div className="flex gap-4 bg-white px-3.5 py-1.5 rounded-xl shadow-sm border border-gray-200">
            <div className="text-xs font-mono">
               <span className="text-gray-500">Chuẩn hóa:</span> <strong className="ml-1 text-gray-900">{data.total_scripts} mẫu</strong>
            </div>
         </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-6 bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 cl-body">
         💡 Kho tàng các tình huống khách hàng thực tế trên Fanpage. Hệ thống lưu lại các câu hỏi thực tế và <strong>cách Anh Việt đã trực tiếp duyệt mộc mạc nhất</strong>. Đội ngũ Sale có thể dùng nút Copy để gửi ngay cho khách.
      </p>

      {data.samples && data.samples.map((sample) => (
      <div key={sample.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
         <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                 <span className="font-bold text-gray-900 text-sm">{sample.customer_name || 'Khách hàng'}</span>
                 {sample.channel && <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-semibold">{sample.channel}</span>}
             </div>
             <span className="text-xs font-mono font-bold text-gray-400">#{sample.id}</span>
         </div>
         <div className="mb-4 bg-gray-50 p-4 rounded-xl text-sm border border-gray-200 text-gray-900">
             <strong className="text-gray-500 font-mono uppercase tracking-wider text-xs block mb-1">
                <BrandIcon name="user-single" className="w-3.5 h-3.5 text-gray-600 inline mr-1" /> Bối cảnh khách hỏi:
             </strong>
             <span className="cl-body italic">"{sample.user_message}"</span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            <div>
               <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                 <BrandIcon name="sparkles-ai" className="w-3.5 h-3.5 text-cyan-600" />
                 <span>Các phương án AI gợi ý:</span>
               </h4>
               <div className="bg-gray-50 p-3.5 rounded-xl text-xs border border-gray-100 text-gray-500 whitespace-pre-wrap italic cl-body">
                 {sample.ai_suggestion}
               </div>
            </div>
            <div>
               <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
                 <BrandIcon name="check-circle" className="w-3.5 h-3.5 text-green-600" />
                 <span>Kịch bản Anh Việt đã chốt:</span>
               </h4>
               <div className="bg-green-50/70 p-3.5 rounded-xl text-sm border border-green-200 text-green-950 font-medium cl-body whitespace-pre-wrap">
                 {sample.approved_reply}
               </div>
               
               {sample.mentor_correction && (
                  <div className="bg-amber-50/80 p-3 rounded-xl text-xs border border-amber-200 text-amber-900 mt-2.5 font-medium flex gap-2 items-start">
                    <span className="text-amber-500">💡</span>
                    <span>{sample.mentor_correction}</span>
                  </div>
               )}
            </div>
         </div>
         <div className="flex justify-end pt-3 border-t border-gray-100">
            <button className="btn-fedu btn-fedu-primary py-2 px-4 rounded-xl text-xs font-bold shadow-sm" 
               onClick={() => {
                   navigator.clipboard.writeText(sample.approved_reply);
                   showToast('Đã copy kịch bản chuẩn vào bộ nhớ đệm');
               }}>
               <BrandIcon name="copy-clipboard" className="w-3.5 h-3.5" /> Copy Kịch Bản Chuẩn
            </button>
         </div>
      </div>
      ))}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);