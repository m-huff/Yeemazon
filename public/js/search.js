$(document).ready(function(){
	$.get("/userInfo", success);
	$.get("/findItems", {keywords:retID(window.location.href)}, function(data){
		for(var item in data.items) {

		//DUMMY ITEM BOX
		var divCreator = "<div onclick=\"goToItemPage\" class=\"itemBox\"><img src=\"views/kingkong.gif\" style=\"width:150;height:150px;margin-top:5px\"></img><br><label>YODA</label><br><label>$19.99</label></div>";
		$(".searchHolder").append(divCreator);

		}
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
		window.location = window.location.href.split("/")[1] + "/search?query=" + $("#search").val();
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
	$(".itemLabel").html("Search Results for " + "\"" + retID(window.location.href) + "\"");
}
function retID(WINDOWURL)
{
	var rightSide = WINDOWURL.split("?")[1];
	var findIt = rightSide.split("query")[1];
	var maybe = findIt.split("=")[1];
	return maybe;
}