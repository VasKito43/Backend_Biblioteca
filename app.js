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
const db = require('./config/database'); // Pra consultas diretas



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
    res.status(404).json({ error: 'Livro não encontrado.' });
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
      title,
      realeaseDate,
      registerDate,
      quantityAvailable,
      edition,
      linkImg
    } = req.body;
    const updated = await bookController.alterarBook(
      isbn, title, realeaseDate, registerDate, quantityAvailable, edition, linkImg
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

// Listar empréstimos
app.get('/api/borrowings', async (req, res) => {
  try {
    const loans = await borrowingController.listarBorrowings();
    res.json(loans);
  } catch (erro) {
    console.error('Erro na API /api/borrowings:', erro);
    res.status(500).json({ error: 'Erro ao buscar empréstimos.' });
  }
});

// Cadastrar empréstimo
app.post('/api/borrowings', async (req, res) => {
  try {
    const {
      user_register,
      librarian_register,
      book_isbn,
      date_borrowing,
      return_date
    } = req.body;

    // 1) Verificar usuário ativo
    const userCheck = await db.query(
      `SELECT su.name AS status 
         FROM users u
         JOIN stats_users su ON u.stats_user_id = su.id
        WHERE u.register = $1`,
      [user_register]
    );
    if (userCheck.rowCount === 0 || userCheck.rows[0].status !== 'active') {
      return res.status(400).json({ error: 'Usuário não ativo ou não encontrado.' });
    }

    // 2) Verificar livro disponível
    const bookCheck = await db.query(
      `SELECT quantity_available 
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

    // 3) Cadastrar o empréstimo
    const created = await borrowingController.cadastrarBorrowing(
      user_register,
      librarian_register,
      book_isbn,
      /* stats_id: */ 1,          // ou outro status padrão
      date_borrowing,
      return_date
    );

    // 4) Decrementar estoque do livro
    await db.query(
      `UPDATE books
          SET quantity_available = quantity_available - 1
        WHERE isbn = $1`,
      [book_isbn]
    );

    return res.status(201).json(created);

  } catch (err) {
    console.error('Erro ao criar empréstimo:', err);
    return res.status(500).json({ error: 'Erro ao criar empréstimo.' });
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
