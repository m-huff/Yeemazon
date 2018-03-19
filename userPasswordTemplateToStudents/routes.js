	
var express = require("express");
var router = express.Router();
var path = require("path");
var clientSessions = require('client-sessions');


router.get("/signup",function(req,res){
//add or modify.  Send back to the client signup.html.	
	
});


router.get("/",function(req,res){
//add or modify.  Send back to the client login.html.	
	
});


router.get("/login",function(req,res){
//add or modify.  Send back to the client login.html.	
	
});

//add or modify.  Below is already done for you.
router.get("/logout",function(req,res){	
	req.session_state.reset();
	res.json({redirect:"/login"});
});	


router.get("/session",function(req,res){
//add or modify.  Look at req.session_state.??? to check if a session is active.
//                If session is active then send back to the client session.html.
//                else send back to the client login.html.

});

router.get("/userInfo",function(req,res){
//add or modify.  Look at req.session_state.??? to check if a session is active.
//                If session is active then send back to client a json object 
//                   with the user data.
//                else send back a json object that is null.

});

 

let userInfo = [];

router.post('/signup', function(req, res){
//add or modify.  Check if a valid signup.  If the signup is valid,
//                  add user and password info to userInfo array.
//                  Give req.session_state.??? a valid value.
//                  Send back a json object of {redirect:"/session"}.
//                else send back a json object that is null.

});



router.post('/login', function(req, res){
//add or modify.  Determine if the login info is valid.  If the login is valid,
//                  set req.session_state.??? to a valid value.
//                  Send back a json object of {redirect:"/session"}.
//                else send back a json object that is null.

});



module.exports = router;

