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

// Card eventos 
document.addEventListener('DOMContentLoaded', function () {
    const eventos = [
        {
            id: 1,
            title: 'Semana do Software 2025',
            date: '12/05',
            time: '10:00',
            location: 'Salão de Eventos',
            type: 'tech',
            description: 'Uma semana inteira dedicada à tecnologia e inovação, com palestras, workshops e hackathons.',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400'
        },
        {
            id: 2,
            title: 'Workshop de IoT',
            date: '12/01',
            time: '08:00',
            location: 'Laboratório CS&I',
            type: 'tech',
            description: 'Workshop prático sobre Internet das Coisas e suas aplicações na indústria 4.0.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=400'
        },
        {
            id: 3,
            title: 'Festa dos Alunos 2025',
            date: '18/05',
            time: '19:00',
            location: 'Área Esportiva do Inatel',
            type: 'cultural',
            description: 'Venha comemorar a melhor Festa dos Alunos de todos os tempos!',
            image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=400'
        },
        {
            id: 4,
            title: 'Feira de Oportunidades',
            date: '04/05',
            time: '10:00',
            location: 'Salão de Eventos',
            type: 'academic',
            description: 'Venha conhecer empresas e projetos com destaque na área da engenharia.',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=400'
        }
    ];

    const carousel = document.querySelector('.carousel');
    let index = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 segundos
    
    // Função para criar um card
    function createCard(event) {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = event.image;
        img.alt = event.title;

        const info = document.createElement('div');
        info.className = 'info';

        const title = document.createElement('h3');
        title.textContent = event.title;

        const description = document.createElement('p');
        description.textContent = event.description;

        const details = document.createElement('p');
        details.innerHTML = `
            <span class="material-symbols-outlined icon">event</span> 
            ${event.date} 
            às 
            ${event.time}
            <span class="material-symbols-outlined icon">pin_drop</span> 
            ${event.location}`;

        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(details);
        card.appendChild(img);
        card.appendChild(info);

        return card;
    }

    // Adiciona os cards ao carrossel
    eventos.forEach(event => {
        const card = createCard(event);
        carousel.appendChild(card);
    });

    // Função para atualizar a posição do carrossel
    function updateCarousel() {
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }
    // Função para avançar para o próximo card
    function nextCard() {
        index = (index + 1) % eventos.length;
        updateCarousel();
    }
    // Função para voltar para o card anterior
    function prevCard() {
        index = (index - 1 + eventos.length) % eventos.length;
        updateCarousel();
    }

    // Função para iniciar o autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextCard, autoPlayDelay);
    }

    // Função para parar o autoplay
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Adicionando interatividade aos botões
    document.getElementById('nextBtn').addEventListener('click', () => {
        nextCard();
        // Reinicia o autoplay após interação manual
        stopAutoPlay();
        startAutoPlay();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        prevCard();
        // Reinicia o autoplay após interação manual
        stopAutoPlay();
        startAutoPlay();
    });

    // Controle de autoplay quando o mouse está sobre o carrossel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Arrastar no celular
    let startX;
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay(); // Pausa o autoplay durante o arraste
    });

    carousel.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextCard();
        if (endX - startX > 50) prevCard();
        startAutoPlay(); // Reinicia o autoplay após o arraste
    });

    // Inicialização
    createCard();
    startAutoPlay(); // Inicia o autoplay quando a página carrega


});