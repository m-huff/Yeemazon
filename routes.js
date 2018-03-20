
var express = require("express");
var router = express.Router();



router.get("/signup",function(request,response){
	response.sendFile(__dirname + "/public/views/signup.html");
});

router.get("/session",function(request,response){
	response.sendFile(__dirname + "/public/views/session.html");
});

router.get("/session/:name:password",function(request,response){

});

var UserData = new (require("./userData")) ("admin", "password");


var loggers = [];


router.get("/userInfo",function(request,response){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var user;
	for(let i = 0; i < loggers.length;i++)
		if(loggers[i][1] === ip)
			user = loggers[i][0];
	
	if(user)
		response.json({username:user.getName(), password : user.getPassword()});
	else
		next();
	console.log("Userinfo requested");
});

router.get("/login",function(request,response){
	response.sendFile(__dirname + "/public/views/login.html");
});

router.post("/login", function(req, res){
	console.log("Login request");
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var user = UserData.findReturnUser(req.body.username);
	var status = user ? (user.getPassword() === req.body.password ? "Success" : "Incorrect") : "Not";
	if(status === "Success")
		loggers[loggers.length] = [user, ip];
	res.json(status);
	console.log(user.username + " ip: " + ip);

	//redirect to session and ask them to get userInfo
});


router.post("/signup", function(req, res){
	res.json((UserData.addUser(req.body.username, req.body.password)) ? 
		{success:"You were created"} : {error:"You were a failure"});
	//instead of success, redirect to session and ask them to get userInfo
});

module.exports = router;

