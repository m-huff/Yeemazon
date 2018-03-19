
var express = require('express');
var bodyParser = require('body-parser');

var routes = require("./routes");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', express.static('./'));
app.use('/views', express.static('./public/views'));
app.use('/js', express.static('./public/js'));
app.use(routes);

app.listen(3000);

