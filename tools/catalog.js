window.SHOPEE_TOOLKIT_CATALOG = [
  {
    id: "product-link-extractor",
    title: "Product Link Extractor",
    description: "Lấy toàn bộ Item ID và link sản phẩm từ Shop ID, username hoặc link Shopee.",
    file: "tools/product-link-extractor.js",
    dependencies: ["tools/ui-system.js"],
    icon: "PL",
    existingSelector: "#shopee-product-link-extractor"
  },
  {
    id: "voucher-wallet",
    title: "Ví Voucher",
    description: "Xem, tìm kiếm và mở các voucher đang có trong tài khoản.",
    file: "tools/voucher-wallet.js",
    dependencies: ["tools/ui-system.js"],
    icon: "VW",
    entry: "showVoucherWallet",
    existingSelector: "#voucherWalletModal"
  },
  {
    id: "voucher-checker",
    title: "Check Voucher",
    description: "Bản đầy đủ: kiểm tra link/ID, lọc, copy, lưu voucher và xem thông tin chi tiết.",
    file: "tools/voucher-checker.js",
    dependencies: ["tools/ui-system.js"],
    icon: "CV",
    existingSelector: "#voucherInfoPopup"
  },
  {
    id: "banner-voucher",
    title: "Banner Voucher",
    description: "Quét/Xem banner, lấy ID:SIGN rồi đưa vào bộ Check Voucher đầy đủ.",
    file: "tools/banner-voucher.js",
    dependencies: ["tools/ui-system.js"],
    icon: "BV",
    existingSelector: "#voucherInfoPopup"
  },
  {
    id: "auto-save-voucher",
    title: "Auto Save Voucher",
    description: "Hẹn giờ theo banner, quét mã mới và lưu lặp có giới hạn, retry, log và nút dừng.",
    file: "tools/auto-save-voucher.js",
    dependencies: ["tools/ui-system.js"],
    icon: "AS",
    existingSelector: "#banner-save-modal"
  }
];
