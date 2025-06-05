const db = require('../config/database');

/**
 * Lista todos os gêneros em 'genres'.
 */
exports.listarGenres = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_genre, name FROM genres ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra um novo gênero em 'genres'.
 */
exports.cadastrarGenre = async (name) => {
  const { rows } = await db.query(
    'INSERT INTO genres (name) VALUES ($1) RETURNING id AS id_genre, name',
    [name]
  );
  return rows[0];
};

/**
 * Altera um gênero existente pelo id.
 */
exports.alterarGenre = async (id_genre, name) => {
  const { rows } = await db.query(
    'UPDATE genres SET name = $1 WHERE id = $2 RETURNING id AS id_genre, name',
    [name, id_genre]
  );
  if (rows.length === 0) throw new Error('Genre não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um gênero pelo id.
 */
exports.removerGenre = async (id_genre) => {
  const { rowCount } = await db.query(
    'DELETE FROM genres WHERE id = $1',
    [id_genre]
  );
  if (rowCount === 0) throw new Error('Genre não encontrado para remover');
  return true;
};

