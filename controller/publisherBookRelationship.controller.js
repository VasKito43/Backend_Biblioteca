const db = require('../config/database');

/**
 * Lista todos os relacionamentos editora↔livro.
 */
exports.listarPublisherBook = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_relationship, 
       publisher_id AS publisherId, 
       book_isbn AS bookIsbn 
     FROM publisher_book_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cria um novo relacionamento editora↔livro.
 */
exports.cadastrarPublisherBook = async (publisherId, bookIsbn) => {
  const { rows } = await db.query(
    `INSERT INTO publisher_book_relationship (publisher_id, book_isbn)
     VALUES ($1, $2)
     RETURNING 
       id AS id_relationship, 
       publisher_id AS publisherId, 
       book_isbn AS bookIsbn`,
    [publisherId, bookIsbn]
  );
  return rows[0];
};

/**
 * Remove um relacionamento editora↔livro pelo id.
 */
exports.removerPublisherBook = async (id_relationship) => {
  const { rowCount } = await db.query(
    'DELETE FROM publisher_book_relationship WHERE id = $1',
    [id_relationship]
  );
  if (rowCount === 0) throw new Error('PublisherBook não encontrado para remover');
  return true;
};
