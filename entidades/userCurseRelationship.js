// userCurseRelationship.js
class UserCurseRelationship {
    constructor(id, userRegister, curseId) {
      this.id = id;             // INTEGER PK
      this.userRegister = userRegister; // INTEGER → FK para users.register
      this.curseId = curseId;         // INTEGER → FK para curses.id
    }
  
    // Opcional: this.user = null; this.curse = null;
  }
  
  module.exports = UserCurseRelationship;
  