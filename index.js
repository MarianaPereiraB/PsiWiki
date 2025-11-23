// Ativando o Vue 3
const { createApp } = Vue;

createApp({
    mounted() {
        // Seleção de elementos
        const links = document.querySelectorAll('.figure-link');
        const contentDisplay = document.getElementById('content-display');
        const searchInput = document.getElementById('search-input');

       
        // FUNÇÃO: Carregar citação aleatória
       
        function fetchRandomQuote() {
            const quoteContainer = document.getElementById('quote-container');

            if (!quoteContainer) return;

            fetch('quotes.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Arquivo quotes.json não encontrado.');
                    }
                    return response.json();
                })
                .then(data => {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    const quoteData = data[randomIndex];

                    quoteContainer.innerHTML = `
                        <blockquote class="blockquote">
                            <p class="mb-0 fs-5">${quoteData.q}</p>
                            <footer class="blockquote-footer mt-2">${quoteData.a}</footer>
                        </blockquote>
                    `;
                })
                .catch(error => {
                    console.error("Erro ao carregar JSON:", error);
                    quoteContainer.innerHTML = `
                        <p class="text-danger">Erro ao carregar as citações.</p>
                    `;
                });
        }

        
        // EVENTO: Clique nas figuras da sidebar
       
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remover tela inicial
                const welcomeMessage = document.getElementById('welcome-message');
                if (welcomeMessage) welcomeMessage.remove();

                // Gerenciar destaque ativo
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Nome do arquivo a carregar
                const figureName = link.getAttribute('data-figure');
                const fileToLoad = `${figureName}-info.html`;

                // Requisição do conteúdo HTML
                fetch(fileToLoad)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Arquivo não encontrado: ${fileToLoad}`);
                        }
                        return response.text();
                    })
                    .then(htmlContent => {
                        contentDisplay.innerHTML = htmlContent;
                    })
                    .catch(error => {
                        console.error('Erro ao carregar conteúdo:', error);
                        contentDisplay.innerHTML = `
                            <div class="alert alert-warning" role="alert">
                                <h4>Conteúdo não disponível</h4>
                                <p>Não foi possível carregar **${fileToLoad}**.</p>
                            </div>
                        `;
                    });
            });
        });

        // -------------------------------------
        // EVENTO: Busca no campo de pesquisa
        // -------------------------------------
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const searchTerm = e.target.value.toLowerCase();

                links.forEach(link => {
                    const linkText = link.textContent.toLowerCase();
                    link.style.display = linkText.includes(searchTerm) ? 'block' : 'none';
                });
            });
        }

        // -------------------------------------
        // CHAMADA INICIAL: Citação do dia
        // -------------------------------------
        fetchRandomQuote();
    }
}).mount('#app');
