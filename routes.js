
var express = require("express");
var router = express.Router();

const request = require('request');
var clientSessions = require('client-sessions');
const uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');

var bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');

var startup = require('./startup');

mongoose.connect(startup.link);
let db = mongoose.connection;

db.once('open',function(){
	console.log("Connected to remote db.")
});
db.on('error',function(err){
	console.log(err);
});

let Product = require('./models/product')

router.get("/",handler);
router.get("/login",handler);
router.get("/session",handler);

router.get("/account", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\account.html");
});
router.get("/item", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\item.html");
});
router.get("/cart", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\cart.html");
});
router.get("/orders", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\orders.html");
});
router.get("/admin", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\admin.html");
});
router.get("/itemInfo", function(req, res){
	//return res.json({item:items.findItemByID(req.query.id)});
	Product.find({_id:req.query.id},function(err,products){
		if (err) {
			console.log(err);
		}else{
			return res.json(products);
		}
	});
});
router.get("/search", function(req, res){
	res.sendFile(__dirname + "\\public\\views\\search.html");
});

function handler(req, res)
{
	res.sendFile(__dirname + ("\\public\\views\\" + ((req.session_state.active) ? "session.html" : "login.html")));
}
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: startup.gmail,
        pass: startup.password
    },
 tls: {
    	rejectUnauthorized: false
	},
	port: 465,
	secure:true

});
router.get("/signup",function(req,res){
	res.sendFile(__dirname + "/public/views/signup.html");
});

var UserData = new (require("./userData")) ("admin", "costa.vincent132@gmail.com", bcrypt.hashSync("pass", saltRounds));
UserData.allUsers[0].addIP("::ffff:192.168.1.135");
UserData.allUsers[0].addIP("::ffff:10.73.122.151");

var loggers = [];
var verificationKeys = [];


router.get("/findItems", function(req, res){
	//var keywords = req.query.keywords;
	//return res.json({items:items.find(keywords.split(" "))});

	Product.find({keywords:req.query.keywords},function(err,products){
		if (err) {console.log(err);}
		else{
			return res.json({items:products});
		}
	});
});
router.get("/findItem", function(req, res){
	//return res.json({itemID:(items.searchName(req.query.name)).itemID});

	Product.findOne({name:req.query.name},function(err,products){
		if (err) {console.log(err);}
		else{
			return res.json({item:products});
		}
	});
});

router.post("/addItem", function(req, res){
	//add an item to mongodb
	//return error:true or error:false in a json object
});
router.post("/changeItem", function(req, res){
	//change an item in mongodb
	//return error:true or error:false in a json object
});
router.post("/deleteItem", function(req, res){
	//remove an item from mongodb
	//return error:true or error:false in a json object
});

router.get("/verify", function(req, res){
	for(let i=0;i<verificationKeys.length;i++)
		if(req.query.code === verificationKeys[i][0])
		{
			var user = verificationKeys[i][1];
			UserData.findReturnUser(user.getName()).addIP(verificationKeys[i][2]);
			console.log("Correct code");
			loggers[loggers.length] = [user, verificationKeys[i][2]];
			return res.sendFile(__dirname + "\\public\\views\\session.html");
		}
	return res.json({error:"Code is invalid or has expired!"});
});

router.get("/getItemInfo", function(req, res){
//	var itemID = req.query.itemID;
//	res.json({items:items.findById(itemID)});

	Product.find({_id:req.query.itemID},function(err,products){
		if(err){
			console.log(err);
		}else{
			console.log(req.query.itemID);
			console.log(products);
			res.json(products);
		}
	});
});

router.get("/userInfo",function(req,res){
	if(!getUserfromIP(req))
	{
		req.session_state.reset();
		res.json({redirect:"/"});
		console.log("Userinfo requested");
	}
	else
	{
		var user = getUserfromIP(req);
		res.json({user:user});
	}

	
});

router.get("/login",function(req,res){
	res.sendFile(__dirname + "/public/views/login.html");
});

var tryers = [];
var banned = [];
router.post("/login", loginAttempt);


