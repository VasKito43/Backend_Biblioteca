const express = require('express');
const app = express();
const port = 8086;

app.get('/', function(req, res){
    res.send('Bem-vindo')
});

app.get('/homepage', function(req, res, next){
    console.log('a resposta ta na proxima funçãp');
    next();
},(req, res) => {
    res.send('Bem-vindo ao homepage')
});

// Passagem por parametro

app.get('/ola/:nome/:sobrenome', function(req, res){
    res.send(`Bem vindo ${req.params.nome} ${req.params.sobrenome}`)
})

//passagem po parametro usando query string
//localhost:8086/ola2?nome=Leandro&sobrenome=Ensina

app.get('/ola2', function(req, res){
    const {nome, sobrenome} = req.query
    res.send(`Bem vindo ${nome} ${sobrenome}`)

})

app.get('/endereço', function(req, res){
    fetch('https://brasilapi.com.br/api/cep/v2/' + '87301-899')
        .then((response) => express.response.json())
        .then((response) => {
            res.send(`endereço: ${endereco.street}`);
        })
        .catch(error => {
            console.log('erro ao acessar o link')
            res.send('ops, houve um erro')
        })

})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}...`)
});