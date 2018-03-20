$(document).ready(function(){
	$.get("/userInfo", success);
});
var username, password;
function success(data)
{
	username = data.username;
	password = data.password;
	$("username").val(username);
	$("password").val(password);
}