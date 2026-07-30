const express = require('express');
const UsuarioService = require('./UsuarioService');

const app = express();
app.use(express.json());

// criamos UMA instância da classe para usar em todas as rotas
const usuarioService = new UsuarioService();

// rota de cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, email e senha.' });
  }

  const usuario = usuarioService.cadastrar(nome, email, senha);
  res.status(201).json({ mensagem: 'Usuário cadastrado!', nome: usuario.nome });
});

// rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const resultado = usuarioService.login(email, senha);

  if (!resultado.sucesso) {
    return res.status(401).json(resultado);
  }

  res.status(200).json(resultado);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
