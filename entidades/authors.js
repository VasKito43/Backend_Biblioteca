// authors.js
class Author {
    constructor(id, name, country, dateBirth) {
      this.id = id;            // INTEGER PK
      this.name = name;        // VARCHAR(50)
      this.country = country;  // VARCHAR(50)
      this.dateBirth = dateBirth; // DATE
    }
  }
  
  module.exports = Author;
  