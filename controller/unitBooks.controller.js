const db = require('../config/database');

/**
 * Lista todas as unidades físicas em 'unit_books'.
 */
exports.listarUnitBooks = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_unit, 
       book_isbn AS bookIsbn 
     FROM unit_books 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cadastra uma nova unidade física (unit_book).
 */
exports.cadastrarUnitBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `INSERT INTO unit_books (book_isbn)
     VALUES ($1)
     RETURNING 
       id AS id_unit, 
       book_isbn AS bookIsbn`,
    [bookIsbn]
  );
  return rows[0];
};

/**
 * Remove uma unidade física pelo id.
 */
exports.removerUnitBook = async (id_unit) => {
  const { rowCount } = await db.query(
    'DELETE FROM unit_books WHERE id = $1',
    [id_unit]
  );
  if (rowCount === 0) throw new Error('UnitBook não encontrado para remover');
  return true;
};

