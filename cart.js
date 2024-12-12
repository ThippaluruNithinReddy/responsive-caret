document.addEventListener('DOMContentLoaded', () => {
    const cartItemList = document.getElementById('cart-item-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const loader = document.getElementById('loader');
    const removeModal = document.getElementById('remove-modal');
    const confirmRemoveBtn = document.getElementById('confirm-remove');
    const cancelRemoveBtn = document.getElementById('cancel-remove');

    // Global variable to track item to remove
    let itemToRemove = null;

    // Default cart data with initial item
    let cartData = {
        "items": [{
            "id": 49839206859071,
            "quantity": 1,
            "title": "Asgaard sofa",
            "price": 250000, // Corrected price (₹250,000)
            "featured_image": {
                "url": "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/Asgaardsofa3.png?v=1728384481"
            }
        }]
    };

    // Format price in Indian Rupees
    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Render cart items
    function renderCartItems(items) {
        // Check if cart is empty
        if (!items || items.length === 0) {
            cartItemList.innerHTML = '<p>Your cart is empty</p>';
            cartSubtotal.textContent = formatPrice(0);
            cartTotal.textContent = formatPrice(0);
            return;
        }

        cartItemList.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.featured_image.url}" alt="${item.title}" style="max-width: 100px; max-height: 100px;">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, this.value - ${item.quantity})">
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <i class="fas fa-trash remove-item" onclick="confirmRemoveItem(${item.id})"></i>
                    </div>
                    <p>Subtotal: ${formatPrice(item.price * item.quantity)}</p>
                </div>
            `;
            cartItemList.appendChild(cartItemDiv);
        });

        // Update totals
        updateCartTotals();
    }

    // Update cart totals
    function updateCartTotals() {
        const subtotal = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSubtotal.textContent = formatPrice(subtotal);
        cartTotal.textContent = formatPrice(subtotal);
    }

    // Update quantity
    window.updateQuantity = function(itemId, change) {
        const item = cartData.items.find(i => i.id === itemId);
        if (item) {
            const newQuantity = Math.max(1, item.quantity + change);
            item.quantity = newQuantity;
            
            // Save to local storage
            localStorage.setItem('cart', JSON.stringify(cartData));
            
            // Re-render and update totals
            renderCartItems(cartData.items);
        }
    }

    // Confirm item removal
    window.confirmRemoveItem = function(itemId) {
        itemToRemove = itemId;
        removeModal.style.display = 'block';
    }

    // Remove item from cart
    function removeItem() {
        if (itemToRemove) {
            cartData.items = cartData.items.filter(item => item.id !== itemToRemove);
            
            // Save to local storage
            localStorage.setItem('cart', JSON.stringify(cartData));
            
            renderCartItems(cartData.items);
            removeModal.style.display = 'none';
            itemToRemove = null;
        }
    }

    // Checkout functionality (placeholder)
    checkoutBtn.addEventListener('click', () => {
        alert('Proceeding to checkout...');
    });

    // Modal event listeners
    confirmRemoveBtn.addEventListener('click', removeItem);
    cancelRemoveBtn.addEventListener('click', () => {
        removeModal.style.display = 'none';
        itemToRemove = null;
    });

    // Fetch cart data from API
    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            console.log('Cart data:', data); // Check if the data is fetched correctly
            cartData = data;
            renderCartItems(cartData.items);
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
        });
    
});
