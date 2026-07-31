(() => {
  "use strict";

  const VERSION = "2.0.0";
  const STYLE_ID = "svt-light-ui-styles";
  const MODAL_CLASS = "svt-modal-root";

  function ensureStyles() {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${MODAL_CLASS},.${MODAL_CLASS} *{box-sizing:border-box}
      .${MODAL_CLASS}{position:fixed;z-index:2147483646;inset:0;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.38);backdrop-filter:blur(5px);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033}
      .${MODAL_CLASS} .svt-panel{display:flex;flex-direction:column;width:min(860px,100%);max-height:calc(100vh - 36px);overflow:hidden;border:1px solid #e2e8f0;border-radius:20px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.2)}
      .${MODAL_CLASS} .svt-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:19px 22px;border-bottom:1px solid #edf1f6;background:linear-gradient(135deg,#fff,#fff8f6)}
      .${MODAL_CLASS} .svt-brand{display:flex;align-items:center;gap:12px}
      .${MODAL_CLASS} .svt-logo{display:grid;width:42px;height:42px;flex:0 0 42px;place-items:center;border-radius:12px;color:#fff;background:linear-gradient(135deg,#ff714d,#e83d1c);font-size:12px;font-weight:900;box-shadow:0 9px 22px rgba(238,77,45,.2)}
      .${MODAL_CLASS} h2{margin:0;color:#111827;font-size:19px;letter-spacing:-.025em}
      .${MODAL_CLASS} .svt-subtitle{margin:3px 0 0;color:#64748b;font-size:12px}
      .${MODAL_CLASS} button,.${MODAL_CLASS} input,.${MODAL_CLASS} textarea{font:inherit}
      .${MODAL_CLASS} .svt-close{display:grid;width:37px;height:37px;place-items:center;border:1px solid #e2e8f0;border-radius:10px;color:#64748b;background:#fff;font-size:20px;cursor:pointer}
      .${MODAL_CLASS} .svt-body{overflow:auto;padding:18px 22px 22px}
      .${MODAL_CLASS} textarea{width:100%;min-height:105px;padding:12px 13px;border:1px solid #dce3ec;border-radius:12px;outline:none;color:#172033;background:#f8fafc;font-size:13px;line-height:1.5;resize:vertical}
      .${MODAL_CLASS} textarea:focus{border-color:#ee4d2d;background:#fff;box-shadow:0 0 0 3px rgba(238,77,45,.11)}
      .${MODAL_CLASS} .svt-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
      .${MODAL_CLASS} .svt-btn{display:inline-flex;min-height:39px;align-items:center;justify-content:center;padding:0 14px;border:1px solid #dce3ec;border-radius:10px;color:#334155;background:#fff;font-size:12px;font-weight:750;cursor:pointer}
      .${MODAL_CLASS} .svt-btn:hover:not(:disabled){border-color:#f2a08d;color:#d93f20;background:#fff8f6}
      .${MODAL_CLASS} .svt-btn:disabled{opacity:.52;cursor:wait}
      .${MODAL_CLASS} .svt-primary{border-color:#ee4d2d;color:#fff;background:linear-gradient(135deg,#ff6847,#e83d1c);box-shadow:0 7px 18px rgba(238,77,45,.16)}
      .${MODAL_CLASS} .svt-primary:hover:not(:disabled){color:#fff;background:linear-gradient(135deg,#ff795b,#ed4b29)}
      .${MODAL_CLASS} .svt-info{border-color:#4f7ff1;color:#fff;background:#4f6fdb}
      .${MODAL_CLASS} .svt-status{min-height:25px;margin-top:12px;color:#64748b;font-size:12px}
      .${MODAL_CLASS} .svt-status.error{color:#dc2626}
      .${MODAL_CLASS} .svt-spinner{display:inline-block;width:13px;height:13px;margin-right:7px;border:2px solid #dbe2eb;border-top-color:#ee4d2d;border-radius:50%;vertical-align:-2px;animation:svt-spin .7s linear infinite}
      @keyframes svt-spin{to{transform:rotate(360deg)}}
      .${MODAL_CLASS} .svt-summary{display:flex;flex-wrap:wrap;gap:7px;margin:3px 0 12px}
      .${MODAL_CLASS} .svt-chip{padding:6px 10px;border-radius:999px;background:#f1f5f9;color:#475569;font-size:11px;font-weight:750}
      .${MODAL_CLASS} .svt-chip.good{color:#047857;background:#ecfdf5}.svt-modal-root .svt-chip.bad{color:#b91c1c;background:#fef2f2}
      .${MODAL_CLASS} .svt-results{margin-top:5px}
      .${MODAL_CLASS} .svt-card{display:grid;grid-template-columns:54px minmax(0,1fr);gap:13px;margin-top:10px;padding:13px;border:1px solid #e5eaf1;border-radius:13px;background:#fff;box-shadow:0 4px 16px rgba(15,23,42,.045)}
      .${MODAL_CLASS} .svt-icon{display:grid;width:54px;height:54px;place-items:center;overflow:hidden;border-radius:11px;color:#fff;background:#ee4d2d;font-size:10px;font-weight:850;text-align:center}
      .${MODAL_CLASS} .svt-icon img{width:100%;height:100%;object-fit:cover}
      .${MODAL_CLASS} .svt-card-title{margin:0;color:#111827;font-size:14px;font-weight:800;line-height:1.4}
      .${MODAL_CLASS} .svt-card-title a{color:#e64727;text-decoration:none}
      .${MODAL_CLASS} .svt-meta{display:grid;gap:3px;margin-top:6px;color:#64748b;font-size:11.5px;line-height:1.45}
      .${MODAL_CLASS} .svt-card-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
      .${MODAL_CLASS} .svt-card-actions .svt-btn{min-height:32px;padding:0 10px;font-size:10.5px}
      .${MODAL_CLASS} .svt-empty{padding:35px 12px;color:#64748b;text-align:center;font-size:13px}
      .${MODAL_CLASS} .svt-structure{max-height:360px;overflow:auto;margin-top:12px;padding:13px;border:1px solid #e2e8f0;border-radius:12px;color:#475569;background:#f8fafc;font:11.5px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;word-break:break-word}
      .${MODAL_CLASS} .svt-transfer{margin-top:10px;padding:10px 12px;border:1px solid #bfdbfe;border-radius:10px;color:#1d4ed8;background:#eff6ff;font-size:11.5px}
      @media(max-width:620px){.${MODAL_CLASS}{padding:6px}.${MODAL_CLASS} .svt-panel{max-height:calc(100vh - 12px)}.${MODAL_CLASS} .svt-header{padding:15px}.${MODAL_CLASS} .svt-body{padding:14px}.${MODAL_CLASS} .svt-actions .svt-btn{flex:1 1 calc(50% - 8px)}}
    `;
    document.head.append(style);
  }

  function createModal({ id, icon, title, subtitle, placeholder }) {
    document.getElementById(id)?.remove();
    ensureStyles();
    const root = document.createElement("div");
    root.id = id;
    root.className = MODAL_CLASS;
    root.innerHTML = `
      <section class="svt-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <header class="svt-header"><div class="svt-brand"><span class="svt-logo">${escapeHtml(icon)}</span><div><h2>${escapeHtml(title)}</h2><p class="svt-subtitle">${escapeHtml(subtitle)}</p></div></div><button class="svt-close" type="button" aria-label="Đóng">×</button></header>
        <div class="svt-body"><textarea class="svt-input" placeholder="${escapeHtml(placeholder)}"></textarea><div class="svt-actions"></div><div class="svt-status"></div><div class="svt-results"></div></div>
      </section>`;
    document.body.append(root);
    const close = () => root.remove();
    root.querySelector(".svt-close").addEventListener("click", close);
    root.addEventListener("click", event => { if (event.target === root) close(); });
    return {
      root,
      input: root.querySelector(".svt-input"),
      actions: root.querySelector(".svt-actions"),
      status: root.querySelector(".svt-status"),
      results: root.querySelector(".svt-results")
    };
  }

  function makeButton(label, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `svt-btn ${className}`.trim();
    button.textContent = label;
    return button;
  }

  function setStatus(ui, message, { loading = false, error = false } = {}) {
    ui.status.classList.toggle("error", error);
    ui.status.replaceChildren();
    if (loading) {
      const spinner = document.createElement("span");
      spinner.className = "svt-spinner";
      ui.status.append(spinner);
    }
    ui.status.append(document.createTextNode(message));
  }

  async function resolveFinalUrl(input) {
    if (!/^https?:\/\//i.test(input)) return input;
    try {
      const response = await fetch(input, { credentials: "include", redirect: "follow" });
      return response.url || input;
    } catch {
      return input;
    }
  }

  async function getSignature(promotionId) {
    const response = await fetch("/api/v4/chat/get_voucher", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json; charset=UTF-8", "x-shopee-client-timezone": "Asia/Ho_Chi_Minh" },
      body: JSON.stringify({ shop_id: "0", voucher_code: "0", id: String(promotionId), is_subaccount: true })
    });
    if (!response.ok) return "";
    const json = await response.json();
    return String(json?.data?.signature || "");
  }

  async function normalizeVoucherInputs(inputs) {
    const normalized = [];
    const seen = new Set();
    for (const source of inputs) {
      const raw = String(source || "").trim();
      if (!raw) continue;
      let promotionId = "";
      let signature = "";
      const pair = raw.match(/^(\d+)\s*[:|]\s*(.+)$/);
      if (pair) [promotionId, signature] = [pair[1], pair[2].trim()];
      if (!promotionId || !signature) {
        const resolved = await resolveFinalUrl(raw);
        try {
          const url = new URL(resolved);
          promotionId = promotionId || url.searchParams.get("promotionId") || url.searchParams.get("promotionid") || url.searchParams.get("promotion_id") || "";
          signature = signature || url.searchParams.get("signature") || url.searchParams.get("sign") || url.searchParams.get("sig") || "";
        } catch {}
      }
      if (!promotionId) promotionId = raw.match(/(?:LIVE|VIDEO|FSV)[-_]?(\d+)/i)?.[1] || (/^\d+$/.test(raw) ? raw : "");
      if (promotionId && !signature) signature = await getSignature(promotionId);
      const key = `${promotionId}:${signature}`;
      if (promotionId && signature && !seen.has(key)) {
        seen.add(key);
        normalized.push({ promotionId: String(promotionId), signature: String(signature) });
      }
    }
    return normalized;
  }

  async function checkVouchers(inputs) {
    const pairs = await normalizeVoucherInputs(inputs);
    if (!pairs.length) throw new Error("Không tìm thấy Promotion ID/signature hợp lệ.");
    const response = await fetch("/api/v2/voucher_wallet/batch_get_vouchers_by_promotion_ids", {
      method: "POST",
      credentials: "include",
      headers: { accept: "application/json", "content-type": "application/json", "x-api-source": "pc" },
      body: JSON.stringify({
        promotion_info: pairs.map(pair => ({ signature: pair.signature, signature_source: "0", promotionid: Number(pair.promotionId), item_info: [] })),
        need_user_voucher_status: false
      })
    });
    const json = await response.json();
    if (!response.ok || json?.error) throw new Error(json?.error_msg || `Voucher API HTTP ${response.status}`);
    const mappings = json?.data?.id_voucher_mappings || {};
    return pairs.map(pair => {
      const voucher = mappings[pair.promotionId];
      if (!voucher) return null;
      voucher.signature = pair.signature;
      return voucher;
    }).filter(Boolean);
  }

  function voucherLink(voucher) {
    const promotionId = voucher.promotionid;
    const code = cleanCode(voucher.voucher_code) || `AUTO-${promotionId}`;
    return `https://shopee.vn/voucher/details?evcode=${encodeURIComponent(utf8Base64(code))}&from_source=voucher-wallet&promotionId=${promotionId}&signature=${encodeURIComponent(voucher.signature || "")}`;
  }

  function cleanCode(value) {
    const code = String(value ?? "").trim();
    return /^(null|undefined)$/i.test(code) ? "" : code;
  }

  function utf8Base64(value) {
    const bytes = new TextEncoder().encode(String(value));
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function formatCurrency(raw) {
    const amount = Math.floor(Number(raw || 0) / 100000);
    return `${amount.toLocaleString("vi-VN")}đ`;
  }

  function voucherTitle(voucher) {
    const ui = voucher.fsv_voucher_card_ui_info;
    if (ui) return `Freeship ${formatCurrency(ui.composed_discount_value)} · Đơn từ ${formatCurrency(ui.int_min_spend_fsv_ui_only)}`;
    const percentage = voucher.discount_percentage || voucher.reward_percentage || 0;
    const value = voucher.discount_value || voucher.reward_value || 0;
    const minimum = voucher.min_spend || 0;
    const cap = voucher.discount_cap || voucher.reward_cap || 0;
    if (percentage) return `Giảm ${percentage}%${cap ? ` tối đa ${formatCurrency(cap)}` : ""} · Đơn từ ${formatCurrency(minimum)}`;
    if (value) return `Giảm ${formatCurrency(value)} · Đơn từ ${formatCurrency(minimum)}`;
    return voucher.display_name || voucher.title || "Voucher Shopee";
  }

  function isExhausted(voucher) {
    return Boolean(voucher.fully_claimed || voucher.fully_used || (voucher.end_time && voucher.end_time * 1000 < Date.now()));
  }

  async function saveVoucher(voucher, button) {
    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = "Đang lưu...";
    try {
      const response = await fetch("/api/v2/voucher_wallet/save_voucher", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", "x-api-source": "pc", "x-csrftoken": getCookie("csrftoken") },
        body: JSON.stringify({ voucher_promotionid: Number(voucher.promotionid), signature: String(voucher.signature), signature_source: "0" })
      });
      const json = await response.json();
      const success = json?.error === 0 || json?.error === 5;
      button.textContent = success ? "Đã lưu" : (json?.error_msg || "Lưu thất bại");
      button.style.color = success ? "#047857" : "#b91c1c";
      button.style.borderColor = success ? "#6ee7b7" : "#fca5a5";
    } catch {
      button.textContent = "Lỗi kết nối";
    } finally {
      button.disabled = false;
      setTimeout(() => { button.textContent = oldText; }, 2200);
    }
  }

  function renderVoucherResults(ui, vouchers, leadText = "") {
    ui.results.replaceChildren();
    const available = vouchers.filter(voucher => !isExhausted(voucher)).length;
    const summary = document.createElement("div");
    summary.className = "svt-summary";
    summary.innerHTML = `<span class="svt-chip">Tổng: ${vouchers.length}</span><span class="svt-chip good">Còn lượt: ${available}</span><span class="svt-chip bad">Hết lượt: ${vouchers.length - available}</span>`;
    ui.results.append(summary);
    if (leadText) {
      const transfer = document.createElement("div");
      transfer.className = "svt-transfer";
      transfer.textContent = leadText;
      ui.results.append(transfer);
    }
    if (!vouchers.length) {
      ui.results.insertAdjacentHTML("beforeend", '<div class="svt-empty">Không có dữ liệu voucher.</div>');
      return;
    }
    vouchers.forEach(voucher => {
      const link = voucherLink(voucher);
      const code = cleanCode(voucher.voucher_code);
      const card = document.createElement("article");
      card.className = "svt-card";
      const icon = voucher.icon_hash
        ? `<span class="svt-icon"><img src="https://down-vn.img.susercontent.com/file/${escapeHtml(voucher.icon_hash)}" alt=""></span>`
        : '<span class="svt-icon">Shopee</span>';
      card.innerHTML = `${icon}<div><h3 class="svt-card-title"><a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(voucherTitle(voucher))}</a></h3><div class="svt-meta"><span>Promotion ID: ${escapeHtml(voucher.promotionid)}</span>${code ? `<span>Mã: <strong>${escapeHtml(code)}</strong></span>` : ""}<span>Đã dùng: ${Number(voucher.percentage_used || 0)}% · Đã lưu: ${Number(voucher.percentage_claimed || 0)}%</span></div><div class="svt-card-actions"></div></div>`;
      const actions = card.querySelector(".svt-card-actions");
      const save = makeButton("Save Voucher");
      const copyLink = makeButton("Copy Link");
      const copyPair = makeButton("Copy ID:SIGN");
      save.addEventListener("click", () => saveVoucher(voucher, save));
      copyLink.addEventListener("click", () => copyText(link, copyLink));
      copyPair.addEventListener("click", () => copyText(`${voucher.promotionid}:${voucher.signature}`, copyPair));
      actions.append(save, copyLink, copyPair);
      card.querySelector(".svt-icon")?.addEventListener("error", event => event.currentTarget.remove());
      ui.results.append(card);
    });
  }

  async function copyText(text, button) {
    const oldText = button?.textContent;
    try {
      await navigator.clipboard.writeText(String(text));
      if (button) button.textContent = "Đã copy";
    } catch {
      const area = document.createElement("textarea");
      area.value = String(text);
      area.style.cssText = "position:fixed;opacity:0";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      if (button) button.textContent = "Đã copy";
    }
    if (button) setTimeout(() => { button.textContent = oldText; }, 1200);
  }

  function normalizeMicrositePath(input) {
    const raw = String(input || "").trim();
    try {
      const url = new URL(raw);
      return `${url.pathname.replace(/^\/m(?:\/|$)/, "/")}${url.search}`.replace(/^\/+/, "");
    } catch {
      return raw.replace(/^\/?m\//i, "").replace(/^\/+/, "");
    }
  }

  async function getMicrositePage(input) {
    const finalUrl = await resolveFinalUrl(input || location.href);
    const path = normalizeMicrositePath(finalUrl);
    const response = await fetch("/api/v4/traffic/page_component/get_microsite_page", {
      method: "POST",
      credentials: "include",
      headers: { accept: "application/json", "content-type": "application/json", "x-api-source": "rn", "x-csrftoken": getCookie("csrftoken"), "x-shopee-client-timezone": "Asia/Ho_Chi_Minh" },
      body: JSON.stringify({ platform: "mobile", version: "2023.12.v2", device_height: 828, account: {}, url: path })
    });
    const json = await response.json();
    if (!response.ok || json?.error) throw new Error(json?.error_msg || `Banner API HTTP ${response.status}`);
    return { json, path };
  }

  function extractCollectionRequests(json) {
    const components = json?.data?.page?.data || json?.layout?.component_list || [];
    const micrositeId = json?.data?.page?.page_id || json?.layout?.page_id || 62026;
    const requests = [];
    for (const component of components) {
      try {
        let data = component.configurations?.data;
        if (!data && component.properties) data = JSON.parse(component.properties).find(item => item.key === "data")?.value;
        const collectionId = data?.voucher_collection_id;
        if (!collectionId) continue;
        requests.push({
          collection_id: collectionId,
          offset: 0,
          limit: Number(component.configurations?.style?.display_voucher_quantity) || 50,
          component_id: component.configurations?.id || component.component_id || component.instance_id || 0,
          component_type: 1,
          number_of_vouchers_per_row: Number(component.configurations?.style?.number_of_vouchers_per_row) || 2,
          microsite_id: micrositeId
        });
      } catch {}
    }
    return { components, requests };
  }

  async function scanBanner(input) {
    const { json, path } = await getMicrositePage(input);
    const { components, requests } = extractCollectionRequests(json);
    if (!requests.length) return { lines: [], components, path };
    const response = await fetch("/api/v1/microsite/get_vouchers_by_collections", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json", "x-csrftoken": getCookie("csrftoken"), "x-requested-with": "XMLHttpRequest" },
      body: JSON.stringify({ voucher_collection_request_list: requests })
    });
    const data = await response.json();
    if (!response.ok || data?.error) throw new Error(data?.error_msg || `Collection API HTTP ${response.status}`);
    const lines = [];
    for (const collection of data?.data || []) {
      for (const item of collection?.vouchers || []) {
        const voucher = item?.voucher?.voucher_identifier;
        if (voucher?.promotion_id && voucher?.signature) lines.push(`${voucher.promotion_id}:${voucher.signature}`);
      }
    }
    return { lines: [...new Set(lines)], components, path };
  }

  async function inspectBanner(input) {
    const finalUrl = await resolveFinalUrl(input || location.href);
    const path = normalizeMicrositePath(finalUrl);
    const response = await fetch(`/api/v4/microsite/campaign_site_page?platform=pc&_mod=microsite&url=${encodeURIComponent(path)}`, {
      credentials: "include",
      headers: { accept: "application/json", "x-api-source": "pc", "x-requested-with": "XMLHttpRequest" }
    });
    const json = await response.json();
    if (!response.ok || json?.error) throw new Error(json?.error_msg || `Microsite HTTP ${response.status}`);
    const page = json?.data?.data || {};
    const components = [...(page.content?.children || []), ...(page.next_content?.children || [])];
    const rows = [];
    if (page.expire_at) rows.push(`Banner thay đổi: ${new Date(page.expire_at * 1000).toLocaleString("vi-VN")}`);
    components.forEach((container, containerIndex) => {
      (container?.children || []).forEach((child, childIndex) => {
        const data = child?.data || {};
        const details = [`type=${child?.type || "unknown"}`];
        if (data.filename) details.push(`image=https://down-vn.img.susercontent.com/file/${data.filename}`);
        if (data.collection_id) details.push(`collection_id=${data.collection_id}`);
        if (data.placeholder_collection_id) details.push(`placeholder_collection_id=${data.placeholder_collection_id}`);
        if (data.image_collection_id) details.push(`image_collection_id=${data.image_collection_id}`);
        if (data.game_link) details.push(`game_link=${data.game_link}`);
        (data.hotspots || []).forEach((hotspot, index) => {
          const url = hotspot?.link || hotspot?.data?.url;
          if (url) details.push(`hotspot_${index + 1}=${url}`);
        });
        rows.push(`[${containerIndex + 1}.${childIndex + 1}] ${details.join(" | ")}`);
      });
    });
    return rows;
  }

  function openCheckVoucher() {
    const ui = createModal({ id: "svt-check-voucher", icon: "CV", title: "Check Voucher", subtitle: "Kiểm tra Promotion ID, signature hoặc link voucher.", placeholder: "Dán link, Promotion ID hoặc ID:SIGN — mỗi dòng một voucher" });
    const checkButton = makeButton("Check Voucher", "svt-primary");
    const clearButton = makeButton("Clear");
    ui.actions.append(checkButton, clearButton);
    checkButton.addEventListener("click", async () => {
      const inputs = ui.input.value.split("\n").map(value => value.trim()).filter(Boolean);
      if (!inputs.length) return setStatus(ui, "Vui lòng nhập voucher.", { error: true });
      checkButton.disabled = true;
      setStatus(ui, "Đang kiểm tra voucher...", { loading: true });
      try {
        const vouchers = await checkVouchers(inputs);
        renderVoucherResults(ui, vouchers);
        setStatus(ui, `Đã kiểm tra ${vouchers.length} voucher.`);
      } catch (error) {
        setStatus(ui, error.message, { error: true });
      } finally {
        checkButton.disabled = false;
      }
    });
    clearButton.addEventListener("click", () => { ui.input.value = ""; ui.results.replaceChildren(); setStatus(ui, ""); });
    ui.input.focus();
  }

  function openBannerVoucher() {
    const ui = createModal({ id: "svt-banner-voucher", icon: "BV", title: "Banner Voucher", subtitle: "Quét banner, lấy mã và chuyển qua cùng bộ Check Voucher.", placeholder: "Dán link microsite/banner Shopee; để trống sẽ dùng trang hiện tại" });
    const scanButton = makeButton("Quét & Check Voucher", "svt-primary");
    const inspectButton = makeButton("Xem Banner", "svt-info");
    const clearButton = makeButton("Clear");
    ui.actions.append(scanButton, inspectButton, clearButton);
    scanButton.addEventListener("click", async () => {
      scanButton.disabled = true;
      inspectButton.disabled = true;
      setStatus(ui, "Đang quét các collection trong banner...", { loading: true });
      try {
        const scan = await scanBanner(ui.input.value.trim() || location.href);
        if (!scan.lines.length) throw new Error("Banner không chứa voucher có Promotion ID/signature.");
        setStatus(ui, `Đã lấy ${scan.lines.length} mã. Đang chuyển sang Check Voucher...`, { loading: true });
        const vouchers = await checkVouchers(scan.lines);
        renderVoucherResults(ui, vouchers, `Banner đã lấy ${scan.lines.length} ID:SIGN và đưa vào bộ Check Voucher dùng chung.`);
        setStatus(ui, `Hoàn tất: ${vouchers.length} voucher từ banner.`);
      } catch (error) {
        setStatus(ui, error.message, { error: true });
      } finally {
        scanButton.disabled = false;
        inspectButton.disabled = false;
      }
    });
    inspectButton.addEventListener("click", async () => {
      inspectButton.disabled = true;
      setStatus(ui, "Đang đọc cấu trúc banner...", { loading: true });
      try {
        const rows = await inspectBanner(ui.input.value.trim() || location.href);
        ui.results.innerHTML = `<pre class="svt-structure">${escapeHtml(rows.join("\n\n") || "Không có component banner.")}</pre>`;
        setStatus(ui, `Đã đọc ${rows.length} thành phần.`);
      } catch (error) {
        setStatus(ui, error.message, { error: true });
      } finally {
        inspectButton.disabled = false;
      }
    });
    clearButton.addEventListener("click", () => { ui.input.value = ""; ui.results.replaceChildren(); setStatus(ui, ""); });
    ui.input.focus();
  }

  function getCookie(name) {
    return document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1] || "";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  window.ShopeeVoucherCore = Object.freeze({ VERSION, openCheckVoucher, openBannerVoucher, checkVouchers, scanBanner });
})();
