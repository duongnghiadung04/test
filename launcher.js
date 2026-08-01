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
    #${ROOT_ID}{--ink:#191816;--ink2:#2b2926;--paper:#fffdf8;--canvas:#f1ede5;--muted:#777067;--line:#ded8ce;--brand:#ff5b37;position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;padding:18px;color:var(--ink);background:rgba(20,18,15,.58);backdrop-filter:blur(16px) saturate(.72);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #${ROOT_ID} button{font:inherit}
    #${ROOT_ID} .st-panel{display:grid;grid-template-columns:250px minmax(0,1fr);width:min(870px,100%);max-height:calc(100vh - 36px);overflow:hidden;border:1px solid rgba(255,255,255,.45);border-radius:24px;background:var(--canvas);box-shadow:0 38px 100px rgba(16,15,13,.36),0 3px 12px rgba(16,15,13,.13)}
    #${ROOT_ID} .st-rail{position:relative;display:flex;min-height:570px;flex-direction:column;padding:28px 25px;color:#fff;background:var(--ink);overflow:hidden}
    #${ROOT_ID} .st-rail:before{position:absolute;inset:0 auto 0 0;width:7px;background:var(--brand);content:""}
    #${ROOT_ID} .st-rail:after{position:absolute;right:-90px;bottom:-90px;width:230px;height:230px;border:1px solid rgba(255,255,255,.08);border-radius:50%;box-shadow:0 0 0 32px rgba(255,255,255,.025),0 0 0 64px rgba(255,255,255,.018);content:""}
    #${ROOT_ID} .st-close{position:absolute;z-index:2;top:18px;right:18px;display:grid;width:38px;height:38px;place-items:center;border:1px solid rgba(255,255,255,.16);border-radius:11px;color:#f6f2eb;background:rgba(255,255,255,.07);font-size:20px;cursor:pointer;transition:.16s}
    #${ROOT_ID} .st-close:hover{border-color:rgba(255,138,109,.58);background:rgba(255,91,55,.22)}
    #${ROOT_ID} .st-monogram{display:grid;width:44px;height:44px;margin-bottom:48px;place-items:center;border-radius:13px;color:#fff;background:var(--brand);font-size:16px;font-weight:900;letter-spacing:-.06em;box-shadow:0 12px 28px rgba(255,91,55,.2)}
    #${ROOT_ID} .st-kicker{display:block;margin-bottom:11px;color:#ff8a6d;font-size:9px;font-weight:850;letter-spacing:.18em;text-transform:uppercase}
    #${ROOT_ID} h1{max-width:170px;margin:0;color:#fff;font-size:34px;line-height:.98;letter-spacing:-.06em}
    #${ROOT_ID} .st-subtitle{max-width:185px;margin:17px 0 0;color:#aaa59e;font-size:11.5px;line-height:1.65}
    #${ROOT_ID} .st-rail-note{position:relative;z-index:1;margin-top:auto;padding-top:32px;color:#7f7a74;font-size:9.5px;line-height:1.55}
    #${ROOT_ID} .st-rail-note strong{display:block;margin-bottom:3px;color:#d5d0c9;font-size:10px;letter-spacing:.05em}
    #${ROOT_ID} .st-main{display:flex;min-width:0;min-height:570px;flex-direction:column;overflow:auto;background:var(--canvas)}
    #${ROOT_ID} .st-main-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:27px 30px 17px}
    #${ROOT_ID} .st-main-kicker{display:block;margin-bottom:6px;color:#a34a34;font-size:9px;font-weight:850;letter-spacing:.16em;text-transform:uppercase}
    #${ROOT_ID} .st-main-title{margin:0;font-size:20px;font-weight:820;letter-spacing:-.035em}
    #${ROOT_ID} .st-ready{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid #d6d0c6;border-radius:99px;color:#676159;background:rgba(255,255,255,.5);font-size:9.5px;font-weight:700}
    #${ROOT_ID} .st-ready:before{width:7px;height:7px;border-radius:50%;background:#16865f;box-shadow:0 0 0 3px rgba(22,134,95,.11);content:""}
    #${ROOT_ID} .st-tools{display:flex;flex-direction:column;gap:8px;padding:0 30px 22px}
    #${ROOT_ID} .st-tool{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) 34px;align-items:center;gap:15px;min-height:84px;padding:12px 14px;border:0;border-radius:15px;color:inherit;background:#fff;text-align:left;cursor:pointer;box-shadow:0 1px 0 rgba(255,255,255,.9),0 5px 18px rgba(38,33,27,.07);transition:transform .16s,box-shadow .16s,background .16s}
    #${ROOT_ID} .st-tool:hover{background:#fffaf5;box-shadow:0 12px 28px rgba(38,33,27,.13);transform:translateY(-2px)}
    #${ROOT_ID} .st-tool:disabled{opacity:.58;cursor:wait;transform:none}
    #${ROOT_ID} .st-number{display:grid;width:48px;height:48px;place-items:center;border-radius:13px;color:#fff;background:var(--ink2);font-size:10px;font-weight:900;letter-spacing:.08em;transition:background .16s,color .16s}
    #${ROOT_ID} .st-tool:hover .st-number{background:var(--brand)}
    #${ROOT_ID} .st-copy{display:block;min-width:0}
    #${ROOT_ID} .st-meta{display:block;margin-bottom:4px;color:#a46c5d;font-size:8px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}
    #${ROOT_ID} .st-title{display:block;margin-bottom:3px;color:var(--ink);font-size:13.5px;font-weight:810;letter-spacing:-.018em}
    #${ROOT_ID} .st-description{display:block;overflow:hidden;color:var(--muted);font-size:10.3px;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}
    #${ROOT_ID} .st-arrow{display:grid;width:32px;height:32px;place-items:center;border:1px solid var(--line);border-radius:50%;color:#706a63;background:#f7f3ec;font-size:15px;transition:.16s}
    #${ROOT_ID} .st-tool:hover .st-arrow{border-color:var(--ink);color:#fff;background:var(--ink);transform:translateX(2px)}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"]{background:#252320}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"] .st-number{color:var(--ink);background:#ff866a}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"] .st-meta{color:#ff9c85}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"] .st-title{color:#fff}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"] .st-description{color:#a9a49d}
    #${ROOT_ID} .st-tool[data-tool="auto-save-voucher"] .st-arrow{border-color:#4f4b46;color:#eae5dd;background:#34312e}
    #${ROOT_ID} .st-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding:13px 30px 17px;border-top:1px solid var(--line);color:#8b847b;background:#e8e2d8;font-size:9.5px}
    #${ROOT_ID} .st-status{min-height:15px;color:#6f6961}
    #${ROOT_ID} .st-status[data-error=true]{color:#b12d28}
    #${ROOT_ID} .st-version{font-weight:800;letter-spacing:.09em}
    #${ROOT_ID} .st-spinner{display:inline-block;width:11px;height:11px;margin-right:7px;border:2px solid #ccc4b9;border-top-color:var(--brand);border-radius:50%;vertical-align:-2px;animation:st-spin .7s linear infinite}
    @keyframes st-spin{to{transform:rotate(360deg)}}
    @media(max-width:680px){
      #${ROOT_ID}{padding:6px}
      #${ROOT_ID} .st-panel{grid-template-columns:1fr;width:100%;max-height:calc(100vh - 12px);border-radius:17px}
      #${ROOT_ID} .st-rail{min-height:auto;padding:20px 18px 18px}
      #${ROOT_ID} .st-rail:after,#${ROOT_ID} .st-rail-note{display:none}
      #${ROOT_ID} .st-monogram{width:38px;height:38px;margin:0 0 18px;border-radius:11px}
      #${ROOT_ID} .st-kicker{margin-bottom:6px}
      #${ROOT_ID} h1{max-width:none;font-size:25px}
      #${ROOT_ID} .st-subtitle{max-width:calc(100% - 58px);margin-top:8px;font-size:10.5px}
      #${ROOT_ID} .st-main{min-height:0}
      #${ROOT_ID} .st-main-head{padding:18px 16px 13px}
      #${ROOT_ID} .st-main-title{font-size:17px}
      #${ROOT_ID} .st-tools{gap:7px;padding:0 16px 16px}
      #${ROOT_ID} .st-tool{grid-template-columns:41px minmax(0,1fr) 30px;gap:11px;min-height:75px;padding:10px}
      #${ROOT_ID} .st-number{width:41px;height:41px;border-radius:11px}
      #${ROOT_ID} .st-description{white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1}
      #${ROOT_ID} .st-footer{padding:11px 16px 13px}
    }
  `;
  document.head.append(styles);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = `
    <section class="st-panel" role="dialog" aria-modal="true" aria-label="Shopee Toolkit">
      <aside class="st-rail">
        <button class="st-close" type="button" aria-label="Đóng">×</button>
        <span class="st-monogram">ST</span>
        <span class="st-kicker">Browser workspace</span>
        <h1>Shopee Toolkit</h1>
        <p class="st-subtitle">Bộ công cụ thao tác nhanh, chạy trực tiếp trên phiên Shopee đang mở.</p>
        <div class="st-rail-note"><strong>Không cần cài đặt</strong>Dùng cookie của trình duyệt hiện tại · Không lưu token.</div>
      </aside>
      <main class="st-main">
        <header class="st-main-head">
          <div><span class="st-main-kicker">Danh mục công cụ</span><h2 class="st-main-title">Bạn muốn làm gì?</h2></div>
          <span class="st-ready">Sẵn sàng</span>
        </header>
        <div class="st-tools"></div>
        <footer class="st-footer"><div class="st-status" role="status">Đang tải danh mục công cụ...</div><span class="st-version">V4.0</span></footer>
      </main>
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

      // Luôn tải lại công cụ để tránh dùng phiên bản cũ còn nằm trong tab Shopee.
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
      // Luôn tải catalog mới nhất; catalog cũ có thể còn trong window của tab hiện tại.
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
