class EventosComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.filtroAtivo = 'todos';
        this.eventos = [];
    }

    connectedCallback() {
        this.carregarEventos(); // Carrega eventos diretamente sem verificar permissão
    }

    async carregarEventos() {
        try {
            const response = await fetch('eventos.json');
            this.eventos = await response.json();
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
                .evento-card {
                    background-color: var(--card-color);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 10px;
                    color: var(--text-color);
                    transition: transform 0.2s ease;
                }
                
                .evento-card:hover {
                    transform: translateY(-3px);
                }
                
                .evento-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .badge {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    color: white;
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
                    gap: 8px;
                }
                
                .evento-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 8px;
                }
                
                .icon {
                    font-size: 18px;
                    vertical-align: middle;
                }
            </style>
            
            <div class="filtros">
                <button class="filtro-btn ${this.filtroAtivo === 'todos' ? 'ativo' : ''}" 
                        data-filtro="todos">Todos</button>
                <button class="filtro-btn ${this.filtroAtivo === 'milhas' ? 'ativo' : ''}" 
                        data-filtro="milhas">Apenas Milhas</button>
                <button class="filtro-btn ${this.filtroAtivo === 'horasAC' ? 'ativo' : ''}" 
                        data-filtro="horasAC">Apenas Horas AC</button>
                <button class="filtro-btn ${this.filtroAtivo === 'horasCP' ? 'ativo' : ''}" 
                        data-filtro="horasCP">Apenas Horas CP</button>
                <button class="filtro-btn ${this.filtroAtivo === 'tech' ? 'ativo' : ''}" 
                        data-filtro="tech">Tech</button>
                <button class="filtro-btn ${this.filtroAtivo === 'workshop' ? 'ativo' : ''}" 
                        data-filtro="workshop">Workshops</button>
            </div>
            
            <div>
                ${eventosFiltrados.map(evento => `
                    <div class="evento-card">
                        <div class="evento-header">
                            <h3>${evento.title}</h3>
                            <div class="evento-horas">
                                ${evento.horasAC > 0 ? `<span class="badge horas-ac">${evento.horasAC}h AC</span>` : ''}
                                ${evento.horasCP > 0 ? `<span class="badge horas-cp">${evento.horasCP}h CP</span>` : ''}
                                ${evento.milhas > 0 ? `<span class="badge milhas">${evento.milhas} milhas</span>` : ''}
                            </div>
                        </div>
                        <p>${evento.description}</p>
                        <div class="evento-info">
                            <span class="material-symbols-outlined icon">event</span>
                            <span>${evento.date} às ${evento.time}</span>
                            <span class="material-symbols-outlined icon">pin_drop</span>
                            <span>${evento.location}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.aplicarFiltro(btn.dataset.filtro);
            });
        });
    }
}

customElements.define('eventos-component', EventosComponent);