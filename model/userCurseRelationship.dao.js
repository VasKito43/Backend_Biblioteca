const db = require("../config/database");

/**
 * Lista todos os relacionamentos usuário↔curso.
 */
exports.listarUserCurse = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idRelationship, 
       user_register AS userRegister, 
       curse_id AS curseId 
     FROM user_curse_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca todos os cursos de um usuário pelo register.
 */
exports.listarCursesPorUser = async (userRegister) => {
  const { rows } = await db.query(
    `SELECT 
       c.id AS idCurse, 
       c.names 
     FROM curses c
     JOIN user_curse_relationship ucr ON c.id = ucr.curse_id
     WHERE ucr.user_register = $1
     ORDER BY c.names`,
    [userRegister]
  );
  return rows;
};

/**
 * Cadastra um novo relacionamento usuário↔curso.
 */
exports.cadastrarUserCurse = async (userRegister, curseId) => {
  const { rows } = await db.query(
    `INSERT INTO user_curse_relationship (user_register, curse_id)
     VALUES ($1, $2)
     RETURNING id AS idRelationship, user_register AS userRegister, curse_id AS curseId`,
    [userRegister, curseId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento usuário↔curso pelo ID do relacionamento.
 */
exports.removerUserCurse = async (idRelationship) => {
  const { rowCount } = await db.query(
    "DELETE FROM user_curse_relationship WHERE id = $1",
    [idRelationship]
  );
  if (rowCount === 0) throw new Error("UserCurse não encontrado para remover");
  return true;
};

/**
 * Remove todos os cursos de um usuário (útil caso queira resetar vínculos).
 */
exports.removerCursesDeUser = async (userRegister) => {
  await db.query(
    "DELETE FROM user_curse_relationship WHERE user_register = $1",
    [userRegister]
  );
  return true;
};

