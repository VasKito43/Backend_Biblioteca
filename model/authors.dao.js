const db = require("../config/database");

/**
 * Lista todos os autores.
 */
exports.listarAuthors = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idAuthor, 
       name, 
       country, 
       date_birth AS dateBirth 
     FROM authors 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca um autor pelo ID.
 */
exports.buscarAuthorPorId = async (idAuthor) => {
  const { rows } = await db.query(
    `SELECT 
       id AS idAuthor, 
       name, 
       country, 
       date_birth AS dateBirth 
     FROM authors 
     WHERE id = $1`,
    [idAuthor]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo autor.
 */
exports.criarAuthor = async (name, country, dateBirth) => {
  const { rows } = await db.query(
    `INSERT INTO authors (name, country, date_birth)
     VALUES ($1, $2, $3)
     RETURNING 
       id AS idAuthor, 
       name, 
       country, 
       date_birth AS dateBirth`,
    [name, country, dateBirth]
  );
  return rows[0];
};

/**
 * Altera um autor existente pelo ID.
 */
exports.alterarAuthor = async (idAuthor, name, country, dateBirth) => {
  const { rows } = await db.query(
    `UPDATE authors 
     SET name = $1, country = $2, date_birth = $3 
     WHERE id = $4 
     RETURNING 
       id AS idAuthor, 
       name, 
       country, 
       date_birth AS dateBirth`,
    [name, country, dateBirth, idAuthor]
  );
  if (rows.length === 0) throw new Error("Author não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um autor pelo ID.
 */
exports.removerAuthor = async (idAuthor) => {
  const { rowCount } = await db.query(
    "DELETE FROM authors WHERE id = $1",
    [idAuthor]
  );
  if (rowCount === 0) throw new Error("Author não encontrado para remover");
  return true;
};

/**
 * Busca autores cujo nome contenha um trecho (para autocomplete ou busca parcial).
 */
exports.buscarAuthorsPorNome = async (trechoNome) => {
  const { rows } = await db.query(
    `SELECT 
       id AS idAuthor, 
       name, 
       country, 
       date_birth AS dateBirth 
     FROM authors 
     WHERE name ILIKE '%' || $1 || '%' 
     ORDER BY name`,
    [trechoNome]
  );
  return rows;
};

