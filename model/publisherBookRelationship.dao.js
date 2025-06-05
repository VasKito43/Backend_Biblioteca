const db = require("../config/database");

/**
 * Lista todos os relacionamentos editora↔livro.
 */
exports.listarPublisherBook = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idRelationship, 
       publisher_id AS publisherId, 
       book_isbn AS bookIsbn 
     FROM publisher_book_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca a(s) editora(s) de um livro pelo ISBN.
 */
exports.listarPublishersPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `SELECT 
       p.id AS idPublisher, 
       p.name, 
       p.country 
     FROM publishers p
     JOIN publisher_book_relationship pbr ON p.id = pbr.publisher_id
     WHERE pbr.book_isbn = $1
     ORDER BY p.name`,
    [bookIsbn]
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
       id AS idRelationship, 
       publisher_id AS publisherId, 
       book_isbn AS bookIsbn`,
    [publisherId, bookIsbn]
  );
  return rows[0];
};

/**
 * Remove um relacionamento editora↔livro pelo ID do relacionamento.
 */
exports.removerPublisherBook = async (idRelationship) => {
  const { rowCount } = await db.query(
    "DELETE FROM publisher_book_relationship WHERE id = $1",
    [idRelationship]
  );
  if (rowCount === 0) throw new Error("PublisherBook não encontrado para remover");
  return true;
};

/**
 * Remove todas as editoras de um livro (útil antes de atualizar).
 */
exports.removerPublishersDeBook = async (bookIsbn) => {
  await db.query(
    "DELETE FROM publisher_book_relationship WHERE book_isbn = $1",
    [bookIsbn]
  );
  return true;
};

