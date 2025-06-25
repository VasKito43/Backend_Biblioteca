// controller/books.controller.js
const db = require('../config/database');

/**
 * Lista todos os livros.
 */
exports.listarBooks = async () => {
  const { rows } = await db.query(
    `SELECT 
       isbn, 
       title, 
       realease_date AS realeaseDate, 
       register_date AS registerDate, 
       quantity_available AS quantityAvailable, 
       edition, 
       link_img AS linkImg 
     FROM books 
     ORDER BY title`
  );
  return rows;
};

/**
 * Retorna um único livro pelo ISBN.
 * Lança erro se não existir.
 */
exports.obterBook = async (isbn) => {
  const { rows } = await db.query(
    `SELECT 
       isbn, 
       title, 
       realease_date AS realeaseDate, 
       register_date AS registerDate, 
       quantity_available AS quantityAvailable, 
       edition, 
       link_img AS linkImg 
     FROM books 
     WHERE isbn = $1`,
    [isbn]
  );
  if (rows.length === 0) throw new Error('Livro não encontrado.');
  return rows[0];
};

/**
 * Cadastra um novo livro.
 */
exports.cadastrarBook = async (
  isbn, title, realeaseDate, registerDate, quantityAvailable, edition, linkImg
) => {
  const { rows } = await db.query(
    `INSERT INTO books 
       (isbn, title, realease_date, register_date, quantity_available, edition, link_img)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING 
       isbn, title, 
       realease_date AS realeaseDate, 
       register_date AS registerDate, 
       quantity_available AS quantityAvailable, 
       edition, link_img AS linkImg`,
    [isbn, title, realeaseDate, registerDate, quantityAvailable, edition, linkImg]
  );
  return rows[0];
};

/**
 * Altera um livro existente pelo ISBN.
 */
 exports.alterarBook = async (isbn, quantityAvailable) => {
  // converte sempre para inteiro e valida
  const qty = parseInt(quantityAvailable, 10);
  if (isNaN(qty)) {
    throw new Error('quantityAvailable inválido');
  }

  const sql = `
    UPDATE books
      SET quantity_available = $2
    WHERE isbn = $1
    RETURNING
      isbn,
      quantity_available AS quantityAvailable
  `;

  // ATENÇÃO: primeiro sql, depois os valores [isbn, qty]
  const { rows } = await db.query(sql, [isbn, qty]);

  if (rows.length === 0) {
    throw new Error('Livro não encontrado para alterar.');
  }
  return rows[0];
};

/**
 * Remove um livro pelo ISBN.
 */
exports.removerBook = async (isbn) => {
  const { rowCount } = await db.query(
    'DELETE FROM books WHERE isbn = $1',
    [isbn]
  );
  if (rowCount === 0) throw new Error('Livro não encontrado para remover.');
  return true;
};
