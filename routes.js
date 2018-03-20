
var express = require("express");
var router = express.Router();



router.get("/signup",function(request,response){
	response.sendFile(__dirname + "/public/views/signup.html");
});

router.get("/session",function(request,response){
	var user = getUserfromIP(request);
	if(user)
		response.sendFile(__dirname + "/public/views/session.html");
	else
		response.sendFile(__dirname + "/public/views/login.html");
});

router.get("/session/:name:password",function(request,response){

});

var UserData = new (require("./userData")) ("admin", "password");


var loggers = [];


router.get("/userInfo",function(request,response){
	var user = getUserfromIP(request);
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
	console.log("Login check");
	var ip = getIP(req);
	var user = UserData.findReturnUser(req.body.username);
	var status = user ? (user.getPassword() === req.body.password ? "Success" : "Incorrect") : "Not";
	if(status === "Success")
		loggers[loggers.length] = [user, ip];
	res.json(status);
	console.log("User: " + user.username + " IP: " + ip + " has logged in");
});


router.post("/signup", function(req, res){
	var ip = getIP(req);
	var user = UserData.addUser(req.body.username, req.body.password);
	loggers[loggers.length] = [user, ip];
	res.json({status: (user)});
});
function getIP(request)
{
	return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
}
function getUserfromIP(request)
{
	var ip = getIP(request);
	var user;
	for(let i = 0; i < loggers.length;i++)
		if(loggers[i][1] === ip)
			user = loggers[i][0];
	return user;
}
module.exports = router;

