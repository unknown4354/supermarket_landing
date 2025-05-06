// Cart functionality
document.addEventListener("DOMContentLoaded", function() {
  // Initialize theme
  initTheme();

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Update cart display
  function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("cart-subtotal");
    const taxElement = document.getElementById("cart-tax");
    const totalElement = document.getElementById("cart-total");

    // Clear current cart display
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                    <a href="index.html" class="inline-block mt-4 text-green-600 dark:text-green-400 hover:underline">
                        Continue Shopping
                    </a>
                </div>
            `;
      return;
    }

    // Calculate totals
    let subtotal = 0;

    // Display each cart item
    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;

      const itemElement = document.createElement("div");
      itemElement.className =
        "flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0";
      itemElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${item.name}</h3>
                        <p class="text-gray-600 dark:text-gray-400">₹${item.price.toFixed(
                          2
                        )}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button class="quantity-btn decrease px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity text-lg font-semibold text-gray-800 dark:text-white">${item.quantity}</span>
                        <button class="quantity-btn increase px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item text-red-600 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
      cartItemsContainer.appendChild(itemElement);
    });

    // Calculate tax and total
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Update summary
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Event delegation for cart item buttons
  document.getElementById("cart-items").addEventListener("click", function(e) {
    const button = e.target.closest("button");
    const index = button ? button.dataset.index : undefined;
    if (index === undefined) return;

    if (e.target.closest(".decrease")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCartDisplay();
        updateCartCount();
      }
    } else if (e.target.closest(".increase")) {
      cart[index].quantity++;
      updateCartDisplay();
      updateCartCount();
    } else if (e.target.closest(".remove-item")) {
      cart.splice(index, 1);
      updateCartDisplay();
      updateCartCount();
    }
  });

  // Checkout button handler
  document
    .getElementById("checkout-button")
    .addEventListener("click", function() {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      // Here you would typically redirect to a checkout page
      alert("Proceeding to checkout...");
    });

  // Initial cart display
  updateCartDisplay();
});

// Theme initialization and toggle
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Apply theme based on preference
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      document.documentElement.classList.remove("dark");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  // Toggle theme function
  function toggleTheme() {
    if (document.documentElement.classList.contains("dark")) {
      // Switch to light theme
      applyTheme(false);
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark theme
      applyTheme(true);
      localStorage.setItem("theme", "dark");
    }
  }

  // Check for saved theme preference or use user's system preference
  const prefersDark =
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  applyTheme(prefersDark);

  // Theme toggle click handler
  themeToggle.addEventListener("click", toggleTheme);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", e => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches);
      }
    });
}
