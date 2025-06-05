const db = require('../config/database');

/**
 * Lista todos os relacionamentos autor↔livro.
 */
exports.listarAuthorBook = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_relationship, 
       author_id AS authorId, 
       book_isbn AS bookIsbn 
     FROM author_book_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cria um novo relacionamento autor↔livro.
 */
exports.cadastrarAuthorBook = async (authorId, bookIsbn) => {
  const { rows } = await db.query(
    `INSERT INTO author_book_relationship (author_id, book_isbn)
     VALUES ($1, $2)
     RETURNING 
       id AS id_relationship, 
       author_id AS authorId, 
       book_isbn AS bookIsbn`,
    [authorId, bookIsbn]
  );
  return rows[0];
};

/**
 * Remove um relacionamento autor↔livro pelo id.
 */
exports.removerAuthorBook = async (id_relationship) => {
  const { rowCount } = await db.query(
    'DELETE FROM author_book_relationship WHERE id = $1',
    [id_relationship]
  );
  if (rowCount === 0) throw new Error('AuthorBook não encontrado para remover');
  return true;
};
