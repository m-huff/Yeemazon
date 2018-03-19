
var express = require("express");
var router = express.Router();

router.get("/login",function(request,response){
	response.sendFile(__dirname + "/public/views/login.html");
});

router.get("/signup",function(request,response){
	response.sendFile(__dirname + "/public/views/signup.html");
});

router.get("/session",function(request,response){
	response.sendFile(__dirname + "/public/views/session.html");
});

var UserData = new (require("./userModule")) ();

UserData.addUser("admin", "password");


router.get("/userInfo",function(request,response){
	var username = request.query.username;
	var user = UserData.findReturnUser(username);
	response.json((user) ? user : {error:"User does not exist!"});
});


router.post("/login", function(req, res){
	var user = UserData.findReturnUser(req.body.username);
	var status = user ? (user.getPassword() === req.body.password ? "Success" : "Incorrect") : "Not";
	switch(status)
	{
		case "Success":
			
			break;
		case "Incorrect":
			
			break;
		case "Not":
			
			break;
		case default:
			
			break;
	}

	//redirect to session and ask them to get userInfo
});


router.post("/signup", function(req, res){
	res.json((UserData.addUser(req.body.username, req.body.password)) ? 
		{success:"You were created"} : {error:"You were a failure"});
	//instead of success, redirect to session and ask them to get userInfo
});

module.exports = router;