router.post("/signup", function(req, res){
	var ip = getIP(req);
	if(getUserfromIP(req) !== undefined)
		return res.json({success:false, status: "You are currently logged in, please sign out first"});

	if(!req.body.captcha)
		return res.json({success:false, status:"Please select captcha"});

	const verify = `https://google.com/recaptcha/api/siteverify?secret=${startup.recaptchaKey}&response=${req.body.captcha}&remoteip=${ip}`;

	request(verify, (err, response, body) => {
		body = JSON.parse(body);
		if(body.success !== undefined && !body.success)
			return res.json({success:false, status:"Failed captcha"});
	});

	var check;
	if(check = checkForBug(req, true))
		return check;

	req.session_state.username = req.body.username;
	req.session_state.email = req.body.email;
	req.session_state.password = req.body.password;
	req.session_state.active = true;

	var hashed = bcrypt.hashSync(req.body.password, saltRounds);
	console.log(hashed);
	var user = UserData.addUser(req.body.username, req.body.email, hashed);
	user.addIP(ip);
	console.log(user.myIPs);

	loggers[loggers.length] = [user, ip];
	return res.json({redirect: "/session"});
});
router.post("/logout", function(req, res){
	var ip = getIP(req);
	var user = getUserfromIP(req);
	req.session_state.reset();
	for(let i=0;i<loggers.length;i++)
		if(loggers[i][1] === ip)
			loggers.splice(i, 1);
	return res.json({redirect: "/"});
});

function getIP(req)
{
	return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];

}
function getUserfromIP(req)
{
	var ip = getIP(req);
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
		return res.json({status:"Banned"});

	console.log("Login check for " + ip);

	var check;
	if(check = checkForBug(req))
		return res.json(check);

	var status;
	if(user)
	{
		status = (bcrypt.compareSync(req.body.password, user.getPassword())) ? "Success" : "Incorrect";
	}
	else
		status = "Username not found";
	if(status === "Success")
	{
		if(user.IPExists(ip)||req.body.username === "admin")
		{
			loggers[loggers.length] = [user, ip];
			req.session_state.username = req.body.username;
			req.session_state.email = req.body.email;
			req.session_state.password = req.body.password;
			req.session_state.active = true;
			res.json({redirect:"/session"});
			console.log("User: " + user.username + " has logged in on IP: " + ip);
		}
		else
		{
			if(verificationExists(user.getName()))
			{
				return res.json({status:"An email to verify your ip has already been sent"});
			}
			else
			{
				var key = uuidv4();
				verificationKeys[verificationKeys.length] = [key, user, ip];
				console.log(req.body.ref);

				var link = "http://" + req.body.ref + "/verify?code=" + key;
				const mailOptions = {
				  from: 'yeemazon@gmail.com', // sender address
				  to: user.email, // list of receivers
				  subject: 'IP Verification link', // Subject line
				  html: '<a href="' + link + '">Click here  to verify</a>'// plain text body
				};

				res.json({status:"You are accessing this account from a new IP, a verification has been sent to your email"});
				console.log("Verification email has been sent to " + user.email + " code: " + key);
				transporter.sendMail(mailOptions, function (err, info) {
				   
				});
			}
		}
		
	}
	else if(status === "Incorrect")
		res.json(incorrectAttempt(res, "Incorrect", ip));
	else
		res.json({status:status});
	
}
function checkForBug(req, isSignup = false)
{
	if(req.body.username.includes("<")||req.body.username.includes(">"))
		return res.json({success:false, status:"Invalid Username"});
	if(isSignup && (req.body.email.includes("<")||req.body.email.includes(">")))
		return res.json({success:false, status:"Invalid email"});
	if(req.body.password.includes("<")||req.body.password.includes(">"))
		return res.json({success:false, status:"Invalid password"});
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
function verificationExists(username)
{
	for(let i=0;i<verificationKeys.length;i++)
		if(verificationKeys[i][1].getName() === username)
			return true;
	return false;
}







module.exports = router;

