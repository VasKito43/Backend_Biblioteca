// controller/books.controller.js
const db = require('../config/database');

/**
 * Lista todos os livros em 'books'.
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
  if (rows.length === 0) throw new Error('Book não encontrado');
  return rows[0];
};

/**
 * Cadastra um novo livro em 'books'.
 */
exports.cadastrarBook = async (
  isbn,
  title,
  realeaseDate,
  registerDate,
  quantityAvailable,
  edition,
  linkImg
) => {
  const { rows } = await db.query(
    `INSERT INTO books 
       (isbn, title, realease_date, register_date, quantity_available, edition, link_img)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING 
       isbn, 
       title, 
       realease_date AS realeaseDate, 
       register_date AS registerDate, 
       quantity_available AS quantityAvailable, 
       edition, 
       link_img AS linkImg`,
    [isbn, title, realeaseDate, registerDate, quantityAvailable, edition, linkImg]
  );
  return rows[0];
};

/**
 * Altera um livro existente pelo ISBN.
 */
exports.alterarBook = async (
  isbn,
  title,
  realeaseDate,
  registerDate,
  quantityAvailable,
  edition,
  linkImg
) => {
  const { rows } = await db.query(
    `UPDATE books 
     SET title = $1, 
         realease_date = $2, 
         register_date = $3, 
         quantity_available = $4, 
         edition = $5, 
         link_img = $6 
     WHERE isbn = $7 
     RETURNING 
       isbn, 
       title, 
       realease_date AS realeaseDate, 
       register_date AS registerDate, 
       quantity_available AS quantityAvailable, 
       edition, 
       link_img AS linkImg`,
    [title, realeaseDate, registerDate, quantityAvailable, edition, linkImg, isbn]
  );
  if (rows.length === 0) throw new Error('Book não encontrado para alterar');
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
  if (rowCount === 0) throw new Error('Book não encontrado para remover');
  return true;
};
