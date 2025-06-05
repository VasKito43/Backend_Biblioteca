// borrowings.js
class Borrowing {
    constructor(
      id,
      userRegister,
      librarianRegister,
      bookIsbn,
      statsId,
      dateBorrowing,
      returnDate
    ) {
      this.id = id;                   // INTEGER PK
      this.userRegister = userRegister;   // INTEGER → FK para users.register
      this.librarianRegister = librarianRegister; // INTEGER → FK para librarian.register
      this.bookIsbn = bookIsbn;         // BIGINT → FK para books.isbn
      this.statsId = statsId;           // INTEGER → FK para stats.id
      this.dateBorrowing = dateBorrowing; // DATE
      this.returnDate = returnDate;     // DATE
    }
  
    // Opcional:
    // this.user = null;
    // this.librarian = null;
    // this.book = null;
    // this.stat = null;
  }
  
  module.exports = Borrowing;
  