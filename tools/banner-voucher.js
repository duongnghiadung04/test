(() => {
  "use strict";
  if (!window.ShopeeVoucherCore) {
    alert("Không tải được Voucher Core.");
    return;
  }
  window.ShopeeVoucherCore.openBannerVoucher();
})();
