const db = require('../config/database');
const usersController = require('./users.controller');


/**
 * Lista todos os empréstimos em 'borrowings'.
 */
exports.listarBorrowings = async () => {
  const { rows } = await db.query(
    `SELECT 
       id AS id_borrowing, 
       user_register AS userRegister, 
       librarian_register AS librarianRegister, 
       book_isbn AS bookIsbn, 
       stats_id AS statsId, 
       date_borrowing AS dateBorrowing, 
       return_date AS returnDate 
     FROM borrowings 
     ORDER BY id`
  );
  return rows;
};

/**
 * Cadastra um novo empréstimo em 'borrowings'.
 */
exports.cadastrarBorrowing = async (
  userRegister,
  librarianRegister,
  bookIsbn,
  statsId,
  dateBorrowing,
  returnDate
) => {
  const { rows } = await db.query(
    `INSERT INTO borrowings 
       (user_register, librarian_register, book_isbn, stats_id, date_borrowing, return_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING 
       id AS id_borrowing, 
       user_register AS userRegister, 
       librarian_register AS librarianRegister, 
       book_isbn AS bookIsbn, 
       stats_id AS statsId, 
       date_borrowing AS dateBorrowing, 
       return_date AS returnDate`,
    [userRegister, librarianRegister, bookIsbn, statsId, dateBorrowing, returnDate]
  );
  return rows[0];
};

/**
 * Altera um empréstimo existente pelo id.
 */
exports.alterarBorrowing = async (
  id_borrowing,
  userRegister,
  librarianRegister,
  bookIsbn,
  statsId,
  dateBorrowing,
  returnDate
) => {
  const { rows } = await db.query(
    `UPDATE borrowings 
     SET 
       user_register = $1, 
       librarian_register = $2, 
       book_isbn = $3, 
       stats_id = $4, 
       date_borrowing = $5, 
       return_date = $6 
     WHERE id = $7 
     RETURNING 
       id AS id_borrowing, 
       user_register AS userRegister, 
       librarian_register AS librarianRegister, 
       book_isbn AS bookIsbn, 
       stats_id AS statsId, 
       date_borrowing AS dateBorrowing, 
       return_date AS returnDate`,
    [userRegister, librarianRegister, bookIsbn, statsId, dateBorrowing, returnDate, id_borrowing]
  );
  if (rows.length === 0) throw new Error('Borrowing não encontrado para alterar');
  return rows[0];
};

/**
 * Remove um empréstimo pelo id.
 */
exports.removerBorrowing = async (id_borrowing) => {
  const { rowCount } = await db.query(
    'DELETE FROM borrowings WHERE id = $1',
    [id_borrowing]
  );
  if (rowCount === 0) throw new Error('Borrowing não encontrado para remover');
  return true;
};


exports.listarBorrowingsComDetalhes = async () => {
  const { rows } = await db.query(
    `SELECT
       b.id AS id_borrowing,
       b.date_borrowing AS dateBorrowing,
       (b.date_borrowing + INTERVAL '14 days')::date AS expected_return,
       u.name  AS user_name,
       l.name  AS librarian_name,
       b.book_isbn AS book_isbn,
       bk.title    AS book_title,
       s.name      AS status,              -- usar “s.name” em vez de “su.name”
       b.return_date
     FROM borrowings b
     JOIN users u ON b.user_register     = u.register
     JOIN librarian l ON b.librarian_register = l.register
     JOIN books bk ON b.book_isbn        = bk.isbn
     JOIN stats s ON b.stats_id          = s.id
     ORDER BY b.date_borrowing DESC`
  );
  return rows;
};


/**
 * Registra a devolução e multa, atualiza livro e usuário.
 */
exports.devolverBorrowing = async (idBorrowing, fine) => {
  try {
    await db.query('BEGIN');


    // 1) Busca empréstimo
    const result = await db.query(
      'SELECT user_register, book_isbn FROM borrowings WHERE id = $1 FOR UPDATE',
      [idBorrowing]
    );
    if (result.rows.length === 0) throw new Error('Empréstimo não encontrado');
    const { user_register, book_isbn } = result.rows[0];


    // 2) Atualiza status do empréstimo
    await db.query(
      `UPDATE borrowings
         SET return_date = CURRENT_DATE,
             stats_id    = (SELECT id FROM stats WHERE name = 'pago')
       WHERE id = $1`,
      [idBorrowing]
    );


    // 3) Incrementa estoque do livro
    await db.query(
      'UPDATE books SET quantity_available = quantity_available + 1 WHERE isbn = $1',
      [book_isbn]
    );


    // 4) Acumula multa no usuário, se houver
    if (fine > 0) {
      const usersController = require('./users.controller');
      await usersController.adicionarDebts(user_register, fine);
    }


    await db.query('COMMIT');
    return { id: idBorrowing, fine };
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
};





