"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const pool = require("./database/db");

const UsuarioService = require("./service/UsuarioService");
const livrosRoutes = require("./routes/livros");

const app = express();
const PORT = 3000;

// ===============================
// Configurações de segurança
// ===============================

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Muitas requisições. Tente novamente mais tarde."
    }
});

app.use(limiter);

app.use(express.json({
    limit: "10kb"
}));

app.use(express.static("public"));

// ===============================
// Rotas
// ===============================

// CRUD de livros
app.use("/livros", livrosRoutes);

// ===============================
// Cadastro de alunos
// ===============================

let alunos = [];
let proximoId = 1;

function isValidCPF(cpf) {

    if (typeof cpf !== "string") {
        return false;
    }

    const cleanCPF = cpf.replace(/\D/g, "");

    return cleanCPF.length === 11;
}

app.post("/api/alunos", (req, res) => {

    const {
        nome,
        cpf,
        idade,
        endereco,
        turma
    } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
        return res.status(400).json({
            error: "Nome inválido."
        });
    }

    const cleanCPF = String(cpf || "").replace(/\D/g, "");

    if (!isValidCPF(cleanCPF)) {
        return res.status(400).json({
            error: "CPF inválido."
        });
    }

    const parsedIdade = parseInt(idade, 10);

    if (isNaN(parsedIdade) || parsedIdade < 1 || parsedIdade > 120) {
        return res.status(400).json({
            error: "Idade inválida."
        });
    }

    if (!endereco || endereco.trim().length < 5) {
        return res.status(400).json({
            error: "Endereço inválido."
        });
    }

    if (!turma || turma.trim().length === 0) {
        return res.status(400).json({
            error: "Turma inválida."
        });
    }

    const existeCPF = alunos.find(aluno => aluno.cpf === cleanCPF);

    if (existeCPF) {
        return res.status(409).json({
            error: "CPF já cadastrado."
        });
    }

    const aluno = {
        id: proximoId++,
        nome: nome.trim(),
        cpf: cleanCPF,
        idade: parsedIdade,
        endereco: endereco.trim(),
        turma: turma.trim(),
        criado_em: new Date()
    };

    alunos.push(aluno);

    return res.status(201).json({
        message: "Aluno cadastrado com sucesso!",
        aluno
    });

});

app.get("/api/alunos", (req, res) => {
    res.json(alunos);
});

// ===============================
// Usuários
// ===============================

const usuarioService = new UsuarioService();

app.post("/cadastro", (req, res) => {

    const {
        nome,
        email,
        senha
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha nome, email e senha."
        });
    }

    const usuario = usuarioService.cadastrar(
        nome,
        email,
        senha
    );

    return res.status(201).json({
        mensagem: "Usuário cadastrado!",
        nome: usuario.nome
    });

});

app.post("/login", (req, res) => {

    const {
        email,
        senha
    } = req.body;

    const resultado = usuarioService.login(
        email,
        senha
    );

    if (!resultado.sucesso) {
        return res.status(401).json(resultado);
    }

    return res.status(200).json(resultado);

});

// ===============================
// Inicialização
// ===============================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});