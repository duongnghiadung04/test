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
    #${ROOT_ID}{position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.48);backdrop-filter:blur(12px) saturate(.8);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033}
    #${ROOT_ID} .st-panel{position:relative;width:min(740px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid rgba(255,255,255,.8);border-radius:26px;background:#f8fafc;box-shadow:0 32px 100px rgba(15,23,42,.3),0 2px 8px rgba(15,23,42,.1)}
    #${ROOT_ID} .st-panel:before{position:absolute;z-index:2;inset:0 0 auto;height:5px;border-radius:26px 26px 0 0;background:linear-gradient(90deg,#ee4d2d,#ff835f 62%,#ffc4b5);content:""}
    #${ROOT_ID} .st-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:27px 28px 23px;border-bottom:1px solid #e9eef5;background:#fff}
    #${ROOT_ID} .st-brand{display:flex;align-items:center;gap:15px}
    #${ROOT_ID} .st-logo{display:grid;width:48px;height:48px;flex:0 0 48px;place-items:center;border-radius:15px;color:#fff;background:linear-gradient(145deg,#ff714f,#e83d1c);font-size:20px;font-weight:900;letter-spacing:-.04em;box-shadow:0 11px 24px rgba(238,77,45,.25)}
    #${ROOT_ID} .st-kicker{display:block;margin-bottom:3px;color:#ee4d2d;font-size:9px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}
    #${ROOT_ID} h1{margin:0;color:#111827;font-size:21px;line-height:1.15;letter-spacing:-.035em}
    #${ROOT_ID} .st-subtitle{margin:5px 0 0;color:#64748b;font-size:11.5px}
    #${ROOT_ID} button{font:inherit}
    #${ROOT_ID} .st-close{display:grid;width:40px;height:40px;place-items:center;border:1px solid #dfe6ef;border-radius:12px;color:#64748b;background:#f8fafc;font-size:20px;cursor:pointer;transition:border-color .15s,color .15s,background .15s,transform .15s}
    #${ROOT_ID} .st-close:hover{border-color:#ffc1b2;color:#e64727;background:#fff4f1;transform:rotate(3deg)}
    #${ROOT_ID} .st-section-head{display:flex;align-items:center;justify-content:space-between;padding:19px 28px 0}
    #${ROOT_ID} .st-section-title{margin:0;color:#334155;font-size:10px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}
    #${ROOT_ID} .st-ready{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:10.5px}
    #${ROOT_ID} .st-ready:before{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.1);content:""}
    #${ROOT_ID} .st-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;padding:13px 28px 22px}
    #${ROOT_ID} .st-tool{position:relative;display:grid;grid-template-columns:42px minmax(0,1fr) 28px;align-items:center;gap:13px;min-height:112px;padding:17px 16px;border:1px solid #e3e9f1;border-radius:16px;color:inherit;background:#fff;text-align:left;cursor:pointer;box-shadow:0 3px 12px rgba(15,23,42,.035);transition:transform .17s,border-color .17s,box-shadow .17s,background .17s}
    #${ROOT_ID} .st-tool:before{position:absolute;inset:14px auto 14px 0;width:3px;border-radius:0 4px 4px 0;background:#ee4d2d;opacity:0;content:"";transition:opacity .17s}
    #${ROOT_ID} .st-tool:hover{border-color:#f3b1a2;background:#fffdfc;box-shadow:0 10px 26px rgba(238,77,45,.1);transform:translateY(-2px)}
    #${ROOT_ID} .st-tool:hover:before{opacity:1}
    #${ROOT_ID} .st-tool:disabled{opacity:.62;cursor:wait;transform:none}
    #${ROOT_ID} .st-number{display:grid;width:42px;height:42px;place-items:center;border:1px solid #ffd1c6;border-radius:13px;color:#ee4d2d;background:#fff4f1;font-size:11px;font-weight:900;letter-spacing:.04em}
    #${ROOT_ID} .st-copy{display:block;min-width:0}
    #${ROOT_ID} .st-meta{display:block;margin-bottom:5px;color:#f0775d;font-size:8.5px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
    #${ROOT_ID} .st-title{display:block;margin-bottom:5px;color:#111827;font-size:14.5px;font-weight:820;letter-spacing:-.015em}
    #${ROOT_ID} .st-description{display:-webkit-box;overflow:hidden;color:#64748b;font-size:10.8px;line-height:1.48;-webkit-box-orient:vertical;-webkit-line-clamp:2}
    #${ROOT_ID} .st-arrow{display:grid;width:28px;height:28px;place-items:center;border-radius:9px;color:#94a3b8;background:#f1f5f9;font-size:15px;transition:color .15s,background .15s,transform .15s}
    #${ROOT_ID} .st-tool:hover .st-arrow{color:#fff;background:#ee4d2d;transform:translateX(2px)}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"]{grid-column:1/-1;min-height:96px;background:linear-gradient(135deg,#fff,#fff8f6)}
    #${ROOT_ID} .st-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 28px 17px;border-top:1px solid #e9eef5;color:#94a3b8;background:#fff;font-size:10.5px}
    #${ROOT_ID} .st-status{min-height:16px;color:#64748b}
    #${ROOT_ID} .st-status[data-error=true]{color:#dc2626}
    #${ROOT_ID} .st-version{color:#c0c8d4;font-weight:700;letter-spacing:.05em}
    #${ROOT_ID} .st-spinner{display:inline-block;width:12px;height:12px;margin-right:7px;border:2px solid #d5dde8;border-top-color:#ee4d2d;border-radius:50%;vertical-align:-2px;animation:st-spin .7s linear infinite}
    @keyframes st-spin{to{transform:rotate(360deg)}}
    @media(max-width:600px){#${ROOT_ID}{padding:7px}#${ROOT_ID} .st-panel{max-height:calc(100vh - 14px);border-radius:20px}#${ROOT_ID} .st-header{padding:23px 18px 18px}#${ROOT_ID} .st-logo{width:44px;height:44px;flex-basis:44px}#${ROOT_ID} .st-section-head{padding:16px 18px 0}#${ROOT_ID} .st-tools{grid-template-columns:1fr;padding:12px 18px 18px}#${ROOT_ID} .st-tool{min-height:102px}#${ROOT_ID} .st-footer{padding:12px 18px 15px}}
  `;
  document.head.append(styles);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = `
    <section class="st-panel" role="dialog" aria-modal="true" aria-label="Shopee Toolkit">
      <header class="st-header">
        <div class="st-brand"><span class="st-logo">S</span><div><span class="st-kicker">Workspace tools</span><h1>Shopee Toolkit</h1><p class="st-subtitle">Bộ tiện ích nhanh cho Shopee trên trình duyệt.</p></div></div>
        <button class="st-close" type="button" aria-label="Đóng">×</button>
      </header>
      <div class="st-section-head"><p class="st-section-title">Chọn công cụ</p><span class="st-ready">Sẵn sàng</span></div>
      <div class="st-tools"></div>
      <footer class="st-footer"><div class="st-status" role="status">Đang tải danh mục công cụ...</div><span class="st-version">TOOLKIT 2.0</span></footer>
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

      if (tool.entry && typeof window[tool.entry] === "function") {
        closeLauncher();
        await window[tool.entry]();
        return;
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
      button.innerHTML = `<span class="st-number">${String(index + 1).padStart(2, "0")}</span><span class="st-copy"><span class="st-meta">${category}</span><span class="st-title">${escapeHtml(tool.title)}</span><span class="st-description">${escapeHtml(tool.description)}</span></span><span class="st-arrow" aria-hidden="true">→</span>`;
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
      if (!Array.isArray(window.SHOPEE_TOOLKIT_CATALOG)) {
        await loadScript("tools/catalog.js", "shopee-toolkit-catalog-script");
      }
      const catalog = window.SHOPEE_TOOLKIT_CATALOG;
      if (!Array.isArray(catalog) || !catalog.length) throw new Error("Danh mục công cụ trống hoặc không hợp lệ.");
      renderCatalog(catalog);
    } catch (error) {
      status.dataset.error = "true";
      status.textContent = error?.message || "Không tải được danh mục công cụ.";
    }
  })();
})();
