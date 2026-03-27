console.log('background file loaded');

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "openTabAndCapture") {
    chrome.tabs.create({ url: msg.url, active: true }, (tab) => {
      console.log('Tab created:', tab.id);

      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === "complete") {

          // Inject content script into the new tab
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                // This runs in the new tab
                const title = document.querySelector("h1, #productTitle")?.innerText || "No title";
                const price =
                  document.querySelector("#priceblock_ourprice")?.innerText ||
                  document.querySelector("#priceblock_dealprice")?.innerText ||
                  document.querySelector(".a-price .a-offscreen")?.innerText ||
                  "Price not available";
                const rating = document.querySelector(".a-icon-alt")?.innerText || "No rating";
                const images = Array.from(
                  document.querySelectorAll("#altImages img, .imgTagWrapper img")
                ).map(img => img.src || img.getAttribute("data-old-hires")).filter(Boolean);
                const seller =
                  document.querySelector("#sellerProfileTriggerId, #bylineInfo")?.innerText ||
                  "Seller not available";

                return { title, price, rating, images, seller };
              },
            },
            (results) => {
                if(!results || !results[0]) {
                    console.error("Script injection failed", chrome.runtime.lastError);
                return;
                }

              const data = results[0].result;
              console.log("Item details:", data);

              // Capture screenshot
              chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
  if (!dataUrl) {
    console.error("Screenshot failed: dataUrl is undefined");
  } else {
    console.log("Screenshot captured!");
    chrome.downloads.download({
      url: dataUrl,
      filename: `amazon_${Date.now()}.png`
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError);
      } else {
        console.log("Download started:", downloadId);
      }
    });
  }

  // Always close the tab
  chrome.tabs.remove(tab.id, () => {
    console.log('Tab closed after screenshot attempt');
  });
});
            }
          );

          // Remove listener to avoid multiple triggers
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });
  }
});