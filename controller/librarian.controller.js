const db = require('../config/database');

/**
 * Lista todos os bibliotecários em 'librarian'.
 */
exports.listarLibrarians = async () => {
  const { rows } = await db.query(
    `SELECT 
       register AS id_librarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       password, 
       link_img AS linkImg 
     FROM librarian 
     ORDER BY register`
  );
  return rows;
};

/**
 * Cadastra um novo bibliotecário em 'librarian'.
 */
exports.cadastrarLibrarian = async (
  name,
  dateBirth,
  email,
  phone,
  password,
  linkImg
) => {
  const { rows } = await db.query(
    `INSERT INTO librarian 
       (name, date_birth, email, phone, password, link_img)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'https://uploads.promoview.com.br/2023/12/b72a1cfe.png'))
     RETURNING 
       register AS id_librarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       password, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, password, linkImg]
  );
  return rows[0];
};

/**
 * Altera um bibliotecário existente pelo register.
 */
exports.alterarLibrarian = async (
  id_librarian,
  name,
  dateBirth,
  email,
  phone,
  password,
  linkImg
) => {
  const { rows } = await db.query(
    `UPDATE librarian 
     SET 
       name = $1, 
       date_birth = $2, 
       email = $3, 
       phone = $4, 
       password = $5, 
       link_img = COALESCE($6, link_img)
     WHERE register = $7
     RETURNING 
       register AS id_librarian, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       password, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, password, linkImg, id_librarian]
  );
  if (rows.length === 0) throw new Error('Librarian não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um bibliotecário pelo register.
 */
exports.removerLibrarian = async (id_librarian) => {
  const { rowCount } = await db.query(
    'DELETE FROM librarian WHERE register = $1',
    [id_librarian]
  );
  if (rowCount === 0) throw new Error('Librarian não encontrado para remover');
  return true;
};
