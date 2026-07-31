(function () {
  "use strict";

  if (!location.hostname.includes("shopee.vn")) {
    return;
  }
// Cập nhật 26.12.2025
  // ===== Tự động load banner và lưu mã khi tới giờ ====
  window.executeLoadBannerThenSaveVoucher = () => {
    if (typeof window.clearPiPLogs === "function") {
      window.clearPiPLogs("Load Banner & Save");
    }
    let bannerPipObserver = null;
    let observedBannerLogEl = null;

    const syncBannerLogToPiP = () => {
      const logContainer = document.getElementById("banner-save-log");
      if (!logContainer || typeof window.setPiPLogs !== "function") return;
      const lines = logContainer.innerText.replace(/\r/g, "").split("\n");
      window.pipDisableMask = true;
      window.setPiPLogs(lines);
    };

    const observeBannerLogChanges = () => {
      const logContainer = document.getElementById("banner-save-log");
      if (!logContainer) {
        setTimeout(observeBannerLogChanges, 120);
        return;
      }
      if (observedBannerLogEl === logContainer && bannerPipObserver) return;

      if (bannerPipObserver) {
        bannerPipObserver.disconnect();
      }
      observedBannerLogEl = logContainer;
      bannerPipObserver = new MutationObserver(() => {
        syncBannerLogToPiP();
      });
      bannerPipObserver.observe(logContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      syncBannerLogToPiP();
    };

    const mainModal = document.getElementById("voucherToolModal");
    let isRunning = false;
    let isWaiting = false;
    let monitorInterval = null;
    let countdownInterval = null;
    let saveLoopActive = false;
    let isCheckingCaptcha = false;
    let initialCollectionIds = [];
    let initialVouchers = [];

    function getCsrfToken() {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const parts = cookie.trim().split("=");
        if (parts[0] === "csrftoken") return parts[1];
      }
      return "";
    }
    function sleepANM(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function formatTimeHM() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    function formatUnixToDateTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${hours}:${minutes}:${seconds} | ${day}/${month}`;
    }
    function getTimeRemainingSeconds(expireTimestamp) {
      const now = Math.floor(Date.now() / 1000);
      return expireTimestamp - now;
    }
    async function savebyANMvoucherCode(voucherCodeInput, iteration) {
      let sout = "";
      let successfulVoucherCode = [];
      const send = {
        vouchercode: voucherCodeInput,
        needuservoucherstatus: true,
      };
      try {
        const response = await fetch(
          "https://shopee.vn/api/v2/voucher_wallet/save_voucher",
          {
            method: "POST",
            headers: {
              authority: "shopee.vn",
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "x-csrftoken": getCsrfToken(),
            },
            body: JSON.stringify(send),
            credentials: "include",
          },
        );
        const resp = await response.json();
        if (resp.error === 0 || resp.error === 5) {
          const voucher_code =
            resp.data?.voucher?.voucher_code || voucherCodeInput;
          sout = `✓ ${voucher_code}`;
          successfulVoucherCode.push(voucher_code);
        } else if (resp.error === 19) {
          sout = "Lỗi: Kiểm tra lại login tài khoản";
        } else {
          const error_msg = resp.error_msg;
          sout = `✗ ${voucherCodeInput} - ${error_msg}`;
          if (resp.data && resp.data.invalidmessagecode) {
            const invalidmessagecode = resp.data.invalidmessagecode;
            if ([1, 2, 3].includes(invalidmessagecode)) {
              successfulVoucherCode.push(voucherCodeInput);
            }
          }
        }
        let sleeptime = 200;
        if (iteration >= 20 && iteration < 40) sleeptime = 400;
        else if (iteration >= 40 && iteration < 60) sleeptime = 640;
        else if (iteration >= 60) sleeptime = 900;
        await sleepANM(sleeptime);
        return { sout, successfulVoucherCode };
      } catch (error) {
        return { sout: `Lỗi: ${error.message}`, successfulVoucherCode };
      }
    }
    async function savebyANM3(urls) {
      let sout = "";
      const set_array = JSON.parse(urls);
      // Đảm bảo promotion_id là số để dễ so sánh
      const details = new Map(
        set_array.map((item) => [
          Number(item.promotion_id),
          {
            voucher_code: item.voucher_code,
            promotion_id: Number(item.promotion_id),
            signature: item.signature,
          },
        ]),
      );
      let successfulItems = [];
      try {
        const response = await fetch(
          "https://shopee.vn/api/v2/voucher_wallet/save_vouchers",
          {
            method: "POST",
            headers: {
              authority: "shopee.vn",
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "x-csrftoken": getCsrfToken(),
            },
            body:
              '{"voucher_identifiers":' +
              urls +
              ',"need_user_voucher_status":true}',
            credentials: "include",
          },
        );
        const resp = await response.json();
        if (resp.error === 0) {
          for (const data of resp.responses) {
            if ([0, 5].includes(data.error)) {
              if (data.data && data.data.voucher) {
                const voucher = data.data.voucher;
                const voucher_code = voucher.voucher_code;
                const signature = voucher.signature;
                const promotion_id = Number(voucher.promotionid);
                const setdetails = details.get(promotion_id);

                // Build show_url và terms cho cả error 0 và error 5
                if (signature && setdetails) {
                  const show_url = `https://shopee.vn/search?voucherCode=${voucher_code}&promotionId=${promotion_id}&signature=${signature}`;
                  let terms = "";

                  // Kiểm tra discount info (có thể null với error 5)
                  if (voucher.discount_percentage && voucher.min_spend) {
                    terms = ` giảm ${voucher.discount_percentage}%, max ${(voucher.discount_cap || voucher.max_value) / 100000000}k từ ${voucher.min_spend / 100000000}k`;
                  } else if (voucher.discount_value && voucher.min_spend) {
                    terms = ` giảm ${voucher.discount_value / 100000000}k từ ${voucher.min_spend / 100000000}k`;
                  }

                  setdetails.show_url = show_url;
                  setdetails.terms = terms;
                }

                successfulItems.push(promotion_id);
              }
            } else {
              if (data.data && data.data.voucher) {
                const voucher_code = data.data.voucher.voucher_code;
                const promotion_id = Number(data.data.voucher.promotionid);
                const setdetails = details.get(promotion_id);
                sout += `✗ ${setdetails.voucher_code} - ${data.error_msg}\n`;
                if (
                  data.data.invalidmessagecode &&
                  [1, 2, 3, 10].includes(data.data.invalidmessagecode)
                ) {
                  successfulItems.push(promotion_id);
                }
              }
            }
          }
        } else if (resp.error === 19) {
          sout = "Lỗi: Kiểm tra lại login tài khoản";
        } else {
          sout = "Lỗi: Spam voucher, hãy thử lại sau";
          await sleepANM(220);
        }
        return { sout, successfulItems, details, resp };
      } catch (error) {
        return {
          sout: `Lỗi: ${error.message}`,
          successfulItems,
          details,
          resp: null,
        };
      }
    }
    async function checkBannerExists(pageApi) {
      const url = `https://shopee.vn/api/v4/pagebuilder/get_csr_page?page_url=${pageApi}&platform=4&timestamp=0`;
      //const url = `https://5anm.net/testapi?v=` + Date.now();
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            "accept-language": "vi",
            "user-agent": navigator.userAgent,
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.error === 0 && data.data) {
          return { exists: true, data: data, error: data.error };
        }
        return {
          exists: false,
          data: data,
          error: data?.error,
          errorMsg: data?.error_msg,
        };
      } catch (error) {
        return { exists: false, data: null, error: null, errorMsg: error.message };
      }
    }
    function parseCollectionsFromResponse(data) {
      let voucherCollections = [];
      if (data.layout && data.layout.component_list) {
        for (const component of data.layout.component_list) {
          const component_id = component.id;
          const properties = component.properties;
          try {
            const propertiesDecoded = JSON.parse(properties);
            if (Array.isArray(propertiesDecoded)) {
              for (const property of propertiesDecoded) {
                if (
                  property.key === "data" &&
                  property.value?.voucher_collection_id
                ) {
                  voucherCollections.push({
                    collection_id: property.value.voucher_collection_id,
                    component_id: component_id,
                  });
                }
              }
            }
          } catch {}
        }
      }
      return voucherCollections;
    }
    async function getVoucherDetails(voucherCollections) {
      const requestList = voucherCollections.map((item) => ({
        collection_id: item.collection_id.toString(),
        component_type: 1,
        component_id: item.component_id,
        limit: 50,
        microsite_id: 66938,
        offset: 0,
        number_of_vouchers_per_row: 1,
      }));
      try {
        const response = await fetch(
          "https://shopee.vn/api/v1/microsite/get_vouchers_by_collections",
          {
            headers: {
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9,vi;q=0.8",
              "content-type": "application/json",
              "x-csrftoken": getCsrfToken(),
            },
            body: JSON.stringify({
              voucher_collection_request_list: requestList,
            }),
            method: "POST",
            credentials: "include",
          },
        );
        const result = await response.json();
        let vouchers = [];
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((collection) => {
            if (collection.vouchers && Array.isArray(collection.vouchers)) {
              collection.vouchers.forEach((voucherItem) => {
                const voucher = voucherItem.voucher;
                const identifier = voucher.voucher_identifier;
                vouchers.push({
                  voucher_code: identifier.voucher_code,
                  promotion_id: Number(identifier.promotion_id),
                  signature: identifier.signature,
                });
              });
            }
          });
        }
        return vouchers;
      } catch {
        return [];
      }
    }
    async function getVoucherDetailsForCaptchaCheck(voucherCollection) {
      const requestList = [
        {
          collection_id: voucherCollection.collection_id.toString(),
          component_type: 1,
          component_id: voucherCollection.component_id,
          limit: 50,
          microsite_id: 66938,
          offset: 0,
          number_of_vouchers_per_row: 1,
        },
      ];
      try {
        const response = await fetch(
          "https://shopee.vn/api/v1/microsite/get_vouchers_by_collections",
          {
            headers: {
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9,vi;q=0.8",
              "content-type": "application/json",
              "x-csrftoken": getCsrfToken(),
            },
            body: JSON.stringify({
              voucher_collection_request_list: requestList,
            }),
            method: "POST",
            credentials: "include",
          },
        );
        const result = await response.json();
        let vouchers = [];
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((collection) => {
            if (collection.vouchers && Array.isArray(collection.vouchers)) {
              collection.vouchers.forEach((voucherItem) => {
                const voucher = voucherItem.voucher;
                const identifier = voucher.voucher_identifier;
                vouchers.push({
                  voucher_code: identifier.voucher_code,
                  promotion_id: Number(identifier.promotion_id),
                  signature: identifier.signature,
                });
              });
            }
          });
        }
        return { error: result.error, vouchers };
      } catch (error) {
        return { error: null, vouchers: [], errorMsg: error.message };
      }
    }
    async function saveVouchersForCaptchaCheck(vouchers) {
      if (!Array.isArray(vouchers) || vouchers.length === 0) {
        return { error: 0 };
      }
      const urlsString = vouchers
        .map((v) =>
          JSON.stringify({
            signature: v.signature,
            signature_source: 0,
            promotion_id: v.promotion_id,
            voucher_code: v.voucher_code,
          }),
        )
        .join(",");
      const result = await savebyANM3(`[${urlsString}]`);
      return { error: result.resp?.error ?? null };
    }
    async function spamSaveAllVouchers(vouchers) {
      const logContainer = document.getElementById("banner-save-log");
      const batchSize = 20;
      let remainingVouchers = [...vouchers];
      let maxAttempts = 10,
        attemptCount = 0;
      const voucherStatusMap = new Map(
        vouchers.map((v) => [
          v.promotion_id,
          {
            voucher_code: v.voucher_code,
            status: "pending",
            message: "Chờ lưu...",
            element: null,
            attemptCount: 0,
          },
        ]),
      );
      voucherStatusMap.forEach((info, promotion_id) => {
        const voucherElement = document.createElement("div");
        voucherElement.className = "voucher-item";
        voucherElement.innerHTML = `
                            <div class="voucher-header">
                                <span class="voucher-status pending">⏳</span>
                                <span class="voucher-code">${info.voucher_code}</span>
                            </div>
                            <div class="voucher-details">
                                <span class="voucher-message-inline">${formatTimeHM()} - Chờ lưu...</span>
                            </div>`;
        logContainer.appendChild(voucherElement);
        info.element = voucherElement;
      });
      logContainer.scrollTop = logContainer.scrollHeight;
      saveLoopActive = true;
      while (
        remainingVouchers.length > 0 &&
        attemptCount < maxAttempts &&
        saveLoopActive
      ) {
        attemptCount++;
        const batch = remainingVouchers.slice(0, batchSize);
        const urlsString = batch
          .map((v) =>
            JSON.stringify({
              signature: v.signature,
              signature_source: 0,
              promotion_id: v.promotion_id,
              voucher_code: v.voucher_code,
            }),
          )
          .join(",");
        try {
          const result = await savebyANM3(`[${urlsString}]`);
          const successfulPromotionIds = new Set(result.successfulItems);

          // Cập nhật status cho từng voucher
          batch.forEach((v) => {
            const info = voucherStatusMap.get(v.promotion_id);
            if (info && info.element) {
              const isSuccessful = successfulPromotionIds.has(v.promotion_id);
              info.attemptCount++;

              if (isSuccessful) {
                info.status = "success";
                const detailInfo = result.details.get(v.promotion_id);
                const show_url = detailInfo?.show_url || "";
                const terms = detailInfo?.terms || "";

                // Cập nhật UI
                const statusSpan =
                  info.element.querySelector(".voucher-status");
                statusSpan.textContent = "✓";
                statusSpan.className = "voucher-status success";

                const messageSpan = info.element.querySelector(
                  ".voucher-message-inline",
                );
                messageSpan.innerHTML = `${formatTimeHM()}: Lưu thành công <a href='${show_url}' target='_blank'>${v.voucher_code}</a> ${terms}.`;
                messageSpan.className = "voucher-message-inline success";

                // Thêm class success cho toàn bộ item
                info.element.classList.add("success");
              } else {
                // Parse error message từ result
                const resultLines = result.sout.split("\n");
                const relevantLine = resultLines.find((line) =>
                  line.includes(v.voucher_code),
                );
                const errorMsg = relevantLine
                  ? relevantLine.split(" - ")[1] || "Lỗi"
                  : "Lỗi";

                // Thêm counter
                let displayMessage = `${errorMsg} (thử lần ${info.attemptCount})`;
                info.message = displayMessage;
                info.status = "error";

                // Cập nhật UI
                const statusSpan =
                  info.element.querySelector(".voucher-status");
                statusSpan.textContent = "✗";
                statusSpan.className = "voucher-status error";

                const messageSpan = info.element.querySelector(
                  ".voucher-message-inline",
                );
                messageSpan.textContent = `${formatTimeHM()}: ${displayMessage}`;
                messageSpan.className = "voucher-message-inline error";

                // Thêm class error cho toàn bộ item
                info.element.classList.add("error");
              }
            }
          });

          // Loại bỏ vouchers đã lưu thành công khỏi remaining
          remainingVouchers = remainingVouchers.filter(
            (v) => !result.successfulItems.includes(v.promotion_id),
          );

          logContainer.scrollTop = logContainer.scrollHeight;
        } catch (error) {
          console.error("❌ ERROR in batch processing:", error);
          console.error("Error stack:", error.stack);
        }
        if (saveLoopActive) {
          await sleepANM(300);
        }
      }
      saveLoopActive = false;
      return remainingVouchers.length === 0;
    }
    function resetButton() {
      const btn = document.getElementById("banner-start-btn");
      isRunning = false;
      isWaiting = false;
      btn.textContent = "▶️ Bắt đầu";
      btn.classList.remove("stop");
    }
    function startCountdown(targetTimestamp, callback) {
      const btn = document.getElementById("banner-start-btn");
      let hasStarted = false;
      function updateCountdown() {
        if (hasStarted) return;
        if (!targetTimestamp) {
          hasStarted = true;
          clearInterval(countdownInterval);
          callback();
          return;
        }

        const secondsLeft = targetTimestamp - Math.floor(Date.now() / 1000);
        if (secondsLeft <= 0) {
          hasStarted = true;
          clearInterval(countdownInterval);
          callback();
          return;
        }

        const minutesLeft = Math.floor(secondsLeft / 60);
        const secondsOnly = secondsLeft % 60;
        btn.textContent = `⏰ Tự chạy sau ${String(minutesLeft).padStart(2, "0")}:${String(secondsOnly).padStart(2, "0")}`;
      }
      updateCountdown();
      if (!hasStarted) {
        countdownInterval = setInterval(updateCountdown, 1000);
      }
    }
    async function startMonitoring(pageApi) {
      const btn = document.getElementById("banner-start-btn");
      const logContainer = document.getElementById("banner-save-log");
      if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
      }
      isRunning = true;
      btn.textContent = "⏸️ Dừng";
      btn.classList.add("stop");
      let scanCount = 0,
        isProcessing = false;
      monitorInterval = setInterval(async () => {
        if (isProcessing) return;
        if (!isRunning || scanCount >= 40) {
          clearInterval(monitorInterval);
          monitorInterval = null;
          if (scanCount >= 40) {
            const warningBlock = document.createElement("div");
            warningBlock.className = "log-result-block log-result-warning";
            warningBlock_detail = `<div class="log-result-content"><div>⚠️ Đã đạt giới hạn 40 lần quét</div></div>`;
            warningBlock.innerHTML = warningBlock_detail;
            updatePiPLog(warningBlock_detail);
            logContainer.appendChild(warningBlock);
            logContainer.scrollTop = logContainer.scrollHeight;
          }
          resetButton();
          return;
        }
        scanCount++;
        const result = await checkBannerExists(pageApi);
        if (!result.exists) {
          const errorBlock = document.createElement("div");
          errorBlock.className = "log-result-block log-result-error";
          errorBlock_detail = `<div class="log-result-content"><div>❌ Banner không còn tồn tại</div></div>`;
          errorBlock.innerHTML = errorBlock_detail;
          updatePiPLog(errorBlock_detail);
          logContainer.appendChild(errorBlock);
          clearInterval(monitorInterval);
          monitorInterval = null;
          resetButton();
          return;
        }
        const currentCollections = parseCollectionsFromResponse(result.data);
        const currentCollectionIds = currentCollections.map(
          (c) => c.collection_id,
        );
        const newCollectionIds = currentCollectionIds.filter(
          (id) => !initialCollectionIds.includes(id),
        );
        if (newCollectionIds.length > 0) {
          isProcessing = true;
          clearInterval(monitorInterval);
          monitorInterval = null;
          isRunning = false;
          const newCollections = currentCollections.filter((c) =>
            newCollectionIds.includes(c.collection_id),
          );
          const newVouchers = await getVoucherDetails(newCollections);
          const uniqueVouchers = newVouchers.filter(
            (v, i, self) =>
              i === self.findIndex((t) => t.promotion_id === v.promotion_id),
          );
          if (uniqueVouchers.length > 0) {
            logContainer.scrollTop = logContainer.scrollHeight;
            await spamSaveAllVouchers(uniqueVouchers);
          } else {
            logContainer.innerHTML += `<div class="log-result-block log-result-warning"><div class="log-result-content"><div>⏰ Không có mã mới để lưu!</div></div></div>`;
          }
          initialCollectionIds = [...initialCollectionIds, ...newCollectionIds];
          if (!saveLoopActive) {
            const completeBlock = document.createElement("div");
            completeBlock.className = "log-result-block log-result-success";
            completeBlock.innerHTML = `<div class="log-result-content"><div>✅ Hoàn thành!</div></div>`;
            logContainer.appendChild(completeBlock);
            logContainer.scrollTop = logContainer.scrollHeight;
          }
          resetButton();
          isProcessing = false;
        }
      }, 240);
    }
    async function validateAndProcessUrl(inputUrl) {
      try {
        let processedUrl = inputUrl.trim();
        if (
          !processedUrl.startsWith("http://") &&
          !processedUrl.startsWith("https://")
        )
          processedUrl = "https://" + processedUrl;
        const shopeeDirectPattern = /^(https?:\/\/(?:www\.)?shopee\.vn)/i;
        if (shopeeDirectPattern.test(processedUrl))
          processedUrl = processedUrl.split("?")[0];
        else {
          const unshortResponse = await fetch("https://5anm.net/api/shopee", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "unshort",
              url: processedUrl,
            }),
          });
          const unshortData = await unshortResponse.json();
          if (unshortData.success && unshortData.expanded_url)
            processedUrl = unshortData.expanded_url.split("?")[0];
          else
            return {
              success: false,
              error: "Không thể unshort URL. Vui lòng kiểm tra lại link!",
            };
        }
        const bannerPattern =
          /^(https?:\/\/(?:www\.)?shopee\.vn)\/m\/([a-zA-Z0-9_-]+)$/i;
        const match = processedUrl.match(bannerPattern);
        if (match)
          return { success: true, pageApi: match[2], fullUrl: processedUrl };
        else
          return {
            success: false,
            error:
              "Link không đúng định dạng banner Shopee! Cần có dạng: shopee.vn/m/xxxxx",
          };
      } catch (error) {
        return { success: false, error: `Lỗi xử lý URL: ${error.message}` };
      }
    }
    async function getSelectedBannerPageApi(logContainer) {
      const bannerType = document.getElementById("banner-type").value;
      if (bannerType !== "custom") return { success: true, pageApi: bannerType };

      const customInput = document
        .getElementById("banner-custom-api")
        .value.trim();
      if (
        customInput.toLowerCase() == "https://shopee.vn/m/bvq425" ||
        customInput.toLowerCase() == "https://shopee.vn/m/usq425" ||
        customInput.toLowerCase() == "https://shopee.vn/tuoi-tre-san-deal-re" ||
        customInput.toLowerCase() ==
          "https://shopee.vn/tuoi-tre-san-deal-re-koc" ||
        customInput.toLowerCase() == "http://shopee.vn/m/bvq425" ||
        customInput.toLowerCase() == "http://shopee.vn/m/usq425" ||
        customInput.toLowerCase() == "http://shopee.vn/tuoi-tre-san-deal-re" ||
        customInput.toLowerCase() ==
          "http://shopee.vn/tuoi-tre-san-deal-re-koc"
      ) {
        return { success: false, error: "Banner không còn thay đổi" };
      }
      if (!customInput) {
        return { success: false, error: "Vui lòng nhập Link Banner!" };
      }
      if (!customInput.includes("://") && !customInput.includes("/")) {
        return { success: true, pageApi: customInput };
      }

      if (logContainer) {
        const processingBlock = document.createElement("div");
        processingBlock.className = "log-header-block";
        processingBlock.innerHTML = `<span>🔄 Đang xử lý URL...</span>`;
        logContainer.appendChild(processingBlock);
      }
      const validationResult = await validateAndProcessUrl(customInput);
      if (!validationResult.success) return validationResult;
      return {
        success: true,
        pageApi: validationResult.pageApi,
        fullUrl: validationResult.fullUrl,
      };
    }
    window.checkBannerCaptcha = async function () {
      if (isCheckingCaptcha || isRunning || isWaiting) return;

      const warningElems = document.querySelectorAll(".banner-warning");
      warningElems.forEach((elem) => {
        elem.style.display = "none";
      });

      const btn = document.getElementById("banner-check-captcha-btn");
      const logContainer = document.getElementById("banner-save-log");
      isCheckingCaptcha = true;
      btn.disabled = true;
      btn.textContent = "⏳ Đang kiểm tra...";
      logContainer.innerHTML = "";

      const selected = await getSelectedBannerPageApi(logContainer);
      if (!selected.success) {
        const errorBlock = document.createElement("div");
        errorBlock.className = "log-result-block log-result-error";
        errorBlock.innerHTML = `<div class="log-result-content"><div>❌ ${selected.error}</div></div>`;
        logContainer.appendChild(errorBlock);
        isCheckingCaptcha = false;
        btn.disabled = false;
        btn.textContent = "Kiểm tra captcha";
        return;
      }

      const startBlock = document.createElement("div");
      startBlock.className = "log-header-block";
      startBlock.innerHTML = `<span>🔍 Đang kiểm tra captcha...</span>`;
      logContainer.appendChild(startBlock);

      let hasCaptcha = false;
      let captchaCheckCollection = null;
      let captchaCheckVouchers = [];
      for (let i = 1; i <= 7; i++) {
        const result = await checkBannerExists(selected.pageApi);
        const errorCode = result.error;
        if (errorCode === 90309999) {
          hasCaptcha = true;
          break;
        }

        if (i === 1 && result.data) {
          const collections = parseCollectionsFromResponse(result.data);
          captchaCheckCollection = collections[0] || null;
        }

        if (captchaCheckCollection) {
          const voucherResult = await getVoucherDetailsForCaptchaCheck(
            captchaCheckCollection,
          );
          if (voucherResult.error === 90309999) {
            hasCaptcha = true;
            break;
          }
          if (i === 1) {
            captchaCheckVouchers = voucherResult.vouchers.slice(0, 20);
          }
          if (captchaCheckVouchers.length > 0) {
            const saveResult = await saveVouchersForCaptchaCheck(
              captchaCheckVouchers,
            );
            if (saveResult.error === 90309999) {
              hasCaptcha = true;
              break;
            }
          }
        }

        if (i < 7) await sleepANM(250);
      }

      const resultBlock = document.createElement("div");
      if (hasCaptcha) {
        resultBlock.className = "log-result-block log-result-error";
        resultBlock.innerHTML = `<div class="log-result-content"><div>⚠️ Phát hiện captcha. Vui lòng verify captcha rồi chạy lại.</div></div>`;
        if (typeof window.showCaptchaErrorModal === "function") {
          window.showCaptchaErrorModal();
        } else {
          alert("Cần verify captcha mới có thể sử dụng tiếp");
        }
      } else {
        resultBlock.className = "log-result-block log-result-success";
        resultBlock.innerHTML = `<div class="log-result-content"><div>✅ Không phát hiện captcha.</div></div>`;
      }
      logContainer.appendChild(resultBlock);
      logContainer.scrollTop = logContainer.scrollHeight;

      isCheckingCaptcha = false;
      btn.disabled = false;
      btn.textContent = "Kiểm tra captcha";
    };

    // Giao diện/Modal/CSS
    // ========== Tạo UI modal + CSS ==========
    const modalCSS = `
                    <style id="banner-save-voucher-style">
                    .banner-save-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100011;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}
                    .banner-save-container{background:#fff;width:90%;max-width:700px;max-height:85%;border-radius:16px;display:flex;flex-direction:column;box-shadow:0 25px 80px rgba(0,0,0,0.4);overflow:hidden;}
                    .banner-save-header{background:linear-gradient(135deg,#ee4d2d 0%,#ff6b35 100%);padding:20px;color:white;position:relative;display:flex;align-items:center;gap:10px;}
                    .banner-save-title{flex:1;min-width:0;}
                    .banner-save-header h2{margin:0 0 8px 0;font-size:22px;font-weight:700;cursor:pointer;user-select:none;}
                    .banner-pip-text{color:#7c3aed;font-weight:800;}
                    .banner-save-header p{margin:0;font-size:14px;opacity:.95;}
                    .banner-close-btn{position:static;background:rgba(255,255,255,0.2);border:none;color:white;font-size:24px;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.3s;flex-shrink:0;}
                    .banner-close-btn:hover{background:rgba(255,255,255,0.3);transform:rotate(90deg);}
                    .banner-save-content{flex:1;overflow-y:auto;padding:20px;}
                    .banner-input-group{margin-bottom:20px;}
                    .banner-input-group label{display:block;margin-bottom:8px;font-weight:600;color:#333;font-size:14px;}
                    .banner-input-group input,.banner-input-group select{width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:14px;transition:.3s;box-sizing:border-box;}
                    .banner-input-group input:focus,.banner-input-group select:focus{outline:none;border-color:#ee4d2d;box-shadow:0 0 0 3px rgba(238,77,45,.1);}
                    .banner-input-hint{font-size:13px;color:#666;font-style:italic;margin-top:8px;}
                    .banner-warning{background:#fff3cd;border-left:4px solid #ffa500;padding:12px;border-radius:6px;margin-bottom:20px;font-size:13px;color:#856404;}
                    .banner-action-row{display:flex;gap:10px;margin-bottom:15px;}
                    .banner-start-btn{flex:1;padding:14px;background:linear-gradient(135deg,#ee4d2d,#ff6b35);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:.3s;}
                    .banner-start-btn:hover:not(:disabled){background:linear-gradient(135deg,#d63916,#e55a2b);transform:translateY(-1px);box-shadow:0 4px 15px rgba(238,77,45,.3);}
                    .banner-start-btn.stop{background:linear-gradient(135deg,#dc2626,#ef4444);}
                    .banner-check-captcha-btn{flex:1;padding:14px;background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:.3s;}
                    .banner-check-captcha-btn:hover:not(:disabled){background:linear-gradient(135deg,#6d28d9,#7c3aed);transform:translateY(-1px);box-shadow:0 4px 15px rgba(124,58,237,.3);}
                    .banner-check-captcha-btn:disabled{opacity:.65;cursor:not-allowed;transform:none;box-shadow:none;}
                    .banner-log-container{border:2px solid #e5e7eb;border-radius:8px;padding:12px;max-height:300px;overflow-y:auto;background:#f9fafb;}
                    .banner-log-title{font-weight:600;margin-bottom:10px;color:#333;font-size:14px;}
                    .log-header-block{background:#fef3c7;border-left:4px solid #f59e0b;color:#92400e;font-weight:600;font-size:13px;padding:10px 12px;border-radius:6px;margin-bottom:10px;}
                    .log-result-block{background:#fce7f3;border-left:4px solid #ec4899;border-radius:6px;margin-bottom:8px;overflow:hidden;}
                    .log-result-content{padding:10px 12px;font-size:13px;color:#831843;line-height:1.6;}
                    .log-result-content div{margin-bottom:4px;}
                    .log-result-content div:last-child{margin-bottom:0;}
                    .log-result-success{background:#dcfce7;border-left-color:#10b981;}
                    .log-result-success .log-result-content{color:#047857;}
                    .log-result-error{background:#fee2e2;border-left-color:#ef4444;}
                    .log-result-error .log-result-content{color:#991b1b;}
                    .log-result-warning{background:#fef3c7;border-left-color:#f59e0b;}
                    .log-result-warning .log-result-content{color:#92400e;}
                    .voucher-item{background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:10px;overflow:hidden;transition:.3s;}
                    .voucher-item.success{border-left:4px solid #10b981;background:#f0fdf4;}
                    .voucher-item.error{border-left:4px solid #ef4444;background:#fef2f2;}
                    .voucher-header{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid #f3f4f6;}
                    .voucher-status{display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;font-size:12px;font-weight:600;}
                    .voucher-status.pending{background:#fef3c7;color:#92400e;}
                    .voucher-status.success{background:#10b981;color:#fff;}
                    .voucher-status.error{background:#ef4444;color:#fff;}
                    .voucher-code{font-weight:600;color:#333;font-size:13px;}
                    .voucher-details{display:flex;justify-content:flex-start;padding:8px 12px;font-size:12px;background:#f9fafb;}
                    .voucher-message-inline{color:#92400e;font-size:12px;font-weight:500;}
                    .voucher-message-inline.success{color:#047859;}
                    .voucher-message-inline.error{color:#991b1b;}
                    .voucher-message-inline a{color:inherit;text-decoration:underline;}
                    .voucher-item.success .voucher-details{background:#dcfce7;}
                    .voucher-item.error .voucher-details{background:#fee2e2;}
                    @media (max-width:768px){.banner-save-container{width:95%;max-height:90%;}
                    .banner-action-row{flex-direction:row;gap:8px;}
                    .banner-start-btn,.banner-check-captcha-btn{padding:12px 8px;font-size:14px;white-space:nowrap;}
                    .banner-save-header h2{font-size:18px;}
                    .banner-save-content{padding:15px;}
                    }
                    </style>
                    `;

    const modalHTML = `
                    <div class="banner-save-modal" id="banner-save-modal">
                        <div class="banner-save-container">
                            <div class="banner-save-header">
                                <div class="banner-save-title">
                                    <h2 onclick="if(typeof showPiPModeMenu === 'function') showPiPModeMenu('Load Banner & Save')">Auto Save Voucher <span class="banner-pip-text">Scheduler</span></h2>
                                    <p>Tự động quét và lưu voucher mới</p>
                                </div>
                                <div class="banner-save-header-actions"><button class="banner-back-btn" id="banner-save-back-btn">← Back</button><button class="banner-close-btn" onclick="closeBannerSaveModal()">×</button></div>
                            </div>
                            <div class="banner-save-content">
                                <div class="banner-input-group">
                                    <label>Chọn banner</label>
                                    <select id="banner-type">
                                        <option value="kol-affiliate">kol-affiliate</option>
                                        <option value="sandealquocte-0726">sandealquocte</option>
                                        <option value="goi-ShopeeVIP">goi-ShopeeVIP</option>
                                        <option value="sieuhoihanquoc">sieuhoihanquoc</option>
                                        <option value="VoucherXtra">VoucherXtra</option>
                                        <option value="custom">Tự nhập</option>
                                    </select>
                                </div>
                                <div class="banner-input-group" id="custom-input-group" style="display:none;">
                                    <label>Link banner tùy chỉnh</label>
                                    <input type="text" id="banner-custom-api" placeholder="Nhập URL tùy chỉnh..." />
                                    <div class="banner-input-hint">💡 Bấm trước thời điểm banner thay đổi từ 1-10 phút</div>
                                </div>
                                <!-- <div class="banner-warning">
                                    💡 <strong>Update</strong>: Kiểm tra mục 3 trước, thường các mã KOL đã có sẵn bên đó khung 0h.
                                </div>  -->
                                <div class="banner-warning">
                                    ⚠️ <strong>Lưu ý:</strong> IOS cần giữ nguyên trang chạy tới khi nào lưu xong code mới quay lại app Shopee tích voucher. Nên dùng thiết bị phụ để chạy code lưu mã!\nAndroid thì bật PIP mode trên tiêu đề thì không còn cần chờ ở trang nữa.
                                </div>
                                <div class="banner-action-row">
                                    <button class="banner-check-captcha-btn" id="banner-check-captcha-btn" onclick="checkBannerCaptcha()">
                                        Kiểm tra captcha
                                    </button>
                                    <button class="banner-start-btn" id="banner-start-btn" onclick="toggleBannerSave()">
                                        ▶️ Bắt đầu
                                    </button>
                                </div>
                                <div class="banner-log-container">
                                    <div class="banner-log-title">📊 Kết quả:</div>
                                    <div id="banner-save-log"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

    document.head.insertAdjacentHTML("beforeend", modalCSS);
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.getElementById("banner-save-back-btn").onclick = function () {
      window.closeBannerSaveModal();
      if (typeof window.ShopeeToolkitBack === "function") window.ShopeeToolkitBack();
    };
    setTimeout(observeBannerLogChanges, 0);
    document
      .getElementById("banner-type")
      .addEventListener("change", function () {
        document.getElementById("custom-input-group").style.display =
          this.value === "custom" ? "block" : "none";
      });
    window.closeBannerSaveModal = function () {
      window.pipDisableMask = false;
      isRunning = false;
      isWaiting = false;
      saveLoopActive = false;
      if (monitorInterval) clearInterval(monitorInterval);
      if (countdownInterval) clearInterval(countdownInterval);
      if (bannerPipObserver) {
        bannerPipObserver.disconnect();
        bannerPipObserver = null;
      }
      const modal = document.getElementById("banner-save-modal");
      const style = document.getElementById("banner-save-voucher-style");
      if (modal) modal.remove();
      if (style) style.remove();
    };
    window.toggleBannerSave = async function () {
      const warningElems = document.querySelectorAll(".banner-warning");
      warningElems.forEach((elem) => {
        elem.style.display = "none";
      });
      const btn = document.getElementById("banner-start-btn");
      const logContainer = document.getElementById("banner-save-log");
      if (isWaiting) {
        isWaiting = false;
        clearInterval(countdownInterval);
        resetButton();
        return;
      }
      if (isRunning) {
        isRunning = false;
        saveLoopActive = false;
        if (monitorInterval) clearInterval(monitorInterval);
        const stopBlock = document.createElement("div");
        stopBlock.className = "log-result-block log-result-error";
        stopBlock.innerHTML = `<div class="log-result-content"><div>⏸️ Đã dừng!</div></div>`;
        logContainer.appendChild(stopBlock);
        logContainer.scrollTop = logContainer.scrollHeight;
        resetButton();
      } else {
        const bannerType = document.getElementById("banner-type").value;
        logContainer.innerHTML = "";
        let pageApi = "";
        if (bannerType === "custom") {
          const customInput = document
            .getElementById("banner-custom-api")
            .value.trim();
          if (
            customInput.toLowerCase() == "https://shopee.vn/m/bvq425" ||
            customInput.toLowerCase() == "https://shopee.vn/m/usq425" ||
            customInput.toLowerCase() ==
              "https://shopee.vn/tuoi-tre-san-deal-re" ||
            customInput.toLowerCase() ==
              "https://shopee.vn/tuoi-tre-san-deal-re-koc" ||
            customInput.toLowerCase() == "http://shopee.vn/m/bvq425" ||
            customInput.toLowerCase() == "http://shopee.vn/m/usq425" ||
            customInput.toLowerCase() ==
              "http://shopee.vn/tuoi-tre-san-deal-re" ||
            customInput.toLowerCase() ==
              "http://shopee.vn/tuoi-tre-san-deal-re-koc"
          ) {
            const errorBlock = document.createElement("div");
            errorBlock.className = "log-result-block log-result-error";
            errorBlock.innerHTML = `<div class="log-result-content"><div>❌ Banner không còn thay đổi</div></div>`;
            logContainer.appendChild(errorBlock);
            return;
          }
          if (!customInput) {
            alert("⚠️ Vui lòng nhập Link Banner!");
            return;
          }
          if (!customInput.includes("://") && !customInput.includes("/"))
            pageApi = customInput;
          else {
            logContainer.innerHTML = "";
            const processingBlock = document.createElement("div");
            processingBlock.className = "log-header-block";
            processingBlock.innerHTML = `<span>🔄 Đang xử lý URL...</span>`;
            logContainer.appendChild(processingBlock);
            const validationResult = await validateAndProcessUrl(customInput);
            if (!validationResult.success) {
              const errorBlock = document.createElement("div");
              errorBlock.className = "log-result-block log-result-error";
              errorBlock.innerHTML = `<div class="log-result-content"><div>❌ ${validationResult.error}</div></div>`;
              logContainer.appendChild(errorBlock);
              return;
            }
            pageApi = validationResult.pageApi;
            const successBlock = document.createElement("div");
            successBlock.className = "log-result-block log-result-success";
            successBlock.innerHTML = `<div class="log-result-content"><div>✅ URL hợp lệ! Banner: ${pageApi}</div></div>`;
            logContainer.appendChild(successBlock);
            logContainer.scrollTop = logContainer.scrollHeight;
            await sleepANM(500);
          }
        } else {
          pageApi = bannerType;
        }
        isWaiting = true;
        btn.classList.add("stop");
        logContainer.innerHTML = "";
        const checkBlock = document.createElement("div");
        checkBlock.className = "log-header-block";
        checkBlock.innerHTML = `<span>🔍 Kiểm tra banner...</span>`;
        logContainer.appendChild(checkBlock);
        const result = await checkBannerExists(pageApi);
        if (!result.exists) {
          const errorBlock = document.createElement("div");
          errorBlock.className = "log-result-block log-result-error";
          errorBlock.innerHTML = `<div class="log-result-content"><div>❌ Banner không tồn tại!</div></div>`;
          logContainer.appendChild(errorBlock);
          resetButton();
          return;
        }
        let expireTime = null,
          timeRemaining = null;
        const TIME_THRESHOLD = 3580;
        if (result.data && result.data.data?.meta?.configuration?.expire_at) {
          expireTime = result.data.data.meta.configuration.expire_at;
          logContainer.innerHTML = "";
          if (expireTime == -1) {
            const warningBlock = document.createElement("div");
            warningBlock.className = "log-result-block log-result-error";
            warningBlock.innerHTML = `<div class="log-result-content"><div>❌ Banner không còn thay đổi</div></div>`;
            logContainer.appendChild(warningBlock);
            logContainer.scrollTop = logContainer.scrollHeight;
            resetButton();
            return;
          }
          timeRemaining = getTimeRemainingSeconds(expireTime);
          const runAtTime = expireTime - 3;
          const formattedTime = formatUnixToDateTime(expireTime);
          const formattedRunAtTime = formatUnixToDateTime(runAtTime);
          if (timeRemaining > TIME_THRESHOLD) {
            const warningBlock = document.createElement("div");
            warningBlock.className = "log-result-block log-result-error";
            warningBlock.innerHTML = `<div class="log-result-content"><div>⏰ Banner sẽ thay đổi lúc ${formattedTime}. Vui lòng chạy trước thời gian banner thay đổi từ 1-10 phút.</div></div>`;
            logContainer.appendChild(warningBlock);
            logContainer.scrollTop = logContainer.scrollHeight;
            resetButton();
            return;
          } else {
            const expireBlock = document.createElement("div");
            expireBlock.className = "log-header-block";
            expireBlock.innerHTML = `<span>⏰ Banner sẽ thay đổi lúc ${formattedTime}. Đang đếm ngược tới ${formattedRunAtTime} để quét sớm hơn 3 giây. Đừng quên đọc kỹ lưu ý!</span>`;
            logContainer.appendChild(expireBlock);
          }
        } else {
          const noExpireBlock = document.createElement("div");
          noExpireBlock.className = "log-header-block";
          noExpireBlock.innerHTML = `<span>✅ Banner đã sẵn sàng để quét!</span>`;
          logContainer.appendChild(noExpireBlock);
        }
        const collections = parseCollectionsFromResponse(result.data);
        initialCollectionIds = collections.map((c) => c.collection_id);
        if (collections.length > 0)
          initialVouchers = await getVoucherDetails(collections);
        logContainer.scrollTop = logContainer.scrollHeight;
        startCountdown(expireTime ? expireTime - 3 : null, () =>
          startMonitoring(pageApi),
        );
      }
      // setTimeout(() => {
      //     document.querySelectorAll('.log-header-block').forEach((elem) => {
      //         elem.style.display = 'none';
      //     });
      // }, 5000);
    };
  };
  window.executeLoadBannerThenSaveVoucher();
})();
