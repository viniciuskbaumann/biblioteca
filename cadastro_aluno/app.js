const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança
app.disable('x-powered-by');
app.use(helmet());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST']
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Muitas requisições. Tente novamente mais tarde.'
    }
});

app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// Simulação do banco
let alunos = [];
let proximoId = 1;

// Validação simples de CPF
const isValidCPF = (cpf) => {
    if (typeof cpf !== 'string') return false;

    const cleanCPF = cpf.replace(/\D/g, '');

    return cleanCPF.length === 11;
};

app.post('/api/alunos', (req, res) => {

    const { nome, cpf, idade, endereco, turma } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
        return res.status(400).json({
            error: 'Nome inválido.'
        });
    }

    const cleanCPF = String(cpf || '').replace(/\D/g, '');

    if (!isValidCPF(cleanCPF)) {
        return res.status(400).json({
            error: 'CPF inválido.'
        });
    }

    const parsedIdade = parseInt(idade, 10);

    if (isNaN(parsedIdade) || parsedIdade < 1 || parsedIdade > 120) {
        return res.status(400).json({
            error: 'Idade inválida.'
        });
    }

    if (!endereco || typeof endereco !== 'string' || endereco.trim().length < 5) {
        return res.status(400).json({
            error: 'Endereço inválido.'
        });
    }

    if (!turma || typeof turma !== 'string' || turma.trim().length === 0) {
        return res.status(400).json({
            error: 'Turma inválida.'
        });
    }

    // Verifica CPF duplicado
    const existeCPF = alunos.find(a => a.cpf === cleanCPF);

    if (existeCPF) {
        return res.status(409).json({
            error: 'CPF já cadastrado.'
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
        message: 'Aluno cadastrado com sucesso!',
        aluno
    });

});

// Apenas para visualizar os cadastros
app.get('/api/alunos', (req, res) => {
    res.json(alunos);
});

app.listen(PORT);

app.use(express.static('public'));
