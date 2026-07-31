# Shopee Bookmarklet Toolkit

Bộ công cụ JavaScript dạng bookmarklet. Một launcher hiển thị bảng chức năng; mỗi công cụ chỉ được tải khi người dùng bấm vào.

Tất cả công cụ dùng chung giao diện sáng, màu cam Shopee và nút **← Back** để quay lại launcher mà không cần bấm bookmark lần nữa.

## Cấu trúc

```text
index.html                         Trang tạo bookmarklet
launcher.js                        Bảng chọn và bộ tải script
bookmarklet.txt                    Mẫu bookmarklet thủ công
tools/catalog.js                   Danh mục công cụ
tools/product-link-extractor.js    Shopee Product Link Extractor
tools/voucher-wallet.js            Ví Voucher
tools/voucher-checker.js           Check Voucher đầy đủ, tách giao diện Check
tools/banner-voucher.js            Code đầy đủ, tách giao diện Quét/Xem Banner
```

## Đưa lên GitHub Pages

1. Tạo repository mới và upload toàn bộ nội dung thư mục này vào root của repository.
2. Vào **Settings → Pages**.
3. Chọn **Deploy from a branch**, branch `main`, thư mục `/ (root)` rồi bấm **Save**.
4. Mở địa chỉ `https://USERNAME.github.io/REPOSITORY/`.
5. Kéo nút **Kéo nút này lên thanh Bookmark** lên thanh dấu trang.
6. Đăng nhập `shopee.vn`, sau đó bấm bookmark **Shopee Toolkit**.

### Nếu Deploy from a branch bị kẹt

Repository đã có sẵn `.github/workflows/pages.yml`. Trong **Settings → Pages**, đổi **Source** thành **GitHub Actions**, sau đó vào tab **Actions** và chạy workflow **Deploy Shopee Toolkit to GitHub Pages**. Mỗi lần push vào `main`, site sẽ tự deploy lại.

Nếu không kéo được nút, hãy tạo bookmark mới và dán nội dung do nút **Copy Bookmarklet** cung cấp vào trường URL.

## Thêm công cụ mới

1. Đặt file JavaScript vào thư mục `tools/`.
2. Thêm một object vào `tools/catalog.js`:

```js
{
  id: "ten-cong-cu",
  title: "Tên công cụ",
  description: "Mô tả ngắn",
  file: "tools/ten-cong-cu.js",
  icon: "JS"
}
```

Script IIFE sẽ tự chạy ngay sau khi được tải. Nếu file chỉ khai báo một hàm toàn cục, thêm `entry: "tenHam"` để launcher gọi hàm đó sau khi tải.

Hai file voucher đều giữ đầy đủ các hàm từ code gốc. Bản Check chỉ ẩn nút Banner; bản Banner chỉ ẩn nút nhập Check thủ công. Khi quét xong, Banner gọi trực tiếp `fetchVouchersBatch(lines)` gốc để hiển thị đầy đủ kết quả, bộ lọc, copy và lưu voucher.

## Lưu ý

- Công cụ phải chạy trên `shopee.vn` và sử dụng phiên đăng nhập hiện tại của trình duyệt.
- Không đưa cookie, token hoặc header bảo mật cá nhân vào repository.
- Nếu trình duyệt báo CSP và chặn GitHub Pages, có thể dùng URL jsDelivr làm URL gốc trong trang cài đặt: `https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@main/`.
