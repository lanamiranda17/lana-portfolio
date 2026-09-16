// Seleciona elementos
var root = document.documentElement;
var btn = document.getElementById("themeToggle");
var menuButton = document.getElementById("menuToggle");
var navigation = document.getElementById("navContent");
var year = document.getElementById("year");

// Atualiza o ano exibido no rodapé
if (year) {
    year.textContent = new Date().getFullYear();
}

// Função para aplicar o tema
function applyTheme(theme) {
    // Define a classe de tema usada pelo Tailwind
    root.classList.toggle("dark", theme === "dark");
    // Salva no localStorage
    localStorage.setItem("theme", theme);
    // Se o botão existir, atualiza o ícone
    if (btn) {
        if (theme === "dark") {
            btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }
}

// Verifica se já existe tema salvo
var savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme("light");
}

// Evento de clique no botão de tema
if (btn) {
    btn.addEventListener("click", function () {
        var currentTheme = root.classList.contains("dark") ? "dark" : "light";
        if (currentTheme === "light") {
            applyTheme("dark");
        } else {
            applyTheme("light");
        }
    });
}

// Evento do menu em telas pequenas
if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        var isOpen = !navigation.classList.contains("hidden");
        navigation.classList.toggle("hidden", isOpen);
        menuButton.setAttribute("aria-expanded", String(!isOpen));
    });
}
