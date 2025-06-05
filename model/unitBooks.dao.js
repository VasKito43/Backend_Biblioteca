const db = require("../config/database");

/**
 * Lista todas as unidades físicas.
 */
exports.listarUnitBooks = async () => {
  const { rows } = await db.query(
    "SELECT id AS idUnit, book_isbn AS bookIsbn FROM unit_books ORDER BY id"
  );
  return rows;
};

/**
 * Busca uma unidade pelo ID.
 */
exports.buscarUnitBookPorId = async (idUnit) => {
  const { rows } = await db.query(
    "SELECT id AS idUnit, book_isbn AS bookIsbn FROM unit_books WHERE id = $1",
    [idUnit]
  );
  return rows[0] || null;
};

/**
 * Cadastra uma nova unidade física.
 */
exports.criarUnitBook = async (bookIsbn) => {
  const { rows } = await db.query(
    "INSERT INTO unit_books (book_isbn) VALUES ($1) RETURNING id AS idUnit, book_isbn AS bookIsbn",
    [bookIsbn]
  );
  return rows[0];
};

/**
 * Remove uma unidade pelo ID.
 */
exports.removerUnitBook = async (idUnit) => {
  const { rowCount } = await db.query(
    "DELETE FROM unit_books WHERE id = $1",
    [idUnit]
  );
  if (rowCount === 0) throw new Error("UnitBook não encontrado para remover");
  return true;
};

/**
 * Conta quantas unidades existem para um determinado livro (útil para verificar estoque).
 */
exports.contarUnidadesPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    "SELECT COUNT(1) AS quantidade FROM unit_books WHERE book_isbn = $1",
    [bookIsbn]
  );
  return parseInt(rows[0].quantidade, 10);
};
