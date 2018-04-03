$(document).ready(function(){
	$.get("/userInfo", success);
	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});

	$("#return").click(() => {
		window.location = window.location.href.split("/")[1] + "/session";
	});

	$("#account").click(() => {
		window.location = window.location.href.split("/")[1] + "/account";
	});

	$("#orders").click(() => {
		window.location = window.location.href.split("/")[1] + "/orders";
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
	//$("#itemLabel").html("Your Cart (" + number of items in cart + " Items)");
}