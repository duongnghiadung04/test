        (function() {
            // Kiểm tra xem có đang ở Shopee không
            if (location.hostname !== "shopee.vn") {
                alert("⚠️ Mở trang Shopee.vn để chạy script này!");
                return;
            }

            // Hàm lấy ID từ input (link hoặc text)
            function grabId(input) {
                const raw = input.trim();
                const m = raw.match(/(?:LIVE|VIDEO|FSV)[-_]?(\d+)/i);
                if (m) return m[1];
                try {
                    const u = new URL(raw);
                    return u.searchParams.get("promotionId") ||
                        u.searchParams.get("promotionid") ||
                        u.searchParams.get("promotion_id") ||
                        u.searchParams.get("promo") ||
                        raw;
                } catch {
                    return raw;
                }
            }

            // Hàm kiểm tra đăng nhập
            async function checkLogin() {
                try {
                    const res = await fetch("https://shopee.vn/api/v4/account/basic/get_account_info", {
                        credentials: "include"
                    });
                    if (!res.ok) return !1;
                    const json = await res.json();
                    return !!json?.data?.userid;
                } catch {
                    return !1;
                }
            }

            // Hàm lấy chữ ký (Signature)
            async function getSignatureByChatVoucher(promotionId) {
                const res = await fetch("https://shopee.vn/api/v4/chat/get_voucher", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json; charset=UTF-8",
                        "x-shopee-client-timezone": "Asia/Ho_Chi_Minh"
                    },
                    body: JSON.stringify({
                        shop_id: "0",
                        voucher_code: "0",
                        id: String(promotionId),
                        is_subaccount: !0
                    })
                });
                if (!res.ok) return null;
                const json = await res.json();
                return json?.data?.signature || null;
            }

            // Hàm lấy thông tin Livestream
            async function fetchLiveStreamSession(streamerId) {
                try {
                    const res = await fetch("https://shopee.vn/api/v4/chat/get_live_streaming_session", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "content-type": "application/json",
                            "x-shopee-client-timezone": "Asia/Ho_Chi_Minh"
                        },
                        body: JSON.stringify({
                            user_ids: [Number(streamerId)]
                        })
                    });
                    if (!res.ok) return null;
                    const json = await res.json();
                    const s = json?.data?.sessions?.[0];
                    return s ? {
                        shop_id: s.shop_id,
                        shop_name: s.shop_name,
                        session_id: s.session_id
                    } : null;
                } catch {
                    return null;
                }
            }

            let latestVoucherResults = [];

            function getCookie(name) {
                const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
                return match ? match[2] : "";
            }

            function normalizeMicrositePath(input) {
                const raw = (input || "").trim();
                if (!raw) return "";

                if (raw.includes("shopee.vn")) {
                    try {
                        const url = new URL(raw);
                        const normalizedPath = (url.pathname || "").replace(/^\/m(?:\/|$)/, "/");
                        return `${normalizedPath}${url.search || ""}`.replace(/^\/+/, "");
                    } catch {
                        return raw;
                    }
                }

                if (/^\/?m\//i.test(raw)) {
                    return raw.replace(/^\/?m\//i, "");
                }

                if (/^\//.test(raw)) {
                    return raw.replace(/^\/+/, "");
                }

                return raw;
            }

            async function resolveFinalUrl(input) {
                const raw = (input || "").trim();
                if (!/^https?:\/\//i.test(raw)) return raw;

                try {
                    const res = await fetch(raw, {
                        method: "GET",
                        credentials: "include",
                        redirect: "follow"
                    });
                    return res?.url || raw;
                } catch {
                    return raw;
                }
            }

            async function resolveMicrositePath(inputValue) {
                const fallback = (inputValue || "").trim() || location.href;
                const finalUrl = await resolveFinalUrl(fallback);
                return normalizeMicrositePath(finalUrl || fallback);
            }

            function encodeBase64Safe(value) {
                const text = String(value ?? "");
                try {
                    const bytes = new TextEncoder().encode(text);
                    let binary = "";
                    bytes.forEach(b => {
                        binary += String.fromCharCode(b);
                    });
                    return btoa(binary);
                } catch {
                    return btoa(text);
                }
            }

            function ensureResponsiveStyles() {
                if (document.getElementById("voucherResponsiveStyle")) return;
                const style = document.createElement("style");
                style.id = "voucherResponsiveStyle";
                style.textContent = `
                    @media (max-width: 768px) {
                        #voucherInfoPopup {
                            width: calc(100vw - 16px) !important;
                            max-height: 92vh !important;
                            padding: 12px !important;
                            border-radius: 14px !important;
                        }
                        #popupScrollArea {
                            max-height: calc(92vh - 24px) !important;
                            padding-right: 0 !important;
                        }
                        #voucherActionRow,
                        #voucherUtilityRow {
                            flex-wrap: wrap !important;
                        }
                        #voucherActionRow > button,
                        #voucherUtilityRow > button {
                            flex: 1 1 calc(50% - 5px) !important;
                            min-width: 120px;
                        }
                        #voucherFilterWrap {
                            justify-content: flex-start !important;
                        }
                        .voucher-row {
                            flex-direction: column !important;
                            gap: 10px !important;
                            padding: 12px !important;
                        }
                    }
                    @media (max-width: 460px) {
                        #voucherActionRow > button,
                        #voucherUtilityRow > button {
                            flex: 1 1 100% !important;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            async function copyText(text) {
                const value = String(text || "");
                if (!value.trim()) return false;
                try {
                    await navigator.clipboard.writeText(value);
                    return true;
                } catch {
                    const ta = document.createElement("textarea");
                    ta.value = value;
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    document.body.appendChild(ta);
                    ta.select();
                    const ok = document.execCommand("copy");
                    ta.remove();
                    return !!ok;
                }
            }

            function showCopyTooltip(targetEl, text, ok = true) {
                if (!targetEl) return;
                const rect = targetEl.getBoundingClientRect();
                const tip = document.createElement("div");
                tip.textContent = text;
                tip.style.cssText = `
                    position:fixed;
                    left:${Math.round(rect.left + rect.width / 2)}px;
                    top:${Math.round(rect.top - 10)}px;
                    transform:translate(-50%, -100%);
                    background:${ok ? "#111827" : "#b91c1c"};
                    color:#fff;
                    padding:4px 8px;
                    border-radius:8px;
                    font-size:11px;
                    font-weight:600;
                    z-index:1000001;
                    pointer-events:none;
                    box-shadow:0 8px 20px rgba(0,0,0,0.18);
                    opacity:0;
                    transition:opacity .12s ease;
                `;
                document.body.appendChild(tip);
                requestAnimationFrame(() => {
                    tip.style.opacity = "1";
                });
                setTimeout(() => {
                    tip.style.opacity = "0";
                    setTimeout(() => tip.remove(), 140);
                }, 850);
            }

            function extractPromotionSignaturePairs(lines) {
                const pairs = [];
                for (const line of lines) {
                    const raw = String(line || "").trim();
                    if (!raw) continue;

                    const directMatch = raw.match(/^(\d+)\s*[:|]\s*(.+)$/);
                    if (directMatch) {
                        const pId = directMatch[1]?.trim();
                        const sig = directMatch[2]?.trim();
                        if (pId && sig) {
                            pairs.push(`${pId}:${sig}`);
                            continue;
                        }
                    }

                    try {
                        const u = new URL(raw);
                        const pId = u.searchParams.get("promotionId") || u.searchParams.get("promotionid") || u.searchParams.get("promotion_id") || u.searchParams.get("promo");
                        const sig = u.searchParams.get("signature") || u.searchParams.get("sign") || u.searchParams.get("sig");
                        if (pId && sig) pairs.push(`${pId}:${sig}`);
                    } catch {}
                }
                return pairs;
            }

            function getLinksForCopy() {
                if (latestVoucherResults.length) {
                    return latestVoucherResults.map(item => {
                        const vb = item?.voucher_basic_info || {};
                        const pId = vb.promotionid;
                        const sig = vb.signature;
                        if (!pId || !sig) return "";
                        const rawVoucherCode = String(vb.voucher_code ?? "").trim();
                        const vCode = rawVoucherCode && !/^(null|undefined)$/i.test(rawVoucherCode) ? rawVoucherCode : `AUTO-${pId}`;
                        const evcode = encodeURIComponent(encodeBase64Safe(vCode));
                        return `https://shopee.vn/voucher/details?evcode=${evcode}&from_source=voucher-wallet&promotionId=${pId}&signature=${sig}`;
                    }).filter(Boolean);
                }

                const inputVal = document.getElementById("voucherLinkInput")?.value.trim() || "";
                if (inputVal) return inputVal.split("\n").map(x => x.trim()).filter(Boolean);

                return latestVoucherResults.map(item => {
                    const vb = item?.voucher_basic_info || {};
                    const pId = vb.promotionid;
                    const sig = vb.signature;
                    if (!pId || !sig) return "";
                    const rawVoucherCode = String(vb.voucher_code ?? "").trim();
                    const vCode = rawVoucherCode && !/^(null|undefined)$/i.test(rawVoucherCode) ? rawVoucherCode : `AUTO-${pId}`;
                    const evcode = encodeURIComponent(encodeBase64Safe(vCode));
                    return `https://shopee.vn/voucher/details?evcode=${evcode}&from_source=voucher-wallet&promotionId=${pId}&signature=${sig}`;
                }).filter(Boolean);
            }

            function getPairsForCopy() {
                if (latestVoucherResults.length) {
                    return latestVoucherResults.map(item => {
                        const vb = item?.voucher_basic_info || {};
                        return vb.promotionid && vb.signature ? `${vb.promotionid}:${vb.signature}` : "";
                    }).filter(Boolean);
                }

                const inputVal = document.getElementById("voucherLinkInput")?.value.trim() || "";
                if (inputVal) return extractPromotionSignaturePairs(inputVal.split("\n"));

                return latestVoucherResults.map(item => {
                    const vb = item?.voucher_basic_info || {};
                    return vb.promotionid && vb.signature ? `${vb.promotionid}:${vb.signature}` : "";
                }).filter(Boolean);
            }

            function bindCopyButtons() {
                const copyLinksBtn = document.getElementById("copyLinksBtn");
                const copyPairsBtn = document.getElementById("copyPairsBtn");

                if (copyLinksBtn && !copyLinksBtn.dataset.bound) {
                    copyLinksBtn.dataset.bound = "1";
                    copyLinksBtn.onclick = async e => {
                        const btn = e.currentTarget;
                        const ok = await copyText(getLinksForCopy().join("\n"));
                        const old = btn.innerText;
                        btn.innerText = ok ? "Đã copy" : "Copy lỗi";
                        setTimeout(() => btn.innerText = old, 1000);
                    };
                }

                if (copyPairsBtn && !copyPairsBtn.dataset.bound) {
                    copyPairsBtn.dataset.bound = "1";
                    copyPairsBtn.onclick = async e => {
                        const btn = e.currentTarget;
                        const ok = await copyText(getPairsForCopy().join("\n"));
                        const old = btn.innerText;
                        btn.innerText = ok ? "Đã copy" : "Copy lỗi";
                        setTimeout(() => btn.innerText = old, 1000);
                    };
                }
            }

            async function fetchMicrositeComponents(inputValue) {
                const path = await resolveMicrositePath(inputValue);

                const res = await fetch(`https://shopee.vn/api/v4/microsite/campaign_site_page?platform=pc&_mod=microsite&url=${encodeURIComponent(path)}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "accept": "application/json",
                        "x-api-source": "pc",
                        "x-requested-with": "XMLHttpRequest"
                    }
                });

                if (!res.ok) throw new Error(`Microsite HTTP ${res.status}`);
                const data = await res.json();
                
                // Lấy content.children và next_content.children
                const contentChildren = data?.data?.data?.content?.children || [];
                const nextContentChildren = data?.data?.data?.next_content?.children || [];
                const expireAt = data?.data?.data?.expire_at || null;
                
                return {
                    components: [...contentChildren, ...nextContentChildren],
                    expireAt: expireAt
                };
            }

            function formatTimestamp(ts) {
                if (!ts) return "N/A";
                const d = new Date(ts * 1000);
                return d.toLocaleString("vi-VN");
            }

            function inspectBannerComponents(components, expireAt) {
                const rows = [];
                let itemIndex = 0;
                
                // Thêm thông tin expire_at ở đầu
                if (expireAt) {
                    const expireTime = formatTimestamp(expireAt);
                    rows.push(`Banner sẽ thay đổi lúc: ${expireTime} (timestamp: ${expireAt})`);
                    rows.push("");
                }
                
                for (const c of components) {
                    const containerName = c?.meta?.name || "";
                    const children = c?.children || [];

                    for (const child of children) {
                        const type = child?.type || "Unknown";
                        const data = child?.data || {};
                        const details = [];
                        const typeLabelMap = {
                            3: "image banner",
                            21: "voucher claim",
                            33: "collection",
                            44: "image collection",
                            252: "game"
                        };
                        const typeLabel = typeLabelMap[type] || "component";

                        if (data?.filename) {
                            details.push(`filename=${data.filename}`);
                            details.push(`image_link=https://down-vn.img.susercontent.com/file/${data.filename}`);
                        }

                        if (Array.isArray(data?.image_slices) && data.image_slices.length) {
                            details.push(`image_slices=${data.image_slices.length}`);
                            data.image_slices.forEach((slice, idx) => {
                                if (slice?.filename) {
                                    details.push(`- slice ${idx + 1}: https://down-vn.img.susercontent.com/file/${slice.filename}`);
                                }
                            });
                        }

                        if (data?.collection_id) {
                            details.push(`collection_id=${data.collection_id}`);
                        }

                        if (data?.placeholder_collection_id) {
                            details.push(`placeholder_collection_id=${data.placeholder_collection_id}`);
                        }

                        if (data?.image_collection_id) {
                            details.push(`image_collection_id=${data.image_collection_id}`);
                        }

                        if (data?.game_link) {
                            details.push(`game_link=${data.game_link}`);
                        }

                        if (Array.isArray(data?.hotspots) && data.hotspots.length) {
                            details.push(`hotspots=${data.hotspots.length}`);
                            data.hotspots.forEach((hotspot, idx) => {
                                const url = hotspot?.link || hotspot?.data?.url || "";
                                if (url) details.push(`- hotspot ${idx + 1}: ${url}`);
                            });
                        }

                        itemIndex += 1;
                        rows.push(`[${itemIndex}] Type ${type} (${typeLabel})${containerName ? ` | ${containerName}` : ""}${details.length ? `\n  ${details.join("\n  ")}` : ""}`);
                    }
                }
                return rows;
            }

            function escapeHtml(text) {
                return String(text ?? "").replace(/[&<>"']/g, c => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                } [c]));
            }

            function linkifyLine(text) {
                const source = String(text ?? "");
                const parts = source.split(/(https?:\/\/[^\s]+)/g);
                return parts.map(part => {
                    if (/^https?:\/\//.test(part)) {
                        const href = part.replace(/"/g, "%22");
                        const isImageUrl = /(?:down-vn\.img\.susercontent\.com|cf\.shopee\.vn)\/file\//i.test(part);
                        if (isImageUrl) {
                            return `<a href="${href}" target="_blank" style="text-decoration:none;"><button style="background:#2563eb;color:#fff;border:none;padding:3px 8px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;">Mở ảnh</button></a>`;
                        }
                        return `<a href="${href}" target="_blank" style="color:#2563eb;text-decoration:underline;">${escapeHtml(part)}</a>`;
                    }
                    return escapeHtml(part);
                }).join("");
            }

            function isVoucherExpired(vb) {
                const nowSec = Math.floor(Date.now() / 1000);
                const endTs = Number(vb?.end_time || vb?.claim_end_time || 0);
                return endTs > 0 && endTs <= nowSec;
            }

            function updateVoucherStats(allResults) {
                const chipsWrap = document.getElementById("voucherStatsChips") || document.getElementById("voucherStatsBar");
                if (!chipsWrap) return;

                const total = allResults.length;
                const available = allResults.filter(item => {
                    const vb = item?.voucher_basic_info || {};
                    return !vb.fully_claimed && !vb.fully_used && !isVoucherExpired(vb);
                }).length;
                const exhausted = allResults.filter(item => {
                    const vb = item?.voucher_basic_info || {};
                    return !!vb.fully_claimed || !!vb.fully_used || isVoucherExpired(vb);
                }).length;

                const chip = (label, value, bg, color) => `<div style="padding:6px 10px;border-radius:999px;background:${bg};color:${color};font-size:12px;font-weight:700;">${label}: ${value}</div>`;
                chipsWrap.innerHTML = [
                    chip("Tổng số", total, "#f3f4f6", "#111827"),
                    chip("Còn lượt", available, "#ecfdf5", "#047857"),
                    chip("Hết lượt", exhausted, "#fef2f2", "#b91c1c")
                ].join("");
            }

            async function scanBannerPromotionInputs(inputValue) {
                const csrftoken = getCookie("csrftoken");
                const path = await resolveMicrositePath(inputValue);

                const res = await fetch("https://shopee.vn/api/v4/traffic/page_component/get_microsite_page", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        "x-api-source": "rn",
                        "x-csrftoken": csrftoken,
                        "x-shopee-client-timezone": "Asia/Ho_Chi_Minh",
                        "user-agent": navigator.userAgent
                    },
                    body: JSON.stringify({
                        platform: "mobile",
                        version: "2023.12.v2",
                        device_height: 828,
                        account: {},
                        url: path
                    })
                });
                const data = await res.json();

                const components = data?.data?.page?.data || data?.layout?.component_list || [];
                const lines = [];
                const micrositeId = data?.data?.page?.page_id || data?.layout?.page_id || 62026;
                const groupedRequests = [];
                let currentGroup = [];
                let collectionCount = 0;

                for (const c of components) {
                    try {
                        let id = null;

                        if (c.configurations) {
                            id = c.configurations?.data?.voucher_collection_id;
                        } else if (c.properties) {
                            const props = JSON.parse(c.properties);
                            id = props.find(p => p.key === "data")?.value?.voucher_collection_id;
                        }

                        if (id) {
                            collectionCount++;
                            
                            // Extract limit từ display_voucher_quantity
                            const limit = Number(c.configurations?.style?.display_voucher_quantity) || 50;
                            
                            // Extract number_of_vouchers_per_row từ style
                            const perRow = c.configurations?.style?.number_of_vouchers_per_row || 2;
                            
                            // component_id từ configurations.id
                            const compId = c.configurations?.id || c.component_id || c.instance_id || 0;
                            
                            const req = {
                                collection_id: id,
                                offset: 0,
                                limit: limit,
                                component_id: compId,
                                component_type: 1,
                                number_of_vouchers_per_row: Number(perRow) || 2,
                                microsite_id: micrositeId
                            };
                            
                            console.log(`📋 [Collection ${collectionCount}] ID: ${id} | CompID: ${compId} | Limit: ${limit} | PerRow: ${perRow}`);
                            currentGroup.push(req);
                        } else if (currentGroup.length) {
                            groupedRequests.push(currentGroup);
                            currentGroup = [];
                        }
                    } catch (e) {
                        console.error("Lỗi xử lý component:", e);
                    }
                }

                if (currentGroup.length) {
                    groupedRequests.push(currentGroup);
                }

                for (let groupIdx = 0; groupIdx < groupedRequests.length; groupIdx++) {
                    const requestGroup = groupedRequests[groupIdx];
                    try {
                        console.log(`📦 [Group ${groupIdx + 1}] Sending ${requestGroup.length} collections`, requestGroup);

                        const res2 = await fetch("https://shopee.vn/api/v1/microsite/get_vouchers_by_collections", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "content-type": "application/json",
                                "x-csrftoken": csrftoken,
                                "x-requested-with": "XMLHttpRequest"
                            },
                            body: JSON.stringify({
                                voucher_collection_request_list: requestGroup
                            })
                        });
                        const data2 = await res2.json();

                        console.log(`✅ Group ${groupIdx + 1} response:`, data2?.data);

                        for (const col of data2?.data || []) {
                            for (const v of col?.vouchers || []) {
                                const vId = v?.voucher?.voucher_identifier;
                                if (!vId?.promotion_id || !vId?.signature) continue;
                                const rawVoucherCode = String(vId?.voucher_code ?? "").trim();
                                const voucherCode = rawVoucherCode && !/^(null|undefined)$/i.test(rawVoucherCode) ? rawVoucherCode : `AUTO-${vId.promotion_id}`;
                                const evcode = encodeURIComponent(encodeBase64Safe(voucherCode));
                                lines.push(`https://shopee.vn/voucher/details?evcode=${evcode}&from_source=voucher-wallet&promotionId=${vId.promotion_id}&signature=${vId.signature}`);
                            }
                        }
                    } catch (apiErr) {
                        console.error(`❌ Lỗi group ${groupIdx + 1}:`, apiErr);
                    }
                }

                console.log(`🎉 Scanned ${collectionCount} collections in ${groupedRequests.length} groups, found ${lines.length} vouchers`);
                return lines;
            }

            // Hàm lưu Voucher
            async function saveVoucher(pId, sig, vCode, btn, msgEl, logArea) {
                btn.innerText = "...";
                btn.disabled = !0;
                try {
                    const res = await fetch("https://shopee.vn/api/v2/voucher_wallet/save_voucher", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "content-type": "application/json",
                            "x-api-source": "pc",
                            "x-csrftoken": document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ""
                        },
                        body: JSON.stringify({
                            voucher_promotionid: Number(pId),
                            signature: String(sig),
                            signature_source: "0"
                        })
                    });
                    const json = await res.json();
                    const codeDisplay = vCode || pId;
                    const isSuccess = json.error === 0 || json.error === 5;
                    const statusText = isSuccess ? `Thành công (${json.error})` : `Thất bại (${json.error})`;
                    const msg = (json.error === 0) ? "Đã lưu vào ví!" : (json.error_msg || json.msg || "Lỗi không xác định");

                    btn.innerText = statusText;
                    btn.style.background = isSuccess ? "#10b981" : "#ef4444";
                    msgEl.innerText = msg;
                    msgEl.style.color = isSuccess ? "#10b981" : "#ef4444";

                    if (logArea) {
                        const logItem = document.createElement("div");
                        logItem.style.cssText = "border-bottom:1px solid #f3f4f6;padding:4px 0;font-size:11px;";
                        logItem.innerHTML = `<span style="color:#6b7280">[${new Date().toLocaleTimeString()}]</span> <b style="color:#EE4D2D">${codeDisplay}</b>: <span style="color:${isSuccess ? "#10b981" : "#ef4444"}">${statusText} - ${msg}</span>`;
                        logArea.prepend(logItem);
                    }
                } catch (e) {
                    btn.innerText = "Lỗi kết nối";
                } finally {
                    setTimeout(() => {
                        btn.disabled = !1
                    }, 1000);
                }
            }

            // Hàm xử lý danh sách Voucher nhập vào
            async function fetchVouchersBatch(inputs) {
                const container = document.getElementById("voucherContent");
                const saveAllBtn = document.getElementById("saveAllBtn");
                const filterWrap = document.getElementById("voucherFilterWrap");
                saveAllBtn.style.display = "none";
                if (filterWrap) filterWrap.style.display = "none";
                container.innerHTML = "Đang tải...";
                const promotionInfo = [];
                const orderIds = [];

                const parsePair = text => {
                    const match = String(text || "").trim().match(/^(\d+)\s*[:|]\s*(.+)$/);
                    if (!match) return null;
                    const pId = match[1]?.trim();
                    const sig = match[2]?.trim();
                    if (!pId || !sig) return null;
                    return { pId, sig };
                };

                for (const line of inputs) {
                    const raw = line.trim();
                    if (!raw) continue;
                    let pId = "",
                        sig = "";

                    const directPair = parsePair(raw);
                    if (directPair) {
                        pId = directPair.pId;
                        sig = directPair.sig;
                    }

                    try {
                        if (!pId || !sig) {
                            const resolvedRaw = await resolveFinalUrl(raw);
                            const u = new URL(resolvedRaw);
                            pId = pId || u.searchParams.get("promotionId") || u.searchParams.get("promotionid") || u.searchParams.get("promotion_id") || u.searchParams.get("promo");
                            sig = sig || u.searchParams.get("signature") || u.searchParams.get("sign") || u.searchParams.get("sig");
                        }
                    } catch (e) {}

                    if (!pId) pId = grabId(raw);
                    if (!sig && /^\d+$/.test(pId)) sig = await getSignatureByChatVoucher(pId);

                    if (pId && sig) {
                        promotionInfo.push({
                            signature: String(sig),
                            signature_source: "0",
                            promotionid: Number(pId),
                            item_info: []
                        });
                        orderIds.push({
                            id: String(pId),
                            sig: sig
                        });
                    }
                }

                if (promotionInfo.length === 0) {
                    alert("❌ Không tìm thấy thông tin hợp lệ");
                    container.innerHTML = "";
                    return;
                }

                try {
                    const res = await fetch("https://shopee.vn/api/v2/voucher_wallet/batch_get_vouchers_by_promotion_ids", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            accept: "application/json",
                            "content-type": "application/json",
                            "x-api-source": "pc"
                        },
                        body: JSON.stringify({
                            promotion_info: promotionInfo,
                            need_user_voucher_status: !1
                        })
                    });
                    const json = await res.json();
                    const mappings = json?.data?.id_voucher_mappings || {};
                    const sortedResults = [];

                    for (const item of orderIds) {
                        if (mappings[item.id]) {
                            const vData = mappings[item.id];
                            vData.signature = item.sig;
                            const streamerId = vData.stream_rule?.streamer_ids?.[0];
                            if (streamerId) {
                                const liveInfo = await fetchLiveStreamSession(streamerId);
                                if (liveInfo) {
                                    vData.session_id = liveInfo.session_id;
                                    if (!vData.shop_id) vData.streamer_shop_id = liveInfo.shop_id;
                                }
                            }
                            sortedResults.push({
                                voucher_basic_info: vData
                            });
                        }
                    }

                    container.innerHTML = '<div id="saveLogArea" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:10px;margin-bottom:15px;max-height:120px;overflow-y:auto;display:none;font-family:monospace;"></div><div id="voucherStatsBar" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px;"><div id="voucherStatsChips" style="display:flex;gap:8px;flex-wrap:wrap;"></div><div id="voucherStatsActions" style="display:flex;gap:8px;flex-wrap:wrap;"><button id="copyLinksBtn" style="background:#334155;color:#fff;border:none;padding:6px 10px;border-radius:10px;cursor:pointer;font-weight:600;font-size:12px;">Copy Links</button><button id="copyPairsBtn" style="background:#475569;color:#fff;border:none;padding:6px 10px;border-radius:10px;cursor:pointer;font-weight:600;font-size:12px;">Copy ID:SIGN</button></div></div><div id="voucherItemsList"></div>';
                    latestVoucherResults = sortedResults;
                    applyVoucherFilter();
                    bindCopyButtons();

                    if (sortedResults.length > 0) {
                        saveAllBtn.style.display = "block";
                        if (filterWrap) filterWrap.style.display = "flex";
                    }

                } catch (err) {
                    console.error(err);
                    alert("❌ Lỗi: " + err.message);
                    container.innerHTML = "";
                }
            }

            // Hàm render Popup giao diện chính
            function renderPopup() {
                ensureResponsiveStyles();
                const popup = document.createElement("div");
                popup.id = "voucherInfoPopup";
                popup.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#ffffff;border-radius:18px;padding:18px;z-index:999999;width:min(680px,calc(100vw - 24px));box-shadow:0 20px 60px rgba(0,0,0,0.18);font-family:'Segoe UI',Roboto,system-ui,-apple-system,sans-serif;color:#111827;max-height:85vh;overflow:hidden;";
                popup.innerHTML = `
                    <div id="popupScrollArea" style="max-height:calc(85vh - 36px);overflow-y:auto;padding-right:2px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h2 style="font-size:18px;margin:0;color:#EE4D2D;font-weight:800;letter-spacing:.2px;">Banner Voucher</h2>
                        <button id="closePopupBtn" style="background:none;border:none;font-size:20px;cursor:pointer;color:#9ca3af;">✖</button>
                    </div>
                    <div style="margin-bottom:10px;">
                        <div style="position:relative;">
                            <textarea id="voucherLinkInput" placeholder="Dán link microsite/banner Shopee" rows="3" style="width:100%;padding:12px 14px;border: 2px solid #f3f4f6;border-radius: 12px;font-size:13.5px;line-height:1.5;box-sizing:border-box;outline:none;background:#fafafa;"></textarea>
                            <div style="position:absolute;right:10px;bottom:8px;font-size:11px;color:#9ca3af;">Enter mỗi dòng</div>
                        </div>
                        <div id="voucherActionRow" style="display:flex;gap:10px;margin-top:10px;">
                            <button id="loadVoucherBtn" hidden style="display:none;flex:1;background:#EE4D2D;color:#fff;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;letter-spacing:.2px;">Check</button>
                            <button id="scanBannerBtn" style="flex:1;background:#0ea5e9;color:#fff;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;letter-spacing:.2px;">Quét Banner</button>
                            <button id="viewBannerBtn" style="flex:1;background:#6366f1;color:#fff;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;letter-spacing:.2px;">Xem Banner</button>
                            <button id="saveAllBtn" style="flex:1;background:#f97316;color:#fff;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;letter-spacing:.2px;display:none;">Save All Voucher</button>
                        </div>
                        <div id="voucherFilterWrap" style="margin-top:8px;display:none;justify-content:flex-end;">
                            <div style="display:flex;gap:8px;">
                                <select id="voucherFilter" style="border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;font-size:12px;background:#fff;color:#111827;">
                                    <option value="all">Tất cả</option>
                                    <option value="available">Còn lượt</option>
                                    <option value="exhausted">Hết lượt</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="voucherContent" style="margin-top:6px;"></div>
                    </div>
                `;

                document.body.appendChild(popup);

                document.getElementById("closePopupBtn").onclick = () => popup.remove();
                document.getElementById("loadVoucherBtn").onclick = () => {
                    const val = popup.querySelector("#voucherLinkInput").value.trim();
                    if (val) fetchVouchersBatch(val.split("\n"));
                };
                document.getElementById("scanBannerBtn").onclick = async e => {
                    const btn = e.currentTarget;
                    const input = popup.querySelector("#voucherLinkInput").value.trim();
                    const container = document.getElementById("voucherContent");

                    btn.disabled = !0;
                    btn.innerText = "Đang quét...";
                    container.innerHTML = "⏳ Đang quét banner...";

                    try {
                        const lines = await scanBannerPromotionInputs(input);
                        if (!lines.length) {
                            container.innerHTML = "";
                            alert("❌ Không quét được voucher có promotionId/signature");
                            return;
                        }

                        await fetchVouchersBatch(lines);
                    } catch (err) {
                        console.error(err);
                        container.innerHTML = "";
                        alert("❌ Lỗi quét banner: " + (err?.message || "Unknown"));
                    } finally {
                        btn.disabled = !1;
                        btn.innerText = "Quét Banner";
                    }
                };
                document.getElementById("viewBannerBtn").onclick = async e => {
                    const btn = e.currentTarget;
                    const input = popup.querySelector("#voucherLinkInput").value.trim();
                    const container = document.getElementById("voucherContent");
                    const saveAllBtn = document.getElementById("saveAllBtn");
                    const filterWrap = document.getElementById("voucherFilterWrap");

                    if (saveAllBtn) saveAllBtn.style.display = "none";
                    if (filterWrap) filterWrap.style.display = "none";

                    btn.disabled = !0;
                    btn.innerText = "Đang đọc...";
                    container.innerHTML = "⏳ Đang phân tích banner...";

                    try {
                        const result = await fetchMicrositeComponents(input);
                        const rows = inspectBannerComponents(result.components, result.expireAt);
                        if (!rows.length) {
                            container.innerHTML = '<div style="font-size:13px;color:#6b7280;">Không có component banner.</div>';
                            return;
                        }
                        container.innerHTML = `<div style="border:1px solid #e5e7eb;border-radius:10px;padding:10px;background:#f9fafb;"><div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:8px;">Danh sách thành phần banner (${rows.length})</div><pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.5;color:#374151;max-height:380px;overflow:auto;">${rows.map(r => linkifyLine(r).replace(/\n/g, "<br>")).join("<br><br>")}</pre></div>`;
                    } catch (err) {
                        console.error(err);
                        container.innerHTML = "";
                        alert("❌ Lỗi xem banner: " + (err?.message || "Unknown"));
                    } finally {
                        btn.disabled = !1;
                        btn.innerText = "Xem Banner";
                    }
                };
                document.getElementById("saveAllBtn").onclick = () => {
                    const logArea = document.getElementById("saveLogArea");
                    if (logArea) logArea.style.display = "block";
                    const btns = document.querySelectorAll(".save-btn");
                    btns.forEach((b, idx) => setTimeout(() => b.click(), idx * 700));
                };
                document.getElementById("voucherFilter").onchange = () => applyVoucherFilter();
            }

            function applyVoucherFilter() {
                const filter = document.getElementById("voucherFilter")?.value || "all";
                if (!latestVoucherResults.length) return;

                updateVoucherStats(latestVoucherResults);

                let filtered = latestVoucherResults;
                if (filter === "available") {
                    filtered = latestVoucherResults.filter(item => {
                        const vb = item?.voucher_basic_info || {};
                        return !vb.fully_claimed && !vb.fully_used && !isVoucherExpired(vb);
                    });
                } else if (filter === "exhausted") {
                    filtered = latestVoucherResults.filter(item => {
                        const vb = item?.voucher_basic_info || {};
                        return !!vb.fully_claimed || !!vb.fully_used || isVoucherExpired(vb);
                    });
                }

                renderVoucherList(filtered);
            }

            // Các hàm format dữ liệu
            function formatTime(ts) {
                if (!ts) return "";
                const d = new Date(ts * 1e3);
                return d.toLocaleString("vi-VN");
            }

            function formatCurrency(raw) {
                const amount = Math.floor(raw / 1e5);
                if (amount === 0) return "₫0đ";
                if (amount < 1e3) return `₫${amount}đ`;
                if (amount < 1e6) {
                    if (amount % 1e3 === 0) return `₫${amount/1e3}k`;
                    const thousands = Math.floor(amount / 1e3);
                    const remainder = amount % 1e3;
                    return `₫${thousands}k${remainder}`;
                }
                const millions = Math.floor(amount / 1e6);
                const remainder = amount % 1e6;
                if (remainder === 0) return `₫${millions}tr`;
                if (remainder % 1e3 === 0) return `₫${millions}tr${remainder/1e3}k`;
                return `₫${millions}tr${Math.floor(remainder/1e3)}k`;
            }

            function displayVoucherInfo(vb) {
                try {
                    if (vb.fsv_voucher_card_ui_info) {
                        const ui = vb.fsv_voucher_card_ui_info;
                        const composed = ui.composed_discount_value || 0;
                        const minSpend = ui.int_min_spend_fsv_ui_only || 0;
                        return `Freeship ${formatCurrency(composed)} đơn từ ${formatCurrency(minSpend)}`;
                    }
                    const pct = vb.discount_percentage || vb.reward_percentage || 0;
                    const val = vb.discount_value || vb.reward_value || 0;
                    const cap = vb.discount_cap || vb.reward_cap || 0;
                    const min = vb.min_spend || 0;
                    const valFmt = formatCurrency(val);
                    const minFmt = formatCurrency(min);
                    const capFmt = cap > 0 ? formatCurrency(cap) : null;

                    if (pct > 0) {
                        if (capFmt) return `Giảm ${pct}% tối đa ${capFmt} đơn từ ${minFmt}`;
                        return `Giảm ${pct}% đơn từ ${minFmt}`;
                    }
                    if (val > 0) return `Giảm ${valFmt} đơn từ ${minFmt}`;
                    return vb.display_name || "Voucher Shopee";
                } catch {
                    return "Voucher Shopee";
                }
            }

            // Hàm render danh sách kết quả Voucher
            async function renderVoucherList(results) {
                const container = document.getElementById("voucherItemsList");
                if (!container) return;
                container.innerHTML = "";
                for (const item of results) {
                    const vb = item.voucher_basic_info;
                    const row = document.createElement("div");
                    row.className = "voucher-row";
                    row.style.cssText = "border:1px solid #eee;background:#fff;border-radius:12px;margin-bottom:12px;line-height:1.55;padding:14px 16px;box-shadow:0 4px 16px rgba(0,0,0,0.06);display:flex;gap:14px;align-items:flex-start;";

                    let avatarHTML = "";
                    const iconText = (vb.icon_text || "").trim();
                    const labelText = (vb.customised_labels?.[0]?.content || "").trim();
                    const applyTextRaw = (iconText + " " + labelText).toLowerCase();
                    const isShopee = applyTextRaw.includes("shopee");
                    const isShopeePay = applyTextRaw.includes("shopeepay");
                    const shippingText = `${iconText} ${labelText} ${vb.sub_icon_text || ""}`.toLowerCase();
                    const isShippingVoucher = shippingText.includes("mã vận chuyển");

                    if (vb.icon_hash) {
                        avatarHTML = `<div style="width:60px;height:60px;border-radius:12px;overflow:hidden;flex-shrink:0;${isShippingVoucher?"background:#26AA99;":((isShopee && !isShopeePay)?"background:#EE4D2D;":"")}"><img src="https://down-vn.img.susercontent.com/file/${vb.icon_hash}" onerror="this.onerror=null;this.src='https://cf.shopee.vn/file/${vb.icon_hash}'" style="width:100%;height:100%;object-fit:cover;"></div>`;
                    } else if (isShopee) {
                        avatarHTML = `<div style="width:60px;height:60px;border-radius:12px;overflow:hidden;flex-shrink:0;display:flex;justify-content:center;align-items:center;font-weight:700;font-size:13px;${isShopeePay?"background:#f3f4f6;color:#6b7280;":"background:#EE4D2D;color:#fff;"}">${isShopeePay?"ShopeePay":"Shopee"}</div>`;
                    } else if (isShippingVoucher) {
                        avatarHTML = '<div style="width:60px;height:60px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#26AA99;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:700;font-size:11px;text-align:center;line-height:1.2;">Vận chuyển</div>';
                    }

                    const iconT = vb.icon_text || "";
                    const labelT = vb.customised_labels?.[0]?.content || "";
                    const applyParts = [];
                    if (iconT) applyParts.push(iconT);
                    if (labelT) applyParts.push(labelT);

                    const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;"
                    } [c]));
                    const applyText = esc(applyParts.join(" - "));
                    let applyHtml = applyText;
                    const targetShopId = vb.shop_id || vb.streamer_shop_id;
                    if (targetShopId) {
                        const shopLink = `https://shopee.vn/shop/${targetShopId}`;
                        applyHtml = `<a href="${shopLink}" target="_blank" style="color:#1a73e8;text-decoration:none;font-weight:600;">${applyText}</a>`;
                    }

                    let title = displayVoucherInfo(vb);
                    const voucherTitle = String(vb.title || "").trim();
                    if (voucherTitle && !title.includes(voucherTitle)) {
                        title = `${title} (${voucherTitle})`;
                    }
                    const expired = isVoucherExpired(vb);
                    const rowId = vb.promotionid;
                    const rowSig = vb.signature;
                    const rawVoucherCode = String(vb.voucher_code ?? "").trim();
                    const vCode = rawVoucherCode && !/^(null|undefined)$/i.test(rawVoucherCode) ? rawVoucherCode : "";
                    const detailCode = vCode || `AUTO-${rowId}`;
                    const detailEvcode = encodeURIComponent(encodeBase64Safe(detailCode));
                    const detail = `https://shopee.vn/voucher/details?evcode=${detailEvcode}&from_source=voucher-wallet&promotionId=${rowId}&signature=${rowSig||""}`;
                    title = `<a href="${detail}" target="_blank" style="color:#EE4D2D;text-decoration:none;font-weight:700;">${title}</a>`;

                    const used = vb.percentage_used ?? 0;
                    const claimed = vb.percentage_claimed ?? 0;
                    const warns = [];
                    if (vb.fully_used) warns.push("Tối đa lượt dùng");
                    if (vb.fully_claimed) warns.push("Tối đa lượt lưu");

                    const claimStart = formatTime(vb.claim_start_time);
                    const claimEnd = formatTime(vb.claim_end_time);
                    const startTime = formatTime(vb.start_time);
                    const endTime = formatTime(vb.end_time);
                    const usageLimit = vb.usage_limit_per_user ?? 0;

                    const listLink = `https://shopee.vn/search?promotionId=${rowId}&signature=${rowSig||""}`;

                    let streamBtn = "";
                    if (vb.session_id) {
                        const streamLink = `https://live.shopee.vn/share?from=live&session=${vb.session_id}`;
                        streamBtn = `<a href="${streamLink}" target="_blank" style="text-decoration:none;margin-left:8px;"><button style="background:#14b8a6;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600;">Xem live</button></a>`;
                    }

                    row.innerHTML = `
                        ${avatarHTML}
                        <div style="display:flex;flex-direction:column;gap:6px;flex:1;">
                            <div style="font-size:15px;">${title}</div>
                            ${vCode ?`<div style="font-size:13px;color:#555;display:flex;align-items:center;gap:6px;">- Mã: <span style="font-weight:600;color:#111">${vCode}</span><button class="copy-code-icon" title="Copy mã" style="background:transparent;border:none;cursor:pointer;font-size:12px;line-height:1;padding:0;color:#9ca3af;">⎘</button></div>`:""}
                            ${applyText ?`<div style="font-size:13px;color:#444;">- Áp dụng: <span style="font-weight:600;color:#111827;">${applyHtml}</span></div>`:""}
                            ${claimStart || claimEnd ?`<div style="font-size:12px;color:#666;">- Claim: ${claimStart||"--"} | ${claimEnd||"--"}</div>`:""}
                            ${startTime || endTime ?`<div style="font-size:12px;color:${expired ? "#dc2626" : "#666"};">- HSD: ${startTime||"--"} | ${endTime||"--"}${expired ? " <span style=\"font-weight:700;color:#dc2626;\">(Hết hạn)</span>" : ""}</div>`:""}
                            <div style="font-size:12px;color:#555;">Đã dùng: ${used}% | Đã lưu: ${claimed}%</div>
                            ${usageLimit ?`<div style="font-size:12px;color:#555;">Lượt dùng / user: ${usageLimit}</div>`:""}
                            ${warns.length ?`<div style="font-size:12px;color:#d93025;">${warns.join(" • ")}</div>`:""}
                            <div style="margin-top:4px;display:flex;flex-direction:column;gap:4px;">
                                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
                                    <button class="save-btn" style="background:#EE4D2D;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600;">Save Voucher</button>
                                    <a href="${listLink}" target="_blank" style="text-decoration:none;"><button style="background:#2563eb;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:600;">List</button></a>
                                    ${streamBtn}
                                </div>
                                <div class="save-msg" style="font-size:11px;font-weight:500;min-height:14px;"></div>
                            </div>
                        </div>
                    `;

                    const sBtn = row.querySelector(".save-btn");
                    const copyCodeIconBtn = row.querySelector(".copy-code-icon");
                    const sMsg = row.querySelector(".save-msg");
                    const logArea = document.getElementById("saveLogArea");

                    sBtn.onclick = () => saveVoucher(rowId, rowSig, vCode, sBtn, sMsg, logArea);
                    if (copyCodeIconBtn) {
                        copyCodeIconBtn.onclick = async () => {
                            const codeToCopy = vCode || `AUTO-${rowId}`;
                            const ok = await copyText(codeToCopy);
                            showCopyTooltip(copyCodeIconBtn, ok ? "Đã copy" : "Copy lỗi", ok);
                        };
                    }
                    container.appendChild(row);
                }
            }

            // Bắt đầu chạy logic chính
            checkLogin().then(ok => {
                if (ok) renderPopup();
            });

        })();
