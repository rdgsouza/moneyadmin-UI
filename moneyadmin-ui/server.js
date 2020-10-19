const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/moneyadmin-ui'));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/dist/moneyadmin-ui/index.html');
});

app.listen(process.env.PORT || 4200);

// Para rodarmos o build que fizemos da nossa aplicação em um servidor local precisamos
// de um servidor http configurado em nossa maquina para isso vamos usar o node.js
// com um framework chamado express que é um framework web simples, rapido e flexivel para
// node.js que inclusive ja vem instaldo quando agente usa o angular cli ele ja estar na nossa
// aplicação então agente ja vai aproveitar ele tambem


// Mas sobre o Framework Express
// Express é o framework web mais popular, e é a biblioteca subjacente para uma
//  série de outros frameworks populares de Nodes. Fornece mecanismos para:

// Gerencia as requisições de diferentes requisições e rotas e URLs.
// Combinar com mecanismos de renderização de "view" para gerar respostas inserindo dados
// em modelos.
// Definir as configurações comuns da aplicação web, como a porta a ser usada para conexão
// e a localização dos modelos que são usados para renderizar a resposta.
// Adicionar em qualquer ponto da requisição um "middleware" para interceptar processar ou
// pré-processar e tratamentar à mesma.

// Fonte: https://developer.mozilla.org/pt-BR/docs/Learn/Server-side/Express_Nodejs/Introdu%C3%A7%C3%A3o
