// app.js
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');

const produtoController = require('./controller/produto.controller');
const Produto = require('./entidades/produto');

const testeController = require('./controller/teste.controller');
const Teste = require('./entidades/teste');

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
// ROTAS DE PRODUTO (mantive como estavam)
// -----------------------------

// Rota GET: abrir formulário de cadastro + mostrar lista de produtos
app.get('/cadastrarProduto', async (req, res) => {
  try {
    const produtos = await produtoController.listarProdutos();
    res.render('cadastroProduto', { produtos });
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    res.status(500).send('Erro ao carregar página de cadastro de produtos.');
  }
});

// Rota POST: cadastrar novo produto
app.post('/cadastrarProduto', async (req, res) => {
  try {
    const { nome, valor } = req.body;
    const imagemFile = req.files?.imagem;
    let caminhoImagemNoBanco = null;

    if (imagemFile) {
      const uploadPath = path.join(__dirname, 'imagens', imagemFile.name);
      await imagemFile.mv(uploadPath);
      caminhoImagemNoBanco = `/imagens/${imagemFile.name}`;
    }

    const novoProduto = new Produto(nome, valor, caminhoImagemNoBanco);
    const resultado = await produtoController.cadastrarProduto(novoProduto);
    console.log('Produto gravado com sucesso:', resultado);

    return res.redirect('/cadastrarProduto');
  } catch (erro) {
    console.error('Erro ao cadastrar produto:', erro);
    return res
      .status(500)
      .send('Ocorreu um erro ao cadastrar o produto. Verifique o console.');
  }
});

// Rota GET: abrir formulário para alterar um produto específico
app.get('/alterarProduto/:id', async (req, res) => {
  try {
    const lista = await produtoController.listarProdutos();
    const prod = lista.find((p) => p.id_produto == req.params.id);
    if (!prod) {
      return res.status(404).send('Produto não encontrado.');
    }
    return res.render('alterarProduto', { produto: prod });
  } catch (erro) {
    console.error('Erro ao carregar formulário de alteração:', erro);
    return res.status(500).send('Erro ao carregar formulário de alteração.');
  }
});

// Rota POST: processar alteração de produto
app.post('/alterarProduto', async (req, res) => {
  try {
    const { nome, valor, id_produto } = req.body;
    const imagemFile = req.files?.imagem;
    let caminhoImagemNoBanco = null;

    if (imagemFile) {
      const uploadPath = path.join(__dirname, 'imagens', imagemFile.name);
      await imagemFile.mv(uploadPath);
      caminhoImagemNoBanco = `/imagens/${imagemFile.name}`;
    }

    const alt = new Produto(nome, valor, caminhoImagemNoBanco);
    alt.id = id_produto;
    const resultado = await produtoController.alterarProduto(alt);
    console.log('Produto alterado com sucesso:', resultado);

    return res.redirect('/cadastrarProduto');
  } catch (erro) {
    console.error('Erro ao alterar produto:', erro);
    return res.status(500).send('Ocorreu um erro ao alterar o produto.');
  }
});

// Rota POST: remover produto
app.post('/removerProduto', async (req, res) => {
  try {
    const { id_produto } = req.body;
    const resultado = await produtoController.removerProduto(id_produto);
    console.log('Produto removido com sucesso:', resultado);
    return res.redirect('/cadastrarProduto');
  } catch (erro) {
    console.error('Erro ao remover produto:', erro);
    return res.status(500).send('Ocorreu um erro ao remover o produto.');
  }
});

// -----------------------------
// ROTAS DE TESTE (ajustadas para não dar “Cannot GET”)
// -----------------------------

// Rota GET: listar todos os testes e renderizar a view listarTestes.handlebars
app.get('/listarTestes', async (req, res) => {
  try {
    const testes = await testeController.listarTestes();
    return res.render('listarTestes', { testes });
  } catch (erro) {
    console.error('Erro ao listar testes:', erro);
    return res.status(500).send('Erro ao carregar a lista de testes.');
  }
});

// Rota GET: abrir formulário de cadastro de teste (caso queira criar novos)
app.get('/cadastrarTeste', (req, res) => {
  // Essa view deve conter um <form action="/cadastrarTeste" method="POST" enctype="multipart/form-data">
  return res.render('cadastrarTeste');
});

// Rota POST: cadastrar um novo teste
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

    // Supondo que o construtor de Teste aceite (nome, valor, caminhoImagem)
    const novoTeste = new Teste(nome, valor, caminhoImagemNoBanco);
    const resultado = await testeController.cadastrarTeste(novoTeste);
    console.log('Teste cadastrado com sucesso:', resultado);

    return res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao cadastrar teste:', erro);
    return res.status(500).send('Ocorreu um erro ao cadastrar o teste.');
  }
});

// Rota GET: abrir formulário para alterar um teste específico
app.get('/alterarTeste/:id', async (req, res) => {
  try {
    const lista = await testeController.listarTestes();
    const teste = lista.find((t) => t.id_teste == req.params.id);
    if (!teste) {
      return res.status(404).send('Teste não encontrado.');
    }
    return res.render('alterarTeste', { teste });
  } catch (erro) {
    console.error('Erro ao carregar formulário de alteração de teste:', erro);
    return res.status(500).send('Erro ao carregar formulário de alteração.');
  }
});

// Rota POST: processar alteração de teste
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
    const resultado = await testeController.alterarTeste(testeAlterado);
    console.log('Teste alterado com sucesso:', resultado);

    return res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao alterar teste:', erro);
    return res.status(500).send('Ocorreu um erro ao alterar o teste.');
  }
});

// Rota POST: remover teste
app.post('/removerTeste', async (req, res) => {
  try {
    const { id_teste } = req.body;
    const resultado = await testeController.removerTeste(id_teste);
    console.log('Teste removido com sucesso:', resultado);
    return res.redirect('/listarTestes');
  } catch (erro) {
    console.error('Erro ao remover teste:', erro);
    return res.status(500).send('Ocorreu um erro ao remover o teste.');
  }
});

// -----------------------------
// Inicia o servidor
// -----------------------------
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}...`);
  // Teste rápido de conexão com o banco de dados (opcional)
  try {
    const todosTestes = await testeController.listarTestes();
    console.log(`Conexão OK: ${todosTestes.length} teste(s) cadastrado(s) no banco.`);
  } catch (erro) {
    console.error('Falha ao conectar com o banco na inicialização:', erro);
  }
});
