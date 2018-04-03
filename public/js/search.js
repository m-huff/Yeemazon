$(document).ready(function(){
	$.get("/userInfo", success);
	$.get("/findItems", {keywords:retID(window.location.href)}, function(data){
		for(var item in data.items)
			var divCreator = "<div class='itemBox'>
								<img id='itemBoxPic' src=''>" + item.icon + "</img>
								<label id='itemBoxName'>" + item.name + "</label>
								<label id='itemBoxPrice'>" + item.price + "</label>
				  			  </div>";
			$(".searchHolder").append(divCreator);
	});
	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});
	$("#account").click(() => {
		window.location = window.location.href.split("/")[1] + "/account";
	});
	$("#orders").click(() => {
		window.location = window.location.href.split("/")[1] + "/orders";
	});
	$("#cart").click(() => {
		window.location = window.location.href.split("/")[1] + "/cart";
	});
	$("#request").click(() => {
		window.location = window.location.href.split("/")[1] + "/search?query=" + $("#request").val();
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