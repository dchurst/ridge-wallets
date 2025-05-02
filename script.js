"use strict";

// Dark Mode Toggling Event Listener
// Waits for page to load before running
document.addEventListener("DOMContentLoaded", () => {
    // Finds the button used for toggling between light and dark mode
    const themeIcon = document.getElementById("theme-icon");
    // Grabs the body element to change it's class 
    const body = document.body;
    // If user saves dark mode it will automatically turn on when the page loads
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }
    // Runs theme based on user clicks
    themeIcon.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        // Saves the mode based on what the user clicks
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});

// Cost Calculator //
// Waits on page to load before running Cost Calculator 
document.addEventListener("DOMContentLoaded", () => {
    // Object that tracks all items in the cart along with setting the Tax rate and shipping costs
    const cart = {
        items: [],
        taxRate: 0.085,
        shipping: 5.00,
    };
    // Selects all the product sections where items can be added or removed from the cart
    const productSections = document.querySelectorAll("#product-display section");
    // Displays the subtotal of the cart
    const subTotalElement = document.querySelector("#your-cart p:nth-of-type(1) span");
    // Displays the total, including tax and shipping
    const cartTotalElement = document.querySelector("#your-cart p:nth-of-type(4) span");
    // Button users click to finish purchase
    const checkoutButton = document.querySelector(".checkout-button");
    // Heading of cart section, used to reference to add cart items
    const cartHeading = document.querySelector("#your-cart h3");
     // Function that calculates the subtotal, tax, and total
    const calculateTotals = () => {
        const subTotal = cart.items.reduce((total, item) => total + item.price, 0);
        const tax = subTotal * cart.taxRate;
        const total = subTotal + tax + (subTotal > 0 ? cart.shipping : 0);
        // Updates the page to show the new subtotal
        subTotalElement.textContent = `$${subTotal.toFixed(2)}`;
        // Updates the page to show the total amount
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    };

    // Updates the display whenever items are added or removed from cart
    const renderCartItems = () => {
        // Clears the current list of cart items before updating
        const existingItems = cartHeading.parentElement.querySelectorAll(".cart-item");
        existingItems.forEach(item => item.remove());

        // Creates a new div for each item in the cart
        cart.items.forEach(item => {
            const cartItem = document.createElement("div");
            // Creates a new class in order to style cart items
            cartItem.classList.add("cart-item");
            // Cart item styles
            cartItem.style.borderBottom = "1px solid #212529"; 
            cartItem.style.padding = "1px";
            cartItem.style.margin = "5px 0";
            // Fills the new cart item with the product name and price
            cartItem.innerHTML = `
                <h4 style="font-size: 1rem;">${item.name}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
            `;
            // Adds the new cart item below the cart h3
            cartHeading.insertAdjacentElement("afterend", cartItem);
        });
    };
    // Adds the product to the cart array while updating display
    const addToCart = (product) => {
        cart.items.push(product);
        renderCartItems();
        calculateTotals();
    };
    // Removes product from cart by filtering the matching name
    const removeFromCart = (productName) => {
        cart.items = cart.items.filter(item => item.name !== productName);
        renderCartItems();
        calculateTotals();
    };
    // Function triggered when checkbox for product is checked or unchecked
    const handleCartToggle = (event) => {
        const checkbox = event.target;
        // Finds closest <section> to checkbox
        const productSection = checkbox.closest("section");
        // Gets products name and price from section
        const productName = productSection.querySelector("h4").textContent;
        const productPrice = parseFloat(productSection.querySelector("p:nth-of-type(2)").textContent.replace("$", ""));
        // Adds product to cart if the checkbox is checked
        if (checkbox.checked) {
            addToCart({ name: productName, price: productPrice });
            // Removes the product if the checkbox is unchecked
        } else {
            removeFromCart(productName);
        }
    };
    // Displays message with the total cost
    const checkout = () => {
        const subTotal = cart.items.reduce((total, item) => total + item.price, 0);
        // Prevents checkout if there are no items in cart
        if (subTotal === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

        const tax = subTotal * cart.taxRate;
        const total = subTotal + tax + cart.shipping;
        // Confirmation message with the final total
        alert(`Thank you for your order! Your total is $${total.toFixed(2)}.`);
        // Clears cart and updates the display
        cart.items = [];
        renderCartItems();
        calculateTotals();
        // Unchecks product checkboxes after checkout
        document.querySelectorAll(".addtocart").forEach(checkbox => {
            checkbox.checked = false;
        });
    };
    // Event listeners for product checkboxes
    productSections.forEach(section => {
        const checkbox = section.querySelector(".addtocart");
        checkbox.addEventListener("change", handleCartToggle);
    });
    // Event listener for checkout button
    checkoutButton.addEventListener("click", checkout);
    // Initializes the cart totals
    calculateTotals();
});

// Form Validation //
// Ensures the code runs after page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // References to form inputs that require validation
    const form = document.querySelector("#form form");
    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");
    const contactMethod = document.getElementsByName("contact-method");
    // Array of required fields 
    const requiredFields = [fullName, email, phone, message];
    // Tracks displayed error messages so they can be cleared
    const errorMessages = {};
    // Checks if email is valid using expression
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    // Checks if phone number is valid and contains 10 digits using expression
    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };
    // Removes error messages displayed
    const clearErrors = () => {
        Object.values(errorMessages).forEach(error => error.remove());
        Object.keys(errorMessages).forEach(key => delete errorMessages[key]);
    };
    // Adds error message below input
    const showError = (input, message) => {
        // Avoids showing duplicate error messages for same field
        if (errorMessages[input.id]) return;
        // Creates span element for error messages and styles it
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = message;
        error.style.color = "red";
        error.style.fontSize = "0.9rem";
        // Inserts error message right next to input field
        input.parentElement.insertBefore(error, input);
         // Tracks error message in order to remove it
        errorMessages[input.id] = error;
    };
    // Function that checks if the form inputs are valid
    const validateForm = () => {
        // Clears previous error messages before validating
        clearErrors();
        // Starts by assuming form is valid
        let isValid = true;
        // Loops through all fields that are required
        requiredFields.forEach(field => {
            // Checks if field is empty
            if (!field.value.trim()) {
                // Message displaying when empty field is found
                showError(field, `${field.name || "This field"} is required.`);
                // Marks form as invalid
                isValid = false;
            }
        });
        // Finds the preferred contact method
        const selectedMethod = Array.from(contactMethod).find(radio => radio.checked);
        // Error message if no preferred contact method was selected
        if (!selectedMethod) {
            showError(contactMethod[0].parentElement, "Please select a contact method.");
            isValid = false;
            // Error message if user selected email but entered an invalid email address
        } else if (selectedMethod.value === "email" && !validateEmail(email.value)) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
            // Error message if user selected phone but entered an invalid phone number
        } else if (selectedMethod.value === "phone" && !validatePhone(phone.value)) {
            showError(phone, "Please enter a valid 10-digit phone number.");
            isValid = false;
        }
        // Returns true when form is valid, false if form is invalid
        return isValid;
    };
    // Function that resets all form fields and clears any error messages
    const resetForm = () => {
        form.reset();
        clearErrors();
    };
    // Function that shows success message when form is submitted correctly
    const displaySuccessMessage = (customer) => {
        // Creates new paragraph element to display success message
        const successMessage = document.createElement("p");
        // Creates class used to style the success message
        successMessage.className = "success-message";
        successMessage.style.color = "green";
        // Success message that displays with customer details
        successMessage.textContent = `Thank you, ${customer.fullName}! We have received your message: "${customer.message}". We will contact you via ${customer.preferredContactMethod} at ${customer.preferredContactValue}.`;
        form.parentElement.appendChild(successMessage);
        // Removes success message after 10 seconds
        setTimeout(() => successMessage.remove(), 10000);
    };

    // Function that runs when form is submitted
    form.addEventListener("submit", (event) => {
        // Prevents web page from reloading after form submission
        event.preventDefault();
        // Checks if form is valid
        if (validateForm()) {
            // Finds preferred contact method
            const selectedMethod = Array.from(contactMethod).find(radio => radio.checked);
            // Customer object containing the users form input
            const customer = {
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                message: message.value.trim(),
                preferredContactMethod: selectedMethod.value,
                preferredContactValue: selectedMethod.value === "email" ? email.value : phone.value,
            };
            // Shows success message with customer details
            displaySuccessMessage(customer);
            // Clears form after success message is displayed
            resetForm();
        }
    });
});