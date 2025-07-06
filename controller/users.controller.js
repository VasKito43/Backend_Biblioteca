const db = require('../config/database');

/**
 * Lista todos os usuários em 'users'.
 */
exports.listarUsers = async () => {
  const { rows } = await db.query(
    `SELECT
  register      AS id_user,
  name          AS nome,
  date_birth    AS "dateBirth",
  email         AS email,
  phone         AS phone,
  debts         AS debts,
  link_img      AS "linkImg",
  stats_user_id AS "statsUserId"
FROM users
ORDER BY register;
`
  );
  return rows;
};

/**
 * Cadastra um novo usuário em 'users'.
 */
exports.cadastrarUser = async (
  name,
  dateBirth,
  email,
  phone,
  debts,
  addressId,
  typeId,
  statsUserId,
  linkImg
) => {
  const { rows } = await db.query(
    `INSERT INTO users 
       (name, date_birth, email, phone, debts, address_id, type_id, stats_user_id, link_img)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'https://uploads.promoview.com.br/2023/12/b72a1cfe.png'))
     RETURNING 
       register AS id_user, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, debts, addressId, typeId, statsUserId, linkImg]
  );
  return rows[0];
};

/**
 * Altera um usuário existente pelo register.
 */
exports.alterarUser = async (
  id_user,
  name,
  dateBirth,
  email,
  phone,
  debts,
  addressId,
  typeId,
  statsUserId,
  linkImg
) => {
  const { rows } = await db.query(
    `UPDATE users 
     SET 
       name = $1, 
       date_birth = $2, 
       email = $3, 
       phone = $4, 
       debts = $5, 
       address_id = $6, 
       type_id = $7, 
       stats_user_id = $8, 
       link_img = COALESCE($9, link_img)
     WHERE register = $10
     RETURNING 
       register AS id_user, 
       name, 
       date_birth AS dateBirth, 
       email, 
       phone, 
       debts, 
       address_id AS addressId, 
       type_id AS typeId, 
       stats_user_id AS statsUserId, 
       link_img AS linkImg`,
    [name, dateBirth, email, phone, debts, addressId, typeId, statsUserId, linkImg, id_user]
  );
  if (rows.length === 0) throw new Error('User não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um usuário pelo register.
 */
exports.removerUser = async (id_user) => {
  const { rowCount } = await db.query(
    'DELETE FROM users WHERE register = $1',
    [id_user]
  );
  if (rowCount === 0) throw new Error('User não encontrado para remover');
  return true;
};


exports.adicionarDebts = async (userRegister, amount) => {
  await db.query(
    'UPDATE users SET debts = debts + $1 WHERE register = $2',
    [amount, userRegister]
  );
};

exports.recalcularDebts = async () => {
  // 1. Busque todos os empréstimos ativos atrasados por usuário
  const { rows: overdue } = await db.query(`
    SELECT 
      u.register AS user_register,
      GREATEST(
        DATE_PART('day', CURRENT_DATE - (b.date_borrowing + INTERVAL '14 days')),
        0
      )::int AS days_overdue
    FROM borrowings b
    JOIN users u ON b.user_register = u.register
    JOIN types t ON u.type_id = t.id
    WHERE b.return_date IS NULL
      AND CURRENT_DATE 
        > (b.date_borrowing
           + CASE t.name
               WHEN 'student' THEN INTERVAL '14 days'
               WHEN 'teacher' THEN INTERVAL '30 days'
               ELSE INTERVAL '14 days'
             END
          )::date
  `);

  // 2. Agrupe por usuário
  const debtsByUser = overdue.reduce((acc, { user_register, days_overdue }) => {
    acc[user_register] = (acc[user_register] || 0) + days_overdue;
    return acc;
  }, {});

  // 3. Para cada usuário, atualize debts e stats_user_id
  for (const [user_register, debt] of Object.entries(debtsByUser)) {
    const stats = debt > 0 ? 3 /*owing*/ : 1 /*active*/;
    await db.query(
      `UPDATE users 
         SET debts = $1, stats_user_id = $2 
       WHERE register = $3`,
      [debt, stats, user_register]
    );
  }

  // 4. Para usuários sem dívida atual (não listados acima), zerar
  await db.query(`
    UPDATE users 
       SET debts = 0, stats_user_id = 1 
     WHERE register NOT IN (${Object.keys(debtsByUser).join(',')})
  `);

  return true;
};