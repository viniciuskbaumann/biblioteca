

        const form = document.getElementById("formLogin");

        form.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();

            try {

                const resposta = await fetch("http://localhost:3000/login", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        senha
                    })

                });

                const resultado = await resposta.json();

                console.log(resultado);

                if (resultado.sucesso) {

                    alert(resultado.mensagem);

                    // Redireciona para a Home
                    window.location.href = "./home.html";

                } else {

                    alert(resultado.mensagem);

                }

            } catch (erro) {

                console.error(erro);

                alert("Erro ao conectar com o servidor.");

            }

        });