
let express = require("express");
let router = express.Router();
let startup = require('./startup');

const request = require('request');
const clientSessions = require('client-sessions');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const saltRounds = startup.saltRounds;

const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');
const fs = require('fs');

mongoose.connect(startup.link);
let db = mongoose.connection;
let Product = require('./models/product');
let users = require('./models/user');

db.once('open',function(){
	console.log("Connected to remote db.");

	users.count({}, (err, count) => {
		console.log("Number of users: " + count);
	});
	Product.count({}, (err, count) => {
		console.log("Number of products: " + count);
	});
});
db.on('error',function(err){
	console.log(err);
});

let transporter = nodemailer.createTransport({
 service: startup.emailType,
 host: startup.host,
 auth: {
 		type:'login',
        user: startup.email,
        pass: startup.password
    },
 tls: {
    	rejectUnauthorized: false
	},
	port: 465,
	secure:true
});

let loggers = [];
let verificationKeys = [];
let tryers = [];
let banned = [];


/////////////////////GETTERS////////////////////////////////////////////////////////
router.get("/",handler);
router.get("/login",handler);
router.get("/session",handler);

function handler(req, res){
	res.sendFile(__dirname + ("\\public\\views\\" + ((req.session_state.active) ? "session.html" : "login.html")));
}

let getters = ["account", "item", "cart", "orders", "admin", "search", "signup", "login"];

for(let i in getters)
	router.get("/" + getters[i], function(req, res){
		res.sendFile(__dirname + "\\public\\views\\" + getters[i] + ".html");
	});

router.get("/itemInfo", function(req, res){
	if(!req.query.id || req.query.id === "")
		return res.json({error:"Enter an ID RYAN"});
	Product.find({_id:req.query.id},function(err,products){
		if(err) throw err;
		return res.json(products);
	});
});

router.get("/findItem", function(req, res){
	if(!req.query.name || req.query.name !== "")
	Product.findOne({name:req.query.name},function(err,products){
		if (err) throw err;
		return res.json({item:products});
	});
});

router.get("/findItems", function(req, res){
	if(!req.query.keywords || req.query.keywords !== [])
	Product.find({keywords:req.query.keywords},function(err,products){
		if (err) throw err;
		return res.json({items:products});
	});
});

router.get("/getItemInfo", function(req, res){

	Product.find({_id:req.query.itemID},function(err,products){
		if(err) throw err;
		return res.json({item:products});
	});
});


router.get("/userInfo",function(req,res){
	console.log("Userinfo requested");
	if(!req.session_state || req.session_state.active === false || !userExistsFromIP(req)) {
		req.session_state.reset();
		return res.json({redirect:"/"});
	}
	users.findOne({username:req.session_state.username}, (err, user) => {
		if(err) throw err;
		return res.json({user:user});
	});
});

router.get("/cartItems", function(req, res){
	users.findOne({username : req.session_state.username}, (err, user) => {
		if(err) throw err;
		Product.find({_id: {$in : user.Cart}}, (err, products) => {
			if(err) throw err;
			return res.json({items:products});
		});
	});
});


router.get("/verify", function(req, res){
	for(let i=0;i<verificationKeys.length;i++)
		if(req.query.code === verificationKeys[i][0])
		{
			users.update({username:verificationKeys[i][1]}, {$push: {IPs : verificationKeys[i][2]}}, function(err, user){
				if(err) throw err;
				loggers[loggers.length] = [user.username, verificationKeys[i][2]];
			});
			return res.json({status:"IP has been verified"});
		}
	return res.json({error:"Code is invalid or has expired!"});
});

router.get("/requestPermission", function(req, res) {
	if(!req.session_state || req.session_state.active === false || !req.query.permission || req.query.permission === "")
		return res.json({errpr:"Field does not exist"});
	user.findOne({username:req.session_state.username}, (err, user) => {
			sendEmail(user.email, req.body.emailPass, "costa.vincent132@gmail.com", req.body.subject, user.username + " is requesting " + req.query.permission + " for their account");
	});
});


	////////////////////END OF GETTERS/////////////////////////////////////////////////////////////////////////////


//////////////////////POST REQUESTS////////////////////////////////////////////////////////////////////////////
router.post("/login", loginAttempt);

