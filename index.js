var myIP = require("ip");
var express = require('express');
var bodyParser = require('body-parser');

var routes = require("./routes");
var clientSessions = require('client-sessions');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(clientSessions({
  secret: 'here is a text string',
  duration: 1 * 60 * 1000
}));


app.use('/', express.static('./'));
app.use('/views', express.static('./public/views'));
app.use('/css', express.static('./public/css'));
app.use('/js', express.static('./public/js'));
app.use('/images', express.static('./public/images'));
app.use(routes);

var port = require('./startup').port;

app.listen(port);
console.log("\n   Yeemazon server has initialized! \n      IP: " + myIP.address() + " Port: " + port + "\n");
