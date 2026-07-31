(() => {
  "use strict";

  const ROOT_ID = "shopee-toolkit-launcher";
  const STYLE_ID = `${ROOT_ID}-styles`;
  const currentScriptUrl = document.currentScript?.src || window.SHOPEE_TOOLKIT_LAUNCHER_URL || "";
  const baseUrl = window.SHOPEE_TOOLKIT_BASE_URL || (currentScriptUrl ? new URL(".", currentScriptUrl).href : "");

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
    #${ROOT_ID}{position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;padding:18px;background:rgba(15,23,42,.38);backdrop-filter:blur(7px);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033}
    #${ROOT_ID} .st-panel{width:min(780px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid #e2e8f0;border-radius:20px;background:#fff;box-shadow:0 28px 90px rgba(15,23,42,.22)}
    #${ROOT_ID} .st-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px;border-bottom:1px solid #edf1f6;background:linear-gradient(135deg,#fff,#fff8f6)}
    #${ROOT_ID} .st-brand{display:flex;align-items:center;gap:13px}
    #${ROOT_ID} .st-logo{display:grid;width:43px;height:43px;place-items:center;border-radius:13px;color:#fff;background:linear-gradient(135deg,#ff6b46,#e83d1c);font-size:16px;font-weight:900;box-shadow:0 10px 24px rgba(238,77,45,.23)}
    #${ROOT_ID} h1{margin:0;font-size:19px;line-height:1.2;letter-spacing:-.025em}
    #${ROOT_ID} .st-subtitle{margin:4px 0 0;color:#64748b;font-size:12px}
    #${ROOT_ID} button{font:inherit}
    #${ROOT_ID} .st-close{display:grid;width:38px;height:38px;place-items:center;border:1px solid #e2e8f0;border-radius:10px;color:#64748b;background:#fff;font-size:21px;cursor:pointer}
    #${ROOT_ID} .st-close:hover{color:#e64727;background:#fff8f6}
    #${ROOT_ID} .st-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:20px 24px 24px}
    #${ROOT_ID} .st-tool{display:flex;align-items:center;gap:14px;min-height:106px;padding:16px;border:1px solid #e5eaf1;border-radius:14px;color:inherit;background:#fff;text-align:left;cursor:pointer;box-shadow:0 4px 14px rgba(15,23,42,.035);transition:transform .14s,border-color .14s,background .14s}
    #${ROOT_ID} .st-tool:hover{border-color:#f1a08d;background:#fffaf8;transform:translateY(-2px)}
    #${ROOT_ID} .st-tool:disabled{opacity:.62;cursor:wait;transform:none}
    #${ROOT_ID} .st-icon{display:grid;width:45px;height:45px;flex:0 0 45px;place-items:center;border:1px solid rgba(255,113,77,.23);border-radius:12px;color:#ff8b70;background:rgba(238,77,45,.1);font-size:12px;font-weight:900;letter-spacing:.04em}
    #${ROOT_ID} .st-copy{min-width:0}
    #${ROOT_ID} .st-title{display:block;margin-bottom:5px;color:#111827;font-size:14px;font-weight:800}
    #${ROOT_ID} .st-description{display:block;color:#64748b;font-size:11.5px;line-height:1.45}
    #${ROOT_ID} .st-status{min-height:37px;padding:0 24px 18px;color:#64748b;font-size:12px}
    #${ROOT_ID} .st-status[data-error=true]{color:#fda4af}
    #${ROOT_ID} .st-spinner{display:inline-block;width:12px;height:12px;margin-right:7px;border:2px solid #475569;border-top-color:#ff6847;border-radius:50%;vertical-align:-2px;animation:st-spin .7s linear infinite}
    @keyframes st-spin{to{transform:rotate(360deg)}}
    @media(max-width:600px){#${ROOT_ID}{padding:7px}#${ROOT_ID} .st-panel{max-height:calc(100vh - 14px)}#${ROOT_ID} .st-tools{grid-template-columns:1fr;padding:14px}#${ROOT_ID} .st-header{padding:16px}#${ROOT_ID} .st-status{padding:0 16px 15px}}
  `;
  document.head.append(styles);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = `
    <section class="st-panel" role="dialog" aria-modal="true" aria-label="Shopee Toolkit">
      <header class="st-header">
        <div class="st-brand"><span class="st-logo">ST</span><div><h1>Shopee Toolkit</h1><p class="st-subtitle">Chọn một công cụ để tải và chạy.</p></div></div>
        <button class="st-close" type="button" aria-label="Đóng">×</button>
      </header>
      <div class="st-tools"></div>
      <div class="st-status" role="status">Đang tải danh mục công cụ...</div>
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
    catalog.forEach(tool => {
      const button = document.createElement("button");
      button.className = "st-tool";
      button.type = "button";
      button.innerHTML = `<span class="st-icon">${escapeHtml(tool.icon || "JS")}</span><span class="st-copy"><span class="st-title">${escapeHtml(tool.title)}</span><span class="st-description">${escapeHtml(tool.description)}</span></span>`;
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