router.post("/signup", function(req, res){
	let ip = getIP(req);
	if(userExistsFromIP(req) !== undefined)
		return res.json({success:false, status: "You are currently logged in, please sign out first"});
	users.findOne({username:req.body.username}, (err, user) => {
		if(err) throw err;
		if(user !== null)
			return res.json({success:false, status:"Username already exists"});
		if(!req.body.captcha)
			return res.json({success:false, status:"Please select captcha"});

		const verify = `https://google.com/recaptcha/api/siteverify?secret=${startup.recaptchaKey}&response=${req.body.captcha}&remoteip=${ip}`;

		request(verify, (err, response, body) => {
			body = JSON.parse(body);
			if(body.success !== undefined && !body.success)
				return res.json({success:false, status:"Failed captcha"});
		});

		let check;
		if(check = checkForBug(req, true))
			return res.json(check);

		req.session_state.username = req.body.username;
		req.session_state.email = req.body.email;
		req.session_state.password = req.body.password;
		req.session_state.active = true;

		let hashed = bcrypt.hashSync(req.body.password, saltRounds);
		let newUser = {
			_id : new ObjectID(),
			username : req.body.username,
			email : req.body.email,
			password : hashed,
			IPs : [ip],
			Cart : []
		}
		db.collection('users').insert(newUser);

		loggers[loggers.length] = [newUser, ip];
		return res.json({redirect: "/session"});
	});
});

router.post("/logout", function(req, res){
	let ip = getIP(req);
	for(let i=0;i<loggers.length;i++)
		if(loggers[i][1] === ip)
			loggers.splice(i,1);
	req.session_state.reset();
	return res.json({redirect: "/"});
});


router.post("/addItem", function(req, res) {
	if(!req.body.name||!req.body.description||!req.body.price||!req.body.keywords)
		return res.json({error:"Ryan stop"});
	//if(!userHasPermission(req.session_state.username, "admin"))
		//return res.json({status:"You do not have permission to do this"});
	let newItem = {
			_id : new ObjectID(),
			name : req.body.name,
			description : req.body.description,
			price : req.body.price,
			link : "images/",
			keywords : req.body.keywords
		}
	db.collection('products').insert(newItem);
	return res.json({status:"Success"});
});

router.post("/changeItem", function(req, res) {
	if(!req.body.name||!req.body.description||!req.body.price||!req.body.keywords||!req.body._id)
		return res.json({error:"Ryan stop"});
	//if(!userHasPermission(req.session_state.username, "admin"))
		//return res.json({status:"You do not have permission to do this"});
	let item = {
		name : req.body.name,
		description : req.body.description,
		price : req.body.price,
		link : ".images",
		keywords : req.body.keywords,
	};
	Product.findOneAndUpdate({_id:req.body._id}, item, {upsert:true}, (err, item) => {
		if(err) throw err;
		return res.json({status:"Successfully changed item"});
	});
});

router.post("/deleteItem", function(req, res) {
	if(!req.body._id || req.body._id == 0)
		return res.json({error:"Ryan stop"});
	//if(!userHasPermission(req.session_state.username, "admin"))
		//return res.json({status:"You do not have permission to do this"});
	Product.remove({_id:req.body._id}, (err) => {
		return res.json({status:"Successfully deleted the item"});
	});
});


router.post("/addToCart", function(req, res) {
	if(!req.body.itemID || req.body.itemID == 0)
		return res.json({error:"Ryan stop"});
	users.update({username:req.session_state.username}, { $push: { Cart: req.body.itemID}}, (err, user) =>{
		if(err) throw err;
		return res.json({status:"Successful addition to cart"});
	});
});

router.post("/removeFromCart", function(req, res) {
	if(!req.body.itemID || req.body.itemID == 0)
		return res.json({error:"Ryan stop"});
	users.update({username:req.session_state.username}, { $pull: { Cart: req.body.itemID}}, (err, user) =>{
		if(err) throw err;
		return res.json({status:"Successful addition to cart"});
	});
});

router.post("/itemClicked", function(req, res) {
	if(!req.body.itemID || req.body.itemID == 0)
		return res.json({error:"Ryan stop"});
	Product.findOne({_id:req.body.itemID}, (err, product) => {
			product.clicks++;
			let found = false;
			for(let i in product.usersClicked)
				if(req.session_state.username === product.usersClicked[i])
				{
					found = true;
					break;
				}
			if(!found)
			{
				product.uniqueClicks++;
				product.usersClicked.push(req.session_state.username);
			}
			product.save((err) => {
				if(err) throw err;
			});
		});
	});

