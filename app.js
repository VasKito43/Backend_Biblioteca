const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');

// Ajuste do path: pasta singular 'controller'
const userController = require('./controller/users.controller')
const testeController = require('././controller/teste.controller');
const Teste = require('././entidades/teste');

const userController = require('././controller/user.controller');
const User = require('././entidades/user');

const app = express();
const port = 8086;

// -----------------------------
// Configurações de diretórios estáticos
// -----------------------------
app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist'))
);
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

// -----------------------------
// Configuração do Handlebars
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

// -----------------------------
// ROTAS DE TESTE
// -----------------------------
app.get('/listarUsers', async (req, res) => {
  try {
    const testes = await userController.listarUsers();
    res.render('listarTestes', { testes });
  } catch (erro) {
    console.error('Erro ao listar testes:', erro);
    res.status(500).send('Erro ao carregar a lista de testes.');
  }
});

app.get('/cadastrarTeste', (req, res) => res.render('cadastrarTeste'));

app.post('/cadastrarTeste', async (req, res) => {
  try {
    const { nome, valor } = req.body;
    const imagemFile = req.files?.imagem;
    let caminhoImagemNoBanco = null;
    if (imagemFile) {
      const uploadPath = path.join(__dirname, 'imagens', imagemFile.name);
      await imagemFile.mv(uploadPath);
      caminhoImagemNoBanco = `/imagens/${imagemFile.name}`;
    }
    const novoTeste = new Teste(nome, valor, caminhoImagemNoBanco);
    await testeController.cadastrarTeste(novoTeste);
    res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao cadastrar teste:', erro);
    res.status(500).send('Ocorreu um erro ao cadastrar o teste.');
  }
});

app.get('/alterarTeste/:id', async (req, res) => {
  try {
    const lista = await testeController.listarTestes();
    const teste = lista.find(t => t.id_teste == req.params.id);
    if (!teste) return res.status(404).send('Teste não encontrado.');
    res.render('alterarTeste', { teste });
  } catch (erro) {
    console.error('Erro ao carregar formulário de alteração de teste:', erro);
    res.status(500).send('Erro ao carregar formulário de alteração.');
  }
});

app.post('/alterarTeste', async (req, res) => {
  try {
    const { id_teste, nome, valor } = req.body;
    const imagemFile = req.files?.imagem;
    let caminhoImagemNoBanco = null;
    if (imagemFile) {
      const uploadPath = path.join(__dirname, 'imagens', imagemFile.name);
      await imagemFile.mv(uploadPath);
      caminhoImagemNoBanco = `/imagens/${imagemFile.name}`;
    }
    const testeAlterado = new Teste(nome, valor, caminhoImagemNoBanco);
    testeAlterado.id = id_teste;
    await testeController.alterarTeste(testeAlterado);
    res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao alterar teste:', erro);
    res.status(500).send('Ocorreu um erro ao alterar o teste.');
  }
});

app.post('/removerTeste', async (req, res) => {
  try {
    const { id_teste } = req.body;
    await testeController.removerTeste(id_teste);
    res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao remover teste:', erro);
    res.status(500).send('Ocorreu um erro ao remover o teste.');
  }
});

// -----------------------------
// ROTAS DE USUÁRIO (Handlebars)
// -----------------------------
app.get('/listarUsers', async (req, res) => {
  try {
    const users = await userController.listarUsers();
    res.render('listarUsers', { users });
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    res.status(500).send('Erro ao carregar a lista de usuários.');
  }
});

app.get('/cadastrarUser', (req, res) => res.render('cadastrarUser'));
app.post('/cadastrarUser', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const novoUser = new User(nome, email, senha);
    await userController.cadastrarUser(novoUser);
    res.redirect('/listarUsers');
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    res.status(500).send('Ocorreu um erro ao cadastrar o usuário.');
  }
});

app.get('/alterarUser/:id', async (req, res) => {
  try {
    const lista = await userController.listarUsers();
    const user = lista.find(u => u.id_user == req.params.id);
    if (!user) return res.status(404).send('Usuário não encontrado.');
    res.render('alterarUser', { user });
  } catch (erro) {
    console.error('Erro ao carregar formulário de alteração de usuário:', erro);
    res.status(500).send('Erro ao carregar formulário de alteração.');
  }
});
app.post('/alterarUser', async (req, res) => {
  try {
    const { id_user, nome, email, senha } = req.body;
    const userAlt = new User(nome, email, senha);
    userAlt.id = id_user;
    await userController.alterarUser(userAlt);
    res.redirect('/listarUsers');
  } catch (erro) {
    console.error('Erro ao alterar usuário:', erro);
    res.status(500).send('Ocorreu um erro ao alterar o usuário.');
  }
});
app.post('/removerUser', async (req, res) => {
  try {
    const { id_user } = req.body;
    await userController.removerUser(id_user);
    res.redirect('/listarUsers');
  } catch (erro) {
    console.error('Erro ao remover usuário:', erro);
    res.status(500).send('Ocorreu um erro ao remover o usuário.');
  }
});

// -----------------------------
// ROTA API JSON PARA USERS
// -----------------------------
app.get('/api/users', async (req, res) => {
  try {
    const users = await userController.listarUsers();
    res.json(users);
  } catch (erro) {
    console.error('Erro na API /api/users:', erro);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// -----------------------------
// Inicia o servidor
// -----------------------------
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}...`);
  try {
    const todosTestes = await testeController.listarTestes();
    console.log(`Conexão OK: ${todosTestes.length} teste(s) cadastrado(s) no banco.`);
  } catch (erro) {
    console.error('Falha ao conectar com o banco na inicialização:', erro);
  }
});
