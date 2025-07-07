require('dotenv').config();

// app.js
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');


// controllers
const testeController = require('./controller/teste.controller');
const bookController = require('./controller/books.controller');
const userController = require('./controller/users.controller');
const borrowingController = require('./controller/borrowings.controller');
const librarianController = require('./controller/librarian.controller')
const usersController = require('./controller/users.controller');
const db = require('./config/database'); // Pra consultas diretas
const { sendBorrowingEmail } = require('./utils/mailer');



// entidades
const Teste = require('./entidades/teste');
const User = require('./entidades/users');

const app = express();
const port = 8086;

// -----------------------------
// diretórios estáticos
// -----------------------------
app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist'))
);
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

// -----------------------------
// Handlebars
// -----------------------------
app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// -----------------------------
// Middlewares
// -----------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload());



app.post('/api/librarians/login', async (req, res) => {
  try {
    const { register, password } = req.body
    console.log(register, password)
    const auth = await librarianController.authenticateLibrarian(register, password)
    if (!auth) {
      return res.status(401).json({ message: 'Registro ou senha inválidos' })
    }
    // opcional: gerar token JWT aqui e retornar
    return res.json({ message: 'Login bem-sucedido' })
  } catch (err) {
    console.error('Erro no login de bibliotecário:', err)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
})

// =============================
// ROTAS DE API JSON DE BOOKS
// =============================

// Listar todos
app.get('/api/books', async (req, res) => {
  try {
    const books = await bookController.listarBooks();
    res.json(books);
  } catch (erro) {
    console.error('Erro na API /api/books:', erro);
    res.status(500).json({ error: 'Erro ao buscar livros.' });
  }
});

// Obter UM livro
app.get('/api/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await bookController.obterBook(isbn);
    res.json(book);
  } catch (erro) {
    console.error('Erro na API GET /api/books/:isbn:', erro);
    res.status(404).json({ error: erro.message });
  }
});

// Criar
app.post('/api/books', async (req, res) => {
  try {
    const {
      title,
      realeaseDate,
      registerDate,
      quantityAvailable,
      edition,
      linkImg
    } = req.body;
    const isbn = Date.now().toString();    // ou receba do body
    const created = await bookController.cadastrarBook(
      isbn, title, realeaseDate, registerDate, quantityAvailable, edition, linkImg
    );
    res.status(201).json(created);
  } catch (erro) {
    console.error('Erro na API POST /api/books:', erro);
    res.status(500).json({ error: 'Erro ao cadastrar livro.' });
  }
});

// Atualizar
app.put('/api/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const {
      quantityAvailable

    } = req.body;
    const updated = await bookController.alterarBook(
      isbn, quantityAvailable
    );
    res.json(updated);
  } catch (erro) {
    console.error('Erro na API PUT /api/books/:isbn:', erro);
    res.status(500).json({ error: 'Erro ao atualizar livro.' });
  }
});

// Deletar
app.delete('/api/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    await bookController.removerBook(isbn);
    res.status(204).end();
  } catch (erro) {
    console.error('Erro na API DELETE /api/books/:isbn:', erro);
    res.status(500).json({ error: 'Erro ao remover livro.' });
  }
});

// =============================
// ROTAS DE API JSON DE USERS
// =============================

