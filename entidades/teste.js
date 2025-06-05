// entidades/teste.js
// -------------------------------------------
// Esta classe modela um “Teste” em memória.  
// O único propósito aqui é guardar nome, valor e caminhoImagem.  
// IDs são gerados sequencialmente pelo controller.
// -------------------------------------------
class Teste {
    constructor(id_teste, nome) {
      this.id_teste = id_teste;
      this.nome = nome;
    }
  }
  
  module.exports = Teste;
  