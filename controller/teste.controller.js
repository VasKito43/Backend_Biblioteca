const db = require('../config/database');

/**
 * Lista todos os testes na tabela 'teste'.
 * Cada linha possui colunas: id, nome.
 */
exports.listarTestes = async () => {
  const { rows } = await db.query('SELECT id AS id_teste, nome FROM teste ORDER BY id');
  return rows;
};

/**
 * Cadastra um novo teste na tabela 'teste'.
 * Retorna o registro criado.
 */
exports.cadastrarTeste = async (nome) => {
  const { rows } = await db.query(
    'INSERT INTO teste (nome) VALUES ($1) RETURNING id AS id_teste, nome',
    [nome]
  );
  return rows[0];
};

/**
 * Altera o nome de um teste existente pelo id.
 */
exports.alterarTeste = async (id_teste, nome) => {
  const { rows } = await db.query(
    'UPDATE teste SET nome = $1 WHERE id = $2 RETURNING id AS id_teste, nome',
    [nome, id_teste]
  );
  if (rows.length === 0) throw new Error('Teste não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um teste pelo id (delete ou define flag).
 */
exports.removerTeste = async (id_teste) => {
  const { rowCount } = await db.query(
    'DELETE FROM teste WHERE id = $1',
    [id_teste]
  );
  if (rowCount === 0) throw new Error('Teste não encontrado para remover');
  return true;
};

// entidades/teste.js (opcional)
