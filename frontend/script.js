const API = "http://localhost:3000/livros";

const form = document.getElementById("formLivro");
const lista = document.getElementById("listaLivros");

async function carregarLivros() {

    const resposta = await fetch(API);

    const livros = await resposta.json();

    lista.innerHTML = "";

    livros.forEach(livro => {

        lista.innerHTML += `
            <div>
                <strong>${livro.titulo}</strong><br>
                ${livro.autor}<br>
                ${livro.ano}<br>

                <button onclick="excluir(${livro.id})">
                    Excluir
                </button>

                <hr>
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