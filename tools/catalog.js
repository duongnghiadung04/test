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
    description: "Bản đầy đủ: kiểm tra link/ID, lọc, copy, lưu voucher và xem thông tin chi tiết.",
    file: "tools/voucher-checker.js",
    icon: "CV",
    existingSelector: "#voucherInfoPopup"
  },
  {
    id: "banner-voucher",
    title: "Banner Voucher",
    description: "Quét/Xem banner, lấy ID:SIGN rồi đưa vào bộ Check Voucher đầy đủ.",
    file: "tools/banner-voucher.js",
    icon: "BV",
    existingSelector: "#voucherInfoPopup"
  }
];
