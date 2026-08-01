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

function isValidCPF(cpf) {
    if (typeof cpf !== "string") {
        return false;
    }
    const cleanCPF = cpf.replace(/\D/g, "");
    return cleanCPF.length === 11;
}

function mascararCPF(cpf) {
    const cpfString = String(cpf).padStart(11, "0");
    return cpfString.replace(/^(\d{3})\d{5}(\d{2})$/, "$1.***.**$2");
}

app.post("/api/alunos", async (req, res) => {

    const {
        nome,
        cpf,
        idade,
        endereco,
        turma
    } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 3 || nome.trim().length > 100) {
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

    if (!endereco || typeof endereco !== "string" || endereco.trim().length < 5 || endereco.trim().length > 200) {
        return res.status(400).json({
            error: "Endereço inválido."
        });
    }

    if (!turma || typeof turma !== "string" || turma.trim().length === 0 || turma.trim().length > 8) {
        return res.status(400).json({
            error: "Turma inválida."
        });
    }

    const turmaLimpa = turma.trim();
    if (!/^[A-Za-z0-9\-]{1,8}$/.test(turmaLimpa)) {
        return res.status(400).json({
            error: "Turma contém caracteres inválidos."
        });
    }

    try {
        const existeCPF = await pool.query(
            "SELECT id FROM aluno WHERE cpf = $1",
            [cleanCPF]
        );

        if (existeCPF.rows.length > 0) {
            return res.status(409).json({
                error: "CPF já cadastrado."
            });
        }

        const resultado = await pool.query(
            `INSERT INTO aluno (nome, cpf, idade, endereco, turma)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nome, cpf, idade, endereco, turma`,
            [nome.trim(), cleanCPF, parsedIdade, endereco.trim(), turmaLimpa]
        );

        const alunoCriado = resultado.rows[0];

        return res.status(201).json({
            message: "Aluno cadastrado com sucesso!",
            aluno: {
                ...alunoCriado,
                cpf: mascararCPF(alunoCriado.cpf)
            }
        });

    } catch (err) {
        console.error("[POST /api/alunos]", err);
        return res.status(500).json({
            error: "Erro ao cadastrar aluno."
        });
    }

});

app.get("/api/alunos", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT id, nome, cpf, idade, endereco, turma FROM aluno ORDER BY id"
        );

        const alunosSeguro = resultado.rows.map(aluno => ({
            ...aluno,
            cpf: mascararCPF(aluno.cpf)
        }));

        res.json(alunosSeguro);
    } catch (err) {
        console.error("[GET /api/alunos]", err);
        res.status(500).json({
            error: "Erro ao buscar alunos."
        });
    }
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
// Handler global de erros
// ===============================

app.use((err, req, res, next) => {
    console.error("[Erro não tratado]", err);
    res.status(500).json({
        error: "Erro interno no servidor."
    });
});

// ===============================
// Inicialização
// ===============================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});