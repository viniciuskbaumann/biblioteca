//crud dos livros
const express = require("express");
const router = express.Router();

const Livro = require("../models/livros");
const livros = require("../database/livros");

//metodo create
router.post("/", (req, res) => {
    const { titulo, autor, ano } = req.body;
    //criar obj livro
    const livro = new Livro (
        livros.length + 1,
        titulo, 
        autor,
        ano
    );
    
    livros.push(livro);

    res.status(201).json(livro);
});

//metodo get (generico, trara todos os registros)
router.get("/", (req, res) => {
    console.log("Rota /livros acessada");
    res.json(livros);
});

//metodo get por id 
router.get("/:id", (req, res) => {

    const livro = livros.find (l => l.id == req.params.id);

    if(!livro){
        return res.status(404).json(
            {
            mensagem: "Livro nao encontrado"
        });
    }
    
    res.json(livro);
});

//metodo update
router.put("/:id", (req, res) => {
    
    const livro = livros.find(l => l.id == req.params.id);

    if(!livro){
        return res.status(404).json({
            mensagem: "livro nao encontrado para atualizar"
        });
    }

    livro.titulo = req.body.titulo;
    livro.autor = req.body.autor;
    livro.ano = req.body.ano;

    res.json({
        mensagem: "Livro atualizado",
        livro
    });
});

//metodo delete
router.delete("/:id", (req, res) => {

    const indice = livros.findIndex(l => l.id == req.params.id);

    if(indice == -1){
        return res.status(400).json({
            mensagem: "Livro nao encontrado"
        });
    }

    livros.splice(indice, 1);

    res.json({
        mensagem: "Livro removido"
    });
});

module.exports = router;