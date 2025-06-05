const db = require('../config/database');

/**
 * Lista todos os relacionamentos usuário↔curso.
 */
exports.listarUserCurse = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_relationship, 
       user_register AS userRegister, 
       curse_id AS curseId 
     FROM user_curse_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cria um novo relacionamento usuário↔curso.
 */
exports.cadastrarUserCurse = async (userRegister, curseId) => {
  const { rows } = await db.query(
    `INSERT INTO user_curse_relationship (user_register, curse_id)
     VALUES ($1, $2)
     RETURNING 
       id AS id_relationship, 
       user_register AS userRegister, 
       curse_id AS curseId`,
    [userRegister, curseId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento usuário↔curso pelo id.
 */
exports.removerUserCurse = async (id_relationship) => {
  const { rowCount } = await db.query(
    'DELETE FROM user_curse_relationship WHERE id = $1',
    [id_relationship]
  );
  if (rowCount === 0) throw new Error('UserCurse não encontrado para remover');
  return true;
};
