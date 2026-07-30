const Usuario = require('./Usuario');

// Essa classe é responsável por guardar os usuários
// e verificar se o login (email + senha) está correto.
class UsuarioService {
  constructor() {
    this.usuarios = [];

    // já deixamos um usuário cadastrado, só para testar o login
    this.cadastrar('Bibliotecária Ana', 'ana@biblioteca.com', '123456');
  }

  cadastrar(nome, email, senha) {
    const usuarioExistente = this.usuarios.find((u) => u.email === email);

    if (usuarioExistente) {
      return { sucesso: false, mensagem: `Email ja cadastrado.` };
    }

    const novoUsuario = new Usuario(nome, email, senha);
    this.usuarios.push(novoUsuario);

    return { sucesso: true, mensagem: 'Usuário cadastrado com sucesso!', nome: novoUsuario.nome };
  }

  login(email, senha) {
    // procura um usuário com esse email
    const usuario = this.usuarios.find((u) => u.email === email);

    if (!usuario) {
      return { sucesso: false, mensagem: 'Usuário não encontrado.' };
    }

    if (usuario.senha !== senha) {
      return { sucesso: false, mensagem: 'Senha incorreta.' };
    }

    return { sucesso: true, mensagem: 'Login realizado com sucesso!', nome: usuario.nome };
  }
}

module.exports = UsuarioService;