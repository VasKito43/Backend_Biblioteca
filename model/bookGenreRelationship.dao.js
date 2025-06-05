const db = require("../config/database");

/**
 * Lista todos os relacionamentos livro↔gênero.
 */
exports.listarBookGenre = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idRelationship, 
       book_isbn AS bookIsbn, 
       genre_id AS genreId 
     FROM book_genre_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca todos os gêneros de um livro pelo ISBN.
 */
exports.listarGenresPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `SELECT 
       g.id AS idGenre, 
       g.name 
     FROM genres g
     JOIN book_genre_relationship bgr ON g.id = bgr.genre_id
     WHERE bgr.book_isbn = $1
     ORDER BY g.name`,
    [bookIsbn]
  );
  return rows;
};

/**
 * Cria um novo relacionamento livro↔gênero.
 */
exports.cadastrarBookGenre = async (bookIsbn, genreId) => {
  const { rows } = await db.query(
    `INSERT INTO book_genre_relationship (book_isbn, genre_id)
     VALUES ($1, $2)
     RETURNING 
       id AS idRelationship, 
       book_isbn AS bookIsbn, 
       genre_id AS genreId`,
    [bookIsbn, genreId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento livro↔gênero específico.
 */
exports.removerBookGenre = async (idRelationship) => {
  const { rowCount } = await db.query(
    "DELETE FROM book_genre_relationship WHERE id = $1",
    [idRelationship]
  );
  if (rowCount === 0) throw new Error("BookGenre não encontrado para remover");
  return true;
};

/**
 * Remove todos os relacionamentos de gêneros de um livro (útil antes de atualizar).
 */
exports.removerGenresDeBook = async (bookIsbn) => {
  await db.query(
    "DELETE FROM book_genre_relationship WHERE book_isbn = $1",
    [bookIsbn]
  );
  return true;
};

