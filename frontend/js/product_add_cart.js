function addToCart(productName, productPrice, productImg, productId) {
    // Get the cart from localStorage (or an empty array if it doesn't exist)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // If the product exists, increase the quantity
        existingProduct.quantity++;
    } else {
        // Otherwise, add a new product to the cart
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            img: productImg,
            quantity: 1
        });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optional: Show a message or update the UI (e.g., Cart icon or message)
    alert(`${productName} added to cart!`);
}
