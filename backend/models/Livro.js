//livro deve ter: titulo, autor e ano

class Livro {
    constructor(id, titulo, autor, ano){
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
    }

    exibirInformacoes(){
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            ano: this.ano
        };
    }
}

module.exports = Livro;