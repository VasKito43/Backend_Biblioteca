const db = require('../config/database');

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
