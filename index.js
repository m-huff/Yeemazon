var myIP = require("ip");
var express = require('express');
var bodyParser = require('body-parser');

var startup = require('./startup');

var routes = require("./routes");
var clientSessions = require('client-sessions');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(clientSessions({
  secret: startup.sessionSecret, // can be anything
  maxAge: startup.cookieExpirationinMS
}));


app.use('/', express.static('./'));
app.use('/views', express.static('./public/views'));
app.use('/css', express.static('./public/css'));
app.use('/js', express.static('./public/js'));
app.use('/images', express.static('./public/images'));
app.use(routes);

if(startup.https === true)
{
	var http = require('http');
	var https = require('https');

	var pem = require('pem');
	pem.config({
 		pathOpenSSL: './openssl'
	})
	pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
		if(err) throw err;

		http.createServer(app).listen(startup.port);
		https.createServer({key : keys.serviceKey, cert : keys.certificate}, app).listen(startup.httpsPort);
		console.log("\n   Yeemazon server has initialized! \n      IP: " + myIP.address() + " HTTP Port: " + startup.port + "\n      HTTPS Port: " + startup.httpsPort);
	});
}
else
{
	app.listen(startup.port);
	console.log("\n   Yeemazon server has initialized! \n      IP: " + myIP.address() + " Port: " + startup.port + "\n      HTTPS Port: DISABLED");
}

