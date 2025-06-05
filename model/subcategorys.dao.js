const db = require("../config/database");

/**
 * Lista todas as subcategorias.
 */
exports.listarSubcategorys = async () => {
  const { rows } = await db.query(
    "SELECT id AS idSubcategory, name FROM subcategorys ORDER BY id"
  );
  return rows;
};

/**
 * Busca uma subcategoria pelo ID.
 */
exports.buscarSubcategoryPorId = async (idSubcategory) => {
  const { rows } = await db.query(
    "SELECT id AS idSubcategory, name FROM subcategorys WHERE id = $1",
    [idSubcategory]
  );
  return rows[0] || null;
};

/**
 * Cadastra uma nova subcategoria.
 */
exports.criarSubcategory = async (name) => {
  const { rows } = await db.query(
    "INSERT INTO subcategorys (name) VALUES ($1) RETURNING id AS idSubcategory, name",
    [name]
  );
  return rows[0];
};

/**
 * Altera uma subcategoria existente pelo ID.
 */
exports.alterarSubcategory = async (idSubcategory, name) => {
  const { rows } = await db.query(
    "UPDATE subcategorys SET name = $1 WHERE id = $2 RETURNING id AS idSubcategory, name",
    [name, idSubcategory]
  );
  if (rows.length === 0) throw new Error("Subcategory não encontrada para alterar");
  return rows[0];
};

/**
 * Remove (deleta) uma subcategoria pelo ID.
 */
exports.removerSubcategory = async (idSubcategory) => {
  const { rowCount } = await db.query(
    "DELETE FROM subcategorys WHERE id = $1",
    [idSubcategory]
  );
  if (rowCount === 0) throw new Error("Subcategory não encontrada para remover");
  return true;
};

