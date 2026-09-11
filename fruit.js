(() => {
  'use strict';

  // Chặn các phím tắt mở DevTools / View Source ở mức trình duyệt.
  // Đây chỉ là lớp hạn chế phía giao diện, không phải cơ chế bảo mật tuyệt đối.
  document.addEventListener('contextmenu', e => e.preventDefault(), true);
  document.addEventListener('keydown', e => {
    const k = String(e.key || '').toLowerCase();
    const blocked = k === 'f12' ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
      (e.ctrlKey && k === 'u') ||
      (e.metaKey && e.altKey && ['i', 'j', 'c'].includes(k));
    if (blocked) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  const ORIGIN = 'https://games.shopee.vn';
  if (location.origin !== ORIGIN || !location.pathname.startsWith('/farm/')) {
    alert(`Hãy mở ${ORIGIN}/farm/ rồi chạy lại.`);
    return;
  }
  if (document.getElementById('sf_panel')) {
    alert('Đang có bảng Farm cũ. Tải lại trang rồi chạy bản mới để thay cả giao diện và logic.');
    return;
  }

  let cropMetas = [];
  const SETTINGS_KEY = 'endy_farm_helper_3_9_settings';
  const GET_RETRIES = 2;

  const panel = document.createElement('div');
  panel.id = 'sf_panel';
  panel.innerHTML = `
<style>
#sf_panel{all:initial;position:fixed;top:50%;left:50%;right:auto;bottom:auto;transform:translate(-50%,-50%);z-index:2147483647;display:block;width:680px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;background:#141518;color:#e6e6e8;border:1px solid #303136;border-radius:12px;box-shadow:0 24px 80px #0008;font:13px/1.5 Segoe UI,Arial,sans-serif;color-scheme:dark}
#sf_panel *{box-sizing:border-box}
#sf_panel header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid #2b2c31;background:#191a1e}
#sf_panel h2{font-size:25px;font-weight:650;color:#f3f3f4;letter-spacing:-.7px;margin:2px 0 0}
#sf_panel small{color:#9798a1;font-size:11px}
#sf_panel header small{font-size:10px;letter-spacing:2px}
#sf_panel .sf_head_left{display:flex;flex-direction:column;gap:2px;min-width:0}
#sf_panel .sf_account{display:flex;align-items:center;gap:8px;margin-top:7px;flex-wrap:wrap}
#sf_panel .sf_user{font-size:12px;font-weight:750;color:#f0eefc;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#sf_panel .sf_coin{font-size:13px;font-weight:850;color:#ffe59b;background:#302916;border:1px solid #66552a;border-radius:999px;padding:3px 9px;letter-spacing:.1px}
#sf_panel button,#sf_panel input,#sf_panel select{font:inherit;background:#202126;border:1px solid #37383e;color:#e4e4e8;border-radius:7px;padding:9px 11px}
#sf_panel button{cursor:pointer;font-weight:600}
#sf_panel button:hover{background:#2d2e35;border-color:#5b5b69}
#sf_panel button:disabled{opacity:.45;cursor:wait}
#sf_panel input:focus,#sf_panel select:focus,#sf_panel button:focus-visible{outline:2px solid #aaa5e7;outline-offset:2px}
#sf_panel select,#sf_panel input[type=number]{width:100%}
#sf_panel input[type=checkbox]{accent-color:#b5aafa}
#sf_panel label{display:block;color:#aaaab3;font-size:12px;margin-bottom:6px}
#sf_panel .sf_crop_head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px}
#sf_panel .sf_crop_head label{margin:0;min-width:0}
#sf_panel #sf_crop_load{padding:5px 10px;font-size:11px;white-space:nowrap}
#sf_panel .sf_crop_status{display:inline-flex;align-items:center;justify-content:center;min-width:74px;padding:3px 8px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.7px;border:1px solid #4b4d55;background:#24252b;color:#d7d8df;margin-left:7px;vertical-align:1px}
#sf_panel .sf_crop_status.live{background:#163525;border-color:#2f8f57;color:#bff5cf;box-shadow:0 0 0 1px #2f8f5722,0 0 14px #2f8f5725}
#sf_panel .sf_crop_status.schedule{background:#3b3217;border-color:#9b8130;color:#ffe7a2;box-shadow:0 0 14px #b28f2722}
#sf_panel .sf_crop_status.restock{background:#3a2818;border-color:#a6652e;color:#ffd0a0;box-shadow:0 0 14px #ba6b2b22}
#sf_panel .sf_crop_status.ended{background:#3a2023;border-color:#8e454c;color:#ffb9bd}
#sf_panel .sf_crop_status.unknown{background:#292a30;border-color:#555761;color:#c3c5cd}
#sf_panel .sf_head_actions{display:flex;gap:8px;align-items:center}
#sf_panel #sf_help_btn{width:34px;height:34px;padding:0;border-radius:50%;font:bold 16px Georgia,serif;color:#d8d1ff}
#sf_panel #sf_pip{min-width:44px;height:34px;padding:0 9px;color:#c8e7ff;background:#1d2b36;border-color:#355267}
#sf_panel #sf_close{color:#b8b8c2;background:transparent}
#sf_panel.sf_in_pip{top:0;left:0;right:auto;bottom:auto;transform:none;width:100%;max-width:none;height:100%;max-height:100%;border:0;border-radius:0;box-shadow:none}
#sf_panel.sf_mini{top:auto;left:auto;right:12px;bottom:12px;transform:none;width:min(340px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:none;overflow:hidden;border-radius:12px}
#sf_panel.sf_mini #sf_help,#sf_panel.sf_mini .sf_tabs,#sf_panel.sf_mini .sf_tab,#sf_panel.sf_mini .sf_log_section,#sf_panel.sf_mini .sf_contact{display:none!important}
#sf_panel.sf_mini header{border-bottom:0;padding:12px 14px}
#sf_panel.sf_mini h2{font-size:18px}
#sf_panel.sf_mini header small{font-size:9px}
#sf_panel.sf_mini .sf_user{max-width:155px}
#sf_panel #sf_help{display:none;padding:14px 24px;background:#1d1e23;border-bottom:1px solid #303136;color:#d0d0d7;font-size:12px;line-height:1.7}
#sf_panel #sf_help.show{display:block}
#sf_panel #sf_help b{color:#e9e6ff}
#sf_panel .sf_tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px 24px;border-bottom:1px solid #292a2f;background:#111215}
#sf_panel .sf_tab_btn.active{background:#c1b6fa;border-color:#c1b6fa;color:#211c35}
#sf_panel .sf_tab{display:none;padding:18px 24px;border-bottom:1px solid #292a2f}
#sf_panel .sf_tab.active{display:block}
#sf_panel #sf_info{border-left:3px solid #b5aafa;background:#202025;color:#d5d1ec;padding:12px 14px;margin-bottom:14px;font-size:13px}
#sf_panel .sf_actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
#sf_panel #sf_farm_actions{grid-template-columns:repeat(2,1fr);margin-top:16px}
#sf_panel #sf_farm_actions [data-action=auto]{grid-column:1/-1;background:#c1b6fa;border-color:#c1b6fa;color:#211c35;font-size:13px;padding:13px}
#sf_panel #sf_farm_actions [data-action=auto]:hover{background:#d1c9ff}
#sf_panel .sf_grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
#sf_panel .sf_space{margin-top:14px}
#sf_panel .sf_check{display:flex;align-items:center;gap:8px;margin:15px 0;color:#d0d0d7}
#sf_panel .sf_check input{width:auto}
#sf_panel #sf_lists{margin-top:14px;max-height:240px;overflow:auto;border-top:1px solid #2d2e34}
#sf_panel #sf_lists:empty{display:none}
#sf_panel #sf_lists>div{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 2px;border-bottom:1px solid #2d2e34}
#sf_panel #sf_lists .sf_item_text{min-width:0;overflow-wrap:anywhere}
#sf_panel #sf_lists button{flex:0 0 auto;padding:6px 10px}
#sf_panel .sf_log_section{padding:16px 24px 18px}
#sf_panel .sf_footer{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
#sf_panel .sf_footer label{font-size:10px;letter-spacing:1.5px;margin:0}
#sf_panel #sf_stop{color:#ffb0aa;background:transparent;border-color:#78484d}
#sf_panel #sf_log{height:190px;overflow:auto;background:#0d0e11;border:1px solid #292a30;border-radius:7px;padding:10px 12px;font:13px/1.65 Consolas,monospace;color:#c0c4cf}
#sf_panel .sf_logline{white-space:pre-wrap;overflow-wrap:anywhere;padding:1px 0}
#sf_panel .sf_logline.prize{font-size:16px;line-height:1.5;font-weight:800;color:#fff1a8;padding:5px 0}
#sf_panel .sf_logline.summary{font-size:14px;font-weight:750;color:#ded9ff;padding:2px 0}
#sf_panel .sf_logline.warn{font-weight:700;color:#ffb4ad}
#sf_panel .sf_logline.water{color:#c9e6ff}
#sf_panel .sf_logline.bonus{font-weight:800;color:#bff7c8}
#sf_panel .sf_logline.buy{color:#ffd3a8}
#sf_panel .sf_logline.harvest{color:#e0ccff}
#sf_panel .sf_logline.info{color:#c7cad4}
#sf_panel .sf_logline.friend{color:#bfe9ff}
#sf_panel .sf_friend_box{border:1px solid #30323a;background:#18191e;border-radius:9px;padding:13px;margin-bottom:14px}
#sf_panel .sf_friend_info{font-size:13px;color:#dddff0;line-height:1.65}
#sf_panel .sf_friend_info b{color:#fff}
#sf_panel .sf_friend_actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
#sf_panel .sf_friend_actions [data-action=friendHelp]{background:#213a2c;border-color:#3b7655;color:#c8f5d8}
#sf_panel .sf_friend_hint{margin-top:7px;color:#888b96;font-size:11px}
#sf_panel .sf_contact{display:flex;justify-content:space-between;padding:12px 24px;color:#777985;font-size:11px;background:#111215}
#sf_panel .sf_contact a{color:#c1b6fa;text-decoration:none;font-weight:650}
@media(max-width:560px){#sf_panel{top:50%;left:50%;right:auto;bottom:auto;transform:translate(-50%,-50%);width:calc(100vw - 12px);max-width:none;max-height:calc(100dvh - 12px);border-radius:10px}#sf_panel header{padding:13px 14px}#sf_panel h2{font-size:21px}#sf_panel .sf_head_actions{gap:5px}#sf_panel #sf_help_btn{width:32px;height:32px}#sf_panel #sf_pip{height:32px;min-width:40px;padding:0 7px}#sf_panel #sf_close{height:32px;padding:0 8px}#sf_panel .sf_tabs{display:flex;gap:6px;overflow-x:auto;padding:9px 12px;scrollbar-width:none}#sf_panel .sf_tabs::-webkit-scrollbar{display:none}#sf_panel .sf_tab_btn{flex:0 0 auto;min-width:155px;padding:8px 10px}#sf_panel .sf_actions,#sf_panel #sf_farm_actions{grid-template-columns:repeat(2,minmax(0,1fr))}#sf_panel .sf_grid{grid-template-columns:1fr;gap:10px}#sf_panel .sf_tab,#sf_panel .sf_log_section,#sf_panel #sf_help{padding-left:14px;padding-right:14px}#sf_panel .sf_tab{padding-top:14px;padding-bottom:14px}#sf_panel #sf_log{height:150px;font-size:12px}#sf_panel .sf_contact{padding:10px 14px;gap:8px;flex-wrap:wrap}#sf_panel button{touch-action:manipulation}#sf_panel.sf_in_pip{top:0;left:0;transform:none;width:100%;height:100%;max-height:100%;border-radius:0}#sf_panel.sf_mini{top:auto;left:auto;right:max(6px,env(safe-area-inset-right));bottom:max(6px,env(safe-area-inset-bottom));transform:none;width:calc(100vw - 12px);max-width:360px}}
@media(max-width:380px){#sf_panel .sf_actions,#sf_panel #sf_farm_actions,#sf_panel .sf_friend_actions{grid-template-columns:1fr}#sf_panel #sf_farm_actions [data-action=auto]{grid-column:auto}#sf_panel .sf_user{max-width:130px}#sf_panel .sf_coin{font-size:11px;padding:3px 7px}}
</style>
<header>
  <div class="sf_head_left"><small>ENDY / FARM HELPER 3.35</small><h2>Nông trại</h2><div class="sf_account"><span id="sf_username" class="sf_user">User: ...</span><span id="sf_header_coins" class="sf_coin">Xu: ...</span></div></div>
  <div class="sf_head_actions"><button id="sf_help_btn" title="Hướng dẫn sử dụng">i</button><button id="sf_pip" title="Mở Picture-in-Picture">PiP</button><button id="sf_close">Đóng</button></div>
</header>
<div id="sf_help">
  <b>AutoWater:</b> tự tưới cây đang có tới khi đủ điều kiện chín, không tự thu hoạch.<br>
  <b>AutoFarm:</b> tự thu hoạch cây hiện có khi đã chín, không trồng cây mới.<br>
  <b>Auto:</b> tự Trồng → Tưới → Thu hoạch theo số cây đã chọn.<br>
  <b>Tự mua nước:</b> nếu túi không đủ, tool sẽ tự cân đối theo ngân sách và lượng nước cần dùng.<br>
  <b>Scheduled / Restock:</b> khi cây chưa mở bán, tool sẽ chờ đến thời điểm có thể trồng; có thể bấm <b>Dừng</b> để hủy.<br>
  <b>Làm mới:</b> cập nhật lại thông tin cây, túi nước và cửa hàng. Các lựa chọn trước đó được ghi nhớ trên trình duyệt.<br>
  <b>Bạn bè:</b> dán link chia sẻ hoặc mã chia sẻ của khu vườn bạn bè rồi bấm <b>Load bạn</b> để xem và tưới.<br>
  <b>PiP:</b> Chrome desktop hỗ trợ sẽ mở Farm Helper trong cửa sổ nổi. Trình duyệt không hỗ trợ sẽ dùng chế độ mini.<br>
  <b>Thời gian sử dụng:</b> chỉ hoạt động từ <b>18:00 11/09/2026</b> đến <b>02:00 12/09/2026</b>. Ngoài thời gian này tool sẽ bị khóa.
</div>
<div class="sf_tabs">
  <button class="sf_tab_btn active" data-tab="overview">Trạng thái · Shop · Túi nước</button>
  <button class="sf_tab_btn" data-tab="farm">Trồng · Thu hoạch · Auto</button>
  <button class="sf_tab_btn" data-tab="friend">Bạn bè</button>
</div>
<section class="sf_tab active" data-page="overview">
  <div id="sf_info">Sẵn sàng. Bấm Trạng thái để đọc cây hiện tại.</div>
  <div class="sf_actions" id="sf_overview_actions">
    <button class="sf_action" data-action="status">Trạng thái</button>
    <button class="sf_action" data-action="shop">Shop</button>
    <button class="sf_action" data-action="bag">Túi nước</button>
    <button class="sf_action" data-action="refresh">Làm mới</button>
  </div>
  <div id="sf_lists"></div>
</section>
<section class="sf_tab" data-page="farm">
  <div><div class="sf_crop_head"><label for="sf_crop">Cây muốn trồng <small id="sf_crop_source">· đang tải từ server...</small><span id="sf_crop_status" class="sf_crop_status unknown">...</span></label><button id="sf_crop_load" class="sf_action" data-action="cropLoad" title="Tải lại danh sách cây từ server">Load</button></div><select id="sf_crop"><option value="">Đang tải danh sách cây...</option></select></div>
  <div class="sf_grid sf_space">
    <div><label for="sf_meta">Meta ID tùy chỉnh</label><input id="sf_meta" type="number" min="1" placeholder="Dùng cây đã chọn"></div>
    <div><label for="sf_cycles">Số cây Auto</label><input id="sf_cycles" type="number" min="1" max="100" value="1"></div>
  </div>
  <label class="sf_check"><input id="sf_buy" type="checkbox">Tự mua nước khi túi không đủ</label>
  <div class="sf_grid">
    <div><label for="sf_budget">Ngân sách nước (xu)</label><input id="sf_budget" type="number" min="0" value="0"></div>
    <div><label for="sf_delay">Độ trễ kiểm tra lại (ms)</label><input id="sf_delay" type="number" min="0" max="3000" step="25" value="75"></div>
  </div>
  <div class="sf_space"><small>Không còn nút “Tưới 1 bình”. AutoWater tự chọn bình và kiểm tra lại cây sau từng lần tưới.</small></div>
  <div class="sf_actions" id="sf_farm_actions">
    <button class="sf_action" data-action="plant">Trồng cây</button>
    <button class="sf_action" data-action="harvest">Thu hoạch</button>
    <button class="sf_action" data-action="autowater">AutoWater</button>
    <button class="sf_action" data-action="autofarm">AutoFarm</button>
    <button class="sf_action" data-action="auto">Auto · Trồng - Tưới - Thu hoạch</button>
  </div>
</section>

<section class="sf_tab" data-page="friend">
  <div class="sf_friend_box">
    <label for="sf_friend_link">Link bạn bè / Share key</label>
    <input id="sf_friend_link" type="text" placeholder="https://shp.ee/... hoặc https://games.shopee.vn/farm/share.html?skey=...">
    <div id="sf_friend_info" class="sf_friend_info sf_space">Chưa tải bạn bè.</div>
    <div class="sf_friend_actions">
      <button class="sf_action" data-action="friendLoad">Load bạn</button>
      <button class="sf_action" data-action="friendHelp">Tưới bạn</button>
    </div>
    <div class="sf_friend_hint">Trước khi tưới, tool luôn đọc lại context bạn bè để lấy cropId mới nhất.</div>
  </div>
</section>
<section class="sf_log_section">
  <div class="sf_footer"><label>NHẬT KÝ</label><div><button id="sf_clear">Xóa log</button> <button id="sf_stop">Dừng</button></div></div>
  <div id="sf_log"></div>
</section>
<footer class="sf_contact"><span>Contact: <a href="https://t.me/endydzkk" target="_blank" rel="noopener noreferrer">Endy</a></span><span>Farm Helper 3.33</span></footer>`;
  document.body.appendChild(panel);

  try {
    const savedLogs = JSON.parse(sessionStorage.getItem('sf_pip_logs') || '[]');
    const logBox = panel.querySelector('#sf_log');
    if (logBox && Array.isArray(savedLogs)) {
      for (const item of savedLogs.slice(-350)) {
        const line = document.createElement('div');
        line.className = item?.cls || 'sf_logline';
        line.textContent = String(item?.text || '');
        logBox.appendChild(line);
      }
      logBox.scrollTop = logBox.scrollHeight;
    }
  } catch {}

  const q = selector => panel.querySelector(selector);
  const qa = selector => [...panel.querySelectorAll(selector)];
  const plainText = value => String(value ?? '').replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u20E3]/gu, '').trim();

  const homeParent = document.body;
  let pipWindow = null;
  let toolClosing = false;

  // Background keepalive:
  // An inaudible audio oscillator keeps an active media clock while the tab is
  // backgrounded. It is only started after a user gesture (PiP button) and is
  // stopped when PiP is closed. This helps reduce background timer throttling;
  // it cannot override browser tab-discard/reload policies.
  let pipKeepAliveAudio = null;

  function startPipKeepAlive() {
    if (pipKeepAliveAudio) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.00001;
      osc.frequency.value = 20;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      pipKeepAliveAudio = { ctx, osc, gain };
      void ctx.resume().catch(() => {});
    } catch {}
  }

  function stopPipKeepAlive() {
    const a = pipKeepAliveAudio;
    pipKeepAliveAudio = null;
    if (!a) return;
    try { a.osc.stop(); } catch {}
    try { a.osc.disconnect(); } catch {}
    try { a.gain.disconnect(); } catch {}
    try { void a.ctx.close(); } catch {}
  }

  function ensurePipLogVisible() {
    const box = panel.querySelector('#sf_log');
    if (box) {
      box.style.display = 'block';
      box.style.visibility = 'visible';
    }
  }

  function updatePipButton() {
    const button = q('#sf_pip');
    if (!button) return;
    if (pipWindow && !pipWindow.closed) {
      button.textContent = 'Thoát';
      button.title = 'Thoát Picture-in-Picture';
    } else if (panel.classList.contains('sf_mini')) {
      button.textContent = 'Mở';
      button.title = 'Mở lại bảng đầy đủ';
    } else {
      button.textContent = 'PiP';
      button.title = 'Mở Picture-in-Picture';
    }
  }

  function restorePanelHome({ closePip = false } = {}) {
    const currentPip = pipWindow;
    pipWindow = null;
    panel.classList.remove('sf_in_pip');
    if (!toolClosing && panel.ownerDocument !== document) homeParent.appendChild(panel);
    if (closePip && currentPip && !currentPip.closed) {
      try { currentPip.close(); } catch {}
    }
    if (!pipWindow) stopPipKeepAlive();
    updatePipButton();
  }

  function isAndroidPipSupported() {
    const ua = navigator.userAgent || '';
    return /Android/i.test(ua) && !!HTMLVideoElement.prototype.requestPictureInPicture;
  }

  let androidPip = null;

  function drawAndroidPipCanvas() {
    if (!androidPip?.canvas || !androidPip.ctx) return;
    const c = androidPip.canvas;
    const ctx = androidPip.ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 720;
    const h = 480;
    if (c.width !== w * dpr || c.height !== h * dpr) {
      c.width = w * dpr;
      c.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#111216';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px Arial';
    ctx.fillText('Shopee Farm Helper', 18, 32);
    ctx.font = '13px Consolas, monospace';
    const box = panel.querySelector('#sf_log');
    const lines = box ? [...box.querySelectorAll('.sf_logline')].slice(-22) : [];
    let y = 58;
    for (const el of lines) {
      let text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length > 105) text = text.slice(0, 102) + '...';
      ctx.fillStyle = '#d5d8e0';
      ctx.fillText(text, 18, y);
      y += 18;
      if (y > h - 12) break;
    }
    if (!lines.length) {
      ctx.fillStyle = '#9da3b0';
      ctx.fillText('Đang chờ log...', 18, y);
    }
  }

  async function closeAndroidPip() {
    const state = androidPip;
    androidPip = null;
    if (!state) return;
    try { if (state.video?.disablePictureInPicture !== undefined) state.video.disablePictureInPicture = true; } catch {}
    try { if (document.pictureInPictureElement === state.video) await document.exitPictureInPicture(); } catch {}
    try { state.video.pause(); } catch {}
    try { state.stream?.getTracks().forEach(t => t.stop()); } catch {}
    try { state.video.remove(); } catch {}
    if (state.observer) state.observer.disconnect();
    stopPipKeepAlive();
    updatePipButton();
  }

  async function toggleAndroidPip() {
    if (androidPip) {
      await closeAndroidPip();
      return true;
    }
    if (!isAndroidPipSupported()) return false;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !canvas.captureStream) return false;
    canvas.width = 720;
    canvas.height = 480;
    const stream = canvas.captureStream(5);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.disablePictureInPicture = false;
    video.srcObject = stream;
    video.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:2px;height:2px;opacity:0;pointer-events:none;';
    document.documentElement.appendChild(video);
    androidPip = { canvas, ctx, stream, video, observer: null };
    const observer = new MutationObserver(() => drawAndroidPipCanvas());
    const box = panel.querySelector('#sf_log');
    if (box) observer.observe(box, { childList: true, subtree: true, characterData: true });
    androidPip.observer = observer;
    drawAndroidPipCanvas();
    try {
      await video.play();
      await video.requestPictureInPicture();
      startPipKeepAlive();
      video.addEventListener('leavepictureinpicture', () => { void closeAndroidPip(); }, { once: true });
      updatePipButton();
      return true;
    } catch (error) {
      await closeAndroidPip();
      log(`PiP Android không khả dụng: ${error?.message || error}`, 'warn');
      return true;
    }
  }

  async function togglePip() {
    // Android Chrome không hỗ trợ Document Picture-in-Picture như desktop.
    // Dùng Video Picture-in-Picture để tạo cửa sổ nổi thật và render log lên canvas.
    if (isAndroidPipSupported()) {
      const handled = await toggleAndroidPip();
      if (handled) return;
    }
    if (pipWindow && !pipWindow.closed) {
      restorePanelHome({ closePip: true });
      return;
    }

    if (panel.classList.contains('sf_mini')) {
      panel.classList.remove('sf_mini');
      updatePipButton();
      return;
    }

    const docPip = window.documentPictureInPicture;
    if (!docPip || typeof docPip.requestWindow !== 'function') {
      panel.classList.add('sf_mini');
      updatePipButton();
      return;
    }

    try {
      const win = await docPip.requestWindow({ width: 680, height: 760 });
      pipWindow = win;
      startPipKeepAlive();
      const meta = win.document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width,initial-scale=1,viewport-fit=cover';
      win.document.head.appendChild(meta);
      Object.assign(win.document.documentElement.style, { width: '100%', height: '100%', background: '#141518' });
      Object.assign(win.document.body.style, { margin: '0', width: '100%', height: '100%', overflow: 'hidden', background: '#141518' });
      panel.classList.remove('sf_mini');
      panel.classList.add('sf_in_pip');
      win.document.body.appendChild(panel);
      ensurePipLogVisible();

      // Keep PiP UI/log state synchronized after DOM moves.
      const pipLog = panel.querySelector('#sf_log');
      if (pipLog) pipLog.scrollTop = pipLog.scrollHeight;

      win.addEventListener('pagehide', () => {
        if (pipWindow === win) restorePanelHome();
      }, { once: true });

      win.addEventListener('beforeunload', () => {
        if (pipWindow === win) {
          pipWindow = null;
          stopPipKeepAlive();
        }
      }, { once: true });

      updatePipButton();
    } catch (error) {
      stopPipKeepAlive();
      panel.classList.add('sf_mini');
      updatePipButton();
      log(`PiP không khả dụng: ${error?.message || error}. Đã chuyển sang chế độ mini.`, 'info');
    }
  }

  function cookieValue(name) {
    const prefix = `${name}=`;
    const raw = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(prefix));
    if (!raw) return '';
    try { return decodeURIComponent(raw.slice(prefix.length)); } catch { return raw.slice(prefix.length); }
  }

  function updateHeaderIdentity(user) {
    const serverName = plainText(user?.name || user?.contactName || '');
    const serverId = Number(user?.id);
    const fallback = plainText(cookieValue('username') || cookieValue('userid') || 'Shopee');
    const username = serverName || (Number.isSafeInteger(serverId) && serverId > 0 ? String(serverId) : fallback);
    q('#sf_username').textContent = username ? `User: ${username}` : 'User: Shopee';
  }

  function updateHeaderCoins(value) {
    const coins = Number(value);
    q('#sf_header_coins').textContent = Number.isFinite(coins) ? `Xu: ${coins.toLocaleString('vi-VN')}` : 'Xu: ...';
  }

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; }
    catch { return {}; }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        cropId: Number(q('#sf_crop').value || 0),
        metaId: q('#sf_meta').value || '',
        cycles: q('#sf_cycles').value || '1',
        buy: q('#sf_buy').checked,
        budget: q('#sf_budget').value || '0',
        delay: q('#sf_delay').value || '75',
        tab: q('.sf_tab_btn.active')?.dataset?.tab || 'overview',
        friendLink: q('#sf_friend_link')?.value || ''
      }));
    } catch {}
  }

  const savedSettings = loadSettings();
  if (savedSettings.metaId !== undefined) q('#sf_meta').value = savedSettings.metaId;
  if (savedSettings.cycles !== undefined) q('#sf_cycles').value = savedSettings.cycles;
  if (savedSettings.buy !== undefined) q('#sf_buy').checked = !!savedSettings.buy;
  if (savedSettings.budget !== undefined) q('#sf_budget').value = savedSettings.budget;
  if (savedSettings.delay !== undefined) q('#sf_delay').value = savedSettings.delay;
  if (savedSettings.friendLink !== undefined) q('#sf_friend_link').value = savedSettings.friendLink;

  function log(message, type = '') {
    const now = new Date();
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
    const line = document.createElement('div');
    line.className = `sf_logline${type ? ` ${type}` : ''}`;
    line.textContent = `[${time}] ${plainText(message)}`;
    const box = q('#sf_log');
    box.appendChild(line);
    while (box.children.length > 350) box.firstElementChild.remove();
    box.scrollTop = box.scrollHeight;
    try {
      sessionStorage.setItem('sf_pip_logs', JSON.stringify(
        [...box.children].slice(-350).map(el => ({ text: el.textContent, cls: el.className }))
      ));
    } catch {}
    return line;
  }

  function logUpdate(key, message, type = 'info') {
    const box = q('#sf_log');
    let line = [...box.children].find(el => el.dataset.sfScanKey === key);
    const now = new Date();
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
    if (!line) {
      line = document.createElement('div');
      line.className = `sf_logline${type ? ` ${type}` : ''}`;
      line.dataset.sfScanKey = key;
      box.appendChild(line);
    }
    line.textContent = `[${time}] ${plainText(message)}`;
    box.scrollTop = box.scrollHeight;
    try {
      sessionStorage.setItem('sf_pip_logs', JSON.stringify(
        [...box.children].slice(-350).map(el => ({ text: el.textContent, cls: el.className }))
      ));
    } catch {}
    return line;
  }

  function switchTab(name) {
    qa('.sf_tab_btn').forEach(button => button.classList.toggle('active', button.dataset.tab === name));
    qa('.sf_tab').forEach(page => page.classList.toggle('active', page.dataset.page === name));
  }

  qa('.sf_tab_btn').forEach(button => button.onclick = () => { switchTab(button.dataset.tab); saveSettings(); if (button.dataset.tab === 'farm' && !active) void warmCropMetas(); });
  ['#sf_crop','#sf_meta','#sf_cycles','#sf_buy','#sf_budget','#sf_delay','#sf_friend_link'].forEach(selector => q(selector).addEventListener('change', () => { saveSettings(); if (selector === '#sf_crop') updateSelectedCropStatus(); }));
  if (['farm','overview','friend'].includes(savedSettings.tab)) switchTab(savedSettings.tab);
  q('#sf_help_btn').onclick = () => q('#sf_help').classList.toggle('show');
  q('#sf_pip').onclick = () => { void togglePip(); };
  document.addEventListener('visibilitychange', () => {
    // Do not restore/close PiP just because the source tab became hidden.
    if (document.visibilityState === 'hidden' && pipWindow && !pipWindow.closed) {
      ensurePipLogVisible();
    }
  });
  updatePipButton();

  // Kiểm tra tab đang ở trạng thái có thể thao tác.
  // Khi đã mở Document PiP thì cho phép chạy dù tab gốc chuyển nền.
  function assertUseWindow() {
    if (pipWindow && !pipWindow.closed) return;
    if (document.visibilityState !== 'visible') {
      throw new Error('Hãy mở lại tab Farm hoặc mở PiP trước khi chạy.');
    }
  }

  let active = null;
  let friendState = null;

  function newRun() {
    return {
      stopped: false,
      metaId: Number(q('#sf_meta').value || q('#sf_crop').value || 0),
      cropMeta: null,
      buy: q('#sf_buy').checked,
      budget: Number(q('#sf_budget').value),
      cycles: Number(q('#sf_cycles').value),
      delay: Number(q('#sf_delay').value),
      spent: 0,
      bag: null,
      shop: null,
      bottles: 0,
      waterBase: 0,
      waterEffective: 0,
      bonusWater: 0,
      bottleStats: new Map(),
      prizes: new Map(),
      pendingRewards: [],
      harvested: 0,
      planted: 0,
      summaryShown: false,
      postLocks: new Set(),
      friendHelpCount: 0
    };
  }

  function check(run) {
    if (run.stopped) throw new Error('Đã dừng.');
    if (!run.allowOutsideWindow) assertUseWindow();
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function pause(run, ms = run.delay) {
    if (ms > 0) await sleep(ms);
    check(run);
  }

  async function api(run, endpoint, payload) {
    check(run);
    const isGet = payload === undefined;
    if (!isGet) assertUseWindow();
    const postKey = isGet ? '' : `${endpoint}:${JSON.stringify(payload)}`;
    if (!isGet) {
      run.postLocks ||= new Set();
      if (run.postLocks.has(postKey)) throw new Error(`Đang gửi thao tác ${endpoint}; đã chặn request trùng.`);
      run.postLocks.add(postKey);
    }

    const attempts = isGet ? GET_RETRIES + 1 : 1;
    let lastError;
    try {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        check(run);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const response = await fetch(`${ORIGIN}/farm/api${endpoint}`, {
            method: isGet ? 'GET' : 'POST',
            credentials: 'include',
            redirect: 'error',
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'game-entrance': 'normal',
              'games-runtime': 'EgretH5',
              'fruit-version-type': 'h5',
              'game-operation-source': endpoint.includes('/iframe/') ? 'fruit_iframe' : 'fruit_farm',
              ...(endpoint.includes('/iframe/') ? {
                'game-iframe-type': 'no_tree',
                'user-source': 'dailycheckin_iframe',
                'fruit-app-version': '0',
                'games-app-version': '0',
                'games-biz-version': '9.7.1'
              } : {})
            },
            ...(isGet ? {} : { body: JSON.stringify(payload) })
          });
          const text = await response.text();
          if (!response.ok) {
            const err = new Error(`HTTP ${response.status}`);
            err.transient = isGet && (response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500);
            throw err;
          }
          let result;
          try { result = JSON.parse(text); }
          catch {
            const err = new Error('Máy chủ trả về dữ liệu không phải JSON.');
            err.transient = isGet;
            throw err;
          }
          if (result.code !== 0) {
            const err = new Error(`${result.msg || 'Thao tác thất bại'} (${result.code})`);
            err.apiCode = Number(result.code);
            err.apiMsg = result.msg || '';
            err.apiData = result.data;
            err.apiResponse = result;
            throw err;
          }
          check(run);
          return result.data;
        } catch (error) {
          if (error.name === 'AbortError') {
            error = new Error(isGet ? 'Kiểm tra dữ liệu quá thời gian.' : 'Thao tác quá thời gian; kết quả chưa rõ.');
            error.transient = isGet;
          }
          lastError = error;
          if (!isGet || !error.transient || attempt >= attempts) throw error;
          await pause(run, 100 * attempt);
        } finally {
          clearTimeout(timeout);
        }
      }
      throw lastError || new Error('Yêu cầu thất bại.');
    } finally {
      if (!isGet) run.postLocks.delete(postKey);
    }
  }

  function ripe(crop) {
    return !!crop && !empty(crop) && ([4, 100].includes(Number(crop.state)) || Number(crop.harvestTime) > 0);
  }

  function empty(crop) {
    return !crop || [0, 101, 102].includes(Number(crop.state));
  }

  function cropStateLabel(crop) {
    if (!crop) return 'Đất trống';
    const state = Number(crop.state);
    if (state === 0) return 'Đất trống';
    if (state === 1) return 'Mới trồng';
    if (state === 2) return 'Đang lớn · giai đoạn 2';
    if (state === 3) return 'Đang lớn · giai đoạn 3';
    if (state === 4 || state === 100) return 'Chín · sẵn sàng thu hoạch';
    if (state === 101 || state === 102) return 'Đã thu hoạch · có thể trồng lại';
    if (Number(crop.harvestTime) > 0) return 'Chín · sẵn sàng thu hoạch';
    return `Trạng thái chưa rõ (${state})`;
  }

  async function current(run) {
    const data = await api(run, '/orchard/iframe/context/get');
    updateHeaderIdentity(data?.user);
    if (!Array.isArray(data?.crops)) throw new Error('Không đọc được danh sách cây; dừng để tránh thao tác nhầm.');
    if (data.crops.length > 1) throw new Error('Có nhiều cây; cần xác định cây mục tiêu trước.');
    const crop = data.crops[0] || null;
    let needText = '';
    if (crop && !empty(crop) && !ripe(crop)) {
      try { needText = ` · Còn ${remaining(crop).toLocaleString('vi-VN')} nước`; } catch {}
    }
    q('#sf_info').textContent = crop
      ? `${plainText(crop.meta?.name) || 'Cây'} · ${cropStateLabel(crop)} · EXP ${Number(crop.exp).toLocaleString('vi-VN')}${needText}`
      : 'Đất trống · Có thể trồng cây';
    return crop;
  }

  function remaining(crop) {
    const levels = crop?.meta?.config?.levelConfig;
    if (!levels) throw new Error('Thiếu levelConfig; không thể tính nước cần tưới.');
    const stage = Number(crop.state);
    if (!levels[stage] || stage < 1 || stage >= 100) throw new Error(`Chưa hỗ trợ ${cropStateLabel(crop)}.`);
    const need = Object.entries(levels)
      .filter(([key]) => +key >= stage && +key < 100)
      .reduce((sum, [, value]) => sum + Number(value.exp), 0) - Number(crop.exp);
    if (!Number.isFinite(need) || need <= 0) throw new Error('EXP đã đủ nhưng trạng thái chưa chín; hãy kiểm tra trong game.');
    return need;
  }

  function formatTime(ms) {
    const n = Number(ms);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date(n));
  }

  function normalizeTimestamp(value) {
    const n = Number(value || 0);
    if (!Number.isFinite(n) || n <= 0) return 0;
    // Server data can be in seconds or milliseconds.
    return n < 1e12 ? n * 1000 : n;
  }

  function selectedMetaOpenTime(meta, statusLabel) {
    if (statusLabel === 'Scheduled') return normalizeTimestamp(meta?.config?.startTime);
    if (statusLabel === 'Restock') return normalizeTimestamp(meta?.nextReleaseTime);
    return 0;
  }

  async function waitInterruptible(run, ms) {
    let left = Math.max(0, Number(ms) || 0);
    while (left > 0) {
      check(run);
      const chunk = Math.min(left, 1000);
      await sleep(chunk);
      left -= chunk;
    }
    check(run);
  }

  function cropStatusInfo(meta) {
    const now = Date.now();
    const code = Number(meta?.status);
    const start = normalizeTimestamp(meta?.config?.startTime);
    const end = normalizeTimestamp(meta?.config?.endTime);
    const next = normalizeTimestamp(meta?.nextReleaseTime);

    if (end > 0 && now >= end) return { label: 'Ended', detail: `kết thúc ${formatTime(end)}` };
    // Once the scheduled opening time has passed, do not keep treating the crop
    // as waiting forever just because the cached status code is still 2.
    if (start > 0 && now < start) return { label: 'Scheduled', detail: `mở ${formatTime(start)}` };
    if (code === 2) {
      if (start > 0 && now >= start) return { label: 'Live', detail: 'đã tới giờ mở · kiểm tra lại' };
      return { label: 'Scheduled', detail: start > 0 ? `mở ${formatTime(start)}` : '' };
    }
    if (code === 6) return { label: 'Restock', detail: next > now ? `lại ${formatTime(next)}` : 'đang chờ mở' };
    if (code === 1) return { label: 'Live', detail: end > now ? `đến ${formatTime(end)}` : '' };
    return { label: `Unknown(${Number.isFinite(code) ? code : '?'})`, detail: '' };
  }

  function cropStatusDisplay(label) {
    if (label === 'Live') return 'LIVE';
    if (label === 'Scheduled') return 'SCHEDULE';
    if (label === 'Restock') return 'RESTOCK';
    if (label === 'Ended') return 'ENDED';
    return String(label || 'UNKNOWN').toUpperCase();
  }

  function cropStatusClass(label) {
    if (label === 'Live') return 'live';
    if (label === 'Scheduled') return 'schedule';
    if (label === 'Restock') return 'restock';
    if (label === 'Ended') return 'ended';
    return 'unknown';
  }

  function updateSelectedCropStatus() {
    const id = Number(q('#sf_crop').value || 0);
    const meta = cropMetas.find(m => Number(m?.id) === id);
    const badge = q('#sf_crop_status');
    if (!badge) return;
    if (!meta) {
      badge.textContent = '...';
      badge.className = 'sf_crop_status unknown';
      return;
    }
    const st = cropStatusInfo(meta);
    badge.textContent = cropStatusDisplay(st.label);
    badge.className = `sf_crop_status ${cropStatusClass(st.label)}`;
    badge.title = st.detail || st.label;
  }

  function cropAvailabilityText(meta) {
    const price = Number.isFinite(Number(meta?.price)) ? Number(meta.price).toLocaleString('vi-VN') : '?';
    const st = cropStatusInfo(meta);
    return `${plainText(meta?.name) || 'Cây'} (${meta?.id}) · ${price} xu · [${cropStatusDisplay(st.label)}]${st.detail ? ` · ${st.detail}` : ''}`;
  }

  function renderCropMetas(metas, preserveId) {
    const select = q('#sf_crop');
    select.textContent = '';
    const rank = meta => {
      const label = cropStatusInfo(meta).label;
      if (label === 'Live') return 0;
      if (label === 'Restock') return 1;
      if (label === 'Scheduled') return 2;
      if (label === 'Ended') return 4;
      return 3;
    };
    const sorted = [...metas].sort((a, b) => rank(a) - rank(b) || Number(a?.price || 0) - Number(b?.price || 0) || Number(a?.id || 0) - Number(b?.id || 0));
    for (const meta of sorted) {
      if (!Number.isSafeInteger(Number(meta?.id)) || Number(meta.id) <= 0) continue;
      const option = document.createElement('option');
      option.value = String(Number(meta.id));
      option.textContent = cropAvailabilityText(meta);
      select.appendChild(option);
    }
    if (!select.options.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Server không trả về cây nào';
      select.appendChild(option);
    }
    const wanted = Number(preserveId || savedSettings.cropId || 0);
    if (wanted && [...select.options].some(o => o.value === String(wanted))) {
      select.value = String(wanted);
    } else {
      const live = sorted.find(meta => cropStatusInfo(meta).label === 'Live');
      if (live && [...select.options].some(o => o.value === String(live.id))) select.value = String(live.id);
    }
    saveSettings();
    updateSelectedCropStatus();
  }

  async function refreshCropMetas(run, { quiet = false } = {}) {
    const preserveId = Number(q('#sf_meta').value || q('#sf_crop').value || 0);
    const data = await api(run, '/orchard/crop/meta/get');
    if (!Array.isArray(data?.cropMetas)) throw new Error('Không đọc được cropMetas từ /orchard/crop/meta/get.');
    cropMetas = data.cropMetas;
    renderCropMetas(cropMetas, preserveId);
    q('#sf_crop_source').textContent = `· server ${cropMetas.length} cây`;
    if (!quiet) log(`Đã cập nhật ${cropMetas.length} cây từ /orchard/crop/meta/get.`);
    return cropMetas;
  }

  async function resolvePlantMeta(run, refresh = true) {
    // Giữ đúng meta người dùng đã chọn trước khi refresh; không tự nhảy sang cây đầu tiên nếu meta vừa hết/biến mất.
    const customMeta = Number(q('#sf_meta').value || 0);
    let requestedMetaId = Number(customMeta || run.metaId || q('#sf_crop').value || 0);
    if (refresh) await refreshCropMetas(run, { quiet: true });
    if (!Number.isSafeInteger(requestedMetaId) || requestedMetaId <= 0) requestedMetaId = Number(q('#sf_crop').value || 0);
    run.metaId = requestedMetaId;
    if (!Number.isSafeInteger(run.metaId) || run.metaId <= 0) throw new Error('Chưa chọn được cây hợp lệ từ server.');
    run.cropMeta = cropMetas.find(meta => Number(meta.id) === run.metaId) || null;
    if (!run.cropMeta) throw new Error(`Meta ${run.metaId} không còn trong danh sách cây server; Auto dừng để tránh trồng nhầm.`);
    if (run.cropMeta && [...q('#sf_crop').options].some(o => o.value === String(run.metaId))) q('#sf_crop').value = String(run.metaId);
    return run.cropMeta;
  }

  async function waitForPlantMetaLive(run) {
    let announcedTarget = 0;
    let scanCount = 0;
    let scanStarted = false;

    while (true) {
      check(run);
      const meta = await resolvePlantMeta(run, true);
      const st = cropStatusInfo(meta);
      const name = plainText(meta?.name) || `meta ${run.metaId}`;

      if (st.label === 'Live') {
        if (scanStarted) logUpdate(`schedule-scan-${run.metaId}`, `[QUÉT] ${name} · đã Live · ${scanCount} lần quét · bắt đầu trồng.`, 'info');
        else if (announcedTarget) log(`[MỞ CÂY] ${name} đã Live · bắt đầu trồng.`, 'info');
        return meta;
      }
      if (st.label === 'Ended') throw new Error(`${name} đã Ended; không thể chờ để trồng.`);
      if (st.label !== 'Scheduled' && st.label !== 'Restock') {
        throw new Error(`${name} hiện ${st.label}; không biết thời điểm mở để chờ.`);
      }

      const target = selectedMetaOpenTime(meta, st.label);
      const now = Date.now();
      const remainSec = Math.max(0, Math.ceil((target - now) / 1000));

      if (announcedTarget !== target) {
        announcedTarget = target;
        scanCount = 0;
        scanStarted = false;
        q('#sf_info').textContent = `${name} · ${st.label} · mở ${formatTime(target)}`;
        log(`[CHỜ CÂY] ${name} · ${st.label} · sẽ bắt đầu quét liên tục khi còn 5 giây.`, 'info');
      }

      // Chỉ bắt đầu polling liên tục ở 5 giây cuối. Mỗi giây kiểm tra lại trạng thái.
      if (remainSec > 5) {
        q('#sf_info').textContent = `${name} · ${st.label} · mở ${formatTime(target)} · còn ${remainSec}s`;
        await waitInterruptible(run, Math.min(1000, Math.max(100, (remainSec - 5) * 1000)));
        continue;
      }

      scanStarted = true;
      scanCount++;
      q('#sf_info').textContent = `${name} · ${st.label} · ⏱️ còn ${remainSec}s · quét #${scanCount}`;
      logUpdate(`schedule-scan-${run.metaId}`, `[QUÉT] ${name} · còn ${remainSec}s · lần quét #${scanCount} · chưa Live, sẽ quét lại sau 1s.`, 'info');
      await waitInterruptible(run, 1000);
    }
  }

  function myUid() {
    const uid = cookieValue('SPC_U') || cookieValue('userid');
    if (!uid || uid === '0') throw new Error('Không đọc được UID tài khoản. Kiểm tra đăng nhập.');
    return String(uid);
  }

  async function farmEncrypt(text) {
    const hex = '663d313d397733722f752f2f662b2f2f3559325a4245385a5a45517351507147';
    const key = await crypto.subtle.importKey(
      'raw',
      Uint8Array.from(hex.match(/../g), h => parseInt(h, 16)),
      'AES-CBC',
      false,
      ['encrypt']
    );
    const iv = new Uint8Array(16);
    const encrypted = new Uint8Array(await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      new TextEncoder().encode(String(text))
    ));
    const packed = new Uint8Array(16 + encrypted.length);
    packed.set(iv);
    packed.set(encrypted, 16);
    return btoa(Array.from(packed, b => String.fromCharCode(b)).join(''));
  }

  async function signature(ts = Date.now()) {
    return farmEncrypt(`1-0-1-${ts}-${myUid()}-0`);
  }

  async function friendCrypto(friendId) {
    const ts = Date.now();
    const [s, encryptFID] = await Promise.all([
      signature(ts),
      farmEncrypt(`${Number(friendId)}-${ts}`)
    ]);
    return { s, encryptFID, ts };
  }

  async function plant(run, knownCrop) {
    const crop = knownCrop === undefined ? await current(run) : knownCrop;
    if (!empty(crop)) throw new Error('Đang có cây; hãy thu hoạch trước khi trồng.');

    // BẮT BUỘC đọc lại danh sách cây ngay trước khi trồng. Nếu Scheduled/Restock thì chờ đúng giờ mở,
    // và nếu server chưa chuyển Live thì tiếp tục reload mỗi 1 giây.
    const meta = await waitForPlantMetaLive(run);
    await api(run, '/orchard/crop/create', { metaId: run.metaId, s: await signature() });
    run.planted++;
    run.bag = null;
    run.shop = null;
    log(`[TRỒNG] ${plainText(meta?.name) || `metaId=${run.metaId}`} · meta ${run.metaId}.`, 'info');
  }

  function addPrize(run, name) {
    name = plainText(name);
    if (!name) return;
    run.prizes.set(name, (run.prizes.get(name) || 0) + 1);
  }

  function extractPrizeNames(data) {
    const names = [];
    const items = data?.reward?.rewardItems || data?.rewardItems || [];
    for (const item of items) {
      const extra = item?.itemExtraData || {};
      const awardName = plainText(extra.luckyDrawAwardName);
      if (awardName) {
        names.push(awardName);
        continue;
      }
      const voucherCode = plainText(extra.voucherCode || extra.luckyDrawVoucherCode);
      if (voucherCode) {
        names.push(`Voucher ${voucherCode}`);
        continue;
      }
      const metaName = plainText(item?.meta?.name);
      if (metaName) {
        // item.num ở reward có thể là GIÁ TRỊ giải (vd. 300 Shopee Xu), không phải số lần trúng.
        // Không bao giờ ghép thành "x300" ở đây; số lần trúng chỉ được đếm bởi addPrize() qua từng lần harvest.
        const value = Number(item?.num);
        if (value > 0 && /shopee\s*xu/i.test(metaName) && !/\d/.test(metaName)) names.push(`${value} ${metaName}`);
        else names.push(metaName);
      }
    }
    if (!names.length && Number(data?.currentCoinBenefit) > 0) {
      names.push(`${Number(data.currentCoinBenefit)} Shopee Xu`);
    }
    return [...new Set(names)];
  }

  function finishHarvestResult(run, data, { claimedReward = false } = {}) {
    run.harvested++;
    const prizes = extractPrizeNames(data);
    if (prizes.length) {
      prizes.forEach(name => addPrize(run, name));
      log(`[TRÚNG] ${prizes.join(' + ')}`, 'prize');
    } else if (claimedReward) {
      log('[THU HOẠCH] Đã nhận thưởng nhưng chưa đọc được tên giải.', 'warn');
    } else {
      log('[THU HOẠCH] Thành công, nhưng response không có tên giải thưởng rõ ràng.', 'harvest');
    }
    return data;
  }

  function rewardIdFromFailedHarvest(failedData) {
    const ids = [
      failedData?.reward?.id,
      failedData?.crop?.rewardId
    ].map(Number).filter(id => Number.isSafeInteger(id) && id > 0);
    return ids[0] || 0;
  }

  async function claimFailedHarvestReward(run, failedData, rewardIdOverride = 0) {
    const rewardId = Number(rewardIdOverride || rewardIdFromFailedHarvest(failedData));
    if (!rewardId) throw new Error('Thu hoạch đã hoàn tất nhưng chưa lấy được kết quả giải thưởng.');

    let lastError = null;
    const retryKey = `reward-${rewardId}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        logUpdate(retryKey, `Lỗi Claim: Reward Luckydraw Component Failed (800005) · thử ${attempt}/3`, 'warn');
        const claimed = await api(run, '/reward/claim', { ids: [rewardId], rewardType: 2 });
        const returnedRewardId = Number(claimed?.reward?.id || 0);
        if (returnedRewardId > 0 && returnedRewardId !== rewardId) {
          throw new Error('Kết quả giải thưởng không khớp.');
        }
        finishHarvestReward(run, claimed);
        return true;
      } catch (error) {
        lastError = error;
        if (attempt < 3) await pause(run, 500);
      }
    }
    logUpdate(retryKey, 'Lỗi Claim: Reward Luckydraw Component Failed (800005) · thử 3/3 thất bại · bỏ qua, sẽ thử lại sau cây mới.', 'warn');
    return false;
  }

  function finishHarvestReward(run, data) {
    const prizes = extractPrizeNames(data);
    if (prizes.length) {
      prizes.forEach(name => addPrize(run, name));
      log(`[TRÚNG] ${prizes.join(' + ')}`, 'prize');
    } else {
      log('[THU HOẠCH] Đã nhận thưởng nhưng chưa đọc được tên giải.', 'warn');
    }
  }

  async function retryPendingRewards(run) {
    if (!run.pendingRewards.length) return;
    const pending = run.pendingRewards.splice(0);
    for (const item of pending) {
      check(run);
      const ok = await claimFailedHarvestReward(run, null, item.rewardId);
      if (!ok) run.pendingRewards.push(item);
    }
  }

  async function harvest(run, crop) {
    crop = crop || await current(run);
    if (!ripe(crop)) throw new Error(`Không có cây sẵn sàng thu hoạch (${cropStateLabel(crop)}).`);

    const payload = {
      cropId: crop.id,
      metaId: crop.metaId ?? crop.meta?.id
    };

    try {
      const data = await api(run, '/orchard/crop/harvest', payload);
      finishHarvestResult(run, data);
      return data;
    } catch (error) {
      if (Number(error?.apiCode) !== 800005) throw error;
      // Harvest may already have completed while the reward component failed.
      // Count the crop as harvested, then retry the reward claim separately.
      run.harvested++;
      const rewardId = rewardIdFromFailedHarvest(error.apiData);
      log(`Lỗi Claim: ${error?.apiMsg || 'Reward Luckydraw Component Failed'} (800005)`, 'warn');
      if (!rewardId) {
        log('[THƯỞNG] Không lấy được mã thưởng · bỏ qua phần thưởng lần này.', 'warn');
        return error.apiData;
      }
      const ok = await claimFailedHarvestReward(run, error.apiData, rewardId);
      if (!ok) run.pendingRewards.push({ rewardId, cropId: Number(crop.id) || 0 });
      return error.apiData;
    }
  }

  function optimalPlan(need, entries, budget = 0) {
    if (!Number.isSafeInteger(need) || need <= 0) throw new Error('Nhu cầu nước không hợp lệ.');
    entries = entries.filter(entry =>
      Number.isSafeInteger(Number(entry.parameter)) && Number(entry.parameter) > 0 &&
      Number.isSafeInteger(Number(entry.amount)) && Number(entry.amount) > 0 &&
      Number.isFinite(Number(entry.cost)) && Number(entry.cost) >= 0
    ).map(entry => ({ ...entry, parameter: Number(entry.parameter), amount: Number(entry.amount), cost: Number(entry.cost) }));
    if (!entries.length) return null;

    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const unit = entries.reduce((n, entry) => gcd(n, entry.parameter), 0);
    const target = Math.ceil(need / unit);
    const cap = target + Math.max(...entries.map(entry => entry.parameter / unit)) - 1;
    if (cap > 200000) throw new Error('Phạm vi tối ưu quá lớn; không thể tính phương án bình an toàn.');

    const dp = new Array(cap + 1);
    dp[0] = { cost: 0, actions: 0, prev: null };

    entries.forEach(entry => {
      const value = entry.parameter / unit;
      let left = Math.min(entry.amount, Math.ceil(cap / value));
      for (let chunk = 1; left > 0; chunk *= 2) {
        const count = Math.min(chunk, left);
        left -= count;
        const weight = count * value;
        for (let sum = cap; sum >= weight; sum--) {
          const prev = dp[sum - weight];
          if (!prev) continue;
          const cost = prev.cost + count * entry.cost;
          const actions = prev.actions + count * (entry.source === 'shop' ? 2 : 1);
          if (cost > budget) continue;
          const old = dp[sum];
          if (!old || cost < old.cost || (cost === old.cost && actions < old.actions)) {
            dp[sum] = { cost, actions, prev, entry, count };
          }
        }
      }
    });

    let best = -1;
    for (let sum = target; sum <= cap; sum++) {
      if (dp[sum] && (
        best < 0 ||
        dp[sum].cost < dp[best].cost ||
        (dp[sum].cost === dp[best].cost && (
          sum < best ||
          (sum === best && dp[sum].actions < dp[best].actions)
        ))
      )) best = sum;
    }

    // Nếu chưa đủ nước, chỉ dùng phần miễn phí trong túi; không mua một phương án vẫn thiếu.
    if (best < 0) {
      for (let sum = target - 1; sum > 0; sum--) {
        if (dp[sum]?.cost === 0) {
          best = sum;
          break;
        }
      }
    }
    if (best < 0) return null;

    const items = [];
    for (let node = dp[best]; node?.entry; node = node.prev) {
      items.push({ entry: node.entry, count: node.count });
    }
    return { items, total: best * unit, cost: dp[best].cost, actions: dp[best].actions };
  }

  async function getBag(run, force = false) {
    if (!run.bag || force) {
      const data = await api(run, '/prop/backpack/list');
      if (!Array.isArray(data?.props)) throw new Error('Không đọc được túi nước.');
      run.bag = data;
    }
    return run.bag;
  }

  async function getShop(run, force = false) {
    if (!run.shop || force) {
      const data = await api(run, '/prop/list');
      if (!Array.isArray(data?.props)) throw new Error('Không đọc được Shop.');
      run.shop = data;
    }
    updateHeaderCoins(run.shop?.coins);
    return run.shop;
  }

  async function refreshWaterSources(run) {
    // BẮT BUỘC check lại cả Túi + Shop trước MỖI lần chọn bình.
    // Chạy song song để giữ tốc độ trong khi vẫn dùng dữ liệu mới nhất.
    const [bag, shop] = await Promise.all([
      getBag(run, true),
      getShop(run, true)
    ]);
    return { bag, shop };
  }

  function bagEntries(run) {
    return (run.bag?.props || [])
      .filter(p => Number(p.typeId) === 4 && Number(p.parameter) > 0 && Number(p.amount) > 0)
      .map(p => ({ ...p, parameter: Number(p.parameter), amount: Number(p.amount), source: 'bag', cost: 0 }));
  }

  function shopEntries(run) {
    return (run.shop?.props || [])
      .filter(p => Number(p.typeId) === 4 && Number(p.parameter) > 0)
      .map(p => ({
        ...p,
        parameter: Number(p.parameter),
        source: 'shop',
        cost: Number(p.price),
        amount: Math.max(0, Number(p.buyLimit) - Number(p.buyNum))
      }))
      .filter(p => p.amount > 0 && Number.isFinite(p.cost) && p.cost >= 0);
  }

  function pickLargestFromPlan(plan, source) {
    const candidates = [];
    for (const part of plan?.items || []) {
      if (part.entry.source !== source || part.count <= 0) continue;
      candidates.push(part.entry);
    }
    return candidates.sort((a, b) => Number(b.parameter) - Number(a.parameter))[0] || null;
  }

  async function buyOne(run, offer) {
    const price = Number(offer.price ?? offer.cost);
    if (!Number.isFinite(price) || price < 0) throw new Error('Giá bình không hợp lệ.');
    if (run.spent + price > run.budget) throw new Error('Đã chạm ngân sách mua nước.');

    await api(run, '/prop/buy/v2', { propMetaId: offer.propMetaId });
    run.spent += price;
    log(`[MUA] ${plainText(offer.name) || 'Bình nước'} · ${Number(offer.parameter).toLocaleString('vi-VN')} nước · ${price.toLocaleString('vi-VN')} xu · đã tiêu ${run.spent.toLocaleString('vi-VN')}/${run.budget.toLocaleString('vi-VN')} xu.`, 'buy');

    // Sau khi mua phải đọc lại cả Shop + Túi để xác nhận buyNum, coins, amount và itemId thực tế.
    await refreshWaterSources(run);
    return run.bag?.props?.find(p =>
      Number(p.typeId) === 4 &&
      (p.propMetaId === offer.propMetaId || Number(p.parameter) === Number(offer.parameter)) &&
      Number(p.amount) > 0
    ) || null;
  }


  async function chooseBottle(run, need) {
    // Mỗi vòng đều check lại Túi + Shop để amount, buyNum, buyLimit và coins luôn mới.
    await refreshWaterSources(run);

    const bag = bagEntries(run);
    const freePlan = optimalPlan(need, bag, 0);

    if (freePlan?.total >= need) {
      const chosen = pickLargestFromPlan(freePlan, 'bag');
      if (chosen) return run.bag.props.find(p => p.itemId === chosen.itemId) || chosen;
    }

    if (run.buy) {
      const shopCoins = Math.max(0, Number(run.shop?.coins ?? 0));
      const budgetLeft = Math.max(0, run.budget - run.spent);
      const remainingBudget = Math.max(0, Math.min(shopCoins, budgetLeft));
      const offers = shopEntries(run);
      const mixedPlan = optimalPlan(need, [...bag, ...offers], remainingBudget);

      if (mixedPlan) {
        const freeFirst = pickLargestFromPlan(mixedPlan, 'bag');
        if (freeFirst) return run.bag.props.find(p => p.itemId === freeFirst.itemId) || freeFirst;

        const toBuy = pickLargestFromPlan(mixedPlan, 'shop');
        if (toBuy) {
          const bought = await buyOne(run, toBuy);
          if (bought) return bought;
          throw new Error('Đã mua nhưng chưa thấy bình trong túi sau khi kiểm tra lại; Auto dừng.');
        }
      }

      if (!bag.length) {
        if (!offers.length) throw new Error('Hết nước trong túi và Shop đã hết lượt/không còn bình mua được; Auto dừng.');
        if (budgetLeft <= 0) throw new Error('Hết nước trong túi và đã chạm ngân sách mua nước; Auto dừng.');
        if (shopCoins <= 0) throw new Error('Hết nước trong túi và Shop không còn đủ xu; Auto dừng.');
        const cheapest = Math.min(...offers.map(o => Number(o.cost)).filter(Number.isFinite));
        if (Number.isFinite(cheapest) && remainingBudget < cheapest) throw new Error(`Hết nước trong túi; còn ${remainingBudget} xu khả dụng nhưng bình rẻ nhất ${cheapest} xu. Auto dừng.`);
      }
    }

    if (freePlan) {
      const partial = pickLargestFromPlan(freePlan, 'bag');
      if (partial) return run.bag.props.find(p => p.itemId === partial.itemId) || partial;
    }

    throw new Error(run.buy
      ? 'Không còn phương án nước phù hợp sau khi check Túi + Shop; Auto dừng.'
      : 'Hết nước trong túi. Bật Tự mua nước hoặc bổ sung nước; Auto dừng.');
  }


  function rememberBottle(run, bottle) {
    run.bottles++;
    run.waterBase += Number(bottle.parameter) || 0;
    const name = plainText(bottle.name) || `${Number(bottle.parameter)} nước`;
    const key = `${name} · ${Number(bottle.parameter)} nước`;
    run.bottleStats.set(key, (run.bottleStats.get(key) || 0) + 1);
  }

  async function readAfterWater(run, crop, beforeNeed) {
    let after = await current(run); // BẮT BUỘC check sau từng bình để bắt bonus nước.
    const progressed = () => {
      if (!after || after.id !== crop.id) return false;
      if (ripe(after)) return true;
      try { return remaining(after) < beforeNeed; } catch { return false; }
    };

    if (!progressed() && !run.stopped) {
      // Server đôi lúc ghi EXP trễ; check lần đầu vẫn giữ, sau đó retry ngắn thay vì tưới thêm mù.
      await pause(run, Math.max(50, run.delay));
      after = await current(run);
    }

    if (!after || after.id !== crop.id) throw new Error('Cây đã thay đổi trong lúc tưới; dừng.');
    if (!ripe(after) && remaining(after) >= beforeNeed) throw new Error('EXP chưa tăng sau tưới; dừng để kiểm tra.');
    return after;
  }

  async function waterOnce(run, crop) {
    if (empty(crop) || ripe(crop)) throw new Error('Không có cây cần tưới.');
    const beforeNeed = remaining(crop);
    const bottle = await chooseBottle(run, beforeNeed);
    if (!bottle || Number(bottle.amount) <= 0) throw new Error('Bình đã hết; cần tải lại túi nước.');

    q('#sf_info').textContent = `${plainText(crop.meta?.name) || 'Cây'} · Còn ${beforeNeed.toLocaleString('vi-VN')} nước · Chọn ${plainText(bottle.name) || 'bình'} ${Number(bottle.parameter).toLocaleString('vi-VN')} nước`;

    await api(run, '/orchard/crop/use_bottled_water', { cropId: 0, propItemId: bottle.itemId });
    bottle.amount = Math.max(0, Number(bottle.amount) - 1);
    rememberBottle(run, bottle);

    const after = await readAfterWater(run, crop, beforeNeed);
    let afterNeed = 0;
    if (!ripe(after)) afterNeed = remaining(after);
    const effective = Math.max(0, beforeNeed - afterNeed);
    const bonus = Math.max(0, effective - Number(bottle.parameter));
    run.waterEffective += effective;
    run.bonusWater += bonus;

    log(`[TƯỚI] ${plainText(bottle.name) || 'Bình nước'} ${Number(bottle.parameter).toLocaleString('vi-VN')} → hiệu dụng ${effective.toLocaleString('vi-VN')} · còn ${afterNeed.toLocaleString('vi-VN')}.`, 'water');
    if (bonus > 0) log(`[BONUS] +${bonus.toLocaleString('vi-VN')} nước.`, 'bonus');
    return after;
  }


  async function onlyWater(run) {
    let crop = await current(run);
    if (empty(crop)) throw new Error('Chưa có cây. Hãy Trồng cây trước.');
    log(`[AUTOWATER] Cây hiện tại: ${plainText(crop.meta?.name) || 'Cây'} · ${cropStateLabel(crop)}${ripe(crop) ? ' · không cần tưới' : ' · bắt đầu tưới'}.`, 'summary');
    for (let step = 0; step < 1000; step++) {
      check(run);
      if (ripe(crop)) {
        log('[AUTOWATER] Cây đã chín · không thu hoạch.', 'summary');
        return;
      }
      crop = await waterOnce(run, crop);
    }
    throw new Error('Đạt giới hạn 1000 lượt tưới.');
  }

  async function autoFarm(run) {
    const crop = await current(run);
    if (empty(crop)) throw new Error('Chưa có cây để thu hoạch.');
    if (!ripe(crop)) throw new Error('Cây chưa chín. Dùng AutoWater để tưới tới chín trước.');
    await harvest(run, crop);
  }

  async function auto(run) {
    let completed = 0;
    let crop = await current(run);
    if (!empty(crop)) {
      const name = plainText(crop.meta?.name) || 'Cây';
      if (ripe(crop)) log(`[AUTO] Đang có cây: ${name} · ${cropStateLabel(crop)} · sẽ thu hoạch trước.`, 'summary');
      else log(`[AUTO] Đang có cây: ${name} · ${cropStateLabel(crop)} · bắt đầu tưới.`, 'summary');
    }

    for (let step = 0; step < 3000; step++) {
      check(run);

      if (empty(crop)) {
        await plant(run, crop);
        await pause(run);
        crop = await current(run);
        if (empty(crop)) {
          await pause(run, Math.max(75, run.delay));
          crop = await current(run);
        }
        if (empty(crop)) throw new Error('Chưa thấy cây sau khi trồng; dừng để tránh gửi lại.');
        continue;
      }

      if (ripe(crop)) {
        const harvestedCropId = Number(crop.id) || 0;
        const hadPendingBefore = run.pendingRewards.some(x => Number(x.cropId) !== harvestedCropId);
        await harvest(run, crop);
        completed++;
        log(`[AUTO] Hoàn tất ${completed}/${run.cycles} cây.`, 'summary');
        // Only revisit an old failed reward after a different crop has just been harvested.
        if (hadPendingBefore) await retryPendingRewards(run);
        if (completed >= run.cycles) return;

        await pause(run);
        crop = await current(run);
        if (!empty(crop)) {
          await pause(run, Math.max(75, run.delay));
          crop = await current(run);
        }
        if (!empty(crop)) throw new Error('Cây chưa được xóa sau thu hoạch; kiểm tra trong game.');
        continue;
      }

      crop = await waterOnce(run, crop);
    }

    throw new Error('Đạt giới hạn 3000 bước; đã dừng.');
  }

  async function inventory(run, shop = false) {
    const data = shop ? await getShop(run, true) : await getBag(run, true);
    const list = q('#sf_lists');
    list.textContent = '';

    if (shop) log(`[SHOP] ${Number(data.coins ?? 0).toLocaleString('vi-VN')} xu.`, 'info');
    const props = (data.props || []).filter(p => Number(p.typeId) === 4 && (shop || Number(p.amount) > 0));
    if (!props.length) {
      list.textContent = 'Không có bình nước.';
      return;
    }

    props.sort((a, b) => Number(a.parameter) - Number(b.parameter));
    for (const prop of props) {
      const row = document.createElement('div');
      const label = document.createElement('span');
      label.className = 'sf_item_text';
      label.textContent = `${plainText(prop.name)} · ${Number(prop.parameter)} nước · ${shop ? `${Number(prop.price)} xu [${Number(prop.buyNum)}/${Number(prop.buyLimit)}]` : `x${Number(prop.amount)}`}`;
      row.appendChild(label);

      // Túi nước chỉ để xem; đã bỏ hoàn toàn thao tác “Tưới 1 bình”.
      if (shop) {
        const button = document.createElement('button');
        button.textContent = 'Mua';
        button.onclick = () => void start('buyItem', prop);
        row.appendChild(button);
      }
      list.appendChild(row);
    }
  }

  function prizeSummary(run) {
    if (!run.prizes.size) return 'Chưa có giải thưởng.';
    return [...run.prizes.entries()].map(([name, count]) => count > 1 ? `${name} x${count}` : name).join(' | ');
  }

  function bottleSummary(run) {
    if (!run.bottles) return '0 bình';
    const detail = [...run.bottleStats.entries()].map(([name, count]) => `${name} x${count}`).join(' | ');
    return `${run.bottles} bình · ${detail}`;
  }

  function showSummary(run, title) {
    if (run.summaryShown) return;
    run.summaryShown = true;
    log(`===== ${title} =====`, 'summary');
    log(`GIẢI THƯỞNG: ${prizeSummary(run)}`, run.prizes.size ? 'prize' : 'summary');
    log(`BÌNH ĐÃ TƯỚI: ${bottleSummary(run)}`, 'summary');
    log(`NƯỚC GỐC: ${run.waterBase.toLocaleString('vi-VN')} · NƯỚC HIỆU DỤNG: ${run.waterEffective.toLocaleString('vi-VN')} · BONUS GHI NHẬN: ${run.bonusWater.toLocaleString('vi-VN')}`, 'summary');
    log(`XU ĐÃ TIÊU: ${run.spent.toLocaleString('vi-VN')}`, 'summary');
    log(`ĐÃ TRỒNG: ${run.planted} · ĐÃ THU HOẠCH: ${run.harvested}${run.friendHelpCount ? ` · ĐÃ TƯỚI BẠN: ${run.friendHelpCount}` : ''}`, 'summary');
  }


  async function refreshAll(run) {
    const [metas, bag, shop] = await Promise.all([
      refreshCropMetas(run, { quiet: true }),
      getBag(run, true),
      getShop(run, true)
    ]);
    const bagCount = (bag.props || []).filter(p => Number(p.typeId) === 4 && Number(p.amount) > 0).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const shopOffers = shopEntries(run).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const list = q('#sf_lists');
    list.textContent = '';
    for (const text of [
      `Cây: ${metas.length} meta · Live ${metas.filter(m => cropStatusInfo(m).label === 'Live').length}`,
      `Túi nước: ${bagCount} bình`,
      `Shop: ${Number(shop.coins ?? 0).toLocaleString('vi-VN')} xu · còn ${shopOffers} lượt mua bình`
    ]) {
      const row = document.createElement('div');
      const span = document.createElement('span');
      span.className = 'sf_item_text'; span.textContent = text; row.appendChild(span); list.appendChild(row);
    }
    log('[LÀM MỚI] Đã cập nhật Cây + Túi + Shop.', 'info');
  }

  function parseShareKey(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    // Link Farm/final URL: lấy NGUYÊN giá trị skey/shareKey, không giả định độ dài.
    try {
      const url = new URL(raw);
      const key = String(url.searchParams.get('skey') || url.searchParams.get('shareKey') || '').trim();
      if (key) return key;
    } catch {}

    // Chuỗi có query nhưng không parse được bằng URL(): vẫn lấy tới trước &, # hoặc khoảng trắng.
    const m = raw.match(/(?:^|[?&])(?:skey|shareKey)=([^&#\s]+)/i);
    if (m?.[1]) {
      try { return decodeURIComponent(m[1]).trim(); } catch { return m[1].trim(); }
    }

    // Vẫn cho phép dán trực tiếp shareKey; không khóa ở 40/48 ký tự.
    if (!/[\s/?#&=]/.test(raw)) return raw;
    return '';
  }

  async function resolveShortLinkViaIframe(run, raw) {
    // Link shp.ee không chứa shareKey. Ta chỉ lấy key SAU KHI nó redirect tới URL Farm cuối cùng.
    return new Promise((resolve, reject) => {
      check(run);
      const frame = document.createElement('iframe');
      frame.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;opacity:0;pointer-events:none;border:0';
      let done = false;
      const started = Date.now();
      let poll = null;
      let timeout = null;
      const cleanup = () => {
        if (poll) clearInterval(poll);
        if (timeout) clearTimeout(timeout);
        try { frame.remove(); } catch {}
      };
      const finish = (fn, value) => {
        if (done) return;
        done = true;
        cleanup();
        fn(value);
      };
      const inspectFinalUrl = () => {
        if (done) return;
        try {
          check(run);
          const href = frame.contentWindow?.location?.href || '';
          if (!href || href === 'about:blank') return;
          // Chỉ chấp nhận khi đã redirect về trang Farm có skey/shareKey.
          const key = parseShareKey(href);
          if (key) finish(resolve, { shareKey: key, resolvedUrl: href });
        } catch {
          // Đang ở domain trung gian (ví dụ shp.ee), chưa same-origin nên chưa đọc được URL.
        }
      };
      frame.onload = inspectFinalUrl;
      document.body.appendChild(frame);
      poll = setInterval(inspectFinalUrl, 100);
      timeout = setTimeout(() => finish(reject, new Error('Không đọc được URL cuối của link rút gọn.')), 10000);
      frame.src = raw;
    });
  }

  async function resolveFriendShareInput(run, value) {
    const raw = String(value || '').trim();
    if (!raw) throw new Error('Nhập link chia sẻ bạn bè.');

    // 1) Link Farm cuối cùng: đọc trực tiếp skey từ URL.
    let shareKey = parseShareKey(raw);
    if (shareKey && /games\.shopee\.vn\/farm\/share\.html/i.test(raw)) {
      return { shareKey, resolvedUrl: raw };
    }

    // Vẫn cho phép dán trực tiếp shareKey, bất kể server dùng 40, 48 hay độ dài khác.
    if (shareKey && !/^https?:\/\//i.test(raw)) return { shareKey, resolvedUrl: '' };

    // 2) Link rút gọn: KHÔNG đọc key từ shp.ee; phải resolve URL cuối rồi mới đọc skey.
    if (!/^https?:\/\/shp\.ee\//i.test(raw)) {
      throw new Error('Dán link Farm có skey, link shp.ee hoặc shareKey trực tiếp.');
    }

    // Nếu CORS cho phép, response.url là URL cuối sau redirect.
    try {
      const response = await fetch(raw, { method: 'GET', redirect: 'follow', credentials: 'omit', cache: 'no-store' });
      const finalUrl = response.url || '';
      shareKey = parseShareKey(finalUrl);
      if (shareKey) return { shareKey, resolvedUrl: finalUrl };
    } catch {}

    // Fallback: điều hướng iframe và đợi tới khi URL cuối trở về games.shopee.vn.
    try { return await resolveShortLinkViaIframe(run, raw); } catch {}
    throw new Error('Không đọc được URL cuối của link shp.ee. Hãy mở link đó rồi dán URL Farm có skey.');
  }

  function friendCropNeed(crop) {
    if (!crop || empty(crop) || ripe(crop)) return 0;
    try { return remaining(crop); } catch { return 0; }
  }

  function renderFriendState(state) {
    const box = q('#sf_friend_info');
    if (!state?.friend) {
      box.textContent = 'Chưa tải bạn bè.';
      return;
    }
    const friend = state.friend;
    const crop = state.crop;
    const parts = [
      `Bạn: ${plainText(friend.name || friend.contactName) || friend.id}`,
      `UID ${friend.id}`
    ];
    if (crop) {
      const need = friendCropNeed(crop);
      parts.push(`${plainText(crop.meta?.name) || 'Cây'} · ${cropStateLabel(crop)} · EXP ${Number(crop.exp || 0).toLocaleString('vi-VN')}${need > 0 ? ` · còn ${need.toLocaleString('vi-VN')}` : ''}`);
    } else parts.push('Không có cây');
    if (state.shareKey) parts.push(`Share key: ${state.shareKey.slice(0, 8)}…${state.shareKey.slice(-6)}`);
    box.textContent = parts.join('\n');
    box.style.whiteSpace = 'pre-line';
  }

  async function loadFriend(run, { quiet = false } = {}) {
    const input = q('#sf_friend_link').value;
    const resolved = await resolveFriendShareInput(run, input);
    const share = await api(run, `/friend/share_info/get?shareKey=${encodeURIComponent(resolved.shareKey)}`);
    const friendId = Number(share?.crop?.userId || share?.user?.id || 0);
    if (!Number.isSafeInteger(friendId) || friendId <= 0) throw new Error('Share info không trả về friendId hợp lệ.');

    const ctx = await api(run, `/friend/orchard/context/get?friendId=${friendId}`);
    const friend = ctx?.user || { id: friendId, name: '' };
    const crops = Array.isArray(ctx?.crops) ? ctx.crops : [];
    const crop = crops[0] || share?.crop || null;
    friendState = {
      shareKey: resolved.shareKey,
      resolvedUrl: resolved.resolvedUrl,
      friend: { ...friend, id: Number(friend?.id || friendId) },
      crop,
      context: ctx,
      share
    };
    renderFriendState(friendState);
    if (!quiet) log(`[BẠN BÈ] ${plainText(friendState.friend.name || friendState.friend.contactName) || friendId} · ${crop ? `${plainText(crop.meta?.name) || 'Cây'} · ${cropStateLabel(crop)}` : 'không có cây'}.`, 'friend');
    return friendState;
  }

  async function helpFriend(run) {
    let state = await loadFriend(run, { quiet: true });
    const friendId = Number(state.friend?.id);
    if (!Number.isSafeInteger(friendId) || friendId <= 0) throw new Error('friendId không hợp lệ.');

    // BẮT BUỘC lấy context mới nhất ngay trước POST để tránh dùng cropId cũ.
    const ctx = await api(run, `/friend/orchard/context/get?friendId=${friendId}`);
    const crop = Array.isArray(ctx?.crops) ? ctx.crops[0] : null;
    const friend = ctx?.user || state.friend;
    if (!crop) throw new Error('Bạn bè hiện không có cây để tưới.');
    if (empty(crop)) throw new Error('Cây bạn bè đã kết thúc; không thể tưới.');
    if (ripe(crop)) throw new Error('Cây bạn bè đã chín; không cần tưới.');

    state = friendState = { ...state, friend, crop, context: ctx };
    renderFriendState(state);

    const crypto = await friendCrypto(friendId);
    const payload = {
      friendId,
      friendAvatar: String(friend?.avatarUrl || ''),
      cropId: Number(crop.id),
      scenarioType: 3,
      friendName: String(friend?.name || friend?.contactName || ''),
      s: crypto.s,
      encryptFID: crypto.encryptFID,
      shareKey: state.shareKey
    };

    const data = await api(run, '/friend/v2/help', payload);
    run.friendHelpCount = (run.friendHelpCount || 0) + 1;
    const afterCrop = data?.crop || crop;
    friendState = { ...state, crop: afterCrop, helpResult: data };
    renderFriendState(friendState);
    const selfGain = Number(data?.helpWaterSelfExp || 0);
    const beforeExp = Number(crop?.exp || 0);
    const afterExp = Number(afterCrop?.exp ?? beforeExp);
    const friendGain = Math.max(0, afterExp - beforeExp);
    log(`[TƯỚI BẠN] ${plainText(friend?.name || friend?.contactName) || friendId} · ${plainText(afterCrop?.meta?.name) || 'Cây'} · EXP: ${beforeExp.toLocaleString('vi-VN')} → ${afterExp.toLocaleString('vi-VN')} (+${friendGain.toLocaleString('vi-VN')})${selfGain > 0 ? ` · Mình +${selfGain.toLocaleString('vi-VN')} EXP` : ''}.`, 'friend');
    return data;
  }

  function validRun(run, action) {
    return Number.isFinite(run.budget) && run.budget >= 0 &&
      Number.isInteger(run.cycles) && run.cycles >= 1 && run.cycles <= 100 &&
      Number.isFinite(run.delay) && run.delay >= 0 && run.delay <= 3000;
  }


  async function start(action, item) {
    try { assertUseWindow(); } catch (e) { log(e.message, 'warn'); return; }
    if (active) {
      log('Tác vụ đang chạy; bấm Dừng trước khi chạy tác vụ khác.', 'warn');
      return;
    }

    const run = newRun();
    if (!validRun(run, action)) {
      log('Kiểm tra ngân sách, số cây (1–100) và độ trễ (0–3000 ms).', 'warn');
      return;
    }

    active = run;
    qa('.sf_action').forEach(button => { button.disabled = true; });

    try {
      if (action === 'status') {
        const crop = await current(run);
        if (crop) {
          let need = '';
          if (!empty(crop) && !ripe(crop)) try { need = ` · Còn ${remaining(crop).toLocaleString('vi-VN')} nước`; } catch {}
          log(`[TRẠNG THÁI] ${plainText(crop.meta?.name)} · ${cropStateLabel(crop)} · EXP ${Number(crop.exp).toLocaleString('vi-VN')}${need}`, 'info');
        } else log('[TRẠNG THÁI] Đất trống · có thể trồng cây.', 'info');
      } else if (action === 'bag') {
        await inventory(run, false);
      } else if (action === 'refresh') {
        await refreshAll(run);
      } else if (action === 'cropLoad') {
        await refreshCropMetas(run, { quiet: true });
        log(`[LOAD CÂY] Đã tải lại ${cropMetas.length} cây từ server.`, 'info');
      } else if (action === 'shop') {
        await inventory(run, true);
      } else if (action === 'friendLoad') {
        await loadFriend(run);
      } else if (action === 'friendHelp') {
        await helpFriend(run);
      } else if (action === 'buyItem') {
        // Mua tay không bị giới hạn bởi ngân sách Auto; vẫn ghi nhận xu đã tiêu của tác vụ này.
        const price = Number(item.price);
        await api(run, '/prop/buy/v2', { propMetaId: item.propMetaId });
        run.spent += Number.isFinite(price) ? price : 0;
        log(`[MUA] ${plainText(item.name) || 'Bình nước'} · ${Number(item.parameter).toLocaleString('vi-VN')} nước · ${Number.isFinite(price) ? price.toLocaleString('vi-VN') : '?'} xu.`, 'buy');
        await inventory(run, true);
      } else if (action === 'plant') {
        await plant(run);
      } else if (action === 'harvest') {
        const before = await current(run);
        await harvest(run, before);
        if (before && run.pendingRewards.some(x => Number(x.cropId) !== Number(before.id))) await retryPendingRewards(run);
      } else if (action === 'autowater') {
        await onlyWater(run);
        showSummary(run, 'AUTOWATER HOÀN TẤT');
      } else if (action === 'autofarm') {
        await autoFarm(run);
        showSummary(run, 'AUTOFARM HOÀN TẤT');
      } else if (action === 'auto') {
        await auto(run);
        showSummary(run, 'AUTO HOÀN TẤT');
      }
    } catch (error) {
      if (run.stopped || error.message === 'Đã dừng.') {
        log('[DỪNG] Không gửi thêm thao tác mới.', 'warn');
      } else {
        log(error.message, 'warn');
      }
    } finally {
      if (run.stopped) showSummary(run, 'TỔNG KẾT KHI DỪNG');
      active = null;
      qa('.sf_action').forEach(button => { button.disabled = false; });
    }
  }

  panel.addEventListener('click', event => {
    const action = event.target?.dataset?.action;
    if (action) void start(action);
  });

  q('#sf_stop').onclick = () => {
    if (!active) {
      log('[DỪNG] Không có tác vụ đang chạy.', 'info');
      return;
    }
    active.stopped = true;
    log('[DỪNG] Đã yêu cầu dừng. Tác vụ đang gửi có thể vẫn hoàn tất; không gửi thao tác mới.', 'warn');
  };

  q('#sf_close').onclick = () => {
    if (active) {
      active.stopped = true;
      log('Đã yêu cầu dừng. Đóng bảng sau khi tác vụ hiện tại kết thúc.', 'warn');
      return;
    }
    saveSettings();
    toolClosing = true;
    const currentPip = pipWindow;
    pipWindow = null;
    panel.remove();
    if (currentPip && !currentPip.closed) {
      try { currentPip.close(); } catch {}
    }
  };

  q('#sf_clear').onclick = () => { q('#sf_log').textContent = ''; };

  async function warmCropMetas() {
    if (active) return;
    const run = { stopped: false, allowOutsideWindow: true };
    try {
      await refreshCropMetas(run, { quiet: true });
    } catch (error) {
      q('#sf_crop_source').textContent = '· lỗi tải server';
      log(`Danh sách cây: ${error.message}`, 'warn');
    }
  }

  async function warmHeaderCoins() {
    if (active) return;
    const run = { stopped: false, allowOutsideWindow: true };
    try { await getShop(run, true); } catch { updateHeaderCoins(NaN); }
  }

  async function warmContextHeader() {
    if (active) return;
    const run = { stopped: false, allowOutsideWindow: true };
    try {
      const data = await api(run, '/orchard/iframe/context/get');
      updateHeaderIdentity(data?.user);
    } catch {
      updateHeaderIdentity();
    }
  }

  updateHeaderIdentity();
  window.addEventListener('beforeunload', saveSettings, { once: true });
  void Promise.allSettled([warmCropMetas(), warmHeaderCoins(), warmContextHeader()]);
})();
