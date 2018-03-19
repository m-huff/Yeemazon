
var express = require('express');
var bodyParser = require('body-parser');
var clientSessions = require('client-sessions');

var routes = require("./routes");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('./'));
app.use('/js', express.static('./public/js'));


app.use(clientSessions({
  secret: 'here is a text string' // CHANGE THIS!
}));

app.use(routes);

var port = process.env.PORT || 3000;
app.listen(port);



