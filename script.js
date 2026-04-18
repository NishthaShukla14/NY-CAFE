// --- Sample Menu Data ---
const menuItems = [
    {
        id: 1,
        name: "Classic Espresso",
        category: "hot",
        price: 3.50,
        description: "Rich, full-bodied espresso with a velvety crema.",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Caramel Macchiato",
        category: "hot",
        price: 4.50,
        description: "Espresso with steamed milk and sweet caramel drizzle.",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Iced Latte",
        category: "cold",
        price: 4.00,
        description: "Chilled espresso, milk, and ice for a refreshing kick.",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Cold Brew",
        category: "cold",
        price: 4.25,
        description: "Slow-steeped, extra smooth cold coffee.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Butter Croissant",
        category: "pastry",
        price: 3.00,
        description: "Flaky, buttery, and baked fresh daily.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Chocolate Muffin",
        category: "pastry",
        price: 3.50,
        description: "Decadent chocolate muffin with chocolate chips.",
        image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&q=80"
    }
];

// --- Cart State Management ---
// Initialize cart from sessionStorage or empty array if none exists
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// --- DOM Elements ---
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCounter = document.getElementById('cart-counter');
const totalPriceEl = document.getElementById('total-price');
const navbar = document.getElementById('navbar');

// --- Initialization ---
// Render initial menu and cart states
renderMenu(menuItems);
updateCart();

/**
 * Renders the menu items to the DOM grid.
 * @param {Array} items - Array of menu item objects to display
 */
function renderMenu(items) {
    // Clear current grid
    menuGrid.innerHTML = '';
    
    // Add items to grid
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `menu-card`;
        card.style.animation = 'fadeInCard 0.4s ease-out forwards';
        
        card.innerHTML = `
            <div class="menu-img-container">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-price-action">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// --- Menu Filtering Logic ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button styles
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter the items based on data-filter attribute
        const filterValue = btn.getAttribute('data-filter');
        
        if (filterValue === 'all') {
            renderMenu(menuItems);
        } else {
            const filtered = menuItems.filter(item => item.category === filterValue);
            renderMenu(filtered);
        }
    });
});

// --- Cart Operations ---

/**
 * Adds an item to the cart. If the item exists, increments quantity.
 * @param {number} id - The ID of the menu item
 */
window.addToCart = function(id) {
    const item = menuItems.find(i => i.id === id);
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
    
    // Micro-animation for the cart icon to indicate addition
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Removes an item from the cart completely.
 * @param {number} id - The ID of the menu item to remove
 */
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

/**
 * Updates all cart-related DOM elements and persists data.
 */
function updateCart() {
    // Save to session storage to persist across reloads
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Calculate total quantity for the counter
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    
    // Hide or show counter based on items
    if (totalItems > 0) {
        cartCounter.style.display = 'flex';
    } else {
        cartCounter.style.display = 'none';
    }

    // Update Cart Sidebar Items display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    // Update Total Price display
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

// --- Modal Toggles ---

// Open Cart
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

// Close Cart (via button or overlay click)
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// --- Navigation Enhancements ---

// Navbar background shadow on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(250, 249, 246, 0.98)';
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(250, 249, 246, 0.95)';
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.05)';
    }
});

// Advanced smooth scrolling to account for fixed navbar height
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
