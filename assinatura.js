var assinatura = function (){
    agora = new Date();
    meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    return `\t\tCampo Mourão, ${agora.getDay()} de 
    ${meses[agora.getMonth()]} de ${agora.getFullYear()}
    
    
    
    
    
    
    
    __________________________________________
    Gabriel Vasco da Silva`

}
module.exports = assinatura;