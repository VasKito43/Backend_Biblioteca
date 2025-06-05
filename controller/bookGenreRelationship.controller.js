const db = require('../config/database');

/**
 * Lista todos os relacionamentos livro↔gênero.
 */
exports.listarBookGenre = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_relationship, 
       book_isbn AS bookIsbn, 
       genre_id AS genreId 
     FROM book_genre_relationship 
     ORDER BY id`
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
       id AS id_relationship, 
       book_isbn AS bookIsbn, 
       genre_id AS genreId`,
    [bookIsbn, genreId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento livro↔gênero pelo id.
 */
exports.removerBookGenre = async (id_relationship) => {
  const { rowCount } = await db.query(
    'DELETE FROM book_genre_relationship WHERE id = $1',
    [id_relationship]
  );
  if (rowCount === 0) throw new Error('BookGenre não encontrado para remover');
  return true;
};

