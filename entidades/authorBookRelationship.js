// authorBookRelationship.js
class AuthorBookRelationship {
    constructor(id, authorId, bookIsbn) {
      this.id = id;         // INTEGER PK
      this.authorId = authorId; // INTEGER → FK para authors.id
      this.bookIsbn = bookIsbn; // BIGINT → FK para books.isbn
    }
  
    // Opcional: this.author = null; this.book = null;
  }
  
  module.exports = AuthorBookRelationship;
  