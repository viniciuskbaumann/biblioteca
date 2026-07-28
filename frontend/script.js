const API = "http://localhost:3000/livros";

const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");

async function carregarLivros() {

    const resposta = await fetch(API);

    const livros = await resposta.json();

    lista.innerHTML = "";

livros.forEach(livro => {

    lista.innerHTML += `
        <div class="livro">

            <div class="livro-info">
                <h3>${livro.titulo}</h3>

                <p><strong>Autor:</strong> ${livro.autor}</p>

                <p><strong>Ano:</strong> ${livro.ano}</p>
            </div>

            <button class="btn-excluir" onclick="excluir(${livro.id})">
                Excluir
            </button>

        </div>
    `;

});

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            titulo: titulo.value,
            autor: autor.value,
            ano: ano.value

        })

    });

    form.reset();

    carregarLivros();

});

async function excluir(id){

    await fetch(API + "/" + id,{
        method:"DELETE"
    });

    carregarLivros();

}

carregarLivros();