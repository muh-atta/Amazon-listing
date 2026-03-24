
let highlightInterval = null;
let currentIndex = 0;
let items = [];

// Listen for Start/Stop messages from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    startHighlight();
  } else if (msg.action === "stop") {
    stopHighlight();
  }
});

// Detect Amazon listing items
function getAmazonItems() {
  return Array.from(document.querySelectorAll('[data-component-type="s-search-result"]'));
}

// Start highlighting
function startHighlight() {
  stopHighlight(); 
  items = getAmazonItems();
  if (!items.length) return;
    itemsCount.textContent= items.length
  currentIndex = 0;
  highlightNext();
}

// Highlight next item with smooth scroll
function highlightNext() {
  if (currentIndex >= items.length) {
    stopHighlight();
    return;
  }

  const item = items[currentIndex];
  // Remove highlight from previous
  items.forEach((el, i) => {
    if (i !== currentIndex) el.style.outline = "";
  });

  // Highlight current item
  item.style.outline = "3px solid orange";
  item.scrollIntoView({ behavior: "smooth", block: "center" });

  currentIndex

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
}

// Random delay to simulate human behavior (500ms to 1500ms)
function getRandomDelay() {
  return Math.floor(Math.random() * 1000) + 500;
}