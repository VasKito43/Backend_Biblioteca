// librarian.js
class Librarian {
    constructor(register, name, dateBirth, email, phone, password, linkImg) {
      this.register = register;    // INTEGER PK
      this.name = name;            // VARCHAR(50)
      this.dateBirth = dateBirth;  // DATE
      this.email = email;          // VARCHAR(100)
      this.phone = phone;          // VARCHAR(20)
      this.password = password;    // VARCHAR(50)
      this.linkImg = linkImg;      // TEXT (default já configurado no BD)
    }
  
    // Opcional:
    // this.borrowings = [];
  }
  module.exports = Librarian;
  