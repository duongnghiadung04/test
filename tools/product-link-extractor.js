(() => {
  "use strict";

  const APP_ID = "shopee-product-link-extractor";
  const API_URL = "/api/v4/chat/get_item_list";
  const SHOP_DETAIL_URL = "/api/v4/shop/get_shop_detail";
  const PAGE_LIMIT = 1000;

  document.getElementById(APP_ID)?.remove();
  document.getElementById(`${APP_ID}-styles`)?.remove();

  const state = {
    products: [],
    shopId: "",
    search: "",
    sort: null,
    loading: false
  };

  const styles = document.createElement("style");
  styles.id = `${APP_ID}-styles`;
  styles.textContent = `
    #${APP_ID}, #${APP_ID} * { box-sizing: border-box; }
    #${APP_ID} {
      --bg:#f4f7fb; --panel:#ffffff; --soft:#f8fafc; --line:#e2e8f0;
      --text:#172033; --muted:#64748b; --accent:#ee4d2d; --danger:#dc2626;
      position:fixed; z-index:2147483647; inset:18px; display:flex;
      align-items:center; justify-content:center; color:var(--text);
      font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }
    #${APP_ID} .spe-backdrop {
      position:absolute; inset:-18px; background:rgba(15,23,42,.38); backdrop-filter:blur(8px);
    }
    #${APP_ID} .spe-panel {
      position:relative; display:flex; flex-direction:column; width:min(1180px,100%);
      max-height:calc(100vh - 36px); overflow:hidden; border:1px solid var(--line);
      border-radius:18px; background:var(--panel); box-shadow:0 28px 90px rgba(15,23,42,.22);
    }
    #${APP_ID} .spe-header {
      display:flex; align-items:center; justify-content:space-between; gap:16px;
      padding:18px 20px; border-bottom:1px solid var(--line);
    }
    #${APP_ID} h2 { margin:0; font-size:21px; letter-spacing:-.03em; }
    #${APP_ID} .spe-subtitle { margin:3px 0 0; color:var(--muted); font-size:12px; }
    #${APP_ID} .spe-close {
      width:38px; height:38px; border:1px solid var(--line); border-radius:10px;
      color:var(--text); background:var(--soft); font-size:22px; cursor:pointer;
    }
    #${APP_ID} .spe-controls { padding:16px 20px; border-bottom:1px solid var(--line); }
    #${APP_ID} .spe-fetch { display:grid; grid-template-columns:1fr auto; gap:10px; }
    #${APP_ID} input {
      width:100%; min-height:44px; padding:0 13px; border:1px solid var(--line);
      border-radius:10px; outline:none; color:var(--text); background:#f8fafc;
      font:inherit;
    }
    #${APP_ID} input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(238,77,45,.14); }
    #${APP_ID} button, #${APP_ID} .spe-open {
      display:inline-flex; min-height:38px; align-items:center; justify-content:center;
      padding:0 13px; border:1px solid var(--line); border-radius:9px; color:#334155;
      background:var(--soft); font:700 12px/1 Inter,ui-sans-serif,sans-serif;
      text-decoration:none; white-space:nowrap; cursor:pointer;
    }
    #${APP_ID} button:hover:not(:disabled), #${APP_ID} .spe-open:hover { border-color:#f1a08d; color:#d93f20; background:#fff8f6; }
    #${APP_ID} button:disabled { opacity:.38; cursor:not-allowed; }
    #${APP_ID} .spe-get {
      min-width:90px; min-height:44px; border-color:transparent;
      color:#fff; background:linear-gradient(135deg,#ff6747,#e83d1c);
    }
    #${APP_ID} .spe-get:hover:not(:disabled) { border-color:transparent; color:#fff; background:linear-gradient(135deg,#ff795b,#ed4b29); }
    #${APP_ID} .spe-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    #${APP_ID} .spe-status { display:flex; align-items:center; gap:8px; margin-top:10px; color:var(--muted); font-size:12px; }
    #${APP_ID} .spe-spinner {
      width:15px; height:15px; border:2px solid #334155; border-top-color:var(--accent);
      border-radius:50%; animation:spe-spin .7s linear infinite;
    }
    @keyframes spe-spin { to { transform:rotate(360deg); } }
    #${APP_ID} .spe-error {
      margin-top:10px; padding:10px 12px; border:1px solid rgba(251,113,133,.3);
      border-radius:9px; color:#b91c1c; background:#fef2f2;
      font-size:12px; overflow-wrap:anywhere;
    }
    #${APP_ID} .spe-toolbar {
      display:flex; align-items:center; justify-content:space-between; gap:14px;
      padding:11px 20px; border-bottom:1px solid var(--line);
    }
    #${APP_ID} .spe-count { color:var(--muted); font-size:12px; }
    #${APP_ID} .spe-count strong { color:#111827; font-size:16px; }
    #${APP_ID} .spe-search { width:min(320px,100%); min-height:38px; }
    #${APP_ID} .spe-table-wrap { min-height:240px; overflow:auto; }
    #${APP_ID} table { width:100%; border-collapse:separate; border-spacing:0; font-size:12px; }
    #${APP_ID} th {
      position:sticky; z-index:2; top:0; padding:11px 12px; border-bottom:1px solid var(--line);
      color:#475569; background:#f8fafc; text-align:left; white-space:nowrap;
    }
    #${APP_ID} td { padding:10px 12px; border-bottom:1px solid rgba(148,163,184,.1); }
    #${APP_ID} th:first-child, #${APP_ID} td:first-child { width:54px; text-align:center; }
    #${APP_ID} .spe-id { font-variant-numeric:tabular-nums; white-space:nowrap; }
    #${APP_ID} .spe-link {
      display:block; max-width:390px; overflow:hidden; color:#e64727;
      text-overflow:ellipsis; white-space:nowrap;
    }
    #${APP_ID} .spe-row-actions { display:flex; justify-content:flex-end; gap:5px; }
    #${APP_ID} .spe-row-actions button, #${APP_ID} .spe-row-actions a { min-height:30px; padding:0 8px; font-size:10px; }
    #${APP_ID} .spe-empty { padding:55px 20px; color:var(--muted); text-align:center; }
    #${APP_ID} .spe-toast {
      position:absolute; right:18px; bottom:18px; padding:11px 14px; border:1px solid rgba(52,211,153,.3);
      border-radius:9px; color:#047857; background:#ecfdf5; box-shadow:0 12px 32px rgba(15,23,42,.16);
      font-size:12px; font-weight:800;
    }
    @media(max-width:700px) {
      #${APP_ID} { inset:6px; }
      #${APP_ID} .spe-backdrop { inset:-6px; }
      #${APP_ID} .spe-panel { max-height:calc(100vh - 12px); }
      #${APP_ID} .spe-toolbar { align-items:stretch; flex-direction:column; }
      #${APP_ID} .spe-search { width:100%; }
      #${APP_ID} th:nth-child(3), #${APP_ID} td:nth-child(3) { display:none; }
      #${APP_ID} .spe-link { max-width:170px; }
    }
  `;
  document.head.append(styles);

  const app = document.createElement("div");
  app.id = APP_ID;
  app.innerHTML = `
    <div class="spe-backdrop"></div>
    <section class="spe-panel" role="dialog" aria-modal="true" aria-label="Shopee Product Link Extractor">
      <header class="spe-header">
        <div>
          <h2>Shopee Product Link Extractor</h2>
          <p class="spe-subtitle">Hỗ trợ Shop ID, username, link shop và link sản phẩm Shopee.</p>
        </div>
        <button class="spe-close" type="button" title="Đóng" aria-label="Đóng">×</button>
      </header>
      <div class="spe-controls">
        <form class="spe-fetch">
          <input class="spe-shop-id" type="text" placeholder="Shop ID, username, link shop hoặc sản phẩm..." required>
          <button class="spe-get" type="submit">GET</button>
        </form>
        <div class="spe-actions">
          <button class="spe-copy-links spe-data" type="button" disabled>Copy All Links</button>
          <button class="spe-copy-ids spe-data" type="button" disabled>Copy All Item IDs</button>
          <button class="spe-export spe-data" type="button" disabled>Export CSV</button>
          <button class="spe-clear" type="button">Clear</button>
        </div>
        <div class="spe-status" hidden><span class="spe-spinner"></span><span class="spe-status-text">Loading...</span></div>
        <div class="spe-error" hidden></div>
      </div>
      <div class="spe-toolbar">
        <span class="spe-count">Tổng sản phẩm: <strong>0</strong></span>
        <input class="spe-search" type="search" placeholder="Tìm Item ID, Shop ID hoặc link..." disabled>
      </div>
      <div class="spe-table-wrap">
        <table>
          <thead><tr>
            <th>STT</th>
            <th><button class="spe-sort" type="button" disabled>Item ID <span>↕</span></button></th>
            <th>Shop ID</th>
            <th>Product Link</th>
            <th></th>
          </tr></thead>
          <tbody></tbody>
        </table>
        <div class="spe-empty">Chưa có sản phẩm. Nhập Shop ID và bấm GET.</div>
      </div>
    </section>
  `;
  document.body.append(app);

  const $ = (selector) => app.querySelector(selector);
  const elements = {
    form: $(".spe-fetch"),
    shopId: $(".spe-shop-id"),
    get: $(".spe-get"),
    copyLinks: $(".spe-copy-links"),
    copyIds: $(".spe-copy-ids"),
    export: $(".spe-export"),
    clear: $(".spe-clear"),
    close: $(".spe-close"),
    status: $(".spe-status"),
    statusText: $(".spe-status-text"),
    error: $(".spe-error"),
    count: $(".spe-count strong"),
    search: $(".spe-search"),
    sort: $(".spe-sort"),
    sortIcon: $(".spe-sort span"),
    tbody: $("tbody"),
    empty: $(".spe-empty")
  };

  async function fetchProducts() {
    const shopInput = elements.shopId.value.trim();
    if (!shopInput) {
      showError("Vui lòng nhập Shop ID, username, link shop hoặc link sản phẩm Shopee.");
      return;
    }

    Object.assign(state, { products: [], shopId: "", search: "", sort: null });
    elements.search.value = "";
    hideError();
    showLoading();
    renderTable();

    let offset = 0;
    let page = 1;
    const seenOffsets = new Set();
    const seenProducts = new Set();

    try {
      elements.statusText.textContent = "Đang xác định Shop ID...";
      const shopId = await resolveShopId(shopInput);
      state.shopId = shopId;

      while (true) {
        if (seenOffsets.has(offset)) {
          throw new Error(`next_offset bị lặp (${offset}).`);
        }
        seenOffsets.add(offset);
        elements.statusText.textContent = `Loading... Trang ${page} · ${state.products.length.toLocaleString("vi-VN")} sản phẩm`;

        const response = await fetch(API_URL, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offset,
            limit: PAGE_LIMIT,
            sort_type: 4,
            is_asc: false,
            query_as_buyer: true,
            shop_id: shopId
          })
        });

        const rawText = await response.text();
        let json;
        try {
          json = rawText ? JSON.parse(rawText) : {};
        } catch {
          throw new Error(`HTTP ${response.status}: Response không phải JSON hợp lệ.`);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}: ${json?.error_msg || json?.message || "Request thất bại"}`);
        }
        if (!json?.data || !Array.isArray(json.data.shop_item_ids)) {
          throw new Error(`Dữ liệu API không hợp lệ: ${json?.error_msg || json?.message || "không có data.shop_item_ids"}`);
        }

        for (const item of json.data.shop_item_ids) {
          const itemId = String(item?.item_id ?? "").trim();
          const itemShopId = String(item?.shop_id ?? shopId).trim();
          const key = `${itemShopId}:${itemId}`;
          if (itemId && itemShopId && !seenProducts.has(key)) {
            seenProducts.add(key);
            state.products.push({
              shopId: itemShopId,
              itemId,
              link: `https://shopee.vn/product/${itemShopId}/${itemId}`
            });
          }
        }

        elements.count.textContent = state.products.length.toLocaleString("vi-VN");
        if (json.data.has_more !== true) break;

        const nextOffset = Number(json.data.next_offset);
        if (!Number.isFinite(nextOffset) || nextOffset < 0) {
          throw new Error("data.next_offset không hợp lệ.");
        }
        offset = nextOffset;
        page += 1;
      }

      renderTable();
      showToast("Done!");
    } catch (error) {
      showError(`Không thể lấy sản phẩm. ${error.message}`);
      renderTable();
    } finally {
      hideLoading();
    }
  }

  async function resolveShopId(input) {
    const value = input.trim();
    if (/^\d+$/.test(value)) return value;

    const productShopId = extractShopIdFromProductUrl(value);
    if (productShopId) return productShopId;

    const username = extractShopUsername(value);
    if (!username) {
      throw new Error("Không nhận dạng được shop. Hãy nhập Shop ID, username, link shop hoặc link sản phẩm Shopee.");
    }
    if (/^\d+$/.test(username)) return username;

    const response = await fetch(`${SHOP_DETAIL_URL}?username=${encodeURIComponent(username)}`, {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" }
    });

    const rawText = await response.text();
    let json;
    try {
      json = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(`HTTP ${response.status}: API chi tiết shop không trả về JSON hợp lệ.`);
    }

    if (!response.ok) {
      throw new Error(`Không thể tìm shop "${username}". HTTP ${response.status} ${response.statusText}: ${json?.error_msg || json?.message || "Request thất bại"}`);
    }
    if (json?.error && Number(json.error) !== 0) {
      throw new Error(`Không thể tìm shop "${username}": ${json.error_msg || `mã lỗi ${json.error}`}`);
    }

    const shopId = String(json?.data?.shopid ?? "").trim();
    if (!/^\d+$/.test(shopId)) {
      throw new Error(`Không tìm thấy Shop ID cho username "${username}".`);
    }

    return shopId;
  }

  function extractShopIdFromProductUrl(input) {
    const value = input.trim();
    if (!/^(?:https?:\/\/|www\.|shopee\.vn\/)/i.test(value)) return "";

    try {
      const urlText = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      const url = new URL(urlText);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      if (hostname !== "shopee.vn" && !hostname.endsWith(".shopee.vn")) return "";

      const decodedPath = decodeURIComponent(url.pathname);
      const canonicalMatch = decodedPath.match(/\/product\/(\d+)\/\d+(?:\/|$)/i);
      if (canonicalMatch) return canonicalMatch[1];

      const seoMatch = decodedPath.match(/-i\.(\d+)\.\d+(?:\/|$)/i);
      return seoMatch ? seoMatch[1] : "";
    } catch {
      return "";
    }
  }

  function extractShopUsername(input) {
    let candidate = input.trim().replace(/^@/, "");

    if (/^(?:https?:\/\/|www\.|shopee\.vn\/)/i.test(candidate)) {
      try {
        const urlText = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
        const url = new URL(urlText);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
        if (hostname !== "shopee.vn" && !hostname.endsWith(".shopee.vn")) return "";

        const segments = url.pathname
          .split("/")
          .filter(Boolean)
          .map((segment) => decodeURIComponent(segment));

        if (!segments.length) return "";
        candidate = segments[0].toLowerCase() === "shop" && segments[1]
          ? segments[1]
          : segments[0];
      } catch {
        return "";
      }
    }

    candidate = candidate.replace(/^@/, "").trim();
    if (/^\d+$/.test(candidate)) return candidate;
    return /^[a-zA-Z0-9._-]+$/.test(candidate) ? candidate : "";
  }

  function renderTable() {
    const term = state.search.toLowerCase();
    let products = state.products.filter((product) =>
      product.itemId.toLowerCase().includes(term) ||
      product.shopId.toLowerCase().includes(term) ||
      product.link.toLowerCase().includes(term)
    );

    if (state.sort) {
      const direction = state.sort === "asc" ? 1 : -1;
      products = [...products].sort((a, b) => compareIds(a.itemId, b.itemId) * direction);
    }

    elements.tbody.replaceChildren();
    const fragment = document.createDocumentFragment();

    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="spe-id"></td>
        <td class="spe-id"></td>
        <td><a class="spe-link" target="_blank" rel="noopener noreferrer"></a></td>
        <td><div class="spe-row-actions"></div></td>
      `;
      row.children[1].textContent = product.itemId;
      row.children[2].textContent = product.shopId;
      const productLink = row.querySelector(".spe-link");
      productLink.href = product.link;
      productLink.textContent = product.link;
      const rowActions = row.querySelector(".spe-row-actions");
      rowActions.append(
        createButton("Copy ID", () => copyText(product.itemId)),
        createButton("Copy Link", () => copyText(product.link)),
        createOpenLink(product.link)
      );
      fragment.append(row);
    });

    elements.tbody.append(fragment);
    const hasProducts = state.products.length > 0;
    elements.empty.hidden = products.length > 0;
    elements.empty.textContent = hasProducts
      ? "Không tìm thấy kết quả."
      : "Chưa có sản phẩm. Nhập Shop ID và bấm GET.";
    elements.count.textContent = state.products.length.toLocaleString("vi-VN");
    app.querySelectorAll(".spe-data").forEach((button) => {
      button.disabled = !hasProducts || state.loading;
    });
    elements.search.disabled = !hasProducts || state.loading;
    elements.sort.disabled = !hasProducts || state.loading;
    elements.sortIcon.textContent = state.sort === "asc" ? "↑" : state.sort === "desc" ? "↓" : "↕";
  }

  async function copyLinks() {
    if (state.products.length) {
      await copyText(state.products.map((product) => product.link).join("\n"));
    }
  }

  async function copyItemIds() {
    if (state.products.length) {
      await copyText(state.products.map((product) => product.itemId).join("\n"));
    }
  }

  function exportCSV() {
    if (!state.products.length) return;
    const rows = [
      ["STT", "ShopID", "ItemID", "ProductLink"],
      ...state.products.map((product, index) => [index + 1, product.shopId, product.itemId, product.link])
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `shop_${state.shopId}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Exported!");
  }

  function showToast(message) {
    app.querySelector(".spe-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "spe-toast";
    toast.textContent = message;
    app.append(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  function showLoading() {
    state.loading = true;
    elements.status.hidden = false;
    elements.get.disabled = true;
    elements.shopId.disabled = true;
    renderTable();
  }

  function hideLoading() {
    state.loading = false;
    elements.status.hidden = true;
    elements.get.disabled = false;
    elements.shopId.disabled = false;
    renderTable();
  }

  function showError(message) {
    elements.error.textContent = message;
    elements.error.hidden = false;
  }

  function hideError() {
    elements.error.hidden = true;
    elements.error.textContent = "";
  }

  function clearAll() {
    Object.assign(state, { products: [], shopId: "", search: "", sort: null });
    elements.shopId.value = "";
    elements.search.value = "";
    hideError();
    renderTable();
    elements.shopId.focus();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!");
    } catch (error) {
      showError(`Không thể sao chép: ${error.message}`);
    }
  }

  function createButton(label, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
  }

  function createOpenLink(url) {
    const link = document.createElement("a");
    link.className = "spe-open";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open";
    return link;
  }

  function compareIds(a, b) {
    const aa = a.replace(/^0+/, "") || "0";
    const bb = b.replace(/^0+/, "") || "0";
    return aa.length === bb.length ? aa.localeCompare(bb) : aa.length - bb.length;
  }

  function escapeCSV(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
  }

  function closeApp() {
    app.remove();
    styles.remove();
  }

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    fetchProducts();
  });
  elements.copyLinks.addEventListener("click", copyLinks);
  elements.copyIds.addEventListener("click", copyItemIds);
  elements.export.addEventListener("click", exportCSV);
  elements.clear.addEventListener("click", clearAll);
  elements.close.addEventListener("click", closeApp);
  elements.search.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderTable();
  });
  elements.sort.addEventListener("click", () => {
    state.sort = state.sort === null ? "asc" : state.sort === "asc" ? "desc" : null;
    renderTable();
  });

  renderTable();
  elements.shopId.focus();
})();
