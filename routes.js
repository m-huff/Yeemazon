
var express = require("express");
var router = express.Router();

router.get("/",handler);
router.get("/login",handler);
router.get("/session",handler);

function handler(request, response)
{
	response.sendFile(__dirname + ("\\public\\views\\" + (getUserfromIP(request) ? "session.html" : "login.html")));
}

router.get("/signup",function(request,response){
	response.sendFile(__dirname + "/public/views/signup.html");
});

var UserData = new (require("./userData")) ("admin", "password");
var loggers = [];

var items = [];

router.get("/info", function(req, res){
	var user = getUserfromIP(getIP(req));
	res.json((user ? {items:items} : {error:"You do not exist yet"} ));
});

router.get("/userInfo",function(request,response){
	var user = getUserfromIP(request);
	if(user)
		response.json({username:user.getName(), password : user.getPassword()});
	else
		response.json({redirect:"/"})
	console.log("Userinfo requested");
});

router.get("/login",function(request,response){
	response.sendFile(__dirname + "/public/views/login.html");
});

var tryers = [];
var banned = [];
router.post("/login", loginAttempt);


router.post("/signup", function(req, res){
	var ip = getIP(req);
	var user = UserData.addUser(req.body.username, req.body.password);
	loggers[loggers.length] = [user, ip];
	res.json({redirect: "/session"});
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

function loginAttempt(req, res)
{
	
	var ip = getIP(req), user = UserData.findReturnUser(req.body.username);

	if(bannedCheck(ip))
	{
		res.json({status:"Banned"});
		return;
	}

	console.log("Login check for " + ip);

	var status = user ? (user.getPassword() === req.body.password ? "Success" : "Incorrect") : "Username not found";
	if(status === "Success")
	{
		loggers[loggers.length] = [user, ip];
		res.json({redirect:"/session"});
		console.log("User: " + user.username + " has logged in on IP: " + ip);
	}
	else if(status === "Incorrect")
		res.json(incorrectAttempt(res, "Incorrect", ip));
	else
		res.json({status:status});
	
}
function bannedCheck(ip)
{
	for (var i = 0; i < banned.length; i++) 
		if(ip === banned[i])
			return true;
	return false;
}
function incorrectAttempt(res, status, ip)
{
	var found = false, index = 0;
	for(let i=0;i<tryers.length;i++)
		if(ip===tryers[i][0])
		{
			if(tryers[i][1] - 1 > 0)
				tryers[i][1]--;
			else {
				console.log("Login attempts reached for " + ip);
				banned[banned.length] = ip;
				return {status:"Locked out"};
			}
			found = true;
			index = i;
			break;
		}
	var remaining = (found) ? tryers[index][1] : (tryers[tryers.length] = [ip, 5])[1];
	return {status:status, attempts:remaining};
}








module.exports = router;

