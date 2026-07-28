# Login da Biblioteca Escolar (versão simples)

Backend bem simples em Node.js + Express, usando POO (Programação Orientada a Objetos)
com só 2 classes.

## Arquivos

- **Usuario.js** → a classe `Usuario`. Só guarda nome, email e senha.
- **UsuarioService.js** → a classe `UsuarioService`. Guarda a lista de usuários e
  tem os métodos `cadastrar()` e `login()`.
- **server.js** → onde criamos as rotas (`/login` e `/cadastro`) usando o Express.

## Como rodar

```bash
npm install
npm start
```

Servidor sobe em `http://localhost:3000`.

## Usuário de teste (já cadastrado)

- email: `ana@biblioteca.com`
- senha: `123456`

## Testando

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@biblioteca.com","senha":"123456"}'
```

**Cadastro:**
```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Aluno","email":"joao@escola.com","senha":"minhasenha"}'
```

## Sobre a senha em texto puro

Aqui a senha fica guardada "crua", sem criptografia, só para ficar mais fácil de entender
no começo. Quando você se sentir mais confortável com JS, dá pra evoluir usando a
biblioteca `bcryptjs` para guardar a senha de forma criptografada — isso é o ideal
para um sistema de verdade.
