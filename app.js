const express = require('express');
const app = express();
const port = 8086;
const handlebars =  require('express-handlebars')
const bodyParser = require('body-parser')

// configurando handlebars

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', '/views')

// configurando body parser

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.send('Bem-vindo')
});

app.get('/formulario', function(req, res){
    res.render('formulario')
});

app.post('/cadastrarPostagem', function(req, res){
    // console.log(req.body.titulo)
    // console.log(req.body.conteudo)

    // res.send('postagem recebida')
    res.render('postagens', {titulo: req.body.titulo, conteudo: req.body.conteudo})
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}...`)
});