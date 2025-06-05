const db = require("../config/database");

/**
 * Lista todas as editoras.
 */
exports.listarPublishers = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idPublisher, 
       name, 
       country 
     FROM publishers 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca uma editora pelo ID.
 */
exports.buscarPublisherPorId = async (idPublisher) => {
  const { rows } = await db.query(
    `SELECT 
       id AS idPublisher, 
       name, 
       country 
     FROM publishers 
     WHERE id = $1`,
    [idPublisher]
  );
  return rows[0] || null;
};

/**
 * Cadastra uma nova editora.
 */
exports.criarPublisher = async (name, country) => {
  const { rows } = await db.query(
    `INSERT INTO publishers (name, country)
     VALUES ($1, $2)
     RETURNING 
       id AS idPublisher, 
       name, 
       country`,
    [name, country]
  );
  return rows[0];
};

/**
 * Altera uma editora existente pelo ID.
 */
exports.alterarPublisher = async (idPublisher, name, country) => {
  const { rows } = await db.query(
    `UPDATE publishers 
     SET name = $1, country = $2 
     WHERE id = $3 
     RETURNING 
       id AS idPublisher, 
       name, 
       country`,
    [name, country, idPublisher]
  );
  if (rows.length === 0) throw new Error("Publisher não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) uma editora pelo ID.
 */
exports.removerPublisher = async (idPublisher) => {
  const { rowCount } = await db.query(
    "DELETE FROM publishers WHERE id = $1",
    [idPublisher]
  );
  if (rowCount === 0) throw new Error("Publisher não encontrado para remover");
  return true;
};

/**
 * Busca editoras por país (ex.: todas as editoras do Brasil).
 */
exports.buscarPublishersPorPais = async (country) => {
  const { rows } = await db.query(
    `SELECT 
       id AS idPublisher, 
       name, 
       country 
     FROM publishers 
     WHERE country ILIKE $1 
     ORDER BY name`,
    [country]
  );
  return rows;
};

