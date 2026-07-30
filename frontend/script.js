"use strict";

const API = "http://localhost:3000/livros";
const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");
const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const anoInput = document.getElementById("ano");

async function carregarLivros() {
    const controller = new AbortController();
    try {
        const resposta = await fetch(API, {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
            signal: controller.signal
        });
        if (!resposta.ok) {
            throw new Error("Erro ao consultar livros.");
        }
        const livros = await resposta.json();
        lista.replaceChildren();
        livros.forEach((livro) => {
            const container = document.createElement("div");
            container.className = "livro";

            const info = document.createElement("div");
            info.className = "livro-info";

            const titulo = document.createElement("h3");
            titulo.textContent = String(livro.titulo ?? "");

            const autor = document.createElement("p");
            autor.innerHTML = "<strong>Autor:</strong> ";
            autor.append(document.createTextNode(String(livro.autor ?? "")));

            const ano = document.createElement("p");

            ano.innerHTML = "<strong>Ano:</strong> ";
            ano.append(document.createTextNode(String(livro.ano ?? "")));
            info.appendChild(titulo);
            info.appendChild(autor);
            info.appendChild(ano);

            const botao = document.createElement("button");
            botao.className = "btn-excluir";
            botao.type = "button";
            botao.textContent = "Excluir";
            botao.addEventListener("click", () => excluir(livro.id));
            container.appendChild(info);
            container.appendChild(botao);
            lista.appendChild(container);
        });
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os livros.");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = tituloInput.value.trim();
    const autor = autorInput.value.trim();
    const ano = Number(anoInput.value);
    if (!titulo || !autor) {
        alert("Título e autor são obrigatórios.");
        return;
    }
    if (!Number.isInteger(ano) || ano < 0 || ano > new Date().getFullYear()) {
        alert("Ano inválido.");
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
            throw new Error("Erro ao cadastrar.");
        }
        form.reset();
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar livro.");
    }
});

async function excluir(id) {
    if (!Number.isInteger(Number(id))) {
        alert("ID inválido.");
        return;
    }
    if (!confirm("Deseja realmente excluir este livro?")) {
        return;
    }
    try {
        const resposta = await fetch(`${API}/${encodeURIComponent(id)}`, {
            method: "DELETE",
            credentials: "same-origin"
        });
        if (!resposta.ok) {
            throw new Error("Erro ao excluir.");
        }
        await carregarLivros();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir livro.");
    }
}
carregarLivros();