const db = require("../config/database");

/**
 * Lista todos os endereços.
 */
exports.listarAddresses = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS idAddress, 
       cep, 
       house_number AS houseNumber, 
       complement 
     FROM addresses 
     ORDER BY id`
  );
  return rows;
};

/**
 * Busca um endereço pelo ID.
 */
exports.buscarAddressPorId = async (idAddress) => {
  const { rows } = await db.query(
    `SELECT 
       id AS idAddress, 
       cep, 
       house_number AS houseNumber, 
       complement 
     FROM addresses 
     WHERE id = $1`,
    [idAddress]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo endereço.
 */
exports.criarAddress = async (cep, houseNumber, complement) => {
  const { rows } = await db.query(
    `INSERT INTO addresses (cep, house_number, complement)
     VALUES ($1, $2, $3)
     RETURNING 
       id AS idAddress, 
       cep, 
       house_number AS houseNumber, 
       complement`,
    [cep, houseNumber, complement]
  );
  return rows[0];
};

/**
 * Altera um endereço existente pelo ID.
 */
exports.alterarAddress = async (idAddress, cep, houseNumber, complement) => {
  const { rows } = await db.query(
    `UPDATE addresses 
     SET cep = $1, house_number = $2, complement = $3 
     WHERE id = $4 
     RETURNING 
       id AS idAddress, 
       cep, 
       house_number AS houseNumber, 
       complement`,
    [cep, houseNumber, complement, idAddress]
  );
  if (rows.length === 0) throw new Error("Address não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um endereço pelo ID.
 */
exports.removerAddress = async (idAddress) => {
  const { rowCount } = await db.query(
    "DELETE FROM addresses WHERE id = $1",
    [idAddress]
  );
  if (rowCount === 0) throw new Error("Address não encontrado para remover");
  return true;
};

/**
 * Verifica se um CEP já está cadastrado.
 */
exports.existeCep = async (cep) => {
  const { rows } = await db.query(
    "SELECT COUNT(1) as count FROM addresses WHERE cep = $1",
    [cep]
  );
  return parseInt(rows[0].count, 10) > 0;
};
