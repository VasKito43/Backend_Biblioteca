const db = require("../config/database");
const md5 = require("md5");

/**
 * Lista todos os bibliotecários.
 */
exports.listarLibrarians = async () => {
  const { rows } = await db.query(
    `SELECT 
       register AS idLibrarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       link_img AS linkImg 
     FROM librarian 
     ORDER BY register`
  );
  return rows;
};

/**
 * Busca um bibliotecário pelo ID.
 */
exports.buscarLibrarianPorId = async (idLibrarian) => {
  const { rows } = await db.query(
    `SELECT 
       register AS idLibrarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       link_img AS linkImg 
     FROM librarian 
     WHERE register = $1`,
    [idLibrarian]
  );
  return rows[0] || null;
};

/**
 * Cria um novo bibliotecário (hasheia a senha com MD5).
 */
exports.criarLibrarian = async (dados) => {
  // dados = { name, dateBirth, email, phone, password, linkImg }
  const { name, dateBirth, email, phone, password, linkImg } = dados;
  const { rows } = await db.query(
    `INSERT INTO librarian 
       (name, date_birth, email, phone, password, link_img) 
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'https://uploads.promoview.com.br/2023/12/b72a1cfe.png'))
     RETURNING 
       register AS idLibrarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, md5(password), linkImg]
  );
  return rows[0];
};

/**
 * Altera um bibliotecário existente pelo ID (opcionalmente altera senha).
 */
exports.alterarLibrarian = async (idLibrarian, dados) => {
  // dados = { name, dateBirth, email, phone, password?, linkImg? }
  const { name, dateBirth, email, phone, password, linkImg } = dados;
  let query, params;

  if (password) {
    query = `
      UPDATE librarian 
      SET 
        name = $1, 
        date_birth = $2, 
        email = $3, 
        phone = $4, 
        password = $5, 
        link_img = COALESCE($6, link_img)
      WHERE register = $7
      RETURNING 
        register AS idLibrarian, 
        name, 
        date_birth AS dateBirth, 
        email, 
        phone, 
        link_img AS linkImg
    `;
    params = [name, dateBirth, email, phone, md5(password), linkImg, idLibrarian];
  } else {
    query = `
      UPDATE librarian 
      SET 
        name = $1, 
        date_birth = $2, 
        email = $3, 
        phone = $4, 
        link_img = COALESCE($5, link_img)
      WHERE register = $6
      RETURNING 
        register AS idLibrarian, 
        name, 
        date_birth AS dateBirth, 
        email, 
        phone, 
        link_img AS linkImg
    `;
    params = [name, dateBirth, email, phone, linkImg, idLibrarian];
  }

  const { rows } = await db.query(query, params);
  if (rows.length === 0) throw new Error("Librarian não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um bibliotecário pelo ID.
 */
exports.removerLibrarian = async (idLibrarian) => {
  const { rowCount } = await db.query(
    "DELETE FROM librarian WHERE register = $1",
    [idLibrarian]
  );
  if (rowCount === 0) throw new Error("Librarian não encontrado para remover");
  return true;
};