// Listar todos os usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await userController.listarUsers();
    res.json(users);
  } catch (erro) {
    console.error('Erro na API /api/users:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Buscar um usuário por ID (se precisar)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userController.buscarUserPorId(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (erro) {
    console.error('Erro na API GET /api/users/:id:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// =============================
// ROTAS DE API JSON DE BORROWINGS
// =============================

app.post('/api/users/recalculate-debts', async (req, res) => {
  try {
    await usersController.recalcularDebts();
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao recalcular dívidas:', err);
    res.status(500).json({ error: 'Falha ao atualizar dívidas.' });
  }
});


app.post('/api/borrowings', async (req, res) => {
  try {
    const { user_register, librarian_register, book_isbn, date_borrowing, return_date } = req.body;

    // Verifica usuário ativo
    const userCheck = await db.query(
      `SELECT u.name, u.email, su.name AS status
         FROM users u
         JOIN stats_users su ON u.stats_user_id = su.id
        WHERE u.register = $1`,
      [user_register]
    );
    if (userCheck.rowCount === 0 || userCheck.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'Usuário não ativo ou não encontrado.' });
    }

    const { name: userName, email: userEmail, role: userRole } = userCheck.rows[0]; // agora pegamos também o campo role

    // Verifica livro disponível
    const bookCheck = await db.query(
      `SELECT title, quantity_available
         FROM books
        WHERE isbn = $1`,
      [book_isbn]
    );
    if (bookCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }
    if (bookCheck.rows[0].quantity_available <= 0) {
      return res.status(400).json({ error: 'Livro sem cópias disponíveis.' });
    }

    const bookTitle = bookCheck.rows[0].title;

    // Cadastra empréstimo
    const created = await borrowingController.cadastrarBorrowing(
      user_register,
      librarian_register,
      book_isbn,
      1, // stats_id = 1
      date_borrowing,
      return_date
    );

    // Decrementa estoque
    await db.query(
      `UPDATE books
          SET quantity_available = quantity_available - 1
        WHERE isbn = $1`,
      [book_isbn]
    );

    // 5) Recuperar dados do usuário e do livro para o e‑mail
   const { rows: [ user ] } = await db.query(
        `SELECT name, email, type_id FROM users WHERE register = $1`,
        [user_register]
      );
      const { rows: [ book ] } = await db.query(
        `SELECT title FROM books WHERE isbn = $1`,
        [book_isbn]
      );
      // Calcular data prevista de devolução (14 dias após)
      
      const periodDays = user.type_id === 2 ? 30 : 14;
      const due = new Date(date_borrowing);
      due.setDate(due.getDate() + periodDays);
      const dueDateStr = due.toISOString().slice(0,10).split('-').reverse().join('/');
 
      // 6) Enviar e‑mail de confirmação
      try {
        await sendBorrowingEmail(user.email, user.name, book.title, dueDateStr);
      } catch (mailErr) {
        console.error('Erro ao enviar e‑mail:', mailErr);
        // não falha toda a API se o e‑mail der erro
      }

    return res.status(201).json(created);

  } catch (err) {
    console.error('Erro ao criar empréstimo:', err);
    return res.status(500).json({ error: 'Erro ao criar empréstimo.' });
  }
});



// 2) Listar empréstimos com detalhes (única rota GET /api/borrowings)
app.get('/api/borrowings', async (req, res) => {
  try {
    const { user, active } = req.query;
    if (user && active === 'true') {
      // só ativos (status != 'pago') daquele usuário
      const result = await db.query(
        `SELECT 
           b.id AS id_borrowing,
           b.date_borrowing,
           b.return_date,
           u.name  AS user_name,
           l.name  AS librarian_name,
           b.book_isbn,
           bk.title AS book_title,
           s.name    AS status
         FROM borrowings b
         JOIN users u         ON b.user_register     = u.register
         JOIN librarian l     ON b.librarian_register = l.register
         JOIN books bk        ON b.book_isbn        = bk.isbn
         JOIN stats s         ON b.stats_id          = s.id
        WHERE b.user_register = $1
          AND s.name <> 'pago'`,
        [user]
      );
      return res.json(result.rows);
    }

    // rota normal (todos os empréstimos com detalhes)
    const rows = await borrowingController.listarBorrowingsComDetalhes();
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar empréstimos:', err);
    res.status(500).json({ error: 'Erro ao buscar empréstimos.' });
  }
});


// 3) Endpoint de devolução (pagar multa + devolver)
app.put('/api/borrowings/:id/return', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { fine } = req.body;
    const result = await borrowingController.devolverBorrowing(id, fine || 0);
    res.json({ message: 'Devolução registrada', ...result });
  } catch (err) {
    console.error('Erro ao devolver empréstimo:', err);
    res.status(500).json({ error: err.message });
  }
});



// =============================
// Inicia servidor
// =============================
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}...`);
  try {
    const testes = await testeController.listarTestes();
    console.log(`Conexão OK: ${testes.length} teste(s) no banco.`);
  } catch (erro) {
    console.error('Falha ao conectar com o banco na inicialização:', erro);
  }
});
