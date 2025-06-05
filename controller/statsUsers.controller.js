const db = require('../config/database');

/**
 * Lista todos os status de usuário em 'stats_users'.
 */
exports.listarStatsUsers = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_stats_user, name FROM stats_users ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra um novo status de usuário.
 */
exports.cadastrarStatsUser = async (name) => {
  const { rows } = await db.query(
    'INSERT INTO stats_users (name) VALUES ($1) RETURNING id AS id_stats_user, name',
    [name]
  );
  return rows[0];
};

/**
 * Altera um status de usuário existente pelo id.
 */
exports.alterarStatsUser = async (id_stats_user, name) => {
  const { rows } = await db.query(
    'UPDATE stats_users SET name = $1 WHERE id = $2 RETURNING id AS id_stats_user, name',
    [name, id_stats_user]
  );
  if (rows.length === 0) throw new Error('StatsUser não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um status de usuário pelo id.
 */
exports.removerStatsUser = async (id_stats_user) => {
  const { rowCount } = await db.query(
    'DELETE FROM stats_users WHERE id = $1',
    [id_stats_user]
  );
  if (rowCount === 0) throw new Error('StatsUser não encontrado para remover');
  return true;
};
