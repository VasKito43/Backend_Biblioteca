// addresses.js
class Address {
    constructor(id, cep, houseNumber, complement) {
      this.id = id;               // INTEGER PK
      this.cep = cep;             // VARCHAR(20)
      this.houseNumber = houseNumber; // INTEGER
      this.complement = complement;   // VARCHAR(50)
    }
  }
  
  module.exports = Address;
  