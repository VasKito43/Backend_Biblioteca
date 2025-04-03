const http = require('http');
const assinatura = require('./assinatura')

http.createServer(function(req, res){

    res.end('hello world \n\n\n' + assinatura())
}).listen(8031)

console.log('Servidor rodando na porta 8081 ...')