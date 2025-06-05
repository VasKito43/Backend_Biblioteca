// publishers.js
class Publisher {
    constructor(id, name, country) {
      this.id = id;        // INTEGER PK
      this.name = name;    // VARCHAR(50)
      this.country = country; // VARCHAR(50)
    }
  }
  
  module.exports = Publisher;
  