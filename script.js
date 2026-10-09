/* ---------- Funções auxiliares ---------- */

function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function logar(email) {
    localStorage.setItem("usuarioLogado", email);
    window.location.href = "agatha.html";
}

/* ---------- Proteção da página (roda na hora, antes de a página aparecer) ---------- */

const scriptAtual = document.currentScript;

if (scriptAtual && scriptAtual.dataset.protegida !== undefined) {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.replace("login.html");
    }
}

/* ---------- Ações de cada página (rodam quando o HTML termina de carregar) ---------- */

document.addEventListener("DOMContentLoaded", function () {

    /* CADASTRO */
    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", function (event) {
            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const senha = document.getElementById("senha").value;
            const confirmar = document.getElementById("confirmar").value;

            if (senha !== confirmar) {
                alert("As senhas não coincidem.");
                return;
            }

            const usuarios = getUsuarios();

            if (usuarios.some(u => u.email === email)) {
                alert("Já existe uma conta com esse e-mail.");
                return;
            }

            usuarios.push({ nome, email, senha });
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            logar(email);
        });
    }

    /* LOGIN */
    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const senha = document.getElementById("senha").value;

            const usuario = getUsuarios().find(u => u.email === email && u.senha === senha);

            if (!usuario) {
                alert("E-mail ou senha incorretos.");
                return;
            }

            logar(email);
        });
    }

    /* SAIR (botão do menu da biografia) */
    const botaoSair = document.getElementById("sair");

    if (botaoSair) {
        botaoSair.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";
        });
    }
});

    /* ABAS DA BIOGRAFIA */
    const botaoMenu = document.getElementById("botaoMenu");
    const menuLateral = document.getElementById("menuLateral");
    const botoesAba = document.querySelectorAll(".menu-lateral button");
    const abas = document.querySelectorAll(".aba");

    function abrirFecharMenu(abrir) {
        menuLateral.classList.toggle("aberto", abrir);
        botaoMenu.setAttribute("aria-expanded", abrir);
    }

    function mostrarAba(id) {
        abas.forEach(function (aba) {
            aba.classList.toggle("ativa", aba.id === id);
        });
        botoesAba.forEach(function (botao) {
            botao.classList.toggle("ativo", botao.dataset.aba === id);
        });
        abrirFecharMenu(false);   // fecha o menu depois de escolher
    }

    if (botaoMenu && menuLateral) {
        botaoMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            abrirFecharMenu(!menuLateral.classList.contains("aberto"));
        });

        botoesAba.forEach(function (botao) {
            botao.addEventListener("click", function () {
                mostrarAba(botao.dataset.aba);
            });
        });

        // clicar fora do menu fecha
        document.addEventListener("click", function (event) {
            if (!menuLateral.contains(event.target)) {
                abrirFecharMenu(false);
            }
        });

        // tecla Esc fecha
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                abrirFecharMenu(false);
            }
        });
    }