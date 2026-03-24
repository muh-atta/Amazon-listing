
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tab = tabs[0];
  const statusDiv = document.getElementById("status");

  if (!tab || !tab.url) {
    statusDiv.textContent = "No active tab found";
    statusDiv.style.backgroundColor = "gray";
    return;
  }

  const url = new URL(tab.url);
  const isAmazon = url.hostname.includes("amazon.");
  const urlParams = url.searchParams;
  const isListing = url.pathname === "/s" && urlParams.has("k");
  const isHomepage = url.pathname === "/" || url.pathname === "/ref=nav_logo";

  if ( (isAmazon && (isListing || isHomepage))) {
    statusDiv.textContent = "amazon.com";
    statusDiv.style.backgroundColor = "green";
  } else {
    statusDiv.textContent = "Visit Amazon listing page";
    statusDiv.style.backgroundColor = "red";
  }
});