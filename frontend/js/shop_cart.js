let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");
  const savingsMessage = document.getElementById("savings-message");

  let totalPrice = 0;
  let totalSavings = 0;

  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p class='text-center'>Your cart is empty!</p>";
  } else {
    cart.forEach((item) => {
      const itemPrice = parseFloat(item.price) || 0; // Ensure price is valid
      const itemQuantity = parseInt(item.quantity) || 1; // Ensure quantity is valid
      const itemTotalPrice = itemPrice * itemQuantity; // Calculate item total

      const listItem = document.createElement("li");
      listItem.className = "cart-list-item";
      listItem.innerHTML = `
        <span class="product-name">${item.name || "Unnamed Product"}</span>
        <span>₹${itemTotalPrice}</span>
        <input 
          type="number" 
          value="${itemQuantity}" 
          min="1" 
          onchange="updateQuantity('${item.name}', this.value)" 
        />
        <button onclick="removeFromCart('${item.name}')">
          <i class="fas fa-trash"></i>
        </button>
      `;
      cartList.appendChild(listItem);

      totalPrice += itemTotalPrice; // Add to total price
      totalSavings += ((item.originalPrice || 0) - itemPrice) * itemQuantity; // Add to savings
    });
  }

  // Update the total price and savings
  totalPriceElement.innerText = `Total: ₹${totalPrice}`;
  savingsMessage.innerText = totalSavings > 0 ? `You saved ₹${totalSavings}!` : "";
}

function removeInvalidItems() {
  // Filter out any items where the name or price is "545"
  cart = cart.filter(item => item.name !== "545" && item.price !== 545);

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh the cart display
  displayCart();
}

// Call this function after loading the cart
window.onload = function () {
  removeInvalidItems();
  displayCart();
};

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function updateQuantity(productName, quantity) {
  const item = cart.find((item) => item.name === productName);
  if (item) {
    item.quantity = parseInt(quantity) || 1; // Ensure quantity is a valid number
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }
}

function checkoutCOD() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Proceeding with Cash on Delivery.");
  }
}

window.onload = displayCart;
