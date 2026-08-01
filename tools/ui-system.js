(() => {
  "use strict";

  const STYLE_ID = "shopee-toolkit-shared-ui";
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    :root {
      --stk-ink: #191816;
      --stk-ink-2: #292724;
      --stk-paper: #fffdf8;
      --stk-canvas: #f1ede5;
      --stk-card: #ffffff;
      --stk-muted: #756f67;
      --stk-line: #ded8ce;
      --stk-line-dark: #c9c1b6;
      --stk-brand: #ff5b37;
      --stk-brand-dark: #e94120;
      --stk-brand-soft: #ffe7de;
      --stk-green: #157f5b;
      --stk-red: #bf3e35;
      --stk-amber: #a66718;
      --stk-radius: 22px;
      --stk-font: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --stk-shadow: 0 38px 100px rgba(16, 15, 13, .34), 0 3px 12px rgba(16, 15, 13, .12);
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

    /* Stage */
    #shopee-product-link-extractor .spe-backdrop,
    #voucherWalletModal,
    .banner-save-modal {
      background: rgba(20, 18, 15, .58) !important;
      backdrop-filter: blur(16px) saturate(.72) !important;
    }

    /* Main shells */
    #shopee-product-link-extractor .spe-panel,
    #voucherWalletModal .voucher-wallet-modal,
    .banner-save-modal .banner-save-container {
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, .46) !important;
      border-radius: var(--stk-radius) !important;
      color: var(--stk-ink) !important;
      background: var(--stk-canvas) !important;
      box-shadow: var(--stk-shadow) !important;
    }
    #shopee-product-link-extractor .spe-panel {
      width: min(1120px, calc(100vw - 32px)) !important;
      max-height: calc(100vh - 32px) !important;
    }
    #voucherWalletModal .voucher-wallet-modal {
      width: min(1060px, calc(100vw - 32px)) !important;
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
      border: 1px solid rgba(255, 255, 255, .46) !important;
      border-radius: var(--stk-radius) !important;
      color: var(--stk-ink) !important;
      background: var(--stk-canvas) !important;
      box-shadow: 0 0 0 100vmax rgba(20, 18, 15, .58), var(--stk-shadow) !important;
    }
    #voucherInfoPopup #popupScrollArea {
      max-height: calc(100vh - 68px) !important;
      padding-right: 3px !important;
      scrollbar-color: #bdb4a8 transparent;
    }

    /* Charcoal mastheads */
    #shopee-product-link-extractor .spe-header,
    #voucherWalletModal .voucher-wallet-header,
    .banner-save-modal .banner-save-header,
    #voucherInfoPopup #popupScrollArea > div:first-child {
      position: relative !important;
      min-height: 92px !important;
      padding: 22px 24px !important;
      border: 0 !important;
      border-radius: var(--stk-radius) var(--stk-radius) 0 0 !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
    }
    #voucherInfoPopup #popupScrollArea > div:first-child {
      min-height: 78px !important;
      margin: -18px -18px 18px !important;
      border-radius: var(--stk-radius) var(--stk-radius) 0 0 !important;
    }
    #shopee-product-link-extractor .spe-header::before,
    #voucherWalletModal .voucher-wallet-header::before,
    .banner-save-modal .banner-save-header::before,
    #voucherInfoPopup #popupScrollArea > div:first-child::before {
      position: absolute;
      inset: 0 auto 0 0;
      width: 7px;
      background: var(--stk-brand);
      content: "";
    }
    #shopee-product-link-extractor h2,
    #voucherWalletModal .voucher-wallet-header h2,
    #voucherInfoPopup h2,
    .banner-save-modal .banner-save-header h2 {
      margin: 0 !important;
      color: #fff !important;
      font-size: clamp(20px, 2.5vw, 27px) !important;
      font-weight: 820 !important;
      line-height: 1.1 !important;
      letter-spacing: -.045em !important;
    }
    #voucherWalletModal .voucher-wallet-header h2::before {
      display: block;
      margin-bottom: 7px;
      color: #ff8a6d;
      font-size: 9px;
      font-weight: 850;
      letter-spacing: .18em;
      text-transform: uppercase;
      content: "Tài khoản · Voucher";
    }
    #voucherInfoPopup h2::before {
      display: block;
      margin-bottom: 6px;
      color: #ff8a6d;
      font-size: 9px;
      font-weight: 850;
      letter-spacing: .18em;
      text-transform: uppercase;
      content: "Voucher workspace";
    }
    #shopee-product-link-extractor .spe-subtitle,
    .banner-save-modal .banner-save-header p {
      margin: 7px 0 0 !important;
      color: #bdb8b1 !important;
      font-size: 11.5px !important;
      line-height: 1.45 !important;
      opacity: 1 !important;
    }
    .banner-save-modal .banner-pip-text {
      color: #ff8a6d !important;
    }

    /* Navigation */
    #shopee-product-link-extractor .spe-header-actions,
    #voucherWalletModal .voucher-wallet-header-actions,
    .banner-save-modal .banner-save-header-actions {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
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
      min-width: 40px !important;
      min-height: 40px !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 13px !important;
      border: 1px solid rgba(255, 255, 255, .18) !important;
      border-radius: 11px !important;
      color: #f7f3ec !important;
      background: rgba(255, 255, 255, .08) !important;
      box-shadow: none !important;
      font-size: 11px !important;
      font-weight: 760 !important;
      cursor: pointer !important;
      transform: none !important;
      transition: background .16s, border-color .16s, color .16s !important;
    }
    #shopee-product-link-extractor .spe-close,
    #voucherWalletModal .voucher-wallet-close,
    #voucherInfoPopup #closePopupBtn,
    .banner-save-modal .banner-close-btn {
      width: 40px !important;
      padding: 0 !important;
      font-size: 19px !important;
    }
    #shopee-product-link-extractor .spe-back:hover,
    #shopee-product-link-extractor .spe-close:hover,
    #voucherWalletModal .voucher-wallet-back:hover,
    #voucherWalletModal .voucher-wallet-close:hover,
    #voucherInfoPopup #backToToolkitBtn:hover,
    #voucherInfoPopup #closePopupBtn:hover,
    .banner-save-modal .banner-back-btn:hover,
    .banner-save-modal .banner-close-btn:hover {
      border-color: rgba(255, 138, 109, .58) !important;
      color: #fff !important;
      background: rgba(255, 91, 55, .25) !important;
    }

    /* Form language */
    #shopee-product-link-extractor input,
    #voucherWalletModal input,
    #voucherInfoPopup textarea,
    #voucherInfoPopup select,
    .banner-save-modal input,
    .banner-save-modal select {
      border: 1px solid var(--stk-line) !important;
      border-radius: 12px !important;
      outline: 0 !important;
      color: var(--stk-ink) !important;
      background: var(--stk-paper) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .8) !important;
      font-family: var(--stk-font) !important;
      transition: border-color .16s, box-shadow .16s, background .16s !important;
    }
    #shopee-product-link-extractor input:focus,
    #voucherWalletModal input:focus,
    #voucherInfoPopup textarea:focus,
    #voucherInfoPopup select:focus,
    .banner-save-modal input:focus,
    .banner-save-modal select:focus {
      border-color: var(--stk-brand) !important;
      background: #fff !important;
      box-shadow: 0 0 0 4px rgba(255, 91, 55, .12) !important;
    }
    #shopee-product-link-extractor button,
    #voucherWalletModal button,
    #voucherInfoPopup button,
    .banner-save-modal button {
      font-family: var(--stk-font) !important;
      transition: transform .14s, background .14s, border-color .14s, color .14s !important;
    }
    #shopee-product-link-extractor button:active:not(:disabled),
    #voucherWalletModal button:active:not(:disabled),
    #voucherInfoPopup button:active:not(:disabled),
    .banner-save-modal button:active:not(:disabled) {
      transform: translateY(1px) !important;
    }

    /* Product extractor */
    #shopee-product-link-extractor .spe-controls {
      padding: 20px 22px 17px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: var(--stk-paper) !important;
    }
    #shopee-product-link-extractor .spe-fetch {
      grid-template-columns: minmax(0, 1fr) 112px !important;
      gap: 9px !important;
    }
    #shopee-product-link-extractor .spe-shop-id {
      min-height: 48px !important;
      padding: 0 16px !important;
    }
    #shopee-product-link-extractor .spe-get,
    #voucherInfoPopup #loadVoucherBtn,
    #voucherInfoPopup #scanBannerBtn,
    .banner-save-modal .banner-start-btn {
      border: 1px solid var(--stk-brand) !important;
      border-radius: 11px !important;
      color: #fff !important;
      background: var(--stk-brand) !important;
      box-shadow: 0 8px 18px rgba(213, 58, 28, .18) !important;
      font-weight: 790 !important;
    }
    #shopee-product-link-extractor .spe-get:hover:not(:disabled),
    #voucherInfoPopup #loadVoucherBtn:hover:not(:disabled),
    #voucherInfoPopup #scanBannerBtn:hover:not(:disabled),
    .banner-save-modal .banner-start-btn:hover:not(:disabled) {
      border-color: var(--stk-brand-dark) !important;
      background: var(--stk-brand-dark) !important;
      transform: translateY(-1px) !important;
    }
    #shopee-product-link-extractor .spe-actions {
      gap: 7px !important;
      margin-top: 9px !important;
    }
    #shopee-product-link-extractor .spe-actions button,
    #shopee-product-link-extractor .spe-open,
    #voucherInfoPopup #viewBannerBtn,
    #voucherInfoPopup #saveAllBtn,
    .banner-save-modal .banner-check-captcha-btn {
      min-height: 38px !important;
      border: 1px solid var(--stk-line-dark) !important;
      border-radius: 10px !important;
      color: var(--stk-ink) !important;
      background: var(--stk-paper) !important;
      box-shadow: none !important;
      font-weight: 740 !important;
    }
    #shopee-product-link-extractor .spe-clear {
      color: var(--stk-red) !important;
    }
    #shopee-product-link-extractor .spe-toolbar {
      padding: 13px 22px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: #e8e2d8 !important;
    }
    #shopee-product-link-extractor .spe-count {
      color: var(--stk-muted) !important;
      font-size: 11px !important;
      font-weight: 650 !important;
      text-transform: uppercase !important;
      letter-spacing: .06em !important;
    }
    #shopee-product-link-extractor .spe-count strong {
      margin-left: 5px !important;
      color: var(--stk-ink) !important;
      font-size: 18px !important;
      letter-spacing: -.02em !important;
    }
    #shopee-product-link-extractor .spe-search {
      min-height: 39px !important;
    }
    #shopee-product-link-extractor .spe-table-wrap {
      background: var(--stk-paper) !important;
      scrollbar-color: #bdb4a8 transparent;
    }
    #shopee-product-link-extractor table {
      border-collapse: separate !important;
      border-spacing: 0 !important;
      background: var(--stk-paper) !important;
    }
    #shopee-product-link-extractor th {
      border-bottom: 0 !important;
      color: #f5f1e9 !important;
      background: var(--stk-ink-2) !important;
      font-size: 10px !important;
      letter-spacing: .07em !important;
      text-transform: uppercase !important;
    }
    #shopee-product-link-extractor th button {
      color: #f5f1e9 !important;
      background: transparent !important;
    }
    #shopee-product-link-extractor td {
      border-bottom: 1px solid #ebe6dd !important;
      color: #3c3833 !important;
      background: transparent !important;
    }
    #shopee-product-link-extractor tbody tr:hover td {
      background: #fff2ec !important;
    }
    #shopee-product-link-extractor .spe-link {
      color: var(--stk-brand-dark) !important;
      font-weight: 650 !important;
    }
    #shopee-product-link-extractor .spe-row-actions button,
    #shopee-product-link-extractor .spe-row-actions a {
      border-color: var(--stk-line) !important;
      color: #4c4741 !important;
      background: #f5f1ea !important;
    }
    #shopee-product-link-extractor .spe-empty {
      color: var(--stk-muted) !important;
      background: var(--stk-paper) !important;
    }
    #shopee-product-link-extractor .spe-error {
      border: 1px solid #ecc3bb !important;
      border-radius: 11px !important;
      color: #8c2d28 !important;
      background: #fff0ec !important;
    }
    #shopee-product-link-extractor .spe-toast,
    #voucherWalletModal .copy-toast {
      border-radius: 12px !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
      box-shadow: 0 14px 35px rgba(0, 0, 0, .24) !important;
    }

    /* Wallet */
    #voucherWalletModal .voucher-tabs {
      gap: 4px !important;
      padding: 12px 18px 0 !important;
      border: 0 !important;
      background: var(--stk-paper) !important;
    }
    #voucherWalletModal .voucher-tab {
      padding: 10px 14px !important;
      border: 0 !important;
      border-radius: 10px 10px 0 0 !important;
      color: var(--stk-muted) !important;
      background: transparent !important;
      font-size: 12px !important;
      font-weight: 720 !important;
    }
    #voucherWalletModal .voucher-tab.active {
      color: #fff !important;
      background: var(--stk-ink) !important;
    }
    #voucherWalletModal .voucher-wallet-search {
      padding: 13px 18px 16px !important;
      border-bottom: 1px solid var(--stk-line) !important;
      background: var(--stk-paper) !important;
    }
    #voucherWalletModal .voucher-search-input {
      min-height: 44px !important;
      padding: 0 15px !important;
      background-image: none !important;
    }
    #voucherWalletModal .voucher-wallet-content {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      grid-auto-rows: auto !important;
      gap: 12px !important;
      padding: 16px !important;
      background: var(--stk-canvas) !important;
    }
    #voucherWalletModal .voucher-card {
      position: relative !important;
      display: grid !important;
      grid-template-columns: 66px minmax(0, 1fr) !important;
      align-items: start !important;
      gap: 14px !important;
      margin: 0 !important;
      padding: 15px !important;
      overflow: hidden !important;
      border: 0 !important;
      border-radius: 16px !important;
      background: var(--stk-card) !important;
      box-shadow: 0 1px 0 rgba(255,255,255,.8), 0 5px 18px rgba(38, 33, 27, .07) !important;
      transform: none !important;
    }
    #voucherWalletModal .voucher-card::after {
      position: absolute;
      inset: 0 0 auto;
      height: 3px;
      background: linear-gradient(90deg, var(--stk-brand), #ffb29f 54%, transparent);
      content: "";
    }
    #voucherWalletModal .voucher-card:hover {
      box-shadow: 0 10px 28px rgba(38, 33, 27, .12) !important;
      transform: translateY(-2px) !important;
    }
    #voucherWalletModal .voucher-avatar-section {
      width: 66px !important;
      gap: 7px !important;
    }
    #voucherWalletModal .voucher-avatar {
      width: 58px !important;
      height: 58px !important;
      flex-basis: 58px !important;
      border: 0 !important;
      border-radius: 50% !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
      box-shadow: inset 0 0 0 4px rgba(255,255,255,.12) !important;
    }
    #voucherWalletModal .voucher-avatar.shipping { background: var(--stk-green) !important; }
    #voucherWalletModal .voucher-avatar.payment { color: #49443e !important; background: #ded8ce !important; }
    #voucherWalletModal .voucher-avatar-label {
      width: 66px !important;
      color: #8b847a !important;
      font-size: 9px !important;
    }
    #voucherWalletModal .voucher-detail-title,
    #voucherWalletModal .voucher-code {
      color: var(--stk-brand-dark) !important;
      font-size: 14px !important;
      font-weight: 780 !important;
    }
    #voucherWalletModal .voucher-detail-line,
    #voucherWalletModal .voucher-terms,
    #voucherWalletModal .voucher-stat-item {
      color: var(--stk-muted) !important;
      font-size: 11.5px !important;
      line-height: 1.55 !important;
    }
    #voucherWalletModal .voucher-detail-line strong { color: var(--stk-ink) !important; }
    #voucherWalletModal .voucher-detail-actions { gap: 6px !important; }
    #voucherWalletModal .voucher-detail-button {
      min-height: 30px !important;
      padding: 0 9px !important;
      border: 1px solid var(--stk-line) !important;
      border-radius: 9px !important;
      color: #4c4741 !important;
      background: #f6f2eb !important;
      font-size: 10px !important;
      font-weight: 730 !important;
    }
    #voucherWalletModal .voucher-detail-button.primary {
      border-color: var(--stk-ink) !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
    }
    #voucherWalletModal .voucher-wallet-loading {
      grid-column: 1 / -1 !important;
      color: var(--stk-muted) !important;
    }
    #voucherWalletModal .voucher-wallet-spinner {
      width: 38px !important;
      height: 38px !important;
      border-color: #dcd5cb !important;
      border-top-color: var(--stk-brand) !important;
    }

    /* Voucher checker + banner scanner */
    #voucherInfoPopup #voucherLinkInput {
      min-height: 92px !important;
      padding: 14px 15px !important;
      resize: vertical !important;
    }
    #voucherInfoPopup #voucherActionRow,
    #voucherInfoPopup #voucherUtilityRow,
    #voucherInfoPopup #voucherStatsActions {
      gap: 7px !important;
    }
    #voucherInfoPopup #voucherActionRow button,
    #voucherInfoPopup #voucherUtilityRow button,
    #voucherInfoPopup #voucherStatsActions button {
      min-height: 40px !important;
      padding: 0 13px !important;
      border: 1px solid var(--stk-line-dark) !important;
      border-radius: 10px !important;
      color: var(--stk-ink) !important;
      background: var(--stk-paper) !important;
      box-shadow: none !important;
      font-size: 11px !important;
      font-weight: 740 !important;
    }
    #voucherInfoPopup #loadVoucherBtn,
    #voucherInfoPopup #scanBannerBtn {
      color: #fff !important;
      background: var(--stk-brand) !important;
    }
    #voucherInfoPopup #saveAllBtn {
      border-color: var(--stk-ink) !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
    }
    #voucherInfoPopup #voucherFilterWrap label {
      color: var(--stk-muted) !important;
      font-size: 11px !important;
      font-weight: 680 !important;
    }
    #voucherInfoPopup #voucherContent > div:not(.voucher-row),
    #voucherInfoPopup #saveLogArea {
      border-color: var(--stk-line) !important;
      border-radius: 12px !important;
      color: #514b44 !important;
      background: var(--stk-paper) !important;
    }
    #voucherInfoPopup .voucher-row {
      position: relative !important;
      gap: 14px !important;
      margin: 0 0 9px !important;
      padding: 15px 16px 15px 19px !important;
      overflow: hidden !important;
      border: 0 !important;
      border-radius: 14px !important;
      color: var(--stk-ink) !important;
      background: var(--stk-card) !important;
      box-shadow: 0 4px 16px rgba(38, 33, 27, .07) !important;
    }
    #voucherInfoPopup .voucher-row::before {
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      background: var(--stk-brand);
      content: "";
    }
    #voucherInfoPopup .voucher-row > div {
      color: var(--stk-muted) !important;
    }
    #voucherInfoPopup .voucher-row a {
      color: var(--stk-brand-dark) !important;
      font-weight: 740 !important;
    }
    #voucherInfoPopup .voucher-row .save-btn {
      min-height: 34px !important;
      border: 1px solid var(--stk-ink) !important;
      border-radius: 9px !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
      box-shadow: none !important;
    }
    #voucherInfoPopup .copy-code-icon {
      color: var(--stk-brand-dark) !important;
      background: transparent !important;
    }

    /* Scheduler / spam save */
    .banner-save-modal .banner-save-content {
      padding: 20px !important;
      background: var(--stk-canvas) !important;
    }
    .banner-save-modal .banner-input-group {
      margin-bottom: 14px !important;
    }
    .banner-save-modal .banner-input-group label {
      margin-bottom: 7px !important;
      color: var(--stk-ink) !important;
      font-size: 11px !important;
      font-weight: 760 !important;
      letter-spacing: .04em !important;
      text-transform: uppercase !important;
    }
    .banner-save-modal .banner-input-group input,
    .banner-save-modal .banner-input-group select {
      min-height: 46px !important;
      padding: 0 14px !important;
    }
    .banner-save-modal .banner-input-hint {
      margin-top: 7px !important;
      color: var(--stk-muted) !important;
      font-size: 11px !important;
      font-style: normal !important;
    }
    .banner-save-modal .banner-warning {
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      border: 1px solid #dec8a7 !important;
      border-left: 4px solid #c9862d !important;
      border-radius: 11px !important;
      color: #6f4b1f !important;
      background: #fff7e7 !important;
      font-size: 11.5px !important;
      line-height: 1.55 !important;
    }
    .banner-save-modal .banner-action-row {
      gap: 8px !important;
      margin-bottom: 14px !important;
    }
    .banner-save-modal .banner-start-btn,
    .banner-save-modal .banner-check-captcha-btn {
      min-height: 45px !important;
      padding: 0 14px !important;
      font-size: 12px !important;
    }
    .banner-save-modal .banner-check-captcha-btn {
      border-color: var(--stk-ink) !important;
      color: #fff !important;
      background: var(--stk-ink) !important;
    }
    .banner-save-modal .banner-start-btn.stop {
      border-color: var(--stk-red) !important;
      background: var(--stk-red) !important;
    }
    .banner-save-modal .banner-log-container {
      max-height: 310px !important;
      padding: 13px !important;
      border: 0 !important;
      border-radius: 14px !important;
      background: var(--stk-paper) !important;
      box-shadow: inset 0 0 0 1px var(--stk-line) !important;
    }
    .banner-save-modal .banner-log-title {
      margin-bottom: 10px !important;
      color: var(--stk-ink) !important;
      font-size: 10px !important;
      font-weight: 790 !important;
      letter-spacing: .08em !important;
      text-transform: uppercase !important;
    }
    .banner-save-modal .log-header-block,
    .banner-save-modal .log-result-block,
    .banner-save-modal .voucher-item {
      margin-bottom: 8px !important;
      border: 0 !important;
      border-left: 4px solid var(--stk-amber) !important;
      border-radius: 10px !important;
      color: #68491e !important;
      background: #f8edda !important;
      box-shadow: none !important;
    }
    .banner-save-modal .log-result-success,
    .banner-save-modal .voucher-item.success {
      border-left-color: var(--stk-green) !important;
      background: #e8f3ed !important;
    }
    .banner-save-modal .log-result-error,
    .banner-save-modal .voucher-item.error {
      border-left-color: var(--stk-red) !important;
      background: #f8e8e5 !important;
    }
    .banner-save-modal .log-result-content,
    .banner-save-modal .voucher-details,
    .banner-save-modal .voucher-header {
      color: inherit !important;
      background: transparent !important;
      border-color: rgba(86, 75, 62, .12) !important;
      font-size: 11.5px !important;
    }

    /* Shared scrollbars */
    #shopee-product-link-extractor ::-webkit-scrollbar,
    #voucherWalletModal ::-webkit-scrollbar,
    #voucherInfoPopup ::-webkit-scrollbar,
    .banner-save-modal ::-webkit-scrollbar { width: 8px; height: 8px; }
    #shopee-product-link-extractor ::-webkit-scrollbar-thumb,
    #voucherWalletModal ::-webkit-scrollbar-thumb,
    #voucherInfoPopup ::-webkit-scrollbar-thumb,
    .banner-save-modal ::-webkit-scrollbar-thumb {
      border: 2px solid transparent;
      border-radius: 99px;
      background: #bdb4a8;
      background-clip: padding-box;
    }

    @media (max-width: 760px) {
      #shopee-product-link-extractor .spe-panel,
      #voucherWalletModal .voucher-wallet-modal,
      .banner-save-modal .banner-save-container,
      #voucherInfoPopup {
        width: calc(100vw - 12px) !important;
        max-height: calc(100vh - 12px) !important;
        border-radius: 16px !important;
      }
      #shopee-product-link-extractor .spe-header,
      #voucherWalletModal .voucher-wallet-header,
      .banner-save-modal .banner-save-header {
        min-height: 80px !important;
        padding: 18px 15px !important;
      }
      #shopee-product-link-extractor h2,
      #voucherWalletModal .voucher-wallet-header h2,
      .banner-save-modal .banner-save-header h2 { font-size: 19px !important; }
      #shopee-product-link-extractor .spe-subtitle,
      .banner-save-modal .banner-save-header p { display: none !important; }
      #shopee-product-link-extractor .spe-back,
      #voucherWalletModal .voucher-wallet-back,
      #voucherInfoPopup #backToToolkitBtn,
      .banner-save-modal .banner-back-btn {
        width: 40px !important;
        padding: 0 !important;
        overflow: hidden !important;
        color: transparent !important;
        font-size: 0 !important;
      }
      #shopee-product-link-extractor .spe-back::after,
      #voucherWalletModal .voucher-wallet-back::after,
      #voucherInfoPopup #backToToolkitBtn::after,
      .banner-save-modal .banner-back-btn::after {
        color: #fff;
        font-size: 18px;
        content: "←";
      }
      #shopee-product-link-extractor .spe-controls,
      #shopee-product-link-extractor .spe-toolbar,
      .banner-save-modal .banner-save-content { padding: 14px !important; }
      #shopee-product-link-extractor .spe-fetch { grid-template-columns: 1fr 82px !important; }
      #voucherWalletModal .voucher-wallet-content { grid-template-columns: 1fr !important; padding: 10px !important; }
      #voucherWalletModal .voucher-tabs { overflow-x: auto !important; white-space: nowrap !important; }
      #voucherInfoPopup { padding: 12px !important; }
      #voucherInfoPopup #popupScrollArea { max-height: calc(100vh - 36px) !important; }
      #voucherInfoPopup #popupScrollArea > div:first-child { margin: -12px -12px 14px !important; padding: 16px 13px !important; }
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
