$(document).ready(function(){
	$.get("/userInfo", success);
});
var username, password;
function success(data)
{
	username = data.username;
	password = data.password;
	$("#userGreeting").html("Hello " + username + "!");
	$("#password").html(password);
}