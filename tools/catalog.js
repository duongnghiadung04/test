window.SHOPEE_TOOLKIT_CATALOG = [
  {
    id: "product-link-extractor",
    title: "Product Link Extractor",
    description: "Lấy toàn bộ Item ID và link sản phẩm từ Shop ID, username hoặc link Shopee.",
    file: "tools/product-link-extractor.js",
    icon: "PL",
    existingSelector: "#shopee-product-link-extractor"
  },
  {
    id: "voucher-wallet",
    title: "Ví Voucher",
    description: "Xem, tìm kiếm và mở các voucher đang có trong tài khoản.",
    file: "tools/voucher-wallet.js",
    icon: "VW",
    entry: "showVoucherWallet",
    existingSelector: "#voucherWalletModal"
  },
  {
    id: "voucher-checker",
    title: "Check Voucher",
    description: "Kiểm tra link, Promotion ID hoặc ID:SIGN và lưu voucher.",
    file: "tools/voucher-checker.js",
    dependencies: ["tools/voucher-core.js"],
    icon: "CV",
    existingSelector: "#svt-check-voucher"
  },
  {
    id: "banner-voucher",
    title: "Banner Voucher",
    description: "Quét banner, lấy ID:SIGN rồi đưa qua bộ Check Voucher dùng chung.",
    file: "tools/banner-voucher.js",
    dependencies: ["tools/voucher-core.js"],
    icon: "BV",
    existingSelector: "#svt-banner-voucher"
  }
];
