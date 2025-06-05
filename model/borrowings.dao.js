const db = require("../config/database");

/**
 * Lista todos os empréstimos.
 */
exports.listarBorrowings = async () => {
  const { rows } = await db.query(
    `SELECT
       id AS idBorrowing,
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
 * Busca um empréstimo pelo ID.
 */
exports.buscarBorrowingPorId = async (idBorrowing) => {
  const { rows } = await db.query(
    `SELECT
       id AS idBorrowing,
       user_register AS userRegister,
       librarian_register AS librarianRegister,
       book_isbn AS bookIsbn,
       stats_id AS statsId,
       date_borrowing AS dateBorrowing,
       return_date AS returnDate
     FROM borrowings
     WHERE id = $1`,
    [idBorrowing]
  );
  return rows[0] || null;
};

/**
 * Cadastra um novo empréstimo.
 */
exports.criarBorrowing = async (
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
       id AS idBorrowing,
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
 * Altera um empréstimo existente pelo ID.
 */
exports.alterarBorrowing = async (
  idBorrowing,
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
       id AS idBorrowing,
       user_register AS userRegister,
       librarian_register AS librarianRegister,
       book_isbn AS bookIsbn,
       stats_id AS statsId,
       date_borrowing AS dateBorrowing,
       return_date AS returnDate`,
    [
      userRegister,
      librarianRegister,
      bookIsbn,
      statsId,
      dateBorrowing,
      returnDate,
      idBorrowing
    ]
  );
  if (rows.length === 0) throw new Error("Borrowing não encontrado para alterar");
  return rows[0];
};

/**
 * Remove (deleta) um empréstimo pelo ID.
 */
exports.removerBorrowing = async (idBorrowing) => {
  const { rowCount } = await db.query(
    "DELETE FROM borrowings WHERE id = $1",
    [idBorrowing]
  );
  if (rowCount === 0) throw new Error("Borrowing não encontrado para remover");
  return true;
};

/**
 * Lista todos os empréstimos de um usuário específico.
 */
exports.listarBorrowingsPorUser = async (userRegister) => {
  const { rows } = await db.query(
    `SELECT
       id AS idBorrowing,
       user_register AS userRegister,
       librarian_register AS librarianRegister,
       book_isbn AS bookIsbn,
       stats_id AS statsId,
       date_borrowing AS dateBorrowing,
       return_date AS returnDate
     FROM borrowings
     WHERE user_register = $1
     ORDER BY date_borrowing DESC`,
    [userRegister]
  );
  return rows;
};

/**
 * Lista todos os empréstimos de um livro específico (útil para checar histórico).
 */
exports.listarBorrowingsPorBook = async (bookIsbn) => {
  const { rows } = await db.query(
    `SELECT
       id AS idBorrowing,
       user_register AS userRegister,
       librarian_register AS librarianRegister,
       book_isbn AS bookIsbn,
       stats_id AS statsId,
       date_borrowing AS dateBorrowing,
       return_date AS returnDate
     FROM borrowings
     WHERE book_isbn = $1
     ORDER BY date_borrowing DESC`,
    [bookIsbn]
  );
  return rows;
};

