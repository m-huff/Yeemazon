$(document).ready(function(){
	$.get("/userInfo", success);
	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[0] + data.redirect;
		});
	});
});
var username, password;
function success(data)
{
	username = data.username;
	password = data.password;
	$("#userGreeting").html("Hello " + username + "!");
	$("#password").html(password);
}