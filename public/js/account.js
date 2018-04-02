$(document).ready(function(){
	$.get("/userInfo", success);

	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});
	
});
var username, password;
function success(data)
{
	if(data.redirect === "/")
	{
		window.location = window.location.href.split("/")[1] + "/";
		return;
	}
	$("#username").html("Username: " + data.user.username);
	$("#email").html("Email: " + data.user.email);
	$("#password").html("Password: " + data.user.password);
	
}