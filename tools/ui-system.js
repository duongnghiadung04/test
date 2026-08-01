(() => {
  "use strict";

  const STYLE_ID = "shopee-toolkit-shared-ui";
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    :root {
      --stk-brand: #ee4d2d;
      --stk-brand-hover: #d94223;
      --stk-brand-soft: #fff0ec;
      --stk-bg: #f5f7fb;
      --stk-panel: #ffffff;
      --stk-surface: #fafbfc;
      --stk-text: #172033;
      --stk-muted: #68758a;
      --stk-line: #e2e7ef;
      --stk-green: #15815f;
      --stk-red: #c13d38;
      --stk-amber: #9a671d;
      --stk-radius: 20px;
      --stk-font: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --stk-shadow: 0 28px 80px rgba(28, 39, 58, .2), 0 2px 8px rgba(28, 39, 58, .08);
    }

    #shopee-product-link-extractor,
    #voucherWalletModal,
    #voucherInfoPopup,
    .banner-save-modal,
    #shopee-product-link-extractor *,
    #voucherWalletModal *,
    #voucherInfoPopup *,
    .banner-save-modal * {
      box-sizing: border-box !important;
      font-family: var(--stk-font) !important;
    }

    #shopee-product-link-extractor .spe-backdrop,
    #voucherWalletModal,
    .banner-save-modal {
      background: rgba(30, 41, 59, .34) !important;
      backdrop-filter: blur(12px) saturate(.88) !important;
    }

    #shopee-product-link-extractor .spe-panel,
    #voucherWalletModal .voucher-wallet-modal,
    .banner-save-modal .banner-save-container {
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, .92) !important;
      border-radius: var(--stk-radius) !important;
      color: var(--stk-text) !important;
      background: var(--stk-panel) !important;
      box-shadow: var(--stk-shadow) !important;
    }
    #shopee-product-link-extractor .spe-panel {
      width: min(1120px, calc(100vw - 32px)) !important;
      max-height: calc(100vh - 32px) !important;
    }
    #voucherWalletModal .voucher-wallet-modal {
      width: min(920px, calc(100vw - 32px)) !important;
      max-height: calc(100vh - 32px) !important;
    }
    .banner-save-modal .banner-save-container {
      width: min(720px, calc(100vw - 32px)) !important;
      max-height: calc(100vh - 32px) !important;
    }
    #voucherInfoPopup {
      width: min(850px, calc(100vw - 32px)) !important;
      max-height: calc(100vh - 32px) !important;
      padding: 18px !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, .92) !important;
      border-radius: var(--stk-radius) !important;
      color: var(--stk-text) !important;
      background: var(--stk-bg) !important;
      box-shadow: 0 0 0 100vmax rgba(30, 41, 59, .34), var(--stk-shadow) !important;
    }
    #voucherInfoPopup #popupScrollArea {
      max-height: calc(100vh - 68px) !important;
      padding-right: 3px !important;
      scrollbar-color: #b9c2d0 transparent;
    }

    /* Light headers */
    #shopee-product-link-extractor .spe-header,
    #voucherWalletModal .voucher-wallet-header,
    .banner-save-modal .banner-save-header,
    #voucherInfoPopup #popupScrollArea > div:first-child {
      position: relative !important;
      min-height: 82px !important;
      padding: 19px 22px 19px 27px !important;
      border: 0 !important;
      border-bottom: 1px solid var(--stk-line) !important;
      border-radius: var(--stk-radius) var(--stk-radius) 0 0 !important;
      color: var(--stk-text) !important;
      background: #fff !important;
    }
    #voucherInfoPopup #popupScrollArea > div:first-child {
      min-height: 70px !important;
      margin: -18px -18px 16px !important;
    }
    #shopee-product-link-extractor .spe-header::before,
    #voucherWalletModal .voucher-wallet-header::before,
    .banner-save-modal .banner-save-header::before,
    #voucherInfoPopup #popupScrollArea > div:first-child::before {
      position: absolute;
      inset: 20px auto 20px 0;
      width: 4px;
      border-radius: 0 6px 6px 0;
      background: var(--stk-brand);
      content: "";
    }
    #shopee-product-link-extractor h2,
    #voucherWalletModal .voucher-wallet-header h2,
    #voucherInfoPopup h2,
    .banner-save-modal .banner-save-header h2 {
      margin: 0 !important;
      color: var(--stk-text) !important;
      font-size: clamp(19px, 2.2vw, 24px) !important;
      font-weight: 800 !important;
      line-height: 1.15 !important;
      letter-spacing: -.035em !important;
    }
    #voucherWalletModal .voucher-wallet-header h2::before,
    #voucherInfoPopup h2::before {
      display: block;
      margin-bottom: 5px;
      color: var(--stk-brand);
      font-size: 8px;
      font-weight: 850;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    #voucherWalletModal .voucher-wallet-header h2::before { content: "Tài khoản · Voucher"; }
    #voucherInfoPopup h2::before { content: "Voucher workspace"; }
    #shopee-product-link-extractor .spe-subtitle,
    .banner-save-modal .banner-save-header p {
      margin: 5px 0 0 !important;
      color: var(--stk-muted) !important;
      font-size: 11.5px !important;
      opacity: 1 !important;
    }
    .banner-save-modal .banner-pip-text { color: var(--stk-brand) !important; }

    /* Back / close */
    #shopee-product-link-extractor .spe-header-actions,
    #voucherWalletModal .voucher-wallet-header-actions,
    .banner-save-modal .banner-save-header-actions {
      display: flex !important;
      align-items: center !important;
      gap: 7px !important;
    }
    #shopee-product-link-extractor .spe-back,
    #shopee-product-link-extractor .spe-close,
    #voucherWalletModal .voucher-wallet-back,
    #voucherWalletModal .voucher-wallet-close,
    #voucherInfoPopup #backToToolkitBtn,
    #voucherInfoPopup #closePopupBtn,
    .banner-save-modal .banner-back-btn,
    .banner-save-modal .banner-close-btn {
      display: inline-flex !important;
      min-width: 38px !important;
      min-height: 38px !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 12px !important;
      border: 1px solid var(--stk-line) !important;
      border-radius: 10px !important;
      color: #536176 !important;
      background: var(--stk-surface) !important;
      box-shadow: none !important;
      font-size: 11px !important;
      font-weight: 740 !important;
      cursor: pointer !important;
      transform: none !important;
    }
    #shopee-product-link-extractor .spe-close,
    #voucherWalletModal .voucher-wallet-close,
    #voucherInfoPopup #closePopupBtn,
    .banner-save-modal .banner-close-btn {
      width: 38px !important;
      padding: 0 !important;
      font-size: 18px !important;
    }
    #shopee-product-link-extractor .spe-back:hover,
    #shopee-product-link-extractor .spe-close:hover,
    #voucherWalletModal .voucher-wallet-back:hover,
    #voucherWalletModal .voucher-wallet-close:hover,
    #voucherInfoPopup #backToToolkitBtn:hover,
    #voucherInfoPopup #closePopupBtn:hover,
    .banner-save-modal .banner-back-btn:hover,
    .banner-save-modal .banner-close-btn:hover {
      border-color: #ffc2b5 !important;
      color: var(--stk-brand) !important;
      background: var(--stk-brand-soft) !important;
    }

    /* Controls */
    #shopee-product-link-extractor input,
    #voucherWalletModal input,
    #voucherInfoPopup textarea,
    #voucherInfoPopup select,
    .banner-save-modal input,
    .banner-save-modal select {
      border: 1px solid #dce3ec !important;
      border-radius: 11px !important;
      outline: none !important;
      color: var(--stk-text) !important;
      background: #fff !important;
      box-shadow: none !important;
      font-family: var(--stk-font) !important;
    }
    #shopee-product-link-extractor input:focus,
    #voucherWalletModal input:focus,
    #voucherInfoPopup textarea:focus,
    #voucherInfoPopup select:focus,
    .banner-save-modal input:focus,
    .banner-save-modal select:focus {
      border-color: var(--stk-brand) !important;
      box-shadow: 0 0 0 3px rgba(238, 77, 45, .11) !important;
    }
    #shopee-product-link-extractor button,
    #voucherWalletModal button,
    #voucherInfoPopup button,
    .banner-save-modal button {
      font-family: var(--stk-font) !important;
      transition: background .15s, border-color .15s, color .15s, transform .15s !important;
    }

    /* Primary + secondary actions */
    #shopee-product-link-extractor .spe-get,
    #voucherInfoPopup #loadVoucherBtn,
    #voucherInfoPopup #scanBannerBtn,
    .banner-save-modal .banner-start-btn {
      border: 1px solid var(--stk-brand) !important;
      border-radius: 10px !important;
      color: #fff !important;
      background: var(--stk-brand) !important;
      box-shadow: 0 7px 16px rgba(238, 77, 45, .16) !important;
      font-weight: 760 !important;
    }
    #shopee-product-link-extractor .spe-get:hover:not(:disabled),
    #voucherInfoPopup #loadVoucherBtn:hover:not(:disabled),
    #voucherInfoPopup #scanBannerBtn:hover:not(:disabled),
    .banner-save-modal .banner-start-btn:hover:not(:disabled) {
      border-color: var(--stk-brand-hover) !important;
      background: var(--stk-brand-hover) !important;
    }
    #shopee-product-link-extractor .spe-actions button,
    #shopee-product-link-extractor .spe-open,
    #voucherInfoPopup #viewBannerBtn,
    #voucherInfoPopup #saveAllBtn,
    .banner-save-modal .banner-check-captcha-btn {
      border: 1px solid var(--stk-line) !important;
      border-radius: 10px !important;
      color: #41506a !important;
      background: #fff !important;
      box-shadow: none !important;
      font-weight: 720 !important;
    }

    /* Product extractor */
    #shopee-product-link-extractor .spe-controls {
      padding: 18px 20px 16px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: #fff !important;
    }
    #shopee-product-link-extractor .spe-fetch {
      grid-template-columns: minmax(0, 1fr) 104px !important;
      gap: 8px !important;
    }
    #shopee-product-link-extractor .spe-shop-id {
      min-height: 46px !important;
      padding: 0 14px !important;
    }
    #shopee-product-link-extractor .spe-actions { gap: 7px !important; margin-top: 9px !important; }
    #shopee-product-link-extractor .spe-actions button { min-height: 37px !important; }
    #shopee-product-link-extractor .spe-clear { color: var(--stk-red) !important; }
    #shopee-product-link-extractor .spe-toolbar {
      padding: 12px 20px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: var(--stk-bg) !important;
    }
    #shopee-product-link-extractor .spe-count { color: var(--stk-muted) !important; font-size: 11px !important; }
    #shopee-product-link-extractor .spe-count strong { color: var(--stk-text) !important; font-size: 16px !important; }
    #shopee-product-link-extractor .spe-search { min-height: 38px !important; }
    #shopee-product-link-extractor .spe-table-wrap,
    #shopee-product-link-extractor table { background: #fff !important; }
    #shopee-product-link-extractor th {
      color: #5e6b7e !important;
      background: #f3f6fa !important;
      border-bottom: 1px solid var(--stk-line) !important;
      font-size: 10px !important;
      text-transform: uppercase !important;
      letter-spacing: .05em !important;
    }
    #shopee-product-link-extractor th button { color: #5e6b7e !important; background: transparent !important; }
    #shopee-product-link-extractor td { border-bottom: 1px solid #edf0f5 !important; color: #354158 !important; }
    #shopee-product-link-extractor tbody tr:hover td { background: #fff8f6 !important; }
    #shopee-product-link-extractor .spe-link { color: #d94223 !important; font-weight: 650 !important; }
    #shopee-product-link-extractor .spe-row-actions button,
    #shopee-product-link-extractor .spe-row-actions a {
      border-color: var(--stk-line) !important;
      color: #536176 !important;
      background: #f8fafc !important;
    }
    #shopee-product-link-extractor .spe-empty { color: var(--stk-muted) !important; background: #fff !important; }
    #shopee-product-link-extractor .spe-error {
      border: 1px solid #f1c5bd !important;
      border-radius: 10px !important;
      color: #9a302c !important;
      background: #fff2ef !important;
    }

    /* Wallet: one-column, intrinsic height — fixes clipped cards */
    #voucherWalletModal .voucher-tabs {
      gap: 5px !important;
      padding: 11px 18px 0 !important;
      border: 0 !important;
      background: #fff !important;
    }
    #voucherWalletModal .voucher-tab {
      padding: 9px 13px !important;
      border: 0 !important;
      border-radius: 9px 9px 0 0 !important;
      color: var(--stk-muted) !important;
      background: transparent !important;
      font-size: 11.5px !important;
      font-weight: 700 !important;
    }
    #voucherWalletModal .voucher-tab.active { color: var(--stk-brand) !important; background: var(--stk-brand-soft) !important; }
    #voucherWalletModal .voucher-wallet-search {
      padding: 12px 18px 15px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: #fff !important;
    }
    #voucherWalletModal .voucher-search-input {
      min-height: 42px !important;
      padding: 0 14px !important;
      background-image: none !important;
    }
    #voucherWalletModal .voucher-wallet-content {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) !important;
      grid-auto-rows: max-content !important;
      align-content: start !important;
      gap: 10px !important;
      padding: 14px !important;
      overflow-y: auto !important;
      background: var(--stk-bg) !important;
    }
    #voucherWalletModal .voucher-card {
      position: relative !important;
      display: grid !important;
      grid-template-columns: 70px minmax(0, 1fr) !important;
      align-items: start !important;
      align-self: start !important;
      gap: 14px !important;
      width: 100% !important;
      height: auto !important;
      min-height: 154px !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 15px 16px !important;
      overflow: visible !important;
      border: 1px solid var(--stk-line) !important;
      border-left: 4px solid #ff8c74 !important;
      border-radius: 13px !important;
      color: var(--stk-text) !important;
      background: #fff !important;
      box-shadow: 0 3px 12px rgba(31, 45, 67, .05) !important;
      transform: none !important;
    }
    #voucherWalletModal .voucher-card:hover {
      border-color: #f4b7aa !important;
      border-left-color: var(--stk-brand) !important;
      box-shadow: 0 8px 22px rgba(31, 45, 67, .09) !important;
    }
    #voucherWalletModal .voucher-avatar-section {
      display: flex !important;
      width: 70px !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 7px !important;
    }
    #voucherWalletModal .voucher-avatar {
      display: flex !important;
      width: 58px !important;
      height: 58px !important;
      min-height: 58px !important;
      flex: 0 0 58px !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      border: 1px solid #e2e7ef !important;
      border-radius: 12px !important;
      color: #fff !important;
      background: var(--brand, #ee4d2d) !important;
    }
    #voucherWalletModal .voucher-avatar.shipping { background: #2aa892 !important; }
    #voucherWalletModal .voucher-avatar.payment { color: #58667a !important; background: #eef2f7 !important; }
    #voucherWalletModal .voucher-avatar-label { width: 70px !important; color: #7a8698 !important; font-size: 9px !important; }
    #voucherWalletModal .voucher-right-section {
      display: flex !important;
      min-width: 0 !important;
      height: auto !important;
      overflow: visible !important;
      flex-direction: column !important;
      gap: 5px !important;
    }
    #voucherWalletModal .voucher-detail-title,
    #voucherWalletModal .voucher-code {
      display: block !important;
      overflow: visible !important;
      color: #d94223 !important;
      font-size: 14px !important;
      font-weight: 760 !important;
      line-height: 1.45 !important;
    }
    #voucherWalletModal .voucher-detail-line,
    #voucherWalletModal .voucher-terms,
    #voucherWalletModal .voucher-stat-item {
      display: block !important;
      overflow: visible !important;
      color: var(--stk-muted) !important;
      font-size: 11.5px !important;
      line-height: 1.5 !important;
    }
    #voucherWalletModal .voucher-detail-line strong { color: var(--stk-text) !important; }
    #voucherWalletModal .voucher-detail-actions { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; margin-top: 5px !important; }
    #voucherWalletModal .voucher-detail-button {
      min-height: 30px !important;
      padding: 0 9px !important;
      border: 1px solid var(--stk-line) !important;
      border-radius: 8px !important;
      color: #526076 !important;
      background: #f8fafc !important;
      font-size: 10px !important;
      font-weight: 700 !important;
    }
    #voucherWalletModal .voucher-detail-button.primary { border-color: var(--stk-brand) !important; color: #fff !important; background: var(--stk-brand) !important; }
    #voucherWalletModal .voucher-wallet-loading { grid-column: 1 / -1 !important; color: var(--stk-muted) !important; }
    #voucherWalletModal .voucher-wallet-spinner { width: 38px !important; height: 38px !important; border-color: #e3e8ef !important; border-top-color: var(--stk-brand) !important; }

    /* Check Voucher + Banner Voucher */
    #voucherInfoPopup #voucherLinkInput { min-height: 92px !important; padding: 13px 14px !important; resize: vertical !important; }
    #voucherInfoPopup #voucherActionRow,
    #voucherInfoPopup #voucherUtilityRow,
    #voucherInfoPopup #voucherStatsActions { gap: 7px !important; }
    #voucherInfoPopup #voucherActionRow button,
    #voucherInfoPopup #voucherUtilityRow button,
    #voucherInfoPopup #voucherStatsActions button {
      min-height: 39px !important;
      padding: 0 12px !important;
      border: 1px solid var(--stk-line) !important;
      border-radius: 9px !important;
      color: #46546a !important;
      background: #fff !important;
      box-shadow: none !important;
      font-size: 11px !important;
      font-weight: 700 !important;
    }
    #voucherInfoPopup #loadVoucherBtn,
    #voucherInfoPopup #scanBannerBtn { color: #fff !important; background: var(--stk-brand) !important; }
    #voucherInfoPopup #saveAllBtn { border-color: #344158 !important; color: #fff !important; background: #344158 !important; }
    #voucherInfoPopup #voucherContent > div:not(.voucher-row),
    #voucherInfoPopup #saveLogArea { border-color: var(--stk-line) !important; border-radius: 11px !important; background: #fff !important; }
    #voucherInfoPopup .voucher-row {
      position: relative !important;
      gap: 13px !important;
      margin: 0 0 9px !important;
      padding: 14px 15px 14px 18px !important;
      overflow: visible !important;
      border: 1px solid var(--stk-line) !important;
      border-left: 4px solid #ff8c74 !important;
      border-radius: 12px !important;
      color: var(--stk-text) !important;
      background: #fff !important;
      box-shadow: 0 3px 12px rgba(31, 45, 67, .05) !important;
    }
    #voucherInfoPopup .voucher-row a { color: #d94223 !important; font-weight: 720 !important; }
    #voucherInfoPopup .voucher-row .save-btn { min-height: 33px !important; border-radius: 8px !important; color: #fff !important; background: var(--stk-brand) !important; }

    /* Auto Save Voucher */
    .banner-save-modal .banner-save-content { padding: 18px !important; background: var(--stk-bg) !important; }
    .banner-save-modal .banner-input-group { margin-bottom: 14px !important; }
    .banner-save-modal .banner-input-group label { margin-bottom: 7px !important; color: var(--stk-text) !important; font-size: 11px !important; font-weight: 720 !important; }
    .banner-save-modal .banner-input-group input,
    .banner-save-modal .banner-input-group select { min-height: 44px !important; padding: 0 13px !important; }
    .banner-save-modal .banner-input-hint { color: var(--stk-muted) !important; font-size: 11px !important; font-style: normal !important; }
    .banner-save-modal .banner-warning {
      margin-bottom: 14px !important;
      padding: 11px 13px !important;
      border: 1px solid #f0d7aa !important;
      border-left: 4px solid #e0a13d !important;
      border-radius: 10px !important;
      color: #78551f !important;
      background: #fffaeb !important;
      font-size: 11.5px !important;
      line-height: 1.5 !important;
    }
    .banner-save-modal .banner-action-row { gap: 8px !important; margin-bottom: 14px !important; }
    .banner-save-modal .banner-start-btn,
    .banner-save-modal .banner-check-captcha-btn { min-height: 43px !important; padding: 0 13px !important; font-size: 12px !important; }
    .banner-save-modal .banner-check-captcha-btn { border-color: #344158 !important; color: #fff !important; background: #344158 !important; }
    .banner-save-modal .banner-start-btn.stop { border-color: var(--stk-red) !important; background: var(--stk-red) !important; }
    .banner-save-modal .banner-log-container {
      max-height: 310px !important;
      padding: 12px !important;
      border: 1px solid var(--stk-line) !important;
      border-radius: 12px !important;
      background: #fff !important;
      box-shadow: none !important;
    }
    .banner-save-modal .banner-log-title { color: var(--stk-text) !important; font-size: 11px !important; font-weight: 720 !important; }
    .banner-save-modal .log-header-block,
    .banner-save-modal .log-result-block,
    .banner-save-modal .voucher-item {
      margin-bottom: 8px !important;
      border: 1px solid #f0d7aa !important;
      border-left: 4px solid #d69a38 !important;
      border-radius: 9px !important;
      color: #74521e !important;
      background: #fffaeb !important;
      box-shadow: none !important;
    }
    .banner-save-modal .log-result-success,
    .banner-save-modal .voucher-item.success { border-color: #b9dfcf !important; border-left-color: var(--stk-green) !important; background: #eef9f4 !important; }
    .banner-save-modal .log-result-error,
    .banner-save-modal .voucher-item.error { border-color: #efc4c1 !important; border-left-color: var(--stk-red) !important; background: #fff2f1 !important; }
    .banner-save-modal .log-result-content,
    .banner-save-modal .voucher-details,
    .banner-save-modal .voucher-header { color: inherit !important; background: transparent !important; font-size: 11.5px !important; }

    #shopee-product-link-extractor .spe-toast,
    #voucherWalletModal .copy-toast { border-radius: 10px !important; color: #fff !important; background: #273449 !important; box-shadow: 0 12px 28px rgba(22, 32, 48, .2) !important; }

    #shopee-product-link-extractor ::-webkit-scrollbar,
    #voucherWalletModal ::-webkit-scrollbar,
    #voucherInfoPopup ::-webkit-scrollbar,
    .banner-save-modal ::-webkit-scrollbar { width: 8px; height: 8px; }
    #shopee-product-link-extractor ::-webkit-scrollbar-thumb,
    #voucherWalletModal ::-webkit-scrollbar-thumb,
    #voucherInfoPopup ::-webkit-scrollbar-thumb,
    .banner-save-modal ::-webkit-scrollbar-thumb { border: 2px solid transparent; border-radius: 99px; background: #b9c2d0; background-clip: padding-box; }

    @media (max-width: 760px) {
      #shopee-product-link-extractor .spe-panel,
      #voucherWalletModal .voucher-wallet-modal,
      .banner-save-modal .banner-save-container,
      #voucherInfoPopup { width: calc(100vw - 12px) !important; max-height: calc(100vh - 12px) !important; border-radius: 15px !important; }
      #shopee-product-link-extractor .spe-header,
      #voucherWalletModal .voucher-wallet-header,
      .banner-save-modal .banner-save-header { min-height: 74px !important; padding: 16px 13px 16px 19px !important; }
      #shopee-product-link-extractor h2,
      #voucherWalletModal .voucher-wallet-header h2,
      .banner-save-modal .banner-save-header h2 { font-size: 18px !important; }
      #shopee-product-link-extractor .spe-subtitle,
      .banner-save-modal .banner-save-header p { display: none !important; }
      #shopee-product-link-extractor .spe-back,
      #voucherWalletModal .voucher-wallet-back,
      #voucherInfoPopup #backToToolkitBtn,
      .banner-save-modal .banner-back-btn { width: 38px !important; padding: 0 !important; overflow: hidden !important; color: transparent !important; font-size: 0 !important; }
      #shopee-product-link-extractor .spe-back::after,
      #voucherWalletModal .voucher-wallet-back::after,
      #voucherInfoPopup #backToToolkitBtn::after,
      .banner-save-modal .banner-back-btn::after { color: #536176; font-size: 17px; content: "←"; }
      #shopee-product-link-extractor .spe-controls,
      #shopee-product-link-extractor .spe-toolbar,
      .banner-save-modal .banner-save-content { padding: 13px !important; }
      #shopee-product-link-extractor .spe-fetch { grid-template-columns: 1fr 78px !important; }
      #voucherWalletModal .voucher-wallet-content { padding: 9px !important; }
      #voucherWalletModal .voucher-card { grid-template-columns: 58px minmax(0, 1fr) !important; min-height: 150px !important; padding: 12px !important; gap: 10px !important; }
      #voucherWalletModal .voucher-avatar-section { width: 58px !important; }
      #voucherWalletModal .voucher-avatar { width: 50px !important; height: 50px !important; min-height: 50px !important; flex-basis: 50px !important; }
      #voucherWalletModal .voucher-avatar-label { width: 58px !important; }
      #voucherWalletModal .voucher-tabs { overflow-x: auto !important; white-space: nowrap !important; }
      #voucherInfoPopup { padding: 12px !important; }
      #voucherInfoPopup #popupScrollArea { max-height: calc(100vh - 36px) !important; }
      #voucherInfoPopup #popupScrollArea > div:first-child { margin: -12px -12px 14px !important; padding: 15px 12px 15px 18px !important; }
      #voucherInfoPopup #voucherActionRow,
      #voucherInfoPopup #voucherUtilityRow { flex-wrap: wrap !important; }
      #voucherInfoPopup #voucherActionRow > button,
      #voucherInfoPopup #voucherUtilityRow > button { flex: 1 1 calc(50% - 5px) !important; min-width: 110px !important; }
      .banner-save-modal .banner-action-row { flex-direction: column !important; }
      .banner-save-modal .banner-start-btn,
      .banner-save-modal .banner-check-captcha-btn { width: 100% !important; }
    }
  `;
  document.head.append(style);
})();
