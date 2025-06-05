const db = require('../config/database');

/**
 * Lista todos os relacionamentos livro↔subcategoria.
 */
exports.listarBookSubcategory = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_relationship, 
       book_isbn AS bookIsbn, 
       subcategory_id AS subcategoryId 
     FROM book_subcategory_relationship 
     ORDER BY id`
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
       id AS id_relationship, 
       book_isbn AS bookIsbn, 
       subcategory_id AS subcategoryId`,
    [bookIsbn, subcategoryId]
  );
  return rows[0];
};

/**
 * Remove um relacionamento livro↔subcategoria pelo id.
 */
exports.removerBookSubcategory = async (id_relationship) => {
  const { rowCount } = await db.query(
    'DELETE FROM book_subcategory_relationship WHERE id = $1',
    [id_relationship]
  );
  if (rowCount === 0) throw new Error('BookSubcategory não encontrado para remover');
  return true;
};

