const db = require('../config/database');

/**
 * Lista todos os autores em 'authors'.
 */
exports.listarAuthors = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_author, 
       name, 
       country, 
       date_birth AS dateBirth 
     FROM authors 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cadastra um novo autor em 'authors'.
 */
exports.cadastrarAuthor = async (name, country, dateBirth) => {
  const { rows } = await db.query(
    `INSERT INTO authors (name, country, date_birth)
     VALUES ($1, $2, $3)
     RETURNING 
       id AS id_author, 
       name, 
       country, 
       date_birth AS dateBirth`,
    [name, country, dateBirth]
  );
  return rows[0];
};

/**
 * Altera um autor existente pelo id.
 */
exports.alterarAuthor = async (id_author, name, country, dateBirth) => {
  const { rows } = await db.query(
    `UPDATE authors 
     SET name = $1, country = $2, date_birth = $3 
     WHERE id = $4 
     RETURNING 
       id AS id_author, name, country, date_birth AS dateBirth`,
    [name, country, dateBirth, id_author]
  );
  if (rows.length === 0) throw new Error('Author não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um autor pelo id.
 */
exports.removerAuthor = async (id_author) => {
  const { rowCount } = await db.query(
    'DELETE FROM authors WHERE id = $1',
    [id_author]
  );
  if (rowCount === 0) throw new Error('Author não encontrado para remover');
  return true;
};

