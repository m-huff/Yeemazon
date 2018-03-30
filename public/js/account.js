$(document).ready(function(){
	$.get("/userInfo", success);

	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});
	$("#request").click(() => {
		$.get("/findItems", {category:$("#search").val()},(data) => {
			alert(data.items);
		});
	});
});
var username, password;
function success(data)
{
	if(data.redirect === "/")
	{
		window.location = window.location.href.split("/")[1];
		return;
	}
	username = data.username;
	password = data.password;
	$("#username").html("Username: " + username);
	$("#password").html("Password: " + password);
}