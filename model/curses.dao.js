const db = require("../config/database");

/**
 * Lista todos os cursos ativos.
 */
exports.listarCurses = async () => {
  const { rows } = await db.query(
    "SELECT id AS idCurse, names FROM curses ORDER BY id"
  );
  return rows;
};

/**
 * Busca um curso pelo ID.
 */
exports.buscarCursePorId = async (idCurse) => {
  const { rows } = await db.query(
    "SELECT id AS idCurse, names FROM curses WHERE id = $1",
    [idCurse]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo curso.
 */
exports.criarCurse = async (names) => {
  const { rows } = await db.query(
    "INSERT INTO curses (names) VALUES ($1) RETURNING id AS idCurse, names",
    [names]
  );
  return rows[0];
};

/**
 * Altera o nome de um curso existente pelo ID.
 */
exports.alterarCurse = async (idCurse, names) => {
  const { rows } = await db.query(
    "UPDATE curses SET names = $1 WHERE id = $2 RETURNING id AS idCurse, names",
    [names, idCurse]
  );
  if (rows.length === 0) throw new Error("Curso não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um curso pelo ID.
 */
exports.removerCurse = async (idCurse) => {
  const { rowCount } = await db.query(
    "DELETE FROM curses WHERE id = $1",
    [idCurse]
  );
  if (rowCount === 0) throw new Error("Curso não encontrado para remover");
  return true;
};

/**
 * Verifica se um curso com determinado nome já existe (caso necessário para evitar duplicidades).
 */
exports.existeCurseComNome = async (names) => {
  const { rows } = await db.query(
    "SELECT COUNT(1) as count FROM curses WHERE names = $1",
    [names]
  );
  return parseInt(rows[0].count, 10) > 0;
};
