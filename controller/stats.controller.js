const db = require('../config/database');

/**
 * Lista todos os status em 'stats'.
 */
exports.listarStats = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_stat, name FROM stats ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra um novo status em 'stats'.
 */
exports.cadastrarStat = async (name) => {
  const { rows } = await db.query(
    'INSERT INTO stats (name) VALUES ($1) RETURNING id AS id_stat, name',
    [name]
  );
  return rows[0];
};

/**
 * Altera um status existente pelo id.
 */
exports.alterarStat = async (id_stat, name) => {
  const { rows } = await db.query(
    'UPDATE stats SET name = $1 WHERE id = $2 RETURNING id AS id_stat, name',
    [name, id_stat]
  );
  if (rows.length === 0) throw new Error('Stat não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um status pelo id.
 */
exports.removerStat = async (id_stat) => {
  const { rowCount } = await db.query(
    'DELETE FROM stats WHERE id = $1',
    [id_stat]
  );
  if (rowCount === 0) throw new Error('Stat não encontrado para remover');
  return true;
};
