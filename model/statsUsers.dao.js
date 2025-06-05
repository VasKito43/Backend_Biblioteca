const db = require("../config/database");

/**
 * Lista todos os status de usuário.
 */
exports.listarStatsUsers = async () => {
  const { rows } = await db.query(
    "SELECT id AS idStatsUser, name FROM stats_users ORDER BY id"
  );
  return rows;
};

/**
 * Busca um status de usuário pelo ID.
 */
exports.buscarStatsUserPorId = async (idStatsUser) => {
  const { rows } = await db.query(
    "SELECT id AS idStatsUser, name FROM stats_users WHERE id = $1",
    [idStatsUser]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo status de usuário.
 */
exports.criarStatsUser = async (name) => {
  const { rows } = await db.query(
    "INSERT INTO stats_users (name) VALUES ($1) RETURNING id AS idStatsUser, name",
    [name]
  );
  return rows[0];
};

/**
 * Altera um status de usuário existente pelo ID.
 */
exports.alterarStatsUser = async (idStatsUser, name) => {
  const { rows } = await db.query(
    "UPDATE stats_users SET name = $1 WHERE id = $2 RETURNING id AS idStatsUser, name",
    [name, idStatsUser]
  );
  if (rows.length === 0) throw new Error("StatsUser não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um status de usuário pelo ID.
 */
exports.removerStatsUser = async (idStatsUser) => {
  const { rowCount } = await db.query(
    "DELETE FROM stats_users WHERE id = $1",
    [idStatsUser]
  );
  if (rowCount === 0) throw new Error("StatsUser não encontrado para remover");
  return true;
};

