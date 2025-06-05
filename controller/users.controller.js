const db = require('../config/database');

/**
 * Lista todos os usuários em 'users'.
 */
exports.listarUsers = async () => {
  const { rows } = await db.query(
    `SELECT 
       register AS id_user, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg 
     FROM users 
     ORDER BY register`
  );
  return rows;
};

/**
 * Cadastra um novo usuário em 'users'.
 */
exports.cadastrarUser = async (
  name,
  dateBirth,
  email,
  phone,
  debts,
  addressId,
  typeId,
  statsUserId,
  linkImg
) => {
  const { rows } = await db.query(
    `INSERT INTO users 
       (name, date_birth, email, phone, debts, address_id, type_id, stats_user_id, link_img)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'https://uploads.promoview.com.br/2023/12/b72a1cfe.png'))
     RETURNING 
       register AS id_user, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, debts, addressId, typeId, statsUserId, linkImg]
  );
  return rows[0];
};

/**
 * Altera um usuário existente pelo register.
 */
exports.alterarUser = async (
  id_user,
  name,
  dateBirth,
  email,
  phone,
  debts,
  addressId,
  typeId,
  statsUserId,
  linkImg
) => {
  const { rows } = await db.query(
    `UPDATE users 
     SET 
       name = $1, 
       date_birth = $2, 
       email = $3, 
       phone = $4, 
       debts = $5, 
       address_id = $6, 
       type_id = $7, 
       stats_user_id = $8, 
       link_img = COALESCE($9, link_img)
     WHERE register = $10
     RETURNING 
       register AS id_user, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, debts, addressId, typeId, statsUserId, linkImg, id_user]
  );
  if (rows.length === 0) throw new Error('User não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um usuário pelo register.
 */
exports.removerUser = async (id_user) => {
  const { rowCount } = await db.query(
    'DELETE FROM users WHERE register = $1',
    [id_user]
  );
  if (rowCount === 0) throw new Error('User não encontrado para remover');
  return true;
};
