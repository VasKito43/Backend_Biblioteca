// users.js
class User {
    constructor(
      register,
      name,
      dateBirth,
      email,
      phone,
      debts,
      addressId,
      typeId,
      statsUserId,
      linkImg
    ) {
      this.register = register;    // INTEGER PK
      this.name = name;            // VARCHAR(50)
      this.dateBirth = dateBirth;  // DATE
      this.email = email;          // VARCHAR(100)
      this.phone = phone;          // VARCHAR(20)
      this.debts = debts;          // INTEGER
      this.addressId = addressId;  // INTEGER → FK para addresses.id
      this.typeId = typeId;        // INTEGER → FK para types.id
      this.statsUserId = statsUserId; // INTEGER → FK para stats_users.id
      this.linkImg = linkImg;      // TEXT (default já configurado no BD)
    }
  
    // Opcional:
    // this.address = null;
    // this.type = null;
    // this.statsUser = null;
    // this.courses = [];
    // this.borrowings = [];
  }
  module.exports = User;
  