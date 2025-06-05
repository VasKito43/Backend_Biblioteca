// bookSubcategoryRelationship.js
class BookSubcategoryRelationship {
    constructor(id, bookIsbn, subcategoryId) {
      this.id = id;              // INTEGER PK
      this.bookIsbn = bookIsbn;     // BIGINT → FK para books.isbn
      this.subcategoryId = subcategoryId; // INTEGER → FK para subcategorys.id
    }
  
    // Opcional: this.book = null; this.subcategory = null;
  }
  
  module.exports = BookSubcategoryRelationship;
  