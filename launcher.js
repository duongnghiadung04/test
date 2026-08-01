(() => {
  "use strict";

  const ROOT_ID = "shopee-toolkit-launcher";
  const STYLE_ID = `${ROOT_ID}-styles`;
  const currentScriptUrl = document.currentScript?.src || window.SHOPEE_TOOLKIT_LAUNCHER_URL || "";
  const baseUrl = window.SHOPEE_TOOLKIT_BASE_URL || (currentScriptUrl ? new URL(".", currentScriptUrl).href : "");

  window.ShopeeToolkitBack = () => {
    document.getElementById("shopee-toolkit-loader")?.remove();
    const script = document.createElement("script");
    script.id = "shopee-toolkit-loader";
    const launcherUrl = new URL("launcher.js", baseUrl);
    launcherUrl.searchParams.set("v", Date.now());
    script.src = launcherUrl.href;
    script.onerror = () => alert("Không tải lại được Shopee Toolkit.");
    document.documentElement.append(script);
  };

  if (!/(^|\.)shopee\.vn$/i.test(location.hostname)) {
    alert("Hãy mở Shopee.vn rồi chạy bookmarklet này.");
    return;
  }

  document.getElementById(ROOT_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  if (!baseUrl) {
    alert("Không xác định được URL bộ công cụ. Hãy chạy launcher bằng bookmarklet.");
    return;
  }

  const styles = document.createElement("style");
  styles.id = STYLE_ID;
  styles.textContent = `
    #${ROOT_ID},#${ROOT_ID} *{box-sizing:border-box}
    #${ROOT_ID}{--brand:#ee4d2d;--brand-soft:#fff0ec;--text:#172033;--muted:#6a778a;--line:#e1e7ef;position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;padding:16px;color:var(--text);background:rgba(30,41,59,.34);backdrop-filter:blur(12px) saturate(.88);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #${ROOT_ID} button{font:inherit}
    #${ROOT_ID} .st-panel{width:min(760px,100%);max-height:calc(100vh - 32px);overflow:auto;border:1px solid rgba(255,255,255,.94);border-radius:22px;background:#f6f8fb;box-shadow:0 28px 80px rgba(28,39,58,.22),0 2px 8px rgba(28,39,58,.08)}
    #${ROOT_ID} .st-header{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:23px 24px 19px;border-bottom:1px solid var(--line);background:#fff}
    #${ROOT_ID} .st-brand{display:flex;align-items:center;gap:13px;min-width:0}
    #${ROOT_ID} .st-logo{display:grid;width:44px;height:44px;flex:0 0 44px;place-items:center;border-radius:13px;color:#fff;background:var(--brand);font-size:14px;font-weight:900;letter-spacing:-.04em;box-shadow:0 9px 20px rgba(238,77,45,.2)}
    #${ROOT_ID} .st-kicker{display:block;margin-bottom:4px;color:var(--brand);font-size:8px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}
    #${ROOT_ID} h1{margin:0;color:var(--text);font-size:21px;line-height:1.15;letter-spacing:-.04em}
    #${ROOT_ID} .st-subtitle{margin:5px 0 0;color:var(--muted);font-size:10.5px;line-height:1.45}
    #${ROOT_ID} .st-close{display:grid;width:38px;height:38px;flex:0 0 38px;place-items:center;border:1px solid var(--line);border-radius:10px;color:#607087;background:#f8fafc;font-size:18px;cursor:pointer;transition:.15s}
    #${ROOT_ID} .st-close:hover{border-color:#ffc3b6;color:var(--brand);background:var(--brand-soft)}
    #${ROOT_ID} .st-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 24px 10px}
    #${ROOT_ID} .st-toolbar-title{margin:0;color:#354158;font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
    #${ROOT_ID} .st-ready{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #dfe5ed;border-radius:99px;color:#667389;background:#fff;font-size:9px;font-weight:700}
    #${ROOT_ID} .st-ready:before{width:7px;height:7px;border-radius:50%;background:#16a177;box-shadow:0 0 0 3px rgba(22,161,119,.1);content:""}
    #${ROOT_ID} .st-tools{display:flex;flex-direction:column;gap:8px;padding:0 24px 20px}
    #${ROOT_ID} .st-tool{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:13px;min-height:75px;padding:11px 13px;border:1px solid var(--line);border-radius:14px;color:inherit;background:#fff;text-align:left;cursor:pointer;box-shadow:0 3px 10px rgba(39,53,76,.035);transition:transform .15s,border-color .15s,box-shadow .15s,background .15s}
    #${ROOT_ID} .st-tool:hover{border-color:#f4b3a5;background:#fffdfc;box-shadow:0 8px 20px rgba(39,53,76,.08);transform:translateY(-1px)}
    #${ROOT_ID} .st-tool:disabled{opacity:.58;cursor:wait;transform:none}
    #${ROOT_ID} .st-number{display:grid;width:42px;height:42px;place-items:center;border-radius:11px;color:var(--brand);background:var(--brand-soft);font-size:10px;font-weight:850;letter-spacing:.06em}
    #${ROOT_ID} .st-copy{display:block;min-width:0}
    #${ROOT_ID} .st-meta{display:block;margin-bottom:3px;color:#a56c60;font-size:7.5px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}
    #${ROOT_ID} .st-title{display:block;margin-bottom:3px;color:var(--text);font-size:13px;font-weight:780;letter-spacing:-.015em}
    #${ROOT_ID} .st-description{display:block;overflow:hidden;color:var(--muted);font-size:10px;line-height:1.42;text-overflow:ellipsis;white-space:nowrap}
    #${ROOT_ID} .st-open{min-height:31px;padding:0 10px;border:1px solid var(--line);border-radius:9px;color:#55647a;background:#f8fafc;font-size:9px;font-weight:750;cursor:pointer}
    #${ROOT_ID} .st-tool:hover .st-open{border-color:var(--brand);color:#fff;background:var(--brand)}
    #${ROOT_ID} .st-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 24px 15px;border-top:1px solid var(--line);color:#8a96a7;background:#fff;font-size:9.5px}
    #${ROOT_ID} .st-status{min-height:15px;color:#667389}
    #${ROOT_ID} .st-status[data-error=true]{color:#bd3731}
    #${ROOT_ID} .st-version{font-weight:800;letter-spacing:.08em}
    #${ROOT_ID} .st-spinner{display:inline-block;width:11px;height:11px;margin-right:7px;border:2px solid #dce2ea;border-top-color:var(--brand);border-radius:50%;vertical-align:-2px;animation:st-spin .7s linear infinite}
    @keyframes st-spin{to{transform:rotate(360deg)}}
    @media(max-width:600px){
      #${ROOT_ID}{padding:6px}
      #${ROOT_ID} .st-panel{max-height:calc(100vh - 12px);border-radius:16px}
      #${ROOT_ID} .st-header{padding:18px 15px 15px}
      #${ROOT_ID} .st-logo{width:40px;height:40px;flex-basis:40px}
      #${ROOT_ID} h1{font-size:18px}
      #${ROOT_ID} .st-subtitle{display:none}
      #${ROOT_ID} .st-toolbar{padding:14px 14px 9px}
      #${ROOT_ID} .st-tools{padding:0 14px 14px}
      #${ROOT_ID} .st-tool{grid-template-columns:38px minmax(0,1fr) auto;gap:10px;min-height:70px;padding:9px}
      #${ROOT_ID} .st-number{width:38px;height:38px}
      #${ROOT_ID} .st-description{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}
      #${ROOT_ID} .st-open{width:32px;padding:0;overflow:hidden;color:transparent;font-size:0}
      #${ROOT_ID} .st-open:after{color:inherit;font-size:14px;content:"→"}
      #${ROOT_ID} .st-footer{padding:11px 14px 13px}
    }
  `;
  document.head.append(styles);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = `
    <section class="st-panel" role="dialog" aria-modal="true" aria-label="Shopee Toolkit">
      <header class="st-header">
        <div class="st-brand">
          <span class="st-logo">ST</span>
          <div><span class="st-kicker">Shopee workspace</span><h1>Shopee Toolkit</h1><p class="st-subtitle">Chọn công cụ để chạy trực tiếp trên trang Shopee hiện tại.</p></div>
        </div>
        <button class="st-close" type="button" aria-label="Đóng">×</button>
      </header>
      <div class="st-toolbar"><p class="st-toolbar-title">Danh sách công cụ</p><span class="st-ready">Sẵn sàng</span></div>
      <div class="st-tools"></div>
      <footer class="st-footer"><div class="st-status" role="status">Đang tải danh mục công cụ...</div><span class="st-version">V4.1 LIGHT</span></footer>
    </section>`;
  document.body.append(root);

  const toolsContainer = root.querySelector(".st-tools");
  const status = root.querySelector(".st-status");
  root.querySelector(".st-close").addEventListener("click", closeLauncher);
  root.addEventListener("click", event => {
    if (event.target === root) closeLauncher();
  });

  function closeLauncher() {
    root.remove();
    styles.remove();
  }

  function loadScript(relativePath, elementId) {
    return new Promise((resolve, reject) => {
      document.getElementById(elementId)?.remove();
      const script = document.createElement("script");
      script.id = elementId;
      const url = new URL(relativePath, baseUrl);
      url.searchParams.set("v", Date.now());
      script.src = url.href;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Không tải được ${url.href}. Hãy kiểm tra GitHub Pages và CSP của trình duyệt.`));
      document.documentElement.append(script);
    });
  }

  async function runTool(tool, button) {
    if (tool.existingSelector && document.querySelector(tool.existingSelector)) {
      closeLauncher();
      return;
    }

    button.disabled = true;
    status.dataset.error = "false";
    status.innerHTML = `<span class="st-spinner"></span>Đang tải ${escapeHtml(tool.title)}...`;

    try {
      for (const dependency of tool.dependencies || []) {
        await loadScript(dependency, `shopee-tool-dependency-${dependency.replace(/[^a-z0-9]+/gi, "-")}`);
      }
      await loadScript(tool.file, `shopee-tool-${tool.id}`);
      if (tool.entry) {
        if (typeof window[tool.entry] !== "function") throw new Error(`Không tìm thấy hàm ${tool.entry}().`);
        await window[tool.entry]();
      }
      closeLauncher();
    } catch (error) {
      button.disabled = false;
      status.dataset.error = "true";
      status.textContent = error?.message || "Không thể chạy công cụ.";
    }
  }

  function renderCatalog(catalog) {
    toolsContainer.replaceChildren();
    catalog.forEach((tool, index) => {
      const button = document.createElement("button");
      button.className = "st-tool";
      button.type = "button";
      button.dataset.tool = tool.id;
      const category = tool.id.includes("product") ? "Sản phẩm" : tool.id.includes("wallet") ? "Tài khoản" : tool.id.includes("auto") ? "Tự động" : tool.id.includes("banner") ? "Chiến dịch" : "Voucher";
      button.innerHTML = `<span class="st-number">${String(index + 1).padStart(2, "0")}</span><span class="st-copy"><span class="st-meta">${category}</span><span class="st-title">${escapeHtml(tool.title)}</span><span class="st-description">${escapeHtml(tool.description)}</span></span><span class="st-open" aria-hidden="true">Mở</span>`;
      button.addEventListener("click", () => runTool(tool, button));
      toolsContainer.append(button);
    });
    status.textContent = `${catalog.length} công cụ sẵn sàng.`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  }

  (async () => {
    try {
      window.SHOPEE_TOOLKIT_CATALOG = undefined;
      await loadScript("tools/catalog.js", "shopee-toolkit-catalog-script");
      const catalog = window.SHOPEE_TOOLKIT_CATALOG;
      if (!Array.isArray(catalog) || !catalog.length) throw new Error("Danh mục công cụ trống hoặc không hợp lệ.");
      renderCatalog(catalog);
    } catch (error) {
      status.dataset.error = "true";
      status.textContent = error?.message || "Không tải được danh mục công cụ.";
    }
  })();
})();
