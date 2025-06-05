const db = require('../config/database');

/**
 * Lista todos os endereços em 'addresses'.
 */
exports.listarAddresses = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_address, 
       cep, 
       house_number AS houseNumber, 
       complement 
     FROM addresses 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cadastra um novo endereço em 'addresses'.
 */
exports.cadastrarAddress = async (cep, houseNumber, complement) => {
  const { rows } = await db.query(
    `INSERT INTO addresses (cep, house_number, complement)
     VALUES ($1, $2, $3)
     RETURNING id AS id_address, cep, house_number AS houseNumber, complement`,
    [cep, houseNumber, complement]
  );
  return rows[0];
};

/**
 * Altera um endereço existente pelo id.
 */
exports.alterarAddress = async (id_address, cep, houseNumber, complement) => {
  const { rows } = await db.query(
    `UPDATE addresses 
     SET cep = $1, house_number = $2, complement = $3 
     WHERE id = $4 
     RETURNING id AS id_address, cep, house_number AS houseNumber, complement`,
    [cep, houseNumber, complement, id_address]
  );
  if (rows.length === 0) throw new Error('Address não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um endereço pelo id.
 */
exports.removerAddress = async (id_address) => {
  const { rowCount } = await db.query(
    'DELETE FROM addresses WHERE id = $1',
    [id_address]
  );
  if (rowCount === 0) throw new Error('Address não encontrado para remover');
  return true;
};
