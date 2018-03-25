
var express = require('express');
var bodyParser = require('body-parser');

var routes = require("./routes");
var clientSessions = require('client-sessions');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(clientSessions({
  secret: 'here is a text string', // CHANGE THIS!
  duration: 1 * 60 * 1000
}));


app.use('/', express.static('./'));
app.use('/views', express.static('./public/views'));
app.use('/css', express.static('./public/css'));
app.use('/js', express.static('./public/js'));
app.use(routes);

app.listen(3000);

