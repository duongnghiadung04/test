(function() {
    'use strict';
    
    if (!location.hostname.includes('shopee.vn')) {return;}
    // Function: window.showVoucherWallet()
    // Hiển thị ví voucher của user với giao diện đẹp, có search

    window.showVoucherWallet = async function() {
        function handleCaptcha903(data) {
            if (!data || Number(data.error) !== 90309999) return false;
            if (typeof window.showCaptchaErrorModal === 'function') window.showCaptchaErrorModal();
            return true;
        }

        // Xóa modal cũ nếu có
        const oldModal = document.getElementById('voucherWalletModal');
        if (oldModal) oldModal.remove();

        // Hàm đóng modal
        window.closeVoucherWallet = function() {
            const modal = document.getElementById('voucherWalletModal');
            const style = document.getElementById('voucher-wallet-style');
            if (modal) modal.remove();
            if (style) style.remove();
        };

        // Cache vouchers cho các tab
        let cachedVouchers = {
            1: null,
            2: null,
            3: null
        };
        let currentStatus = 1;
        let activeVouchers = []; // Voucher đang hiển thị (của tab hiện tại)

        // Tạo style cho modal
        const style = document.createElement('style');
        style.id = 'voucher-wallet-style';
        style.textContent = `
            .voucher-wallet-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .voucher-wallet-modal {
                background: linear-gradient(135deg, #ffffff 0%, #fef7f5 100%);
                border-radius: 16px;
                width: 90%;
                max-width: 1080px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(238, 77, 45, 0.2);
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .voucher-wallet-header {
                background: linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%);
                color: white;
                padding: 18px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 16px 16px 0 0;
            }

            .voucher-wallet-header h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .voucher-wallet-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
            }

            .voucher-wallet-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            /* TABS */
            .voucher-tabs {
                display: flex;
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 0 20px;
                gap: 20px;
                flex-shrink: 0;
            }
            .voucher-tab {
                padding: 15px 5px;
                font-size: 15px;
                font-weight: 500;
                color: #6b7280;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s;
            }
            .voucher-tab:hover {
                color: #ee4d2d;
            }
            .voucher-tab.active {
                color: #ee4d2d;
                border-bottom-color: #ee4d2d;
                font-weight: 700;
            }

            .voucher-wallet-search {
                padding: 16px 20px;
                background: white;
                border-bottom: 1px solid #e5e7eb;
            }

            .voucher-search-input {
                width: 100%;
                padding: 12px 16px 12px 45px;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                font-size: 14px;
                transition: all 0.3s ease;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ee4d2d" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>') no-repeat 15px center;
                background-size: 18px;
                box-sizing: border-box;
            }

            .voucher-search-input:focus {
                outline: none;
                border-color: #ee4d2d;
                box-shadow: 0 0 0 3px rgba(238, 77, 45, 0.1);
            }

            .voucher-wallet-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: 1fr; /* Thêm dòng này - bắt tất cả rows có cùng chiều cao */
                gap: 16px;
                align-content: start;
            }

            #claimedstatus {
                padding-left:10px;
            }

            .voucher-wallet-loading {
                grid-column: 1 / -1; /* Chiếm toàn bộ chiều rộng grid */
                text-align: center;
                padding: 60px 20px;
                color: #6b7280;
            }

            .voucher-wallet-spinner {
                border: 4px solid #fee2e2;
                border-top: 4px solid #ee4d2d;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .voucher-card {
                background: white;
                border-radius: 12px;
                margin-bottom: 0;
                padding: 16px;
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
                display: flex; /* Changed to flex for better control */
                flex-direction: row;
                gap: 22px;
                align-items: center;
            }

            .voucher-card:hover {
                box-shadow: 0 8px 20px rgba(238, 77, 45, 0.1);
                transform: translateY(-2px);
                border-color: #ee4d2d;
            }

            .voucher-icon-section {
                flex-shrink: 0;
                cursor: pointer;
                transition: transform 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                width: 110px;
            }
            .voucher-icon-section:hover {
                transform: scale(1.05);
            }

            .voucher-icon {
                width: 85px;
                height: 85px;
                border-radius: 10px;
                object-fit: cover;
                display: block;
            }

            .voucher-icon-text {
                width: 100%;
                color: #6b7280;
                font-size: 11px;
                font-weight: 700;
                text-align: center;
                line-height: 1.4;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-transform: uppercase;
            }
            
            .voucher-right-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0; /* Prevent flex overflow */
            }

            /* Code Line with Icon */
            .voucher-line-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: nowrap;
            }

            .voucher-code {
                font-size: 15px;
                font-weight: 700;
                color: #ee4d2d;
                font-family: 'Courier New', monospace;
                letter-spacing: 0.3px;
                cursor: pointer;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            .voucher-code:hover {
                color: #1d4ed8;
                text-decoration: underline;
            }

            .copy-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                z-index: 2147483647; /* Max z-index to ensure visibility */
                animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
                font-weight: 500;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .voucher-terms {
                color: #374151;
                font-size: 13px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            .action-icon {
                font-size: 16px;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #f3f4f6;
            }
            .action-icon:hover {
                opacity: 1;
                transform: scale(1.1);
                background: #e5e7eb;
            }
            .icon-copy-link { color: #10b981; }
            .icon-use { color: #3b82f6; }

            .voucher-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                font-size: 12px;
                margin-top: 2px;
            }

            .voucher-stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #6b7280;
                font-size: 12px;
            }

            .voucher-stat-value {
                font-weight: 600;
            }

            .stat-success { color: #16a34a; }
            .stat-warning { color: #d97706; }
            .stat-danger { color: #dc2626; }

            .voucher-time {
                font-size: 11px;
                color: #059669;
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 2px;
            }

            .voucher-btn {
                display: none; /* Hide old buttons */
            }

            /* ... (keep other styles) ... */

            /* Mobile responsive */
            @media (max-width: 768px) {
                .voucher-wallet-content {
                    grid-template-columns: 1fr;
                }
                .voucher-card {
                    padding: 12px 4px;
                    gap: 12px;
                }
                .voucher-icon {
                    width: 70px;
                    height: 70px;
                }
                .voucher-code {
                    font-size: 14px;
                }
                .voucher-icon-text {    
                    font-size: 9px;
                }
                .voucher-wallet-content {
                    padding: 10px;  
                }
                .voucher-icon-section {
                    width: 80px;
                }
            }
        `;
        document.head.appendChild(style);

        // Tạo HTML modal
        const modalHTML = `
            <div class="voucher-wallet-overlay" id="voucherWalletModal">
                <div class="voucher-wallet-modal">
                    <div class="voucher-wallet-header">
                        <h2>
                            <span>🎫</span>
                            <span>Ví Voucher Của Tôi</span>
                        </h2>
                        <button class="voucher-wallet-close" onclick="closeVoucherWallet()">
                            ×
                        </button>
                    </div>
                    
                    <div class="voucher-tabs">
                        <div class="voucher-tab active" data-tab="1">Sẵn ví</div>
                        <div class="voucher-tab" data-tab="3">Hết mã</div>
                        <div class="voucher-tab" data-tab="2">Đã dùng</div>
                    </div>

                    <div class="voucher-wallet-search">
                        <input 
                            type="text" 
                            class="voucher-search-input" 
                            id="voucherSearchInput"
                            placeholder="Tìm kiếm theo mã, điều kiện, % giảm giá..."
                        >
                    </div>
                    <div class="voucher-wallet-content" id="voucherWalletContent">
                        <div class="voucher-wallet-loading">
                            <div class="voucher-wallet-spinner"></div>
                            <p><strong>Đang tải voucher...</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Hàm load vouchers từ API
        async function loadVouchers(status) {
            const content = document.getElementById('voucherWalletContent');
            
            // Show loading
            content.innerHTML = `
                <div class="voucher-wallet-loading">
                    <div class="voucher-wallet-spinner"></div>
                    <p><strong>Đang tải danh sách...</strong></p>
                </div>
            `;

            // Check cache
            if (cachedVouchers[status]) {
                activeVouchers = cachedVouchers[status];
                renderVouchers(activeVouchers);
                 // Trigger search
                const searchVal = document.getElementById('voucherSearchInput').value.trim();
                if (searchVal) filterVouchers(searchVal);
                return;
            }
            
            try {
                const cookies = document.cookie;
                const csrfToken = cookies.match(/csrftoken=([^;]+)/)?.[1] || '';
                
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Csrftoken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                };
                
                // Quy định số trang load
                const maxPages = status === 1 ? 4 : 3;

                const payload = {
                    "exclude_user_voucher_list_type": [9],
                    "voucher_status": status,
                    "user_voucher_list_type": 1,
                    "voucher_sort_flag": 1,
                    "cursor": "",
                    "limit": 100,
                    "addition": ["voucher_microsite_link"],
                    "version": 6,
                    "priority_voucher_list": null
                };
                
                let allVoucherData = [];
                let cursor = "";
                
                // Fetch multiple pages
                for (let i = 0; i < maxPages; i++) {
                    payload.cursor = cursor;
                    
                    try {
                        const response = await fetch('https://shopee.vn/api/v2/voucher_wallet/get_user_voucher_list', {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(payload)
                        });
                        
                        const data = await response.json();
                        if (handleCaptcha903(data)) break;
                        
                        if (data.data && data.data.user_voucher_list) {
                            allVoucherData = allVoucherData.concat(data.data.user_voucher_list);
                            
                            if (data.data.next) {
                                cursor = data.data.next;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } catch (error) {
                        console.error('Lỗi khi fetch voucher:', error);
                        break;
                    }
                }

                // Parse vouchers
                const vouchers = allVoucherData.map(v => parseVoucher(v));
                
                cachedVouchers[status] = vouchers;
                activeVouchers = vouchers;

                // Render vouchers
                renderVouchers(activeVouchers);

                // Trigger search
                const searchVal = document.getElementById('voucherSearchInput').value.trim();
                if (searchVal) filterVouchers(searchVal);

            } catch (error) {
                console.error('Error loading vouchers:', error);
                content.innerHTML = `
                    <div class="voucher-empty">
                        <div class="voucher-empty-icon">⚠️</div>
                        <h3>Không thể tải voucher</h3>
                        <p style="color: #dc2626;">${error.message}</p>
                    </div>
                `;
            }
        }

        // Hàm get CSRF token
        function getCsrfToken() {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') return value;
            }
            return '';
        }

        // Hàm rút gọn tên mã voucher
        function shortenVoucherCode(code) {
            if (!code) return '';
            
            // Tìm chuỗi số dài >= 10 chữ số liên tiếp
            const match = code.match(/^([A-Z-]+)(\d{10,})$/);
            
            if (match) {
                const prefix = match[1]; // Phần chữ (VD: LIVE-, VIDEO-, SV)
                const numbers = match[2]; // Phần số dài
                const lastThree = numbers.slice(-3); // 3 số cuối
                return `${prefix}...${lastThree}`;
            }
            
            return code; // Không match thì giữ nguyên
        }

        // Hàm parse voucher
        function parseVoucher(v) {
            // Helper format number: 3300 -> 3.300
            const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            // Format time
            const formatTime = (timestamp) => {
                const date = new Date(timestamp * 1000);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                return `${hours}:${minutes} | ${day}/${month}`;
            };

            // Format terms
            let terms = '';
            if (v.discount_percentage) {
                const discountPercentage = v.discount_percentage;
                const minSpend = fmt(v.min_spend / 100000000);
                const discountCap = fmt((v.discount_cap || v.max_value) / 100000000);
                terms = `giảm ${discountPercentage}%, max ${discountCap}k từ ${minSpend}k`;
            } else if (v.discount_value) {
                const discountValue = fmt(v.discount_value / 100000000);
                const minSpend = fmt(v.min_spend / 100000000);
                terms = `giảm ${discountValue}k từ ${minSpend}k`;
            } else if (v.coin_percentage) {
                const discountPercentage = v.coin_percentage;
                const minSpend = fmt(v.min_spend / 100000000);
                const discountCap = fmt(v.coin_cap); // coin_cap might be raw units
                terms = `hoàn ${discountPercentage}%, max ${discountCap}k từ ${minSpend}k`;
            } else if (v.coin_value) {
                const discountValue = fmt(v.coin_value); // coin_value might be raw units
                const minSpend = fmt(v.min_spend / 100000000);
                terms = `hoàn ${discountValue}k từ ${minSpend}k`;
            } else if (v.fsv_voucher_card_ui_info && v.fsv_voucher_card_ui_info.int_min_spend_fsv_ui_only != null) {
                let composedDiscountValue = v.fsv_voucher_card_ui_info.composed_discount_value;
                let intMinSpend = v.fsv_voucher_card_ui_info.int_min_spend_fsv_ui_only;
                
                if (composedDiscountValue !== null && composedDiscountValue !== undefined) {
                    composedDiscountValue = fmt(Math.round(composedDiscountValue / 100000000));
                    intMinSpend = fmt(Math.round(intMinSpend / 100000000));
                    terms = `MPVC giảm tối đa ${composedDiscountValue}k từ ${intMinSpend}k`;
                } else {
                    intMinSpend = fmt(Math.round(intMinSpend / 100000000));
                    terms = `MPVC từ ${intMinSpend}k`;
                }
            }

            terms = terms.replace(/max\s*0k/gi, 'không giới hạn');

            // Background color
            const backgroundVoucherInfoColor = v.voucher_market_type == 1 
                ? (v.voucher_code?.includes('FSV-') ? '#00bfa5' : '#F05132') 
                : '#ffffff';

            const originalCode = v.voucher_code || '';
            const shortenedCode = shortenVoucherCode(originalCode);

            return {
                code: originalCode,
                displayCode: shortenedCode,
                promotionId: v.promotionid,
                signature: v.signature,
                terms: terms,
                iconHash: v.icon_hash,
                iconText: v.icon_text || '',
                percentageUsed: v.percentage_used || 0,
                percentageClaimed: v.percentage_claimed || 0,
                usageLimitPerUser: v.usage_limit_per_user || null,
                startTime: formatTime(v.start_time),
                endTime: formatTime(v.end_time),
                backgroundColor: backgroundVoucherInfoColor,
                // Include both original terms (formatted) and terms with dots removed (unformatted) for better search
                searchText: `${originalCode} ${terms} ${terms.replace(/\./g, '')} ${v.icon_text || ''}`.toLowerCase()
            };
        }

        // Hàm render vouchers (UPDATED)
        function renderVouchers(vouchers) {
            const content = document.getElementById('voucherWalletContent');
            
            if (!vouchers || vouchers.length === 0) {
                content.innerHTML = `
                    <div class="voucher-empty">
                        <div class="voucher-empty-icon">📭</div>
                        <h3>Không tìm thấy voucher</h3>
                        <p>Bạn chưa có voucher nào trong ví</p>
                    </div>
                `;
                return;
            }

            let html = '';
            
            vouchers.forEach(voucher => {
                const usedColor = voucher.percentageUsed > 80 ? 'stat-danger' : 
                                 voucher.percentageUsed > 50 ? 'stat-warning' : 'stat-success';
                
                const claimedColor = voucher.percentageClaimed > 80 ? 'stat-danger' : 
                                    voucher.percentageClaimed > 50 ? 'stat-warning' : 'stat-success';

                const iconUrl = voucher.iconHash 
                    ? `https://down-vn.img.susercontent.com/file/${voucher.iconHash}`
                    : '';

                const voucherUrl = `https://shopee.vn/search?promotionId=${voucher.promotionId}&signature=${voucher.signature}&voucherCode=${voucher.code}`;
                const voucherUrlEscaped = voucherUrl.replace(/'/g, "\\'");
                const voucherCodeEscaped = voucher.code.replace(/'/g, "\\'");

                html += `
                    <div class="voucher-card">
                        ${iconUrl ? `
                            <div class="voucher-icon-section" title="Mở link voucher">
                                <img 
                                    src="${iconUrl}" 
                                    class="voucher-icon" 
                                    alt="Voucher"
                                    style="background-color: ${voucher.backgroundColor}; cursor: pointer;"
                                    onclick="useVoucher('${voucherUrlEscaped}')"
                                >
                                ${voucher.iconText ? `<div class="voucher-icon-text">${voucher.iconText}</div>` : ''}
                            </div>
                        ` : ''}
                        
                        <div class="voucher-right-section">
                            <!-- Helper line: Code + Copy Link Icon -->
                            <div class="voucher-line-wrapper">
                                <div class="voucher-code" onclick="copyVoucherCodeOnly('${voucherCodeEscaped}')" title="Click để copy mã: ${voucher.code}">
                                    ${voucher.displayCode}
                                </div>
                                <span class="action-icon icon-copy-link" onclick="copyVoucherUrl('${voucherUrlEscaped}')" title="Copy Link Voucher">
                                    📋
                                </span>
                            </div>

                            <!-- Helper line: Terms + Use Icon -->
                            <div class="voucher-line-wrapper">
                                <div class="voucher-terms" title="${voucher.terms}">${voucher.terms}</div>
                            </div>
                            
                            <div class="voucher-stats">
                                <div class="voucher-stat-item">
                                    <span class="voucher-stat-icon">📊</span>
                                    <span>Đã dùng <span class="voucher-stat-value ${usedColor}">${voucher.percentageUsed}%</span></span>
                                </div>
                                <div class="voucher-stat-item" id="claimedstatus">
                                    <span class="voucher-stat-icon">🔖</span>
                                    <span>Đã lưu <span class="voucher-stat-value ${claimedColor}">${voucher.percentageClaimed}%</span></span>
                                </div>
                            </div>
                            
                            <div class="voucher-stat-item">
                                <span class="voucher-stat-icon">🔄</span>
                                <span>Lượt dùng tối đa: <span class="voucher-stat-value">${voucher.usageLimitPerUser}</span></span>
                            </div>
                            
                            <div class="voucher-time">
                                ⏰ ${voucher.startTime} - ${voucher.endTime}
                            </div>
                        </div>
                    </div>
                `;
            });

            content.innerHTML = html;
        }

        // Hàm filter vouchers theo search
        function filterVouchers(searchText) {
            if (!searchText) {
                renderVouchers(activeVouchers);
                return;
            }

            searchText = searchText.toLowerCase();
            
            // Logic search phức tạp
            let filtered = activeVouchers.filter(voucher => {
                const words = searchText.split(/\s+/);
                
                if (words.length === 1) {
                    const word = words[0];
                    
                    // 1. Số có 'm' -> chuyển thành 'k'
                    if (/^\d+m$/i.test(word)) {
                        const num = word.replace(/m$/i, '000k');
                        return voucher.searchText.includes(num);
                    }
                    
                    // 2. Số + '%' -> tìm discount_percentage
                    if (/^\d+%$/.test(word)) {
                        return voucher.searchText.includes(`giảm ${word.replace('%', '')}%`);
                    }
                    
                    // 3. 2 chữ số -> tìm discount_percentage
                    if (/^\d{1,2}$/.test(word)) {
                        return voucher.searchText.includes(`giảm ${word}%`);
                    }
                    
                    // 4. 3+ số hoặc kết thúc 'k' -> tìm trong terms
                    if (/^\d{3,}$/.test(word) || /\d+k$/i.test(word)) {
                        return voucher.searchText.includes(word.toLowerCase());
                    }
                    
                    // 5. Text khác -> tìm trong voucher_code
                    return voucher.code.toLowerCase().includes(word) || voucher.searchText.includes(word);
                } else {
                    // Nhiều từ -> tìm trong terms VÀ icon_text
                    return words.every(word => voucher.searchText.includes(word));
                }
            });

            renderVouchers(filtered);
        }

         // Setup tab switch
        const tabs = document.querySelectorAll('.voucher-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update UI active
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Load data
                const status = parseInt(tab.dataset.tab);
                currentStatus = status;
                loadVouchers(status);
            });
        });

        // Hàm copy chỉ mã voucher (khi click vào tên mã)
        window.copyVoucherCodeOnly = function(code) {
            navigator.clipboard.writeText(code).then(() => {
                showCopyToastVoucher(`✅ Đã copy mã: ${code}`);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showCopyToastVoucher(`✅ Đã copy mã: ${code}`);
            });
        };

        // Hàm copy URL đầy đủ (nút Copy)
        window.copyVoucherUrl = function(url) {
            navigator.clipboard.writeText(url).then(() => {
                showCopyToastVoucher(`✅ Đã copy link voucher`);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showCopyToastVoucher(`✅ Đã copy link voucher`);
            });
        };

        // Hàm use voucher
        window.useVoucher = function(url) {
            open(url, '_blank');
        };

        // Hàm hiển thị toast
        window.showCopyToastVoucher = function(message) {
            const toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 3000);
        }
        // Fetch vouchers từ API (Tab default 1)
        await loadVouchers(1);

        // Setup search
        const searchInput = document.getElementById('voucherSearchInput');
        searchInput.addEventListener('input', (e) => {
            filterVouchers(e.target.value.trim());
        });
    };
    
})();