router.post("/sendEmail", function(req, res) {
	if(!req.body.itemID || req.body.itemID == 0)
		return res.json({error:"Ryan stop"});
	users.findOne({username:req.session_state.username}, (err, user) => {
		if(err) throw err;

		sendEmail(user.email, req.body.emailPass, req.body.to, req.body.subject, req.body.content);
	});


//////////////////////////END OF POST REQUESTS//////////////////////////////


////////////////////SPECIAL FUNCTIONS///////////////////////////////////////////////////////






function getIP(req) {
	return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];
}


function checkForBug(req, isSignup = false) {
	if(req.body.username.includes("<")||req.body.username.includes(">"))
		return {success:false, status:"Invalid Username"};
	if(isSignup && (req.body.email.includes("<")||req.body.email.includes(">")))
		return {success:false, status:"Invalid email"};
	if(req.body.password.includes("<")||req.body.password.includes(">"))
		return {success:false, status:"Invalid password"};

}

function bannedCheck(ip) {
	for (let i = 0; i < banned.length; i++)
		if(ip === banned[i])
			return true;
	return false;
}

function loginAttempt(req, res) {
	let ip = getIP(req);
	if(bannedCheck(ip)) return res.json({status:"Banned"});

	users.findOne({username:req.body.username}, (err, user) => {
		if(err) throw err;

		console.log("Login check for " + ip);

		let check;
		if(check = checkForBug(req))
			return res.json(check);

		let status;
		if(user)
		{
			status = (bcrypt.compareSync(req.body.password, user.password)) ? "Success" : "Incorrect";
		}
		else
			status = "Username not found";
		if(status === "Success")
		{
			let IPExistsOnUser = false;
			for(let i=0;i<user.IPs.length;i++)
				if(ip === user.IPs[i])
					IPExistsOnUser = true;

			if(IPExistsOnUser||req.body.username === "admin")
			{
				loggers[loggers.length] = [user.username, ip];
				req.session_state.username = req.body.username;
				req.session_state.email = req.body.email;
				req.session_state.password = req.body.password;
				req.session_state.active = true;
				res.json({redirect:"/session"});
				console.log("User: " + user.username + " has logged in on IP: " + ip);
			}
			else
			{
				if(verificationExists(user.username))
				{
					return res.json({status:"An email to verify your ip has already been sent"});
				}
				else
				{
					let key = uuidv4();
					verificationKeys[verificationKeys.length] = [key, user.username, ip];
					console.log(req.body.ref);

					let link = "http://" + req.body.ref + "/verify?code=" + key;
					const mailOptions = {
					  from: startup.email, // sender address
					  to: user.email, // list of receivers
					  subject: 'IP Verification link', // Subject line
					  html: '<a href="' + link + '">Click here  to verify</a>'// plain text body
					};

					res.json({status:"You are accessing this account from a new IP, a verification has been sent to your email"});
					console.log("Verification email has been sent to " + user.email + " code: " + key);
					transporter.sendMail(mailOptions, function (err, info) {
					   console.log(err);
					});
				}
			}

		}
		else if(status === "Incorrect")
			res.json(incorrectAttempt(res, "Incorrect", ip));
		else
			res.json({status:status});
	});

}

function incorrectAttempt(res, status, ip) {
	let found = false, index = 0;
	for(let i=0;i<tryers.length;i++)
		if(ip===tryers[i][0])
		{
			if(tryers[i][1] - 1 > 0)
				tryers[i][1]--;
			else {
				console.log("Login attempts reached for " + ip);
				banned.push(ip);
				return {status:"Locked out"};
			}
			found = true;
			index = i;
			break;
		}
	let remaining = (found) ? tryers[index][1] : (tryers[tryers.length] = [ip, startup.loginAttempts])[1];
	return {status:status, attempts:remaining};
}

function checkPassword(req) {
	users.findOne({username:req.session_state.username}, (err, user) => {
		if(err) throw err;
		return bcrypt.compareSync(req.session_state.password, user.password);
	});
}


function verificationExists(username) {
	for(let i=0;i<verificationKeys.length;i++)
		if(verificationKeys[i][1].username === username)
			return true;
	return false;
}

function userExistsFromIP(req) {
	let ip = getIP(req);
	for(let i=0;i<loggers.length;i++)
		if(loggers[i][1] === ip)
			return true;
}

function userHasPermission(username, permissionLevel){
	users.findOne({username:username}, (err, user) => {
		if(err) throw err;
		return user.permission === permissionLevel;
	});
}

function sendEmail(FromEmail, FromPassword, ToEmail, Subject, Content) {
	let newTransport = nodemailer.createTransport({
	 service: startup.emailType,
	 host: startup.host,
	 auth: {
			type:'login',
					user: FromEmail,
					pass: FromPassword
			},
	 tls: {
				rejectUnauthorized: false
		},
		port: 465,
		secure:true
	});
	const newMailOptions = {
		from: FromEmail, // sender address
		to: ToEmail, // list of receivers
		subject: Subject, // Subject line
		html: '<h3>' + Content + '</h3>'// plain text body
	};
	newTransport.sendMail(newMailOptions, function (err, info) {
		 console.log(err);
	});
}


////////////////////////END OF FUNCTIONS///////////////////////////////////////////////////////





module.exports = router;
