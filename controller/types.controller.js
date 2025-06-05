const db = require('../config/database');

/**
 * Lista todos os tipos na tabela 'types'.
 * Cada linha possui colunas: id, name.
 */
exports.listarTypes = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_type, name FROM types ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra um novo tipo na tabela 'types'.
 */
exports.cadastrarType = async (name) => {
  const { rows } = await db.query(
    'INSERT INTO types (name) VALUES ($1) RETURNING id AS id_type, name',
    [name]
  );
  return rows[0];
};

/**
 * Altera o nome de um tipo existente pelo id.
 */
exports.alterarType = async (id_type, name) => {
  const { rows } = await db.query(
    'UPDATE types SET name = $1 WHERE id = $2 RETURNING id AS id_type, name',
    [name, id_type]
  );
  if (rows.length === 0) throw new Error('Type não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um tipo pelo id.
 */
exports.removerType = async (id_type) => {
  const { rowCount } = await db.query(
    'DELETE FROM types WHERE id = $1',
    [id_type]
  );
  if (rowCount === 0) throw new Error('Type não encontrado para remover');
  return true;
};

