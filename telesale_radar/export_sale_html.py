#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Export 2 khối lead ra file HTML độc lập cho Telesale gọi nốt:
- Khối 1: Đã nhắn (Chờ rep) - 12 lead
- Khối 2: Đã trao đổi / Cân nhắc 🔥 - 15 lead
- Đồng thời upload lên Cloudflare R2 CDN và cấu hình route cho server
"""

import os
import sys
import json
from datetime import datetime

DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(DIR)
import telesale_engine as engine

def get_2_columns_leads():
    leads = engine.aggregate_all_leads()

    def is_sale_lead(l):
        if not l: return False
        if l.get('is_sale_consulted'): return True
        if (l.get('sale_note') or '').strip(): return True
        tags = l.get('tags') or []
        if any(('sale' in t.lower() or 'đã tv' in t.lower() or 'da tv' in t.lower()) for t in tags): return True
        note = (l.get('note') or '').lower()
        if any(k in note for k in ['[sale đã tv]', 'sale đã tv', 'sale đã gọi', '[sale da tv]']): return True
        name = ((l.get('apple_contact_name') or '') + ' ' + (l.get('name') or '')).lower()
        if any(k in name for k in ['[sale đã tv]', '[sale da tv]']): return True
        return False

    # Danh sách các lead loại bỏ theo yêu cầu của anh Việt:
    # 1. Ngân Gia Huy (0943490349)
    # 2. Nguyễn Hữu Chiến (0839666685)
    # 3. Nguyễn Việt - Test Cockpit (0982492003)
    # 4. Vũ Trí Văn (0832126789)
    EXCLUDED_PHONES = {'0943490349', '0839666685', '0982492003', '0832126789'}

    active = [l for l in leads if not l.get('is_archived') and l.get('phone') not in EXCLUDED_PHONES]
    active_non_sale = [l for l in active if not is_sale_lead(l)]

    # Cập nhật ghi chú riêng cho Hoàng anh tài theo chỉ đạo của anh Việt:
    for l in active_non_sale:
        if l.get('phone') == '0327288139':
            l['note'] = '🔥 GIẢM GIÁ CÒN 2.4 NHƯNG CHƯA CHỐT • ' + (l.get('note') or '')

    contacted = [l for l in active_non_sale if l.get('status') == 'contacted']
    called = [l for l in active_non_sale if l.get('status') in ['called', 'considering']]

    return contacted, called

def generate_sale_html(contacted_leads, called_leads, output_path):
    all_target_leads = []
    for l in contacted_leads:
        item = dict(l)
        item['column_type'] = 'contacted'
        item['column_label'] = 'ĐÃ NHẮN (CHỜ REP)'
        all_target_leads.append(item)
    for l in called_leads:
        item = dict(l)
        item['column_type'] = 'called'
        item['column_label'] = 'ĐÃ TRAO ĐỔI / CÂN NHẮC 🔥'
        all_target_leads.append(item)

    total_leads = len(all_target_leads)
    leads_json = json.dumps(all_target_leads, ensure_ascii=False)
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M")

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Danh Sách {total_leads} Lead Cần Gọi Nốt — FEDU LED Hub</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%234f46e5'/><text x='50%' y='64%' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='38' fill='white'>SALE</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      -webkit-tap-highlight-color: transparent;
    }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: #f1f5f9; }}
    ::-webkit-scrollbar-thumb {{ background: #cbd5e1; border-radius: 4px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: #94a3b8; }}
    .lead-card {{
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }}
    .lead-card:hover {{
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
    }}
    .lead-card.done-card {{
      opacity: 0.7;
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }}
    .lead-card.done-card:hover {{
      opacity: 0.95;
    }}
  </style>
</head>
<body class="min-h-screen flex flex-col pb-16">

  <!-- ================= TOP HEADER ================= -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm font-black text-sm tracking-tight shrink-0">
          LED
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">Danh Sách Gọi Nốt Cho Sale</h1>
            <span class="bg-indigo-50 text-indigo-700 text-xs font-black px-2 py-0.5 rounded-full border border-indigo-200 shrink-0">{total_leads} LEAD</span>
          </div>
          <p class="text-xs text-slate-500 hidden sm:block">2 Khối: Đã Nhắn ({len(contacted_leads)}) + Đã Trao Đổi ({len(called_leads)}) • Cập nhật: {now_str}</p>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="flex items-center gap-2">
        <div class="bg-slate-100 px-3 py-1.5 rounded-xl text-right shrink-0">
          <div class="text-[10px] text-slate-500 font-medium">TIẾN ĐỘ GỌI</div>
          <div class="text-xs sm:text-sm font-black text-indigo-600" id="progressStat">0 / {total_leads} (0%)</div>
        </div>
        <button onclick="exportNotesSummary()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs">
          <span>📋 Xuất báo cáo</span>
        </button>
      </div>
    </div>

    <!-- PROGRESS BAR -->
    <div class="w-full bg-slate-100 h-1.5">
      <div id="progressBar" class="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-1.5 transition-all duration-300" style="width: 0%;"></div>
    </div>

    <!-- FILTER & SEARCH BAR -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/70 border-t border-slate-100">
      <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
        <button onclick="setFilter('all')" id="filter-btn-all" class="filter-chip px-3 py-1 rounded-lg text-xs font-bold transition bg-indigo-600 text-white shadow-2xs shrink-0">
          Tất cả ({total_leads})
        </button>
        <button onclick="setFilter('contacted')" id="filter-btn-contacted" class="filter-chip px-3 py-1 rounded-lg text-xs font-semibold transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shrink-0">
          🟠 Đã Nhắn ({len(contacted_leads)})
        </button>
        <button onclick="setFilter('called')" id="filter-btn-called" class="filter-chip px-3 py-1 rounded-lg text-xs font-semibold transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shrink-0">
          🔥 Đã Trao Đổi ({len(called_leads)})
        </button>
        <button onclick="setFilter('pending')" id="filter-btn-pending" class="filter-chip px-3 py-1 rounded-lg text-xs font-semibold transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shrink-0">
          ⏳ Chưa gọi nốt
        </button>
        <button onclick="setFilter('done')" id="filter-btn-done" class="filter-chip px-3 py-1 rounded-lg text-xs font-semibold transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shrink-0">
          ✅ Đã xử lý
        </button>
      </div>

      <!-- Search input -->
      <div class="relative w-full sm:w-64">
        <input
          type="text"
          id="searchInput"
          oninput="handleSearch(this.value)"
          placeholder="Tìm tên, SĐT, nghề..."
          class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs"
        >
        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>
  </header>

  <!-- ================= MAIN CONTENT ================= -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex-1 w-full">
    
    <!-- VIEW TOGGLE TABS (MOBILE ONLY) -->
    <div class="grid grid-cols-2 gap-2 mb-4 md:hidden">
      <button onclick="switchMobileTab('contacted')" id="tab-btn-contacted" class="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-xs">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Đã Nhắn ({len(contacted_leads)})</span>
      </button>
      <button onclick="switchMobileTab('called')" id="tab-btn-called" class="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-white text-slate-600 border border-slate-200">
        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
        <span>Đã Trao Đổi ({len(called_leads)})</span>
      </button>
    </div>

    <!-- 2 COLUMNS CONTAINER -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      
      <!-- CỘT 1: ĐÃ NHẮN (CHỜ REP) -->
      <div id="col-contacted-wrapper" class="flex flex-col gap-3">
        <div class="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs"></span>
            <div>
              <h2 class="font-extrabold text-sm uppercase tracking-wide text-amber-950">ĐÃ NHẮN (CHỜ REP)</h2>
              <p class="text-[11px] text-amber-800/80">Khách đã nhận tin/gọi nhỡ • Cần gọi trực tiếp trao đổi</p>
            </div>
          </div>
          <span id="badge-count-contacted" class="text-xs font-black bg-white text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
            {len(contacted_leads)}
          </span>
        </div>
        <div id="list-contacted" class="space-y-3"></div>
      </div>

      <!-- CỘT 2: ĐÃ TRAO ĐỔI / CÂN NHẮC -->
      <div id="col-called-wrapper" class="flex flex-col gap-3">
        <div class="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-2xs"></span>
            <div>
              <h2 class="font-extrabold text-sm uppercase tracking-wide text-indigo-950">ĐÃ TRAO ĐỔI / CÂN NHẮC 🔥</h2>
              <p class="text-[11px] text-indigo-800/80">Đã đàm thoại hoặc hẹn mai • Tỷ lệ chốt K3 cao</p>
            </div>
          </div>
          <span id="badge-count-called" class="text-xs font-black bg-white text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
            {len(called_leads)}
          </span>
        </div>
        <div id="list-called" class="space-y-3"></div>
      </div>

    </div>

  </main>

  <!-- ================= TOAST NOTIFICATION ================= -->
  <div id="toast" class="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl z-50 transform translate-y-12 opacity-0 transition-all duration-200 flex items-center gap-2 pointer-events-none">
    <span id="toast-icon">✅</span>
    <span id="toast-message">Đã sao chép</span>
  </div>

  <!-- ================= JAVASCRIPT LOGIC ================= -->
  <script>
    const INITIAL_LEADS = {leads_json};
    let currentFilter = 'all';
    let searchQuery = '';
    let currentMobileTab = 'contacted';

    const STORAGE_KEY = 'FEDU_SALE_CALL_PROGRESS_V1';
    let saleProgress = {{}};
    try {{
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) saleProgress = JSON.parse(saved);
    }} catch (e) {{
      console.warn("Storage load error", e);
    }}

    function saveProgress() {{
      try {{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saleProgress));
      }} catch (e) {{}}
      updateStats();
    }}

    function renderCards() {{
      const listContacted = document.getElementById('list-contacted');
      const listCalled = document.getElementById('list-called');
      listContacted.innerHTML = '';
      listCalled.innerHTML = '';

      let cntContacted = 0;
      let cntCalled = 0;

      INITIAL_LEADS.forEach(lead => {{
        const prog = saleProgress[lead.phone] || {{}};
        const isDone = prog.status === 'called_ok' || prog.status === 'paid' || prog.status === 'unqualified';

        if (currentFilter === 'contacted' && lead.column_type !== 'contacted') return;
        if (currentFilter === 'called' && lead.column_type !== 'called') return;
        if (currentFilter === 'pending' && isDone) return;
        if (currentFilter === 'done' && !isDone) return;

        if (searchQuery) {{
          const blob = `${{lead.name}} ${{lead.phone}} ${{lead.occupation}} ${{lead.reason}} ${{lead.note}} ${{prog.note || ''}}`.toLowerCase();
          if (!blob.includes(searchQuery)) return;
        }}

        const card = createCardElement(lead, prog);
        if (lead.column_type === 'contacted') {{
          listContacted.appendChild(card);
          cntContacted++;
        }} else {{
          listCalled.appendChild(card);
          cntCalled++;
        }}
      }});

      if (cntContacted === 0) {{
        listContacted.innerHTML = '<div class="py-8 text-center text-xs text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">Không có lead nào trong mục này</div>';
      }}
      if (cntCalled === 0) {{
        listCalled.innerHTML = '<div class="py-8 text-center text-xs text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">Không có lead nào trong mục này</div>';
      }}

      updateStats();
    }}

    function createCardElement(lead, prog) {{
      const isDone = prog.status === 'called_ok' || prog.status === 'paid' || prog.status === 'unqualified';
      const div = document.createElement('div');
      div.className = `lead-card bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2.5 ${{isDone ? 'done-card' : ''}}`;
      div.id = `card-${{lead.phone}}`;

      const badgeTime = lead.registration_info?.badge || 'Mới';
      const isHot = lead.registration_info?.is_hot;

      let statusBadgeHtml = '';
      if (prog.status === 'called_ok') {{
        statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">✅ ĐÃ TRAO ĐỔI</span>';
      }} else if (prog.status === 'considering') {{
        statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">🔥 HẸN GỌI LẠI</span>';
      }} else if (prog.status === 'paid') {{
        statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-2xs">💰 ĐÃ CỌC K3</span>';
      }} else if (prog.status === 'missed') {{
        statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">📵 GỌI NHỠ / BẬN</span>';
      }} else if (prog.status === 'unqualified') {{
        statusBadgeHtml = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700">❌ SAI TỆP</span>';
      }}

      const lastCallBadge = lead.recent_snippet ? `
        <div class="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1 flex items-start gap-1.5 leading-snug">
          <span class="shrink-0 mt-0.5">ℹ️</span>
          <span class="font-medium">${{lead.recent_snippet}}</span>
        </div>
      ` : '';

      const originalNoteBadge = lead.note ? `
        <div class="text-[11px] bg-indigo-50/40 border border-indigo-100 text-indigo-900 rounded-xl px-2.5 py-1 leading-snug">
          <b class="text-indigo-950 font-bold">Ghi chú trước:</b> ${{lead.note}}
        </div>
      ` : '';

      const zaloUrl = lead.zalo_app_url || `zalo://conversation?phone=${{lead.phone}}`;
      const escapedScript = (lead.suggested_script || '').replace(/'/g, "\\\\'");

      div.innerHTML = `
        <!-- Dòng 1: Tên, SĐT, Trạng thái -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-black text-sm sm:text-base text-slate-900 leading-tight">${{lead.name}}</h3>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${{isHot ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'}}">
                ${{isHot ? '🔥 ' : '📅 '}}${{badgeTime}}
              </span>
            </div>
            <div class="mt-1 flex items-center gap-1.5">
              <span class="font-mono text-xs font-black text-indigo-600 tracking-wide">${{lead.display_phone || lead.phone}}</span>
              <button onclick="copyToClipboard('${{lead.phone}}', 'Đã copy SĐT ${{lead.phone}}')" class="text-slate-400 hover:text-indigo-600 p-0.5 rounded hover:bg-slate-100 transition" title="Copy số">
                📋
              </button>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            ${{statusBadgeHtml}}
            <span class="text-[10px] font-bold text-slate-400">#${{lead.column_type === 'contacted' ? 'Đã-nhắn' : 'Cân-nhắc'}}</span>
          </div>
        </div>

        <!-- Dòng 2: Nghề nghiệp & Lý do / Nút thắt -->
        <div class="bg-slate-50/80 rounded-xl p-2 border border-slate-100 text-xs space-y-1">
          <div class="flex items-start gap-1.5 text-slate-700">
            <span class="font-bold text-slate-900 shrink-0">💼 Nghề:</span>
            <span>${{lead.occupation || 'Chưa điền'}}</span>
          </div>
          ${{lead.reason && lead.reason !== 'Chưa điền' ? `
            <div class="flex items-start gap-1.5 text-slate-700">
              <span class="font-bold text-indigo-900 shrink-0">🎯 Nút thắt:</span>
              <span class="text-indigo-950 font-medium">${{lead.reason}}</span>
            </div>
          ` : ''}}
        </div>

        <!-- Dòng 3: Snippet tương tác cũ -->
        ${{lastCallBadge}}
        ${{originalNoteBadge}}

        <!-- Dòng 4: BỘ NÚT 1-CHẠM LIÊN HỆ (TO RÕ CHO ĐIỆN THOẠI) -->
        <div class="grid grid-cols-4 gap-1.5 pt-1">
          <a href="tel:${{lead.phone}}" onclick="recordAction('${{lead.phone}}', 'calling')" class="col-span-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 shadow-xs text-center">
            📞 Gọi
          </a>

          <a href="${{zaloUrl}}" target="_blank" onclick="recordAction('${{lead.phone}}', 'zalo')" class="col-span-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 shadow-xs text-center">
            💬 Zalo
          </a>

          <a href="sms:${{lead.phone}}" class="col-span-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 text-center">
            ✉️ SMS
          </a>

          <button onclick="toggleScript('${{lead.phone}}')" class="col-span-1 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-bold text-xs py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 text-center">
            💡 Kịch bản
          </button>
        </div>

        <!-- Khối kịch bản ẩn / hiện -->
        <div id="script-box-${{lead.phone}}" class="hidden bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-amber-900 text-[11px] uppercase tracking-wide">💡 GỢI Ý MỞ LỜI THEO NGHỀ:</span>
            <button onclick="copyToClipboard('${{escapedScript}}', 'Đã copy kịch bản mở lời!')" class="text-[10px] font-bold bg-white text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md hover:bg-amber-100 transition">
              📋 Copy
            </button>
          </div>
          <p class="text-slate-800 italic leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-100 font-normal">
            "${{lead.suggested_script}}"
          </p>
        </div>

        <!-- Dòng 5: CẬP NHẬT KẾT QUẢ CUỘC GỌI CHO SALE -->
        <div class="border-t border-slate-100 pt-2 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider">KẾT QUẢ GỌI:</span>
            <span class="text-[10px] text-slate-400">Bấm để đánh dấu</span>
          </div>

          <div class="grid grid-cols-5 gap-1 text-[11px]">
            <button onclick="setLeadResult('${{lead.phone}}', 'called_ok')" class="py-1 px-0.5 rounded-lg font-bold border transition text-center ${{prog.status === 'called_ok' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}}" title="Đã trao đổi tốt">
              Đã gọi
            </button>
            <button onclick="setLeadResult('${{lead.phone}}', 'considering')" class="py-1 px-0.5 rounded-lg font-bold border transition text-center ${{prog.status === 'considering' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'}}" title="Khách hẹn mai gọi lại">
              Hẹn mai
            </button>
            <button onclick="setLeadResult('${{lead.phone}}', 'paid')" class="py-1 px-0.5 rounded-lg font-bold border transition text-center ${{prog.status === 'paid' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'}}" title="Đã chốt cọc K3">
              + Cọc K3
            </button>
            <button onclick="setLeadResult('${{lead.phone}}', 'missed')" class="py-1 px-0.5 rounded-lg font-bold border transition text-center ${{prog.status === 'missed' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}}" title="Gọi nhỡ hoặc bận">
              Nhỡ / Bận
            </button>
            <button onclick="setLeadResult('${{lead.phone}}', 'unqualified')" class="py-1 px-0.5 rounded-lg font-bold border transition text-center ${{prog.status === 'unqualified' ? 'bg-slate-700 text-white border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-800'}}" title="Sai tệp / không học">
              Sai tệp
            </button>
          </div>

          <!-- Ghi chú nhanh của Sale -->
          <div class="flex items-center gap-1.5">
            <input
              type="text"
              id="note-input-${{lead.phone}}"
              value="${{prog.note || ''}}"
              placeholder="Gõ ghi chú nhanh (VD: Hẹn 20h, đã gửi STK...)"
              class="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              onkeydown="if(event.key==='Enter') saveLeadNote('${{lead.phone}}')"
            >
            <button onclick="saveLeadNote('${{lead.phone}}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition shrink-0">
              Lưu
            </button>
          </div>
        </div>
      `;

      return div;
    }}

    function toggleScript(phone) {{
      const box = document.getElementById(`script-box-${{phone}}`);
      if (box) box.classList.toggle('hidden');
    }}

    function setLeadResult(phone, status) {{
      if (!saleProgress[phone]) saleProgress[phone] = {{}};
      if (saleProgress[phone].status === status) {{
        saleProgress[phone].status = null;
        showToast('↩️ Đã hủy trạng thái');
      }} else {{
        saleProgress[phone].status = status;
        saleProgress[phone].updated_at = new Date().toLocaleTimeString('vi-VN');
        showToast(`Đã lưu: ${{status}}`);
      }}
      saveProgress();
      renderCards();
      syncStatusToServer(phone, status);
    }}

    function saveLeadNote(phone) {{
      const input = document.getElementById(`note-input-${{phone}}`);
      if (!input) return;
      const noteVal = input.value.trim();
      if (!saleProgress[phone]) saleProgress[phone] = {{}};
      saleProgress[phone].note = noteVal;
      saleProgress[phone].note_time = new Date().toLocaleTimeString('vi-VN');
      saveProgress();
      showToast('💾 Đã lưu ghi chú!');
      syncNoteToServer(phone, noteVal);
    }}

    async function syncStatusToServer(phone, status) {{
      try {{
        const lead = INITIAL_LEADS.find(l => l.phone === phone);
        const mapStatus = {{
          'called_ok': 'called',
          'considering': 'considering',
          'paid': 'paid',
          'missed': 'contacted',
          'unqualified': 'unqualified'
        }};
        const targetStatus = mapStatus[status] || 'contacted';
        await fetch('/api/leads/update', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{
            phone: phone,
            status: targetStatus,
            note: saleProgress[phone]?.note ? `[Sale]: ${{saleProgress[phone].note}}` : undefined,
            name: lead ? lead.name : undefined
          }})
        }});
      }} catch (e) {{}}
    }}

    async function syncNoteToServer(phone, note) {{
      try {{
        await fetch('/api/leads/update', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{
            phone: phone,
            note: `[Sale note]: ${{note}}`
          }})
        }});
      }} catch (e) {{}}
    }}

    function recordAction(phone, type) {{
      if (!saleProgress[phone]) saleProgress[phone] = {{}};
      saleProgress[phone].last_action = type;
      saleProgress[phone].last_action_time = new Date().toLocaleTimeString('vi-VN');
      saveProgress();
    }}

    function updateStats() {{
      const total = INITIAL_LEADS.length;
      let done = 0;
      Object.values(saleProgress).forEach(p => {{
        if (p.status === 'called_ok' || p.status === 'paid' || p.status === 'unqualified') {{
          done++;
        }}
      }});
      const pct = Math.round((done / total) * 100);
      const statEl = document.getElementById('progressStat');
      const barEl = document.getElementById('progressBar');
      if (statEl) statEl.innerText = `${{done}} / ${{total}} (${{pct}}%)`;
      if (barEl) barEl.style.width = `${{pct}}%`;
    }}

    function setFilter(filter) {{
      currentFilter = filter;
      document.querySelectorAll('.filter-chip').forEach(btn => {{
        btn.className = 'filter-chip px-3 py-1 rounded-lg text-xs font-semibold transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shrink-0';
      }});
      const activeBtn = document.getElementById(`filter-btn-${{filter}}`);
      if (activeBtn) {{
        activeBtn.className = 'filter-chip px-3 py-1 rounded-lg text-xs font-bold transition bg-indigo-600 text-white shadow-2xs shrink-0';
      }}
      renderCards();
    }}

    function handleSearch(val) {{
      searchQuery = (val || '').toLowerCase().trim();
      renderCards();
    }}

    function switchMobileTab(tab) {{
      currentMobileTab = tab;
      const colContacted = document.getElementById('col-contacted-wrapper');
      const colCalled = document.getElementById('col-called-wrapper');
      const btnContacted = document.getElementById('tab-btn-contacted');
      const btnCalled = document.getElementById('tab-btn-called');

      if (tab === 'contacted') {{
        colContacted.classList.remove('hidden');
        colCalled.classList.add('hidden');
        btnContacted.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-xs';
        btnCalled.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-white text-slate-600 border border-slate-200';
      }} else {{
        colContacted.classList.add('hidden');
        colCalled.classList.remove('hidden');
        btnCalled.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-indigo-50 text-indigo-900 border-2 border-indigo-300 shadow-xs';
        btnContacted.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bg-white text-slate-600 border border-slate-200';
      }}
    }}

    function copyToClipboard(text, msg) {{
      if (navigator.clipboard) {{
        navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => manualCopy(text, msg));
      }} else {{
        manualCopy(text, msg);
      }}
    }}

    function manualCopy(text, msg) {{
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(msg);
    }}

    function showToast(msg) {{
      const t = document.getElementById('toast');
      const m = document.getElementById('toast-message');
      if (t && m) {{
        m.innerText = msg;
        t.classList.remove('translate-y-12', 'opacity-0');
        t.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => {{
          t.classList.add('translate-y-12', 'opacity-0');
          t.classList.remove('translate-y-0', 'opacity-100');
        }}, 2200);
      }}
    }}

    function exportNotesSummary() {{
      let text = `📋 BÁO CÁO GỌI LEAD OFFLINE (${{new Date().toLocaleString('vi-VN')}})\\n\\n`;
      let count = 0;
      INITIAL_LEADS.forEach((l, idx) => {{
        const p = saleProgress[l.phone] || {{}};
        if (p.status || p.note) {{
          count++;
          text += `${{count}}. ${{l.name}} (${{l.phone}}) - ${{l.occupation || 'Nghề tự do'}}\\n`;
          text += `   Trạng thái: ${{p.status || 'Chưa đánh dấu'}}\\n`;
          if (p.note) text += `   Note: ${{p.note}}\\n`;
          text += `\\n`;
        }}
      }});
      if (count === 0) {{
        alert('Chưa có cuộc gọi nào được ghi nhận hoặc lưu ghi chú!');
        return;
      }}
      copyToClipboard(text, `Đã copy báo cáo ${{count}} cuộc gọi vào bộ nhớ tạm!`);
    }}

    function checkViewport() {{
      if (window.innerWidth < 768) {{
        switchMobileTab(currentMobileTab);
      }} else {{
        document.getElementById('col-contacted-wrapper').classList.remove('hidden');
        document.getElementById('col-called-wrapper').classList.remove('hidden');
      }}
    }}

    window.addEventListener('resize', checkViewport);

    document.addEventListener('DOMContentLoaded', () => {{
      checkViewport();
      renderCards();
    }});
  </script>
</body>
</html>
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅ Đã xuất HTML thành công: {output_path} ({len(all_target_leads)} leads)")

if __name__ == "__main__":
    contacted, called = get_2_columns_leads()
    print(f"📊 Đã lấy: {len(contacted)} Đã nhắn | {len(called)} Đã trao đổi/cân nhắc")
    out_file = os.path.join(DIR, "sale_call_list.html")
    generate_sale_html(contacted, called, out_file)
