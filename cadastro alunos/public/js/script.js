// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    // Sanitização simples para prevenir XSS no Frontend
    const sanitizeInput = (text) => {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = text;
        return tempDiv.innerHTML.trim();
    };

    // Validação de formato de CPF (000.000.000-00 ou apenas números)
    const isValidCPF = (cpf) => {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio tradicional do formulário

        // Coleta e sanitização via DOM API (sem innerHTML / innerText de entrada)
        const rawNome = document.getElementById('nome').value;
        const rawCpf = document.getElementById('cpf').value;
        const rawIdade = document.getElementById('idade').value;
        const rawEndereco = document.getElementById('endereco').value;
        const rawTurma = document.getElementById('turma').value;

        // Sanitização contra XSS
        const nome = sanitizeInput(rawNome);
        const cpf = rawCpf.replace(/\D/g, ''); // Mantém apenas dígitos
        const idade = parseInt(rawIdade, 10);
        const endereco = sanitizeInput(rawEndereco);
        const turma = sanitizeInput(rawTurma);

        // --- VALIDAÇÕES DE SEGURANÇA E REGRA DE NEGÓCIO ---

        if (!nome || nome.length < 3) {
            alert('Por favor, informe um nome válido.');
            return;
        }

        if (!isValidCPF(cpf)) {
            alert('CPF inválido. Certifique-se de digitar 11 dígitos.');
            return;
        }

        if (isNaN(idade) || idade < 1 || idade > 120) {
            alert('Idade inválida.');
            return;
        }

        if (!endereco) {
            alert('O endereço é obrigatório.');
            return;
        }

        if (!turma) {
            alert('A turma é obrigatória.');
            return;
        }

        // DADOS PRONTOS PARA ENVIO AO BACKEND
        const payload = {
            nome,
            cpf,
            idade,
            endereco,
            turma
        };

        try {
            // Envio seguro via HTTPS/POST (evita Credential/Data Exposure na URL via GET)
            const response = await fetch('/api/alunos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Aluno cadastrado com sucesso!');
                form.reset();
            } else {
                // Trata falhas sem expor detalhes internos do sistema (Information Disclosure)
                alert('Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            // Evita expor a stack de erro completa ao usuário no browser
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    });
});
