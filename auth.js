// 🚀 Register User
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("registerName").value.trim();
    let email = document.getElementById("registerEmail").value.trim();
    let password = document.getElementById("registerPassword").value;

    if (localStorage.getItem(email)) {
        document.getElementById("registerError").textContent = "⚠ Email already registered!";
        return;
    }

    localStorage.setItem(email, JSON.stringify({ name, password }));
    alert("🎉 Registration successful! Please log in.");
    window.location.href = "login.html";
});

// 🚀 Login User
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;
    let userData = localStorage.getItem(email);

    if (!userData) {
        document.getElementById("loginError").textContent = "⚠ Email not found!";
        return;
    }

    let user = JSON.parse(userData);
    if (user.password !== password) {
        document.getElementById("loginError").textContent = "⚠ Incorrect password!";
        return;
    }

    sessionStorage.setItem("loggedInUser", email);
    alert(`🎉 Welcome, ${user.name}!`);
    window.location.href = "Home.html"; // Redirect to main app
});

// 🚀 Check if User is Logged In
function checkAuth() {
    if (!sessionStorage.getItem("loggedInUser")) {
        window.location.href = "login.html";
    }
}

// ✅ Logout Function (Fix)
function logout() {
    sessionStorage.removeItem("loggedInUser"); // Remove session data
    alert("🚪 Logged out successfully! Redirecting to login...");
    window.location.href = "login.html"; // Redirect to login page
}

// ✅ Ensure User is Logged In
function checkAuth() {
    if (!sessionStorage.getItem("loggedInUser")) {
        alert("⚠ You must be logged in to access this page!");
        window.location.href = "login.html"; // Redirect if not logged in
    }
}

// ✅ Run `checkAuth()` on protected pages like `index.html`
window.onload = function () {
    if (window.location.pathname.includes("Home.html")) {
        checkAuth();
    }
};
