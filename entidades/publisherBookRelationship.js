// publisherBookRelationship.js
class PublisherBookRelationship {
    constructor(id, publisherId, bookIsbn) {
      this.id = id;          // INTEGER PK
      this.publisherId = publisherId; // INTEGER → FK para publishers.id
      this.bookIsbn = bookIsbn;     // BIGINT → FK para books.isbn
    }
  
    // Opcional: this.publisher = null; this.book = null;
  }
  
  module.exports = PublisherBookRelationship;
  