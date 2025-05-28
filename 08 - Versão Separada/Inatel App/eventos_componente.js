class EventosComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.filtroAtivo = 'todos';
        this.eventos = [];
        this.eventosComprados = new Set();
        this.eventoAtual = null;
    }

    connectedCallback() {
        this.carregarEventos();
    }

    async carregarEventos() {
        try {
            const response = await fetch('eventos.json');
            this.eventos = await response.json();
            
            // Carrega eventos comprados do localStorage
            const comprados = localStorage.getItem('eventosComprados');
            if (comprados) {
                this.eventosComprados = new Set(JSON.parse(comprados));
            }
            
            this.render();
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.shadowRoot.innerHTML = `<p>Erro ao carregar eventos</p>`;
        }
    }

    aplicarFiltro(tipo) {
        this.filtroAtivo = tipo;
        this.render();
    }

    mostrarModal(evento) {
        this.eventoAtual = evento;
        const modal = this.shadowRoot.getElementById('evento-modal');
        const modalImage = this.shadowRoot.getElementById('modal-image');
        const modalTitle = this.shadowRoot.getElementById('modal-title');
        const modalDescription = this.shadowRoot.getElementById('modal-description');
        const modalDate = this.shadowRoot.getElementById('modal-date');
        const modalTime = this.shadowRoot.getElementById('modal-time');
        const modalLocation = this.shadowRoot.getElementById('modal-location');
        const modalBadges = this.shadowRoot.getElementById('modal-badges');
        const modalMilhas = this.shadowRoot.getElementById('modal-milhas');
        const modalMilhasContainer = this.shadowRoot.getElementById('modal-milhas-container');
        const comprarBtn = this.shadowRoot.getElementById('comprar-btn');

        // Preenche os dados do modal
        modalTitle.textContent = evento.title;
        modalDescription.textContent = evento.description;
        modalDate.textContent = evento.date;
        modalTime.textContent = evento.time;
        modalLocation.textContent = evento.location;

        // Atualiza o botão de compra
        if (comprarBtn) {
            comprarBtn.textContent = this.eventosComprados.has(evento.id) ? 'Ingresso Comprado' : 'Comprar Ingresso';
            comprarBtn.disabled = this.eventosComprados.has(evento.id);
        }

        // Configura a imagem (se existir)
        if (evento.image) {
            modalImage.src = evento.image;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }

        // Configura as badges (horas AC, CP e milhas)
        modalBadges.innerHTML = '';
        if (evento.horasAC > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge horas-ac';
            badge.textContent = `${evento.horasAC}h AC`;
            modalBadges.appendChild(badge);
        }
        if (evento.horasCP > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge horas-cp';
            badge.textContent = `${evento.horasCP}h CP`;
            modalBadges.appendChild(badge);
        }

        // Configura as milhas (se existirem)
        if (evento.milhas > 0) {
            modalMilhas.textContent = `${evento.milhas} milhas`;
            modalMilhasContainer.style.display = 'flex';
        } else {
            modalMilhasContainer.style.display = 'none';
        }

        // Mostra o modal
        modal.classList.remove('hidden');
    }

    fecharModal() {
        const modal = this.shadowRoot.getElementById('evento-modal');
        modal.classList.add('hidden');
    }

    mostrarConfirmacaoCompra() {
        const confirmacao = this.shadowRoot.getElementById('confirmacao-compra');
        confirmacao.classList.remove('hidden');
        
        setTimeout(() => {
            confirmacao.classList.add('hidden');
        }, 3000);
    }

    comprarIngresso(eventoId) {
        this.eventosComprados.add(eventoId);
        localStorage.setItem('eventosComprados', JSON.stringify([...this.eventosComprados]));
        this.mostrarConfirmacaoCompra();
        this.fecharModal();
        this.render();
    }

    render() {
        const eventosFiltrados = this.filtroAtivo === 'todos' 
            ? this.eventos 
            : this.eventos.filter(e => {
                if (this.filtroAtivo === 'milhas') return e.milhas > 0;
                if (this.filtroAtivo === 'horasAC') return e.horasAC > 0;
                if (this.filtroAtivo === 'horasCP') return e.horasCP > 0;
                return e.tipo === this.filtroAtivo;
            });

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 18px;
                    display: inline-block;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    white-space: nowrap;
                    direction: ltr;
                    -webkit-font-feature-settings: 'liga';
                    -webkit-font-smoothing: antialiased;
                }

                .evento-card {
                    background-color: var(--card-color);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 10px;
                    color: var(--text-color);
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }

                .evento-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .evento-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 10px;
                }

                .evento-title-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    flex: 1;
                }

                .badge {
                    font-size: 14px;
                    padding: 2px 8px;
                    border-radius: 50px;
                    color: white;
                    background-color: gray;
                    display: inline-block;
                    line-height: 1;
                    vertical-align: middle;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .badge-comprado {
                    background-color: var(--nota-alta);
                    color: white;
                    padding: 3px 8px;
                    border-radius: 50px;
                    font-size: 12px;
                    display: inline-block;
                }

                .horas-ac { background-color: var(--nota-alta); }
                .horas-cp { background-color: var(--nota-media); }
                .milhas { background-color: var(--nota-baixa); }

                .filtros {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                }

                .filtro-btn {
                    background: var(--card-color);
                    border: none;
                    padding: 8px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    color: var(--text-color);
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .filtro-btn.ativo {
                    background: var(--primary-color);
                    color: white;
                }

                .evento-horas {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                .evento-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 8px;
                    flex-wrap: wrap;
                }

                /* Modal styles */
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .modal.hidden {
                    display: none;
                }

                .modal-content {
                    background-color: var(--card-color);
                    padding: 20px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    color: var(--text-color);
                    position: relative;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .modal-image {
                    width: 100%;
                    max-height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }

                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    color: var(--text-color);
                    font-size: 24px;
                }

                .close-btn:hover {
                    color: var(--nota-baixa);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: var(--text-color);
                }

                .modal-badges {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                }

                .modal-info {
                    margin-top: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .modal-info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 5px 0;
                }

                .modal-info-item .material-symbols-outlined {
                    font-size: 20px;
                }

                /* Estilo para o botão de comprar */
                .comprar-btn {
                    background-color: var(--nota-alta);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s;
                    width: 100%;
                }

                .comprar-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .comprar-btn:hover:not(:disabled) {
                    background-color: var(--primary-color);
                }

                /* Estilo para a confirmação de compra */
                .confirmacao-compra {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--nota-alta);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .confirmacao-compra.hidden {
                    display: none;
                }

                .confirmacao-compra .material-symbols-outlined {
                    font-size: 24px;
                }
            </style>
            
            <div class="filtros">
                <button class="filtro-btn ${this.filtroAtivo === 'todos' ? 'ativo' : ''}" data-filtro="todos">Todos</button>
                <button class="filtro-btn ${this.filtroAtivo === 'milhas' ? 'ativo' : ''}" data-filtro="milhas">Apenas Milhas</button>
                <button class="filtro-btn ${this.filtroAtivo === 'horasAC' ? 'ativo' : ''}" data-filtro="horasAC">Apenas Horas AC</button>
                <button class="filtro-btn ${this.filtroAtivo === 'horasCP' ? 'ativo' : ''}" data-filtro="horasCP">Apenas Horas CP</button>
                <button class="filtro-btn ${this.filtroAtivo === 'tech' ? 'ativo' : ''}" data-filtro="tech">Tech</button>
                <button class="filtro-btn ${this.filtroAtivo === 'workshop' ? 'ativo' : ''}" data-filtro="workshop">Workshops</button>
            </div>
            
            <div id="eventos-container">
                ${eventosFiltrados.map(evento => `
                    <div class="evento-card" data-id="${evento.id}">
                        <div class="evento-header">
                            <div class="evento-title-container">
                                <h3>${evento.title}</h3>
                                ${this.eventosComprados.has(evento.id) ? 
                                    `<span class="badge-comprado">Comprado</span>` : ''}
                            </div>
                            <div class="evento-horas">
                                ${evento.horasAC > 0 ? `<span class="badge horas-ac">${evento.horasAC}h AC</span>` : ''}
                                ${evento.horasCP > 0 ? `<span class="badge horas-cp">${evento.horasCP}h CP</span>` : ''}
                                ${evento.milhas > 0 ? `<span class="badge milhas">${evento.milhas} milhas</span>` : ''}
                            </div>
                        </div>
                        <p>${evento.description}</p>
                        <div class="evento-info">
                            <span class="material-symbols-outlined">event</span>
                            <span>${evento.date} às ${evento.time}</span>
                            <span class="material-symbols-outlined">pin_drop</span>
                            <span>${evento.location}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Modal -->
            <div id="evento-modal" class="modal hidden">
                <div class="modal-content">
                    <button class="close-btn">&times;</button>
                    <img id="modal-image" class="modal-image" src="" alt="Imagem do Evento">
                    <div class="modal-header">
                        <h2 id="modal-title"></h2>
                        <div class="modal-badges" id="modal-badges"></div>
                    </div>
                    <p id="modal-description"></p>
                    <div class="modal-info">
                        <div class="modal-info-item">
                            <span class="material-symbols-outlined">event</span>
                            <span id="modal-date"></span>
                        </div>
                        <div class="modal-info-item">
                            <span class="material-symbols-outlined">schedule</span>
                            <span id="modal-time"></span>
                        </div>
                        <div class="modal-info-item">
                            <span class="material-symbols-outlined">pin_drop</span>
                            <span id="modal-location"></span>
                        </div>
                        <div class="modal-info-item" id="modal-milhas-container" style="display: none;">
                            <span class="material-symbols-outlined">directions_bus</span>
                            <span id="modal-milhas"></span>
                        </div>
                    </div>
                    <button id="comprar-btn" class="comprar-btn">
                        ${this.eventosComprados.has(this.eventoAtual?.id) ? 'Ingresso Comprado' : 'Comprar Ingresso'}
                    </button>
                </div>
            </div>

            <!-- Confirmação de compra -->
            <div id="confirmacao-compra" class="confirmacao-compra hidden">
                <span class="material-symbols-outlined">check_circle</span>
                <span>Compra realizada com sucesso!</span>
            </div>
        `;

        // Adiciona os event listeners para os filtros
        this.shadowRoot.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.aplicarFiltro(btn.dataset.filtro);
            });
        });

        // Adiciona os event listeners para os cards de evento
        this.shadowRoot.querySelectorAll('.evento-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventoId = parseInt(card.dataset.id);
                const evento = this.eventos.find(e => e.id === eventoId);
                this.mostrarModal(evento);
            });
        });

        // Adiciona event listeners para fechar o modal
        const closeBtn = this.shadowRoot.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            this.fecharModal();
        });

        const modal = this.shadowRoot.getElementById('evento-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.fecharModal();
            }
        });

        // Adiciona event listener para o botão de comprar
        const comprarBtn = this.shadowRoot.getElementById('comprar-btn');
        if (comprarBtn) {
            comprarBtn.addEventListener('click', () => {
                if (this.eventoAtual && !this.eventosComprados.has(this.eventoAtual.id)) {
                    this.comprarIngresso(this.eventoAtual.id);
                }
            });
        }
    }
}

customElements.define('eventos-component', EventosComponent);