document.addEventListener('DOMContentLoaded', () => {
  const productsList = document.getElementById('productsList');
  const clearBtn = document.getElementById('clearBtn');
  
  // Load products from storage
  function loadProducts() {
    chrome.storage.local.get({ products: [] }, (res) => {
      const products = res.products;
      renderProducts(products);
    });
  }

  // Listen for storage changes to update live
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.products) {
      renderProducts(changes.products.newValue || []);
    }
  });

  // Render products
  function renderProducts(products) {
    productsList.innerHTML = '';
    
    if (!products || products.length === 0) {
      productsList.innerHTML = `
        <div class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>No products scraped yet. Scrape items on Amazon to see them here.</p>
        </div>
      `;
      return;
    }
    
    products.forEach((product, index) => {
      const card = document.createElement('a');
      card.href = product.link || '#';
      card.target = '_blank';
      card.className = 'product-card';
      
      const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/150?text=No+Image';
      
      card.innerHTML = `
        <img src="${imageUrl}" class="product-image" alt="Product Image">
        <div class="product-details">
          <h3 class="product-title" title="${product.title}">${product.title || 'Unknown Product'}</h3>
          <p class="product-price">${product.price || 'Price unavailable'}</p>
          <div class="product-meta">
            <span class="product-seller" title="${product.seller}">By: ${product.seller || 'Unknown'}</span>
            <span class="product-rating">★ ${product.rating || 'N/A'}</span>
          </div>
        </div>
      `;
      
      productsList.appendChild(card);
    });
  }

  // Clear products
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved products?')) {
      chrome.storage.local.set({ products: [] }, () => {
      });
    }
  });

  // Initial load
  loadProducts();
});
