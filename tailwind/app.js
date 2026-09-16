// Personalizei isso: alternância de tema e navegação mobile sem dependências adicionais
var root = document.documentElement;
var themeButton = document.getElementById("themeToggle");
var menuButton = document.getElementById("menuToggle");
var navigation = document.getElementById("navContent");
var year = document.getElementById("year");

function applyTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    if (themeButton) {
        themeButton.innerHTML = theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }
}

applyTheme(localStorage.getItem("theme") || "light");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        applyTheme(root.classList.contains("dark") ? "light" : "dark");
    });
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        var isOpen = !navigation.classList.contains("hidden");
        navigation.classList.toggle("hidden", isOpen);
        menuButton.setAttribute("aria-expanded", String(!isOpen));
    });
}

if (year) {
    year.textContent = new Date().getFullYear();
}
