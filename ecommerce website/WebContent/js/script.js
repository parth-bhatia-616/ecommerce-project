// Validate registration form
function validateRegistration() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (name === "" || email === "" || phone === "" || password === "" || confirmPassword === "") {
        alert("All fields are required!");
        return false;
    }

    // Name: only letters and spaces
    if (!/^[A-Za-z ]+$/.test(name)) {
        alert("Name must contain only letters and spaces!");
        return false;
    }

    // Email: basic validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return false;
    }

    // Phone: exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits!");
        return false;
    }

    // Password: at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least 1 uppercase letter!");
        return false;
    }

    // Confirm password: must match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    return true;
}

// Validate login form
function validateLogin() {
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Email and password are required!");
        return false;
    }

    return true;
}
