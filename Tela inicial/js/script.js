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
            console.log('Navegar para Cadastro de Aluno');
        });
    }

    if (btnCadastroLivro) {
        btnCadastroLivro.addEventListener('click', () => {
            // Ação ao clicar em Cadastro Livro / Reserva
            console.log('Navegar para Cadastro de Livro / Reserva');
        });
    }
});