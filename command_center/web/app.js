const { useState, useEffect, useRef } = React;

const App = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    // SSE setup for real-time updates
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

  return (
    <div className="flex flex-col h-screen w-full">
       {/* Header */}
       <header className="text-white p-4 flex justify-between items-center shadow-md" style={{backgroundColor: 'var(--primary-color)'}}>
          <div className="flex items-center gap-3">
             <div className="font-bold text-xl">FEDU Command Center</div>
             <div title={isConnected ? "Đã kết nối máy chủ" : "Mất kết nối máy chủ"} className={`status-dot ${isConnected ? 'active' : 'error'}`}></div>
          </div>
          <div className="text-sm hidden sm:block">{new Date().toLocaleString('vi-VN')}</div>
       </header>

       {/* Tabs Navigation */}
       <div className="bg-white border-b px-4 py-2">
         <div className="tab-nav">
           <div className={`tab-item ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
             📨 Inbox Hub <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs ml-1">3</span>
           </div>
           <div className={`tab-item ${activeTab === 'led' ? 'active' : ''}`} onClick={() => setActiveTab('led')}>📞 LED Board</div>
           <div className={`tab-item ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>👨‍🎓 Student Hub</div>
           <div className={`tab-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>📊 Báo Cáo</div>
           <div className={`tab-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>🧠 Huấn Luyện AI</div>
         </div>
       </div>

       {/* Main Content Area */}
       <main className="flex-1 overflow-auto relative">
         {activeTab === 'inbox' && <InboxTab showToast={showToast} />}
         {activeTab === 'led' && <LedBoardTab showToast={showToast} />}
         {activeTab === 'student' && <StudentHubTab showToast={showToast} />}
         {activeTab === 'reports' && <ReportsTab showToast={showToast} />}
         {activeTab === 'ai' && <AITrainingTab showToast={showToast} />}
       </main>

       {/* Toast Notifications container */}
       <div className="toast-container">
         {toasts.map(t => (
           <div key={t.id} className="toast">{t.msg}</div>
         ))}
       </div>
    </div>
  );
};

// --- TAB: Inbox Hub ---
const InboxTab = ({showToast}) => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📨 Inbox Hub</h2>
      
      {/* Thread Example 1 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
         <div className="flex justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center gap-2">Nguyễn Văn A <span className="badge badge-blue">Zalo</span></h3>
            <span className="text-sm text-gray-500">10 phút trước</span>
         </div>
         <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded">Dạ cho em hỏi khóa học này còn slot không ạ?</p>
         
         <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <div className="text-xs font-bold text-blue-800 mb-1">🤖 AI Gợi ý trả lời:</div>
            <p className="text-sm text-blue-900">Chào bạn, khóa học offline hiện vẫn còn 2 slot cho ca tối nhé. Bạn muốn đăng ký luôn không?</p>
         </div>
         
         <div className="flex flex-wrap gap-2">
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm font-medium transition" onClick={() => showToast('Đang mở Meta Suite...')}>Mở Chat Meta Suite</button>
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-sm font-medium transition" onClick={() => showToast('Đã copy kịch bản')}>Copy Kịch Bản</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-bold transition ml-auto" onClick={() => showToast('Đã duyệt & gửi tin nhắn')}>Duyệt & Gửi</button>
         </div>
      </div>

      {/* Skeleton for loading items */}
      <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
         <div className="flex justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
         </div>
         <div className="h-10 bg-gray-100 rounded w-full mb-4"></div>
      </div>
    </div>
  );
};

