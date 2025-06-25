const db = require("../config/database");

/**
 * Lista todos os livros, com dados básicos.
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
 * Busca um livro pelo ISBN.
 */
exports.buscarBookPorIsbn = async (isbn) => {
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
  return rows[0] || null;
};

/**
 * Cadastra um novo livro.
 */
exports.criarBook = async (
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
   quantityAvailable
 ) => {
   const { rows } = await db.query(
-    `UPDATE books 
-     SET 
-       quantity_available = $2, 
-
-     WHERE isbn = $1 
-     RETURNING 
-       isbn, 
-       quantity_available AS quantityAvailable,`,
-    [quantityAvailable, isbn]
+    `UPDATE books
+     SET quantity_available = $2
+     WHERE isbn = $1
+     RETURNING
+       isbn,
+       quantity_available AS quantityAvailable`,
+    [isbn, quantityAvailable]
   );
   if (rows.length === 0) throw new Error("Book não encontrado para alterar");
   return rows[0];
 };

/**
 * Remove (deleta) um livro pelo ISBN.
 */
exports.removerBook = async (isbn) => {
  const { rowCount } = await db.query(
    "DELETE FROM books WHERE isbn = $1",
    [isbn]
  );
  if (rowCount === 0) throw new Error("Book não encontrado para remover");
  return true;
};

/**
 * Busca livros cujo título contenha um trecho (para busca rápida/autocomplete).
 */
exports.buscarBooksPorTitulo = async (trechoTitulo) => {
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
     WHERE title ILIKE '%' || $1 || '%' 
     ORDER BY title`,
    [trechoTitulo]
  );
  return rows;
};

/**
 * Busca todos os livros de um determinado gênero (ex.: listar todos de Ficção Científica).
 */
exports.buscarBooksPorGenre = async (genreId) => {
  const { rows } = await db.query(
    `SELECT 
       b.isbn, 
       b.title, 
       b.realease_date AS realeaseDate, 
       b.register_date AS registerDate, 
       b.quantity_available AS quantityAvailable, 
       b.edition, 
       b.link_img AS linkImg 
     FROM books b
     JOIN book_genre_relationship bgr ON b.isbn = bgr.book_isbn
     WHERE bgr.genre_id = $1
     ORDER BY b.title`,
    [genreId]
  );
  return rows;
};

