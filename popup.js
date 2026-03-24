const toggleBtn = document.getElementById("toggleBtn");
const statusDiv = document.getElementById("status");

let isStarted = false;

// Check Amazon page status for the popup banner
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const tab = tabs[0];
  if (!tab || !tab.url) {
    statusDiv.textContent = "No active tab";
    statusDiv.style.backgroundColor = "gray";
    toggleBtn.disabled = true;
    return;
  }

  const url = new URL(tab.url);
  const isAmazon = url.hostname.includes("amazon.");
  const isListing = url.pathname === "/s" && url.searchParams.has("k");

  if (isAmazon && isListing ) {
    statusDiv.textContent = "amazon.com";
    statusDiv.style.backgroundColor = "green";
    toggleBtn.disabled = false; 
  } else {
    statusDiv.textContent = "Visit Amazon listing page";
    statusDiv.style.backgroundColor = "red";
    toggleBtn.disabled = true;  
  }
});

// Handle toggle button click
toggleBtn.addEventListener("click", () => {
  isStarted = !isStarted;
  toggleBtn.textContent = isStarted ? "Stop" : "Start";

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, { action: isStarted ? "start" : "stop" });
  });
});