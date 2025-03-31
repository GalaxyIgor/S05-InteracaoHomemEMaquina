class AulasComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.hoje = "ter";
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch('aulas.json');
            const aulas = await response.json();
            this.render(aulas);
        } catch (error) {
            console.error('Erro ao carregar os dados das aulas:', error);
        }
    }

    getNotaColor(nota) {
        const notaNum = parseFloat(nota);
        if (notaNum < 6) return 'var(--nota-baixa)';
        if (notaNum < 8) return 'var(--nota-media)';
        return 'var(--nota-alta)';
    }

    render(aulas) {
        const aulasDia = aulas.filter(a => a.data === this.hoje);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles_componente.css'; 
        this.shadowRoot.appendChild(link); 
        
        this.shadowRoot.innerHTML += `
        <style>
            .comp-aula {
                background-color: var(--card-bg);
                padding: 15px;
                margin: 10px 0;
                border-radius: 10px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                color: var(--text-color);
            }
            .lable-nota {
                background-color: var(--nota-media);
            }
        </style>
        <div>
            ${aulasDia.map(a => {
                let provaDisplay = a.prova_alert ? '' : 'display: none;';
                const notaColor = this.getNotaColor(a.nota);
                return `
                <div class="comp-aula">
                    <div class="lable-prova p_lable" style="${provaDisplay}">
                        PROVA: <b>${a.prova}</b>
                    </div>
                    <div class="titulo_aula">
                        ${a.disciplina}
                    </div>
                    <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
                    <div class="lables">
                        <div class="lable-frequencia p_lable">
                            FALTAS: <b>${a.frequencia}</b>
                        </div>
                        <div class="lable-nota p_lable" style="background-color: ${notaColor}">
                            CR: <b>${a.nota}</b>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        `;
    }
}

customElements.define('aulas-component', AulasComponent);