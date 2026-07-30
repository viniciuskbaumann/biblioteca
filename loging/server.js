const express = require('express');
const UsuarioService = require('./UsuarioService');

const app = express();
app.use(express.json());

const usuarioService = new UsuarioService();

// rota de cadastro
app.post('/cadastro', (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha email e senha.' });
    }

    const resultado = usuarioService.cadastrar(email, senha);

    if (!resultado.sucesso) {
      return res.status(409).json(resultado);
    }

    res.status(201).json(resultado);
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
});

// rota de login
app.post('/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha email e senha.' });
    }

    const resultado = usuarioService.login(email, senha);

    if (!resultado.sucesso) {
      return res.status(401).json(resultado);
    }

    res.status(200).json(resultado);
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});