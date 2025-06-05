const db = require('../config/database');

/**
 * Lista todas as subcategorias em 'subcategorys'.
 */
exports.listarSubcategorys = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_subcategory, name FROM subcategorys ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra uma nova subcategoria em 'subcategorys'.
 */
exports.cadastrarSubcategory = async (name) => {
  const { rows } = await db.query(
    'INSERT INTO subcategorys (name) VALUES ($1) RETURNING id AS id_subcategory, name',
    [name]
  );
  return rows[0];
};

/**
 * Altera uma subcategoria existente pelo id.
 */
exports.alterarSubcategory = async (id_subcategory, name) => {
  const { rows } = await db.query(
    'UPDATE subcategorys SET name = $1 WHERE id = $2 RETURNING id AS id_subcategory, name',
    [name, id_subcategory]
  );
  if (rows.length === 0) throw new Error('Subcategory não encontrada para alterar');
  return rows[0];
};

/**
 * Remove uma subcategoria pelo id.
 */
exports.removerSubcategory = async (id_subcategory) => {
  const { rowCount } = await db.query(
    'DELETE FROM subcategorys WHERE id = $1',
    [id_subcategory]
  );
  if (rowCount === 0) throw new Error('Subcategory não encontrada para remover');
  return true;
};
