const db = require("../config/database");

/**
 * Lista todos os gêneros.
 */
exports.listarGenres = async () => {
  const { rows } = await db.query(
    "SELECT id AS idGenre, name FROM genres ORDER BY id"
  );
  return rows;
};

/**
 * Busca um gênero pelo ID.
 */
exports.buscarGenrePorId = async (idGenre) => {
  const { rows } = await db.query(
    "SELECT id AS idGenre, name FROM genres WHERE id = $1",
    [idGenre]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo gênero.
 */
exports.criarGenre = async (name) => {
  const { rows } = await db.query(
    "INSERT INTO genres (name) VALUES ($1) RETURNING id AS idGenre, name",
    [name]
  );
  return rows[0];
};

/**
 * Altera um gênero existente pelo ID.
 */
exports.alterarGenre = async (idGenre, name) => {
  const { rows } = await db.query(
    "UPDATE genres SET name = $1 WHERE id = $2 RETURNING id AS idGenre, name",
    [name, idGenre]
  );
  if (rows.length === 0) throw new Error("Genre não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um gênero pelo ID.
 */
exports.removerGenre = async (idGenre) => {
  const { rowCount } = await db.query(
    "DELETE FROM genres WHERE id = $1",
    [idGenre]
  );
  if (rowCount === 0) throw new Error("Genre não encontrado para remover");
  return true;
};
