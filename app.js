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


// (Suas demais rotas Handlebars e de usuários seguem abaixo, sem alteração…)


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
