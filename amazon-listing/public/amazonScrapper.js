console.log('amazon scrapper file loaded ')
function injectButtonStyles() {
  if (document.getElementById("open-item-btn-styles")) return;
  const style = document.createElement("style");
  style.id = "open-item-btn-styles";
  style.innerHTML = `
    .openItemBtn {
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 999;
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid #007bff;
      border-radius: 4px;
      background-color: #007bff;
      color: #fff;
      font-size: 12px;
      transition: background-color 0.2s ease, transform 0.1s ease;
      display: none;
    }
    [data-component-type="s-search-result"]:hover > .openItemBtn {
      display: block;
    }
    .openItemBtn:hover {
      background-color: #0056b3;
      transform: scale(1.05);
    }
    .openItemBtn:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
}

// Add button to each Amazon item
function handleHiddenMode(link, title) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = link;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument;
      const images = Array.from(
        doc.querySelectorAll("#altImages img, .imgTagWrapper img")
      ).map(img => img.src).filter(Boolean);

      const seller =
        doc.querySelector("#sellerProfileTriggerId, #bylineInfo")?.innerText ||
        "Seller not available";

      const price = 
        doc.querySelector(".a-price .a-offscreen")?.innerText || "Price not available"

      const rating =
        doc.querySelector(".a-icon-alt")?.innerText?.trim() || "No rating";

      console.log("Hidden Mode Data:", { title, link, images, seller, price, rating });

    } catch (err) {
      console.error(err);
    } finally {
      iframe.remove();
    }
  };
}

function addButtonToItems() {
  injectButtonStyles();

  const items = Array.from(document.querySelectorAll('[data-component-type="s-search-result"]'));
  items.forEach((item) => {
    if (item.querySelector(".openItemBtn")) return;

    const button = document.createElement("button");
    button.innerText = "Open Item";
    button.className = "openItemBtn";

    if (getComputedStyle(item).position === "static") item.style.position = "relative";

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const link =
        item.querySelector("h2 a")?.href ||
        item.querySelector("a.a-link-normal")?.href;

      const title = item.querySelector("h2 span")?.innerText || "No title";

      if (!link) return console.log("No link available");

      chrome.storage.local.get("scrapeMode", (data) => {
        const mode = data.scrapeMode || "visible";

        if (mode === "visible") {
          chrome.runtime.sendMessage({
            action: "openTabAndCapture",
            url: link,
            title
          });
          console.log("Using VISIBLE mode");
        } else {
          handleHiddenMode(link, title);
          console.log("Using HIDDEN mode");
        }
      });
    });

    item.prepend(button);
  });
}

addButtonToItems();

new MutationObserver(addButtonToItems).observe(document.body, { childList: true, subtree: true });


    // Buton click handler
//     button.addEventListener("click", async (e) => {
//       e.stopPropagation();
//       alert('you clicked at button, to see details visit browser console')
//       const link = item.querySelector("h2 a")?.href || item.querySelector("a.a-link-normal")?.href;
//       const title = item.querySelector("h2 span")?.innerText || "No title";
//       const rating = item.querySelector(".a-icon-alt")?.innerText?.trim() || "No rating";
//       const price =
//         item.querySelector("#priceblock_ourprice")?.innerText?.trim() ||
//         item.querySelector("#priceblock_dealprice")?.innerText?.trim() ||
//         item.querySelector(".a-price .a-offscreen")?.innerText?.trim() ||
//         item.querySelector("#corePrice_feature_div .a-offscreen")?.innerText?.trim() ||
//         "Price not available";

//       if (!link) return console.log("No link available for this item");

//       // Open a hidden iframe to scrape details 
//       const iframe = document.createElement("iframe");
//       iframe.style.width = "0";
//       iframe.style.height = "0";
//       iframe.style.position = "absolute";
//       iframe.style.left = "-9999px";
//       iframe.src = link;

//       document.body.appendChild(iframe);

//       iframe.onload = async () => {
//         try {
//           const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

//           // Collect all images
//           const imageElements = Array.from(
//             iframeDoc.querySelectorAll("#altImages img, .imgTagWrapper img")
//           );
//           const images = imageElements.map(img => img.src || img.getAttribute("data-old-hires")).filter(Boolean);

//           // Get seller/store name
//           const seller =
//             iframeDoc.querySelector("#sellerProfileTriggerId, #bylineInfo")?.innerText?.trim() ||
//             "Seller not available";

//           const itemData = {
//             title,
//             link,
//             images,
//             price,
//             seller,
//             rating,
//           };

//           console.log("Detailed Item Data:", itemData);
//         } catch (err) {
//           console.error("Error scraping details page:", err);
//         } finally {
//           document.body.removeChild(iframe);
//         }
//       };
//     });

//     item.prepend(button);
//   });
// }

// // Initial call and observe dynamic items
// addButtonToItems();
// new MutationObserver(addButtonToItems).observe(document.body, { childList: true, subtree: true });