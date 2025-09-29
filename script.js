document.addEventListener('DOMContentLoaded', () => {
    const listaPeladasContainer = document.getElementById('lista-peladas');
    const filtroCidadeInput = document.getElementById('filtroCidade');
    const loadingSpinner = document.getElementById('loading');
    
    // IMPORTANTE: Substitua pela URL real do seu Apps Script
    const API_URL = 'https://script.google.com/macros/s/AKfycby-0AySLNjArdTm8A3cdFGhQ36xeQBI2CbGXKICHwxOsCF2TR_qFqMCbqaBtikR0jGyXw/exec'; 

    let todasAsPeladas = []; // Armazena os dados para filtrar localmente

    async function fetchPeladas() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados.');
            }
            const data = await response.json();
            todasAsPeladas = data;
            renderPeladas(todasAsPeladas);
        } catch (error) {
            listaPeladasContainer.innerHTML = '<p>Não foi possível carregar as peladas. Tente novamente mais tarde.</p>';
            console.error('Erro:', error);
        } finally {
            loadingSpinner.style.display = 'none'; // Esconde o spinner
        }
    }

    function renderPeladas(peladas) {
        listaPeladasContainer.innerHTML = ''; // Limpa a lista
        if (peladas.length === 0) {
            listaPeladasContainer.innerHTML = '<p>Nenhuma pelada encontrada com este filtro.</p>';
            return;
        }

        peladas.forEach(pelada => {
            const card = document.createElement('div');
            card.className = 'pelada-card';

            // Formata o contato para ser um link clicável (ex: WhatsApp)
            let contatoLink = `mailto:${pelada['Contato do Organizador']}`;
            if (pelada['Contato do Organizador'].match(/^\d+$/)) { // Se for só números, assume que é WhatsApp
                contatoLink = `https://wa.me/${pelada['Contato do Organizador']}`;
            }

            card.innerHTML = `
                <div class="pelada-info">
                    <h2>${pelada['Nome da Pelada']}</h2>
                    <p class="localizacao">📍 ${pelada['Cidade']}</p>
                    <p class="data-hora">🗓️ ${pelada['Data da Pelada']} - 🕖 ${pelada['Hora da Pelada']}</p>
                    ${pelada['Detalhes Adicionais'] ? `<p>${pelada['Detalhes Adicionais']}</p>` : ''}
                </div>
                <div class="pelada-contato">
                    <a href="${contatoLink}" target="_blank" class="btn-contato">Contactar</a>
                </div>
            `;
            listaPeladasContainer.appendChild(card);
        });
    }

    filtroCidadeInput.addEventListener('keyup', () => {
        const termoBusca = filtroCidadeInput.value.toLowerCase();
        const peladasFiltradas = todasAsPeladas.filter(pelada => 
            pelada['Cidade'].toLowerCase().includes(termoBusca)
        );
        renderPeladas(peladasFiltradas);
    });

    // Inicia o processo
    fetchPeladas();
});