// --- TAB: LED Board (Kanban) ---
const LedBoardTab = ({showToast}) => {
  const [columns, setColumns] = useState({
    'chua_goi': { title: 'Chưa Gọi', items: [{id: 1, name: 'Lê Thị B', phone: '0987654321', industry: 'Thiết kế', lastCall: 'Chưa có'}] },
    'da_lien_he': { title: 'Đã Liên Hệ', items: [{id: 2, name: 'Trần Văn C', phone: '0912223334', industry: 'Marketing', lastCall: 'Hôm qua'}] },
    'dang_trao_doi': { title: 'Đang Trao Đổi', items: [] },
    'da_dang_ky': { title: 'Đã Đăng Ký', items: [{id: 3, name: 'Phạm D', phone: '0909090909', industry: 'IT', lastCall: 'Sáng nay'}] },
  });
  const [selectedCard, setSelectedCard] = useState(null);

  const handleDragStart = (e, id, sourceCol) => {
    e.dataTransfer.setData('cardId', id);
    e.dataTransfer.setData('sourceCol', sourceCol);
  };

  const handleDrop = (e, targetCol) => {
    const cardId = parseInt(e.dataTransfer.getData('cardId'));
    const sourceCol = e.dataTransfer.getData('sourceCol');
    if (sourceCol === targetCol) return;
    
    const card = columns[sourceCol].items.find(i => i.id === cardId);
    if (!card) return;

    setColumns(prev => {
      const newCols = {...prev};
      newCols[sourceCol].items = newCols[sourceCol].items.filter(i => i.id !== cardId);
      newCols[targetCol].items.push(card);
      return newCols;
    });
    showToast(`Đã chuyển thẻ sang ${columns[targetCol].title}`);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="kanban-board pb-8">
        {Object.entries(columns).map(([colId, col]) => (
          <div key={colId} className="kanban-column"
               onDragOver={e => e.preventDefault()}
               onDrop={e => handleDrop(e, colId)}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">{col.title}</h3>
              <span className="badge badge-blue">{col.items.length}</span>
            </div>
            {col.items.map(card => (
              <div key={card.id} className="kanban-card" draggable
                   onDragStart={e => handleDragStart(e, card.id, colId)}
                   onClick={() => setSelectedCard(card)}>
                <div className="font-bold text-sm mb-1">{card.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                   <a href={`tel:${card.phone}`} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{card.phone}</a>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <span className="badge badge-yellow">{card.industry}</span>
                  <span className="badge bg-gray-100">{card.lastCall}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedCard && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedCard(null)}></div>
          <div className="drawer open">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-lg">{selectedCard.name}</h3>
               <button onClick={() => setSelectedCard(null)} className="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
               <div className="bg-white p-3 rounded border mb-4">
                 <p className="mb-2 text-sm text-gray-600"><strong>SĐT:</strong> <a href={`tel:${selectedCard.phone}`} className="text-blue-600 text-base">{selectedCard.phone}</a></p>
                 <p className="mb-2 text-sm text-gray-600"><strong>Ngành:</strong> {selectedCard.industry}</p>
                 <p className="text-sm text-gray-600"><strong>Liên hệ lần cuối:</strong> {selectedCard.lastCall}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-2 mb-6">
                 <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition" onClick={() => showToast('Mở Zalo')}>Chat Zalo</button>
                 <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition" onClick={() => showToast('Mở iMessage')}>iMessage</button>
               </div>
               
               <h4 className="font-bold mb-2 text-gray-800">Ghi chú & Lịch sử cuộc gọi</h4>
               <textarea className="w-full border border-gray-300 rounded p-3 text-sm mb-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows="4" placeholder="Nhập ghi chú hoặc kết quả trao đổi..."></textarea>
               
               <button className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-bold shadow-md transition" onClick={() => {showToast('Đã lưu dữ liệu vào hệ thống STU'); setSelectedCard(null)}}>Lưu Kho STU</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- TAB: Student Hub ---
const StudentHubTab = ({showToast}) => {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👨‍🎓 Student Hub</h2>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         <span className="badge badge-blue cursor-pointer px-4 py-1.5 text-sm">Tất cả</span>
         <span className="badge bg-white border cursor-pointer px-4 py-1.5 text-sm hover:bg-gray-50">Offline K1</span>
         <span className="badge bg-white border cursor-pointer px-4 py-1.5 text-sm hover:bg-gray-50">Offline K2</span>
         <span className="badge bg-white border cursor-pointer px-4 py-1.5 text-sm hover:bg-gray-50">Online</span>
         <span className="badge bg-white border cursor-pointer px-4 py-1.5 text-sm hover:bg-gray-50">Skool</span>
      </div>
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Họ và Tên</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Lớp</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngành</th>
              <th className="px-4 py-3 font-semibold text-gray-600">SĐT</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Điểm</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-blue-50 cursor-pointer transition" onClick={() => showToast('Mở hồ sơ chi tiết')}>
              <td className="px-4 py-3 font-medium">Nguyễn Văn Sinh</td>
              <td className="px-4 py-3">Offline K1</td>
              <td className="px-4 py-3">Thiết kế Đồ họa</td>
              <td className="px-4 py-3">0912345678</td>
              <td className="px-4 py-3">sinh.nv@gmail.com</td>
              <td className="px-4 py-3 font-bold text-blue-600">9.5</td>
              <td className="px-4 py-3"><span className="badge badge-green">Đang học</span></td>
            </tr>
            <tr className="hover:bg-blue-50 cursor-pointer transition" onClick={() => showToast('Mở hồ sơ chi tiết')}>
              <td className="px-4 py-3 font-medium">Trần Thị Thu</td>
              <td className="px-4 py-3">Online</td>
              <td className="px-4 py-3">Digital Marketing</td>
              <td className="px-4 py-3">0988776655</td>
              <td className="px-4 py-3">thu.tt@gmail.com</td>
              <td className="px-4 py-3 font-bold text-blue-600">8.0</td>
              <td className="px-4 py-3"><span className="badge badge-yellow">Bảo lưu</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- TAB: Báo Cáo ---
const ReportsTab = ({showToast}) => {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Báo Cáo Hoạt Động</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                onClick={() => showToast('Đã gửi báo cáo tổng hợp qua Telegram (Bot: @baoDuLieu_bot)')}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 4v5.586l-2.293-2.293-1.414 1.414L9 14.414l3.707-3.707-1.414-1.414L9 11.586V6H9z"></path></svg>
          Gửi Báo Cáo Telegram
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">New Leads Today</div>
           <div className="text-3xl font-bold text-indigo-600 mt-2">12</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Calls Made</div>
           <div className="text-3xl font-bold text-green-600 mt-2">45</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Messages Sent</div>
           <div className="text-3xl font-bold text-blue-600 mt-2">128</div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
           <div className="text-gray-500 text-sm font-medium">Conversion Rate</div>
           <div className="text-3xl font-bold text-pink-600 mt-2">8.5%</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-5 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-gray-800">Dòng thời gian (Hôm nay)</h3>
              <span className="text-xs text-gray-500">Cập nhật lần tới trong: <strong className="text-blue-600">04:30</strong></span>
            </div>
            <div className="border-l-2 border-gray-200 ml-3 pl-5 relative space-y-5">
               <div>
                  <div className="absolute w-3.5 h-3.5 bg-blue-500 rounded-full -left-[9px] mt-1 ring-4 ring-white"></div>
                  <div className="text-sm font-bold text-gray-800">14:00</div>
                  <div className="text-sm text-gray-600 mt-1">Auto-scan FB Fanpage hoàn tất (5 leads mới)</div>
               </div>
               <div>
                  <div className="absolute w-3.5 h-3.5 bg-green-500 rounded-full -left-[9px] mt-1 ring-4 ring-white"></div>
                  <div className="text-sm font-bold text-gray-800">13:15</div>
                  <div className="text-sm text-gray-600 mt-1">Gửi 10 email nhắc nhở học viên qua Resend</div>
               </div>
               <div>
                  <div className="absolute w-3.5 h-3.5 bg-gray-400 rounded-full -left-[9px] mt-1 ring-4 ring-white"></div>
                  <div className="text-sm font-bold text-gray-800">09:00</div>
                  <div className="text-sm text-gray-600 mt-1">Hệ thống bắt đầu radar quét dữ liệu mới</div>
               </div>
            </div>
         </div>
         <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="font-bold mb-5 text-gray-800">Thống kê Leads (7 ngày qua)</h3>
            <div className="h-48 flex items-end gap-2 pb-2 mt-4 px-2">
               {/* Simple CSS Bar Chart placeholders */}
               <div className="bg-indigo-300 w-full h-[40%] rounded-t-sm hover:bg-indigo-400 transition" title="T2: 40%"></div>
               <div className="bg-indigo-300 w-full h-[60%] rounded-t-sm hover:bg-indigo-400 transition" title="T3: 60%"></div>
               <div className="bg-indigo-300 w-full h-[30%] rounded-t-sm hover:bg-indigo-400 transition" title="T4: 30%"></div>
               <div className="bg-indigo-300 w-full h-[80%] rounded-t-sm hover:bg-indigo-400 transition" title="T5: 80%"></div>
               <div className="bg-indigo-300 w-full h-[50%] rounded-t-sm hover:bg-indigo-400 transition" title="T6: 50%"></div>
               <div className="bg-indigo-300 w-full h-[90%] rounded-t-sm hover:bg-indigo-400 transition" title="T7: 90%"></div>
               <div className="bg-indigo-500 w-full h-[100%] rounded-t-sm shadow-md" title="CN: 100% (Hôm nay)"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2 font-medium">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-indigo-600 font-bold">CN</span>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- TAB: Huấn Luyện AI ---
const AITrainingTab = ({showToast}) => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold">🧠 Huấn Luyện AI</h2>
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
