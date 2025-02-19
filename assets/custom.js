// document.addEventListener("DOMContentLoaded", function() {
//   document.querySelectorAll("form[action*='/cart/add']").forEach(form => {
//     form.addEventListener("submit", function() {
//       let timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
//       let hiddenField = form.querySelector("#added_at");
//       if (hiddenField) {
//         hiddenField.value = timestamp;
//       }
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", function() {
//   document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
//     form.addEventListener("submit", async function() {
//       const productId = form.querySelector('[name="id"]').value;
//       const response = await fetch('/api/track-product', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId, cartId: 'CART_ID' }), // Replace with actual cart ID
//       });
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", function() {
//   const checkoutButton = document.getElementById('checkout-button');
//   if (checkoutButton) {
//     checkoutButton.addEventListener('click', async function(event) {
//       event.preventDefault();

//       // Fetch the current cart token
//       const cartData = await fetch('/cart.js').then(res => res.json());
//       const cartToken = cartData.token;

//       // Check discount eligibility using the cart token
//       const response = await fetch('/api/apply-discount', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cartId: cartToken }),
//       });

//       const data = await response.json();
//       if (data.success && data.discountCode) {
//         window.location.href = `/checkout?discount=${data.discountCode}`;
//       } else {
//         window.location.href = '/checkout';
//       }
//     });
//   }
// });

// Function to apply ₹100 discount only if no other discount is present
function applyDiscount() {
  const autoDiscountCode = 'AUTO100'; // Default ₹100 discount code

  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const hasExistingDiscount = cart.cart_level_discount_applications.length > 0; // Check if any discount is already applied

      if (!hasExistingDiscount) {
        console.log("Applying ₹100 discount...");

        fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discount_code: autoDiscountCode }),
        })
          .then(response => response.json())
          .then(updatedCart => {
            console.log("₹100 discount applied successfully!");
            // Instead of reloading, update the cart UI dynamically
            updateCartDisplay();
          })
          .catch(error => console.error('Error applying discount:', error));
      } else {
        console.log("User already has a discount, skipping AUTO100.");
      }
    })
    .catch(error => console.error('Error fetching cart:', error));
}

// Function to update cart display without refreshing
function updateCartDisplay() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      // Find the cart total element and update it dynamically
      const cartTotalElement = document.querySelector('.cart-total-price');
      if (cartTotalElement) {
        cartTotalElement.innerText = `₹${(cart.total_price / 100).toFixed(2)}`;
      }
    })
    .catch(error => console.error('Error updating cart display:', error));
}

// Run the discount logic when the page loads
document.addEventListener('DOMContentLoaded', function() {
  applyDiscount();
});

// Run the discount logic when the cart is updated
document.addEventListener('click', function(event) {
  if (event.target.matches('.cart__update, .cart__checkout')) {
    setTimeout(applyDiscount, 1000); // Wait for the cart to update
  }
});

