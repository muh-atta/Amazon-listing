let highlightInterval = null;
let currentIndex = 0;
let items = [];
let previousItem = null;
let collectData = [];

// Listen for Start/Stop button click message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    startHighlight();
  } else if (msg.action === "stop") {
    stopHighlight();
  }
});

// Get Amazon listing items
function getAmazonItems() {
  return Array.from(document.querySelectorAll('[data-component-type="s-search-result"]'));
}

// Start highlighting
function startHighlight() {
  stopHighlight();

  items = getAmazonItems();
  if (!items.length) return;

  collectData= [];
  currentIndex = 0;

  // Send initial progress
  chrome.runtime.sendMessage({
    type: "progress",
    current: 0,
    total: items.length
  });

  highlightNext();
}

// Highlight items one by one
function highlightNext() {
  if (currentIndex >= items.length) {

    // Convert to nested object format
    const formattedData = {};
    
    collectData.forEach((item, index) => {
      formattedData[`Item ${index + 1}`] = item;
    });
    
    console.log("Final Data:", formattedData);

    stopHighlight();
    return;
  }

  const item = items[currentIndex];

  // Remove previous highlight
  if (previousItem) {
    previousItem.style.outline = "";
  }

  // Highlight current item
  item.style.outline = "3px solid orange";
  item.scrollIntoView({ behavior: "smooth", block: "center" });

  // Extract data here
  const data = extractItemData(item);
  collectData.push(data);

  chrome.runtime.sendMessage({
  type: "itemFetched",
  item: data
});

  console.log(`Item ${currentIndex + 1}:`, data);

  // Update progress
  chrome.runtime.sendMessage({
    type: "progress",
    current: currentIndex + 1,
    total: items.length
  });

  previousItem = item;
  currentIndex++;

  highlightInterval = setTimeout(highlightNext, getRandomDelay());
}

// Stop highlighting
function stopHighlight() {
  if (highlightInterval) {
    clearTimeout(highlightInterval);
    highlightInterval = null;
  }

  items.forEach(item => item.style.outline = "");

  currentIndex = 0;
  previousItem = null;
}

// Random delay
function getRandomDelay() {
  return Math.floor(Math.random() * 500) + 500;
}

// function to fetch data from the amazon listing page 
function extractItemData(item) {
  // Title
  const title =
    item.querySelector("h2 span")?.innerText?.trim() ||
    "No title available";

  // Price
  const price =
    item.querySelector(".a-price .a-offscreen")?.innerText?.trim() ||
    "Price not available";

  // Rating
  const rating =
    item.querySelector(".a-icon-alt")?.innerText?.trim() ||
    "No rating";

  // Reviews count
  const reviews =
    item.querySelector(".a-size-base.s-underline-text")?.innerText?.trim() ||
    item.querySelector(".a-size-base")?.innerText?.trim() ||
    "0 reviews";

  // Image URL
  const image =
    item.querySelector("img.s-image")?.src ||
    item.querySelector("img")?.src ||
    "No image available";

  const link =
  item.querySelector("h2 a")?.href || 
  item.querySelector("h2 span a")?.href || 
  item.querySelector("a.a-link-normal.s-no-outline")?.href || 
  "No link available";

  return {
    title,
    price,
    rating,
    reviews,
    image,
    link
  };
}
