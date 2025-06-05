const db = require("../config/database");

/**
 * Lista todos os relacionamentos livro↔subcategoria.
 */
exports.listarBookSubcategory = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idRelationship, 
       book_isbn AS bookIsbn, 
       subcategory_id AS subcategoryId 
     FROM book_subcategory_relationship 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca todas as subcategorias de um livro pelo ISBN.
 */
exports.listarSubcategoriesPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `SELECT 
       s.id AS idSubcategory, 
       s.name 
     FROM subcategorys s
     JOIN book_subcategory_relationship bsr ON s.id = bsr.subcategory_id
     WHERE bsr.book_isbn = $1
     ORDER BY s.name`,
    [bookIsbn]
  );
  return rows;
};

/**
 * Cria um novo relacionamento livro↔subcategoria.
 */
exports.cadastrarBookSubcategory = async (bookIsbn, subcategoryId) => {
  const { rows } = await db.query(
    `INSERT INTO book_subcategory_relationship (book_isbn, subcategory_id)
     VALUES ($1, $2)
     RETURNING 
       id AS idRelationship, 
       book_isbn AS bookIsbn, 
       subcategory_id AS subcategoryId`,
    [bookIsbn, subcategoryId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento livro↔subcategoria pelo ID do relacionamento.
 */
exports.removerBookSubcategory = async (idRelationship) => {
  const { rowCount } = await db.query(
    "DELETE FROM book_subcategory_relationship WHERE id = $1",
    [idRelationship]
  );
  if (rowCount === 0) throw new Error("BookSubcategory não encontrado para remover");
  return true;
};

/**
 * Remove todas as subcategorias de um livro (útil antes de atualizar).
 */
exports.removerSubcategoriesDeBook = async (bookIsbn) => {
  await db.query(
    "DELETE FROM book_subcategory_relationship WHERE book_isbn = $1",
    [bookIsbn]
  );
  return true;
};
