document.addEventListener('DOMContentLoaded', async () => {
    // Acessa o valor da URL da API
    //console.log(window.config.apiUrl);
    const API_URL = `${window.config.apiUrl}/list/atividade`;    
    const token = localStorage.getItem('sc-authToken');
    //console.log(token);

    if (token) {
        localStorage.setItem('sc-authToken', token);
        //console.log('Autenticado com sucesso - 1:', token);
    } else {
        console.error('Token não encontrado na resposta da API.');
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();

        if (response.ok) {
            const infosContainer = document.querySelector('.list-vistoria');
            
            // Limpa o conteúdo atual de ".infos" antes de adicionar novos itens
            infosContainer.innerHTML = '';

            // Itera sobre cada item de "atividade" e insere os dados no HTML
            data.atividade.forEach(item => {       
                const activityHtml = `
                  <div class="post-list">
                    <div class="link post-horizontal">
                   <a href="/lista-itens/?id=${item.id}">

                    <div class="infos">
                        <div class="post-category">${item.cliente}</div>
                        <div class="post-title">${item.site}</div>
                     
                    <div class="post-data">
                        <span class="badge color-dark">${item.dt_criacao || 'Data não disponível'}</span>
                    </div>
                  </div>
                  </div>  
                `;

                // Adiciona cada bloco de atividade ao contêiner ".infos"
                infosContainer.innerHTML += activityHtml;
            });

        } else {
            console.log(data.message || 'Erro ao buscar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        console.log('Erro ao conectar com o servidor');
    }
});

$$(document).on("page:init", '.page[data-name="nova-vistoria"]', function () {
    console.log("Página de Vistoria Carregada");
    const API_URL = `${window.config.apiUrl}/add/atividade`;
    const token = localStorage.getItem('sc-authToken');

    if (token) {
        console.log('Autenticado com sucesso:');
    } else {
        console.error('Token não encontrado.');
        return;
    }

    // Seleciona a div de feedback
    const feedbackMessage = $$('#feedbackMessage');

    // Função para capturar e enviar os dados ao endpoint
    $$('#NovaVistoriaForm').on('submit', function (e) {
        e.preventDefault();  // Evita o recarregamento da página

        const cliente = $$('#cliente').val();
        const site = $$('#site').val();
        const usuario_id = "1"; // Id do usuário, ajustar conforme necessário

        const data = {
            cliente: cliente,
            site: site,
            usuario_id: usuario_id
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        
        .then(response => response.json())
        .then(data => {
            feedbackMessage.text('Vistoria cadastrada com sucesso!');
            feedbackMessage.css('color', 'green');
            feedbackMessage.show();
        })
        .catch(error => {
            feedbackMessage.text('Erro ao cadastrar vistoria.');
            feedbackMessage.css('color', 'red');
            feedbackMessage.show();
            console.error('Erro ao cadastrar vistoria:', error);
        });
    });
});


//Lista de Fotos


// Função para inicializar a página e carregar todos os registros
$$(document).on("page:init", '.page[data-name="lista-itens"]', function () {
    console.log("Página de Lista de Itens Carregada");
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const idAtividade = hashParams.get('id');
    console.log('ID da Atividade:', idAtividade);   
    
    // Chama a função para carregar todos os dados de fotos
    carregarDadosFotos(idAtividade);
});

// Função para carregar todos os dados de fotos
async function carregarDadosFotos(idAtividade) {
    const API_URL = `${window.config.apiUrl}/list/lista_fotos/`;    
    const token = localStorage.getItem('sc-authToken');
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${token}`
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || 'Erro ao buscar dados das fotos');
            return;
        }

        const data = await response.json();
        console.log('Dados das Fotos:', data);

        // Processa e exibe os dados das fotos no HTML
        exibirDadosFotos(data.lista_fotos,idAtividade);

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        console.log('Erro ao conectar com o servidor');
    }
}

// Função para exibir os dados das fotos no HTML
function exibirDadosFotos(listaFotos,idAtividade) {
    const infosContainer = document.querySelector('.lista_fotos');

    if (!infosContainer) {
        console.error('Elemento ".lista_fotos" não encontrado no DOM');
        return;
    }

    // Limpa o conteúdo atual da lista de fotos
    infosContainer.innerHTML = '';

     // Filtra as fotos para exibir apenas aquelas com o atividade_id igual ao idAtividade
     const fotosFiltradas = listaFotos.filter(foto => foto.atividade_id === parseInt(idAtividade));
     console.log('Fotos Filtradas:', fotosFiltradas);

    // Verifica se a lista de fotos filtradas contém dados
    if (fotosFiltradas.length > 0) {
        // Itera sobre as fotos filtradas e cria o HTML para cada uma
        fotosFiltradas.forEach(foto => {
            const fotoHtml = `
            <div class="post-list">
                <div class="link post-horizontal">        
                    <div class="item-media event-icon"><i class="icon f7-icons">photo</i></div>  
                    <a href="/item-edit/?id=${foto.id}">
                        <div class="infos">                            
                            <div class="post-title">${foto.foto_nome || 'Nome da foto não disponível'}</div>
                            <div class="post-description">${foto.descricao || 'Descrição não disponível'}</div>
                        </div>   
                    </a>              
                    <div class="links-list">            
                        <a href="/item-edit/?id=${foto.id}"></a>
                    </div>                      
                </div>
            </div>    
            `;
            // Adiciona cada foto ao contêiner
            infosContainer.innerHTML += fotoHtml;
        });
    } else {
        // Se não houver fotos filtradas, exibe uma mensagem
        infosContainer.innerHTML = '<p>Nenhuma foto encontrada para esta atividade.</p>';
        
        

    }
}



//Foto Edit

$$(document).on("page:init", '.page[data-name="item-edit"]', function () {
    console.log("Página de Edição de Foto Carregada");

    // Extrai o ID da foto da URL
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const idFoto = hashParams.get('id');
    console.log('ID da Foto:', idFoto);
    
    if (idFoto) {
        // Chama a função para carregar os dados da foto com o ID fornecido
        carregarDadosFoto(idFoto);
    } else {
        console.error('ID da foto não encontrado');
        console.log('ID da foto não encontrado');
    }
});

// Função para carregar dados da foto com o ID fornecido
async function carregarDadosFoto(idFoto) {
    const API_URL = `${window.config.apiUrl}/view/lista_fotos/${idFoto}`; // Ajuste a URL conforme necessário

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Inclua o token de autenticação se necessário
                'X-Authorization': `Bearer ${localStorage.getItem('sc-authToken')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || 'Erro ao buscar dados da foto');
            return;
        }

        const data = await response.json();
        console.log('Dados da Foto:', data);

        // Processa e exibe os dados da foto no HTML
        exibirDadosFoto(data);
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        console.log('Erro ao conectar com o servidor');
    }
}

// Função para exibir os dados da foto no HTML
async function exibirDadosFoto(data) {
    const fotoContainer = document.querySelector('.item-foto');

    if (!fotoContainer) {
        console.error('Elemento ".item-foto" não encontrado no DOM');
        return;
    }

    // Verifica se os dados estão presentes
    const foto = data.lista_fotos;  // Agora lista_fotos é um objeto e não um array
    if (!foto) {
        console.error('Dados da foto não encontrados');
        fotoContainer.innerHTML = '<p>Foto não encontrada.</p>';
        return;
    }

    const nomeUsuario = await obterNomeUsuario(foto.usuario_id);

    if(foto.foto_arquivo != null){
        // Atualiza o conteúdo HTML com os dados da foto
    fotoContainer.innerHTML = `
    <div class="album-header">
        <img src="${foto.foto_arquivo?.url || 'img/testes/1.jpg'}" alt="${foto.foto_nome}" class="single-cover-image">
        <div class="album-title">${foto.descricao || 'Nome da Foto'}</div>      
    </div>
    <div class="grid grid-cols-2 grid-gap album-stats">
        <div class="album-stat">
            <div class="album-stat-title">Criado por</div>
            <div class="album-stat-number">${nomeUsuario || 'ID do usuário'}</div>
        </div>

        <div class="album-stat">        
            <div class="album-stat-title">Tipo</div>
            <div class="album-stat-number">${foto.foto_nome || 'Descrição não disponível'}</div>
        </div>      

        <div class="album-stat">        
            <div class="album-stat-title">Data de Criação</div>
            <div class="album-stat-number">${foto.dt_criacao ? new Date(foto.dt_criacao).toLocaleDateString() : '-'}</div>
        </div>
    </div>
`;

    }else {
        // Atualiza o conteúdo HTML com os dados da foto
    fotoContainer.innerHTML = `
    <div class="album-header">
    


        <div class="album-title">${foto.descricao || 'Nome da Foto'}</div>      
    </div>
    <div class="grid grid-cols-2 grid-gap album-stats">
        <div class="album-stat">
            <div class="album-stat-title">Criado por</div>
            <div class="album-stat-number">${nomeUsuario || 'ID do usuário'}</div>
        </div>

        <div class="album-stat">        
            <div class="album-stat-title">Tipo</div>
            <div class="album-stat-number">${foto.foto_nome || 'Descrição não disponível'}</div>
        </div>      

        <div class="album-stat">        
            <div class="album-stat-title">Data de Criação</div>
            <div class="album-stat-number">${foto.dt_criacao ? new Date(foto.dt_criacao).toLocaleDateString() : '-'}</div>
        </div>
    </div>
`;
    }
    
}

//Recupera nome do usuario

// Função para obter o nome do usuário com base no ID
async function obterNomeUsuario(usuarioId) {
    const API_URL = `${window.config.apiUrl}/view/usuarios/${usuarioId}`; // Ajuste a URL conforme sua API

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${localStorage.getItem('sc-authToken')}` // Use o token de autenticação, se necessário
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário');
        }

        const data = await response.json();
        
        // Verifica se a resposta contém o usuário e retorna o nome
        if (data.success && data.usuarios && data.usuarios.nome) {
            return data.usuarios.nome;
        } else {
            console.error('Nome do usuário não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter o nome do usuário:', error);
        return null;
    }
}




//UPLOAD DA FOTO
$$(document).on("page:init", '.page[data-name="item-edit"]', function () {
    console.log("Página foto-edit carregada");

    // Verificar se os elementos existem antes de tentar acessar
    const fotoPreview = document.getElementById('fotoPreview');
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const previewArea = document.getElementById('previewArea');
    const saveButton = document.getElementById('saveButton');

    if (!fotoPreview || !fileInput || !uploadButton || !previewArea || !saveButton) {
        console.error("Erro: Elementos não encontrados no DOM.");
        return;
    }

    // Evento de clique no botão para abrir o input de arquivo
    uploadButton.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        fileInput.click(); // Aciona o input de arquivo
    });

    // Evento para quando o usuário selecionar ou tirar uma foto
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0]; // Pega o primeiro arquivo selecionado

        if (file) {
            const reader = new FileReader(); // Cria um novo leitor de arquivos

            // Quando o arquivo for lido, exibe a imagem
            reader.onload = function(event) {
                fotoPreview.src = event.target.result; // Atualiza a imagem de pré-visualização
                previewArea.innerHTML = '<img src="' + event.target.result + '" class="preview-image" />'; // Exibe a imagem

                // Exibe o botão de salvar foto
                saveButton.style.display = 'inline-block';
            };

            // Lê o arquivo como URL de dados (para pré-visualização)
            reader.readAsDataURL(file);
        }
    });

    // Evento de clique para salvar a foto via RESTCONF
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Salvando a foto via RESTCONF...");

        // Crie um objeto FormData para enviar o arquivo de imagem
        const formData = new FormData();
        const file = fileInput.files[0]; // Obtém o arquivo selecionado

        // Verifica se existe um arquivo selecionado
        if (file) {
            formData.append('foto_arquivo', file); // Adiciona o arquivo ao FormData
        } else {
            alert("Nenhuma foto selecionada.");
            return;
        }
        
        // Extrai o ID da foto da URL
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const fotoId = hashParams.get('id');

        const API_URL = `${window.config.apiUrl}/edit/lista_fotos/${fotoId}`;

        // Envie o FormData via POST com fetch
        fetch(API_URL, {
            method: 'POST', // Método de envio
            headers: {
                // Se precisar adicionar autenticação, você pode incluir um token aqui
                'X-Authorization': `Bearer ${localStorage.getItem('sc-authToken')}`
            },
            body: formData, // Envia o FormData com a foto
        })
        .then(response => response.json()) // Espera a resposta em JSON
        .then(data => {
            if (data.success) {
                console.log("Foto salva com sucesso!");
                console.log("Resposta da API:", data);
            } else {
                console.log("Erro ao salvar a foto.");
                console.error("Erro na resposta da API:", data);
            }
        })
        .catch(error => {
            console.log("Erro ao enviar a foto.");
            console.error("Erro:", error);
        });
    });
});



  