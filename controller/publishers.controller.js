const db = require('../config/database');

/**
 * Lista todas as editoras em 'publishers'.
 */
exports.listarPublishers = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_publisher, 
       name, 
       country 
     FROM publishers 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cadastra uma nova editora em 'publishers'.
 */
exports.cadastrarPublisher = async (name, country) => {
  const { rows } = await db.query(
    `INSERT INTO publishers (name, country)
     VALUES ($1, $2)
     RETURNING 
       id AS id_publisher, 
       name, 
       country`,
    [name, country]
  );
  return rows[0];
};

/**
 * Altera uma editora existente pelo id.
 */
exports.alterarPublisher = async (id_publisher, name, country) => {
  const { rows } = await db.query(
    `UPDATE publishers 
     SET name = $1, country = $2 
     WHERE id = $3 
     RETURNING 
       id AS id_publisher, 
       name, 
       country`,
    [name, country, id_publisher]
  );
  if (rows.length === 0) throw new Error('Publisher não encontrado para alterar');
  return rows[0];
};

/**
 * Remove uma editora pelo id.
 */
exports.removerPublisher = async (id_publisher) => {
  const { rowCount } = await db.query(
    'DELETE FROM publishers WHERE id = $1',
    [id_publisher]
  );
  if (rowCount === 0) throw new Error('Publisher não encontrado para remover');
  return true;
};

