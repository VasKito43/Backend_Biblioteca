//Usei md5 para hashear a senha, seguindo o padrão do seu exemplo.
const db = require("../config/database");
const md5 = require("md5");

/**
 * Lista todos os usuários ativos (stats_user_id = 1 ou 'active').
 */
exports.listarUsers = async () => {
  const { rows } = await db.query(
    `SELECT 
       register AS idUser, 
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
     WHERE stats_user_id = 1 
     ORDER BY register`
  );
  return rows;
};

/**
 * Busca um usuário pelo register.
 */
exports.buscarUserPorId = async (idUser) => {
  const { rows } = await db.query(
    `SELECT 
       register AS idUser, 
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
     WHERE register = $1`,
    [idUser]
  );
  return rows[0] || null;
};

/**
 * Busca um usuário pelo e-mail.
 */
exports.buscarUserPorEmail = async (email) => {
  const { rows } = await db.query(
    `SELECT 
       register AS idUser, 
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
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
};

/**
 * Busca um usuário pelo nome de usuário (username não existe em seu schema,
 * mas caso queira adicionar, coloque aqui).
 * Se for autenticação, compare as senhas fora do DAO.
 */
exports.procurarUsuarioPeloUsername = async (username) => {
  const { rows } = await db.query(
    `SELECT 
       register AS idUser, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg, 
       senha 
     FROM usuario 
     WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
};

/**
 * Cria um novo usuário.
 */
exports.criarUser = async (novoUser) => {
  // Ex.: novoUser = { name, dateBirth, email, phone, senha, addressId, typeId, statsUserId, linkImg }
  const { rows } = await db.query(
    `INSERT INTO users 
       (name, date_birth, email, phone, debts, address_id, type_id, stats_user_id, link_img)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'https://uploads.promoview.com.br/2023/12/b72a1cfe.png'))
     RETURNING 
       register AS idUser, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [
      novoUser.name,
      novoUser.dateBirth,
      novoUser.email,
      novoUser.phone,
      novoUser.debts || 0,
      novoUser.addressId,
      novoUser.typeId,
      novoUser.statsUserId,
      novoUser.linkImg || null
    ]
  );
  return rows[0];
};

/**
 * Altera um usuário existente pelo register.
 */
exports.alterarUser = async (idUser, dadosUser) => {
  // Ex.: dadosUser = { name, dateBirth, email, phone, debts, addressId, typeId, statsUserId, linkImg }
  const {
    name,
    dateBirth,
    email,
    phone,
    debts,
    addressId,
    typeId,
    statsUserId,
    linkImg
  } = dadosUser;
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
       register AS idUser, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [
      name,
      dateBirth,
      email,
      phone,
      debts,
      addressId,
      typeId,
      statsUserId,
      linkImg,
      idUser
    ]
  );
  if (rows.length === 0) throw new Error("User não encontrado para alterar");
  return rows[0];
};

/**
 * “Remover” um usuário marcando status (por exemplo, marcando stats_user_id = 3 → “deleted”).
 */
exports.removerUser = async (idUser) => {
  // Em vez de apagar, marcamos como deleted (stats_user_id = 3)
  const { rowCount } = await db.query(
    "UPDATE users SET stats_user_id = 3 WHERE register = $1",
    [idUser]
  );
  if (rowCount === 0) throw new Error("User não encontrado para remover");
  return true;
};

/**
 * Aumenta a dívida (debts) de um usuário quando ele atrasa a devolução.
 */
exports.adicionarDivida = async (idUser, valor) => {
  const { rows } = await db.query(
    `UPDATE users 
     SET debts = debts + $1 
     WHERE register = $2 
     RETURNING 
       register AS idUser, 
       debts`,
    [valor, idUser]
  );
  if (rows.length === 0) throw new Error("User não encontrado para adicionar dívida");
  return rows[0];
};
