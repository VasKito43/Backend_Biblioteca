const db = require("../config/database");

/**
 * Lista todos os status em `stats`.
 */
exports.listarStats = async () => {
  const { rows } = await db.query(
    "SELECT id AS idStat, name FROM stats ORDER BY id"
  );
  return rows;
};

/**
 * Busca um status pelo ID.
 */
exports.buscarStatPorId = async (idStat) => {
  const { rows } = await db.query(
    "SELECT id AS idStat, name FROM stats WHERE id = $1",
    [idStat]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo status em `stats`.
 */
exports.criarStat = async (name) => {
  const { rows } = await db.query(
    "INSERT INTO stats (name) VALUES ($1) RETURNING id AS idStat, name",
    [name]
  );
  return rows[0];
};

/**
 * Altera um status existente pelo ID.
 */
exports.alterarStat = async (idStat, name) => {
  const { rows } = await db.query(
    "UPDATE stats SET name = $1 WHERE id = $2 RETURNING id AS idStat, name",
    [name, idStat]
  );
  if (rows.length === 0) throw new Error("Stat não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um status pelo ID.
 */
exports.removerStat = async (idStat) => {
  const { rowCount } = await db.query(
    "DELETE FROM stats WHERE id = $1",
    [idStat]
  );
  if (rowCount === 0) throw new Error("Stat não encontrado para remover");
  return true;
};
