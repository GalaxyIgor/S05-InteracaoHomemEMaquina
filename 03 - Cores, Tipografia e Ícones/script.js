window.onload = function () {
    // Recupera o tema salvo no localStorage, se existir
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Exibe o menu de temas ao clicar no ícone de menu
    document.getElementById('menu-Brightness-item').addEventListener('click', function () {
        const themeMenu = document.getElementById('theme-menu');
        // Alterna a classe show para mostrar ou esconder o menu
        themeMenu.classList.toggle('show');
    });
};

// Função para mudar o tema
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Salva o tema escolhido no localStorage
    localStorage.setItem('theme', theme);
}
