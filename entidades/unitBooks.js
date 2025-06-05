// unitBooks.js
class UnitBook {
    constructor(id, bookIsbn) {
      this.id = id;         // INTEGER PK
      this.bookIsbn = bookIsbn; // BIGINT → FK para books.isbn
    }
  
    // Opcional: this.book = null;
  }
  
  module.exports = UnitBook;
  