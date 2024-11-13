document.addEventListener('DOMContentLoaded', function() {
    // Verifique se está na página de login
    if (document.querySelector('.page[data-name="login-page"]')) {
        // Adiciona o evento de submit ao formulário de login
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            // Mostrar o preloader
            document.getElementById('preloader').style.display = 'block';
                       
            console.log(window.config.apiUrl);  // Acessa o valor da URL da API
            const API_URL = `${window.config.apiUrl}/login`;

            const username = document.getElementById('email').value;
            const password = document.getElementById('password').value;                        
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Salva o token de autenticação no localStorage
                    if (response.ok) {
                        // Salva o token de autenticação no localStorage
                        localStorage.setItem('sc-authToken', data.JWT);
                        //console.log('Token JWT armazenado:', data.JWT);
                    
                        // Redireciona para a página principal
                        window.location.href = 'main.html';
                    } else {
                        // Tratar erro de autenticação
                        alert(data.message || 'Erro de autenticação');
                    }

                    // Redireciona para a página principal
                    window.location.href = 'main.html';
                } else {
                    // Tratar erro de autenticação
                    alert(data.message || 'Erro de autenticação');
                    
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor');
            } finally {
                // Esconde o preloader, independente do resultado
                document.getElementById('preloader').style.display = 'none';
            
                // Habilita o formulário de login
                document.getElementById('email').disabled = false;
                document.getElementById('senha').disabled = false;
                document.getElementById('btnEntrar').disabled = false;
            }
        });
    }
});


$$(document).on("page:init", '.page[data-name="logout"]', function () {
    console.log("Página de Logout Carregada");
    
    $$("#logoutbutton").on("click", function () {
      console.log("Botão clicado");;
  
      // Remove o token de autenticação do localStorage
      localStorage.removeItem('sc-authToken');
  
      // Redireciona o usuário para a página de login
      window.location.href = 'login.html';
      console.log('Usuário deslogado');
    });
  
  });


// Função para verificar a autenticação em qualquer página
function checkAuthentication() {
    const token = localStorage.getItem('sc-authToken');
    const currentPage = window.location.pathname;

    if (token) {
        if (!currentPage.endsWith('/main.html') && !currentPage.endsWith('/')) {
            // Se o token existir e não estiver na página principal, redireciona para a página principal
            window.location.href = 'main.html';
            console.log('Usuário autenticado');
        }
    } else {
        if (!currentPage.endsWith('/login.html')) {
            // Se o token não existir e não estiver na página de login, redireciona para a página de login
            window.location.href = 'login.html';
        }
    }
}

// Chama a verificação de autenticação ao carregar a página
checkAuthentication();

