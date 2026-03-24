const toggleBtn = document.getElementById("toggleBtn");
const statusDiv = document.getElementById("status");
const currentItem = document.getElementById("currentCount");
const itemsCount = document.getElementById("totalCount");
const pageDiv = document.getElementById("pageNumber");

let isStarted = false;

// Get tab info 
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tab = tabs[0];

  if (!tab || !tab.url) {
    statusDiv.textContent = "No active tab";
    statusDiv.style.backgroundColor = "gray";
    toggleBtn.disabled = true;
    return;
  }

  const url = new URL(tab.url);

  // Page number
  const page = url.searchParams.get("page") || 1;
  pageDiv.textContent = `Page: ${page}`;

  // Amazon listing detection
  const isAmazon = url.hostname.includes("amazon.");
  const isListing = url.pathname === "/s" && url.searchParams.has("k");

  if (isAmazon && isListing) {
    statusDiv.textContent = "amazon.com";
    statusDiv.style.backgroundColor = "green";
    toggleBtn.disabled = false;
  } else {
    statusDiv.textContent = "Visit Amazon listing page";
    statusDiv.style.backgroundColor = "red";
    toggleBtn.disabled = true;

    // Reset button state
    toggleBtn.textContent = "Start";
    isStarted = false;
  }
});

// Handle Start/Stop button
toggleBtn.addEventListener("click", () => {
  isStarted = !isStarted;
  toggleBtn.textContent = isStarted ? "Stop" : "Start";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      action: isStarted ? "start" : "stop"
    });
  });
});

// Listen for progress updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "progress") {
    currentItem.textContent = msg.current;
    itemsCount.textContent = msg.total;
  }
});