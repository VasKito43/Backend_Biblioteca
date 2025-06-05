// books.js
class Book {
    constructor(
      isbn,
      title,
      realeaseDate,
      registerDate,
      quantityAvailable,
      edition,
      linkImg
    ) {
      this.isbn = isbn;                     // BIGINT PK
      this.title = title;                   // VARCHAR(50)
      this.realeaseDate = realeaseDate;     // DATE
      this.registerDate = registerDate;     // DATE
      this.quantityAvailable = quantityAvailable; // INTEGER
      this.edition = edition;               // VARCHAR(50)
      this.linkImg = linkImg;               // TEXT
    }
  
    // Se quiser relacionar, pode-se adicionar arrays vazias:
    // this.genres = [];
    // this.subcategories = [];
    // this.authors = [];
    // this.publishers = [];
    // this.units = [];
  }
  
  module.exports = Book;
  