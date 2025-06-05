const db = require("../config/database");

/**
 * Lista todos os relacionamentos autor↔livro.
 */
exports.listarAuthorBook = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idRelationship, 
       author_id AS authorId, 
       book_isbn AS bookIsbn 
     FROM author_book_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca todos os autores de um livro pelo ISBN.
 */
exports.listarAuthorsPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `SELECT 
       a.id AS idAuthor, 
       a.name, 
       a.country, 
       a.date_birth AS dateBirth 
     FROM authors a
     JOIN author_book_relationship abr ON a.id = abr.author_id
     WHERE abr.book_isbn = $1
     ORDER BY a.name`,
    [bookIsbn]
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
       id AS idRelationship, 
       author_id AS authorId, 
       book_isbn AS bookIsbn`,
    [authorId, bookIsbn]
  );
  return rows[0];
};

/**
 * Remove um relacionamento autor↔livro pelo ID do relacionamento.
 */
exports.removerAuthorBook = async (idRelationship) => {
  const { rowCount } = await db.query(
    "DELETE FROM author_book_relationship WHERE id = $1",
    [idRelationship]
  );
  if (rowCount === 0) throw new Error("AuthorBook não encontrado para remover");
  return true;
};

/**
 * Remove todos os relacionamentos de autores de um livro (útil antes de atualizar).
 */
exports.removerAuthorsDeBook = async (bookIsbn) => {
  await db.query(
    "DELETE FROM author_book_relationship WHERE book_isbn = $1",
    [bookIsbn]
  );
  return true;
};
