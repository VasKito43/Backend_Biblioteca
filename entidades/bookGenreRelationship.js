// bookGenreRelationship.js
class BookGenreRelationship {
    constructor(id, bookIsbn, genreId) {
      this.id = id;           // INTEGER PK
      this.bookIsbn = bookIsbn; // BIGINT → FK para books.isbn
      this.genreId = genreId;   // INTEGER → FK para genres.id
    }
  
    // Opcional: referencias diretas
    // this.book = null;
    // this.genre = null;
  }
  
  module.exports = BookGenreRelationship;
  