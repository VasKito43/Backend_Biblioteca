const db = require("../config/database");

/**
 * Lista todos os tipos de usuários.
 */
exports.listarTypes = async () => {
  const { rows } = await db.query(
    "SELECT id AS idType, name FROM types ORDER BY id"
  );
  return rows;
};

/**
 * Busca um tipo pelo ID.
 */
exports.buscarTypePorId = async (idType) => {
  const { rows } = await db.query(
    "SELECT id AS idType, name FROM types WHERE id = $1",
    [idType]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo tipo.
 */
exports.criarType = async (name) => {
  const { rows } = await db.query(
    "INSERT INTO types (name) VALUES ($1) RETURNING id AS idType, name",
    [name]
  );
  return rows[0];
};

/**
 * Altera um tipo existente pelo ID.
 */
exports.alterarType = async (idType, name) => {
  const { rows } = await db.query(
    "UPDATE types SET name = $1 WHERE id = $2 RETURNING id AS idType, name",
    [name, idType]
  );
  if (rows.length === 0) throw new Error("Type não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um tipo pelo ID.
 */
exports.removerType = async (idType) => {
  const { rowCount } = await db.query(
    "DELETE FROM types WHERE id = $1",
    [idType]
  );
  if (rowCount === 0) throw new Error("Type não encontrado para remover");
  return true;
};
