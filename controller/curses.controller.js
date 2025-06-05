const db = require('../config/database');

/**
 * Lista todos os cursos na tabela 'curses'.
 * Cada linha possui colunas: id, names.
 */
exports.listarCurses = async () => {
  const { rows } = await db.query(
    'SELECT id AS id_curse, names FROM curses ORDER BY id'
  );
  return rows;
};

/**
 * Cadastra um novo curso na tabela 'curses'.
 * Retorna o registro criado.
 */
exports.cadastrarCurse = async (names) => {
  const { rows } = await db.query(
    'INSERT INTO curses (names) VALUES ($1) RETURNING id AS id_curse, names',
    [names]
  );
  return rows[0];
};

/**
 * Altera o nome de um curso existente pelo id.
 */
exports.alterarCurse = async (id_curse, names) => {
  const { rows } = await db.query(
    'UPDATE curses SET names = $1 WHERE id = $2 RETURNING id AS id_curse, names',
    [names, id_curse]
  );
  if (rows.length === 0) throw new Error('Curse não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um curso pelo id.
 */
exports.removerCurse = async (id_curse) => {
  const { rowCount } = await db.query(
    'DELETE FROM curses WHERE id = $1',
    [id_curse]
  );
  if (rowCount === 0) throw new Error('Curse não encontrado para remover');
  return true;
};
