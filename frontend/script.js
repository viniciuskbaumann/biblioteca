"use strict";

const API = "http://localhost:3000/livros";

const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");

const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const anoInput = document.getElementById("ano");

const modal = document.getElementById("modal");

const editId = document.getElementById("editId");
const editTitulo = document.getElementById("editTitulo");
const editAutor = document.getElementById("editAutor");
const editAno = document.getElementById("editAno");

const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

function validarLivro(titulo, autor, ano) {

    if (!titulo || !autor) {
        alert("Título e autor são obrigatórios.");
        return false;
    }

    if (titulo.length > 100) {
        alert("O título deve ter no máximo 100 caracteres.");
        return false;
    }

    if (autor.length > 100) {
        alert("O autor deve ter no máximo 100 caracteres.");
        return false;
    }

    if (!Number.isInteger(ano) || ano < 0 || ano > new Date().getFullYear()) {
        alert("Ano inválido.");
        return false;
    }

    return true;
}

function criarCardLivro(livro) {

    const container = document.createElement("div");
    container.className = "livro";

    const info = document.createElement("div");
    info.className = "livro-info";

    const titulo = document.createElement("h3");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("p");
    autor.innerHTML = "<strong>Autor:</strong> ";
    autor.append(document.createTextNode(livro.autor));

    const ano = document.createElement("p");
    ano.innerHTML = "<strong>Ano:</strong> ";
    ano.append(document.createTextNode(livro.ano));

    info.append(titulo, autor, ano);

    const botoes = document.createElement("div");
    botoes.className = "livro-botoes";

    const btnAlterar = document.createElement("button");
    btnAlterar.type = "button";
    btnAlterar.className = "btn-alterar";
    btnAlterar.textContent = "Alterar";
    btnAlterar.addEventListener("click", () => abrirModal(livro));

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "btn-excluir";
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", () => excluir(livro.id));

    botoes.append(btnAlterar, btnExcluir);

    container.append(info, botoes);

    return container;
}

async function carregarLivros() {

    try {

        const resposta = await fetch(API, {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin"
        });

        if (!resposta.ok) {
            throw new Error();
        }

        const livros = await resposta.json();

        lista.replaceChildren();

        livros.forEach((livro) => {
            lista.appendChild(criarCardLivro(livro));
        });

    } catch (erro) {

        console.error(erro);
        alert("Não foi possível carregar os livros.");

    }
}

async function cadastrarLivro() {

    const titulo = tituloInput.value.trim();
    const autor = autorInput.value.trim();
    const ano = Number(anoInput.value);

    if (!validarLivro(titulo, autor, ano)) {
        return;
    }

    try {

        const resposta = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                titulo,
                autor,
                ano
            })
        });

        if (!resposta.ok) {
            throw new Error();
        }

        form.reset();

        await carregarLivros();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao cadastrar livro.");

    }

}

async function excluir(id) {

    if (!confirm("Deseja realmente excluir este livro?")) {
        return;
    }

    try {

        const resposta = await fetch(`${API}/${encodeURIComponent(id)}`, {
            method: "DELETE",
            credentials: "same-origin"
        });

        if (!resposta.ok) {
            throw new Error();
        }

        await carregarLivros();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao excluir livro.");

    }

}

function abrirModal(livro) {

    editId.value = livro.id;
    editTitulo.value = livro.titulo;
    editAutor.value = livro.autor;
    editAno.value = livro.ano;

    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

async function alterarLivro() {

    const titulo = editTitulo.value.trim();
    const autor = editAutor.value.trim();
    const ano = Number(editAno.value);

    if (!validarLivro(titulo, autor, ano)) {
        return;
    }

    try {

        const resposta = await fetch(`${API}/${encodeURIComponent(editId.value)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                titulo,
                autor,
                ano
            })
        });

        if (!resposta.ok) {
            throw new Error();
        }

        fecharModal();

        await carregarLivros();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao alterar livro.");

    }

}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await cadastrarLivro();
});

btnSalvar.addEventListener("click", alterarLivro);

btnCancelar.addEventListener("click", fecharModal);

carregarLivros();