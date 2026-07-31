'use strict';

/**
 * Script de ação dos botões principais
 */
document.addEventListener('DOMContentLoaded', () => {
    const btnCadastroAluno = document.getElementById('btnCadastroAluno');
    const btnCadastroLivro = document.getElementById('btnCadastroLivro');

    if (btnCadastroAluno) {
        btnCadastroAluno.addEventListener('click', () => {
            // Ação ao clicar em Cadastro Aluno (ex: redirecionamento ou aviso)
            window.location.href = "./aluno.html"
        });
    }

    if (btnCadastroLivro) {
        btnCadastroLivro.addEventListener('click', () => {
            // Ação ao clicar em Cadastro Livro / Reserva
            window.location.href = "./livros.html"
        });
    }
});