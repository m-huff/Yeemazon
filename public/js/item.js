$(document).ready(function(){
	$.get("/userInfo", success);

	var id = retID(window.location.href);
	$.get("/itemInfo", {id:id},(data) => {
		$("#name").html(data[0].name + " \"ID: " + data[0]._id + "\"");
		$(document).prop('title', 'Yeemazon - ' + data[0].name);
		$("#itemPrice").html("$" + data[0].price);
		$("#itemDesc").html(data[0].description);
		$("#img").attr('src', data[0].link);
	});

	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});
	$("#account").click(() => {
		window.location = window.location.href.split("/")[1] + "/account";
	});
	$("#catalog").click(() => {
		window.location = window.location.href.split("/")[1] + "/session";
	});
});
function success(data)
{
	if(data.redirect === "/")
	{
		window.location = window.location.href.split("/")[1] + "/";
		return;
	}
	$("#userGreeting").html("Hello " + data.user.username + "!");
	$("#password").html(data.user.password);
}
function retID(WINDOWURL)
{
	var rightSide = WINDOWURL.split("?")[1];
	var findIt = rightSide.split("id")[1];
	var maybe = findIt.split("=")[1];
	return maybe;
}