(() => {
  "use strict";

  const STYLE_ID = "shopee-toolkit-shared-ui";
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    :root {
      --stk-accent: #ee4d2d;
      --stk-accent-hover: #dd3f20;
      --stk-accent-soft: #fff3ef;
      --stk-bg: #f7f9fc;
      --stk-panel: #ffffff;
      --stk-text: #111827;
      --stk-muted: #64748b;
      --stk-line: #e2e8f0;
      --stk-radius: 22px;
      --stk-shadow: 0 30px 90px rgba(15, 23, 42, .26), 0 2px 8px rgba(15, 23, 42, .08);
      --stk-font: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    /* Overlay */
    #shopee-product-link-extractor .spe-backdrop,
    #voucherWalletModal,
    .banner-save-modal {
      background: rgba(15, 23, 42, .48) !important;
      backdrop-filter: blur(11px) saturate(.82) !important;
    }

    /* Panel */
    #shopee-product-link-extractor .spe-panel,
    #voucherWalletModal .voucher-wallet-modal,
    .banner-save-modal .banner-save-container {
      border: 1px solid rgba(255, 255, 255, .82) !important;
      border-radius: var(--stk-radius) !important;
      background: var(--stk-panel) !important;
      box-shadow: var(--stk-shadow) !important;
      font-family: var(--stk-font) !important;
    }
    #voucherInfoPopup {
      border: 1px solid rgba(255, 255, 255, .82) !important;
      border-radius: var(--stk-radius) !important;
      background: var(--stk-panel) !important;
      box-shadow: 0 0 0 100vmax rgba(15, 23, 42, .48), var(--stk-shadow) !important;
      font-family: var(--stk-font) !important;
    }

    /* Header */
    #shopee-product-link-extractor .spe-header,
    #voucherWalletModal .voucher-wallet-header,
    .banner-save-modal .banner-save-header {
      min-height: 76px !important;
      padding: 17px 22px !important;
      border-bottom: 1px solid #e9eef5 !important;
      border-radius: var(--stk-radius) var(--stk-radius) 0 0 !important;
      color: var(--stk-text) !important;
      background: linear-gradient(135deg, #fff, #fff8f6) !important;
    }
    #voucherInfoPopup #popupScrollArea > div:first-child {
      min-height: 67px !important;
      margin: -18px -18px 16px !important;
      padding: 15px 18px !important;
      border-bottom: 1px solid #e9eef5 !important;
      background: linear-gradient(135deg, #fff, #fff8f6) !important;
    }
    #shopee-product-link-extractor h2,
    #voucherWalletModal .voucher-wallet-header h2,
    #voucherInfoPopup h2,
    .banner-save-modal .banner-save-header h2 {
      margin: 0 !important;
      color: var(--stk-text) !important;
      font-size: 19px !important;
      font-weight: 800 !important;
      letter-spacing: -.025em !important;
    }
    #shopee-product-link-extractor .spe-subtitle,
    .banner-save-modal .banner-save-header p {
      margin-top: 4px !important;
      color: var(--stk-muted) !important;
      font-size: 11.5px !important;
      opacity: 1 !important;
    }
    .banner-save-modal .banner-save-header h2 {
      cursor: default !important;
    }
    .banner-save-modal .banner-pip-text {
      color: var(--stk-accent) !important;
    }

    /* Back / close */
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
      border-radius: 11px !important;
      color: #475569 !important;
      background: #fff !important;
      box-shadow: none !important;
      font-size: 12px !important;
      font-weight: 750 !important;
      cursor: pointer !important;
      transform: none !important;
    }
    #shopee-product-link-extractor .spe-close,
    #voucherWalletModal .voucher-wallet-close,
    #voucherInfoPopup #closePopupBtn,
    .banner-save-modal .banner-close-btn {
      width: 38px !important;
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
      border-color: #f3b1a2 !important;
      color: var(--stk-accent) !important;
      background: var(--stk-accent-soft) !important;
    }
    .banner-save-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Form controls */
    #shopee-product-link-extractor input,
    #voucherWalletModal input,
    #voucherInfoPopup textarea,
    #voucherInfoPopup select,
    .banner-save-modal input,
    .banner-save-modal select {
      border: 1px solid #dbe3ed !important;
      border-radius: 11px !important;
      outline: none !important;
      color: #172033 !important;
      background: #f8fafc !important;
      box-shadow: none !important;
      font-family: var(--stk-font) !important;
    }
    #shopee-product-link-extractor input:focus,
    #voucherWalletModal input:focus,
    #voucherInfoPopup textarea:focus,
    #voucherInfoPopup select:focus,
    .banner-save-modal input:focus,
    .banner-save-modal select:focus {
      border-color: var(--stk-accent) !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(238, 77, 45, .11) !important;
    }

    /* Primary actions */
    #shopee-product-link-extractor .spe-get,
    #voucherInfoPopup #loadVoucherBtn,
    #voucherInfoPopup #scanBannerBtn,
    .banner-save-modal .banner-start-btn {
      border: 1px solid var(--stk-accent) !important;
      border-radius: 10px !important;
      color: #fff !important;
      background: linear-gradient(135deg, #ff6847, #e83d1c) !important;
      box-shadow: 0 7px 18px rgba(238, 77, 45, .16) !important;
      font-weight: 750 !important;
    }
    #voucherInfoPopup #viewBannerBtn,
    #voucherInfoPopup #saveAllBtn,
    .banner-save-modal .banner-check-captcha-btn {
      border: 1px solid #dbe3ed !important;
      border-radius: 10px !important;
      color: #334155 !important;
      background: #fff !important;
      box-shadow: none !important;
      font-weight: 750 !important;
    }

    /* Content surfaces */
    #voucherWalletModal .voucher-wallet-content,
    .banner-save-modal .banner-save-content {
      background: var(--stk-bg) !important;
    }
    #voucherWalletModal .voucher-card,
    #voucherInfoPopup .voucher-row,
    .banner-save-modal .voucher-item,
    .banner-save-modal .banner-log-container {
      border: 1px solid #e3e9f1 !important;
      border-radius: 14px !important;
      background: #fff !important;
      box-shadow: 0 4px 16px rgba(15, 23, 42, .045) !important;
    }
    #voucherWalletModal .voucher-avatar {
      border-radius: 13px !important;
    }
    #voucherWalletModal .voucher-detail-title,
    #voucherInfoPopup a {
      color: var(--stk-accent) !important;
    }
    .banner-save-modal .banner-warning {
      border: 1px solid #fed7aa !important;
      border-left: 3px solid #f59e0b !important;
      border-radius: 11px !important;
      color: #92400e !important;
      background: #fffbeb !important;
    }
    .banner-save-modal .banner-log-container {
      max-height: 330px !important;
      background: #f8fafc !important;
    }

    @media (max-width: 640px) {
      #shopee-product-link-extractor .spe-header,
      #voucherWalletModal .voucher-wallet-header,
      .banner-save-modal .banner-save-header {
        min-height: 68px !important;
        padding: 14px !important;
      }
      .banner-save-modal .banner-save-container {
        width: calc(100% - 12px) !important;
        max-height: calc(100% - 12px) !important;
      }
    }
  `;
  document.head.append(style);
})();
