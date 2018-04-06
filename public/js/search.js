$(document).ready(function(){
	$.get("/userInfo", success);
	$.get("/findItems", {keywords:retID(window.location.href)}, function(data){
		for(var i = 0; i < data.items.length; i++) {

			let id = data.items[i]._id;
			var divCreator = "<div id=\"" + id + "\" class=\"itemBox\"><img src=\"" + data.items[i].link + "\" style=\"width:140px;height:140px;margin-top:5px\"></img><br><label>$" + data.items[i].name + "</label><br><label>" + data.items[i].price + "</label></div>";
			$(".searchHolder").append(divCreator);
			$("#" + id).click(function(){window.location = window.location.href.split("/")[1] + "/item?id=" + id});

		}

		//scale the back of the page to compensate for number of items
		$(".searchHolder").css("height", 230 * (Math.floor((data.items.length/6)) + 1));
		$("#searchBack").css("height", 350 * (Math.floor((data.items.length/6)) + 1));

		//update search list size to show user
		$(".itemLabel").html("Search Results for " + "\"" + retID(window.location.href) + "\" -- " + data.items.length + " results");

	});
	$("#logout").click(() => {
		$.post("/logout", (data) => {
			window.location = window.location.href.split("/")[1] + data.redirect;
		});
	});
	$("#account").click(() => {
		window.location = window.location.href.split("/")[1] + "/account";
	});
	$("#return").click(() => {
		window.location = window.location.href.split("/")[1] + "/session";
	});
	$("#orders").click(() => {
		window.location = window.location.href.split("/")[1] + "/orders";
	});
	$("#cart").click(() => {
		window.location = window.location.href.split("/")[1] + "/cart";
	});
	$("#request").click(() => {
		if ($("#search").val() && $("#search").val() !== "Search for an item")
			window.location = window.location.href.split("/")[1] + "/search?query=" + $("#search").val().toLowerCase();
	});

	$(document).keypress(function(e){
      if(e.keyCode==13 && $("#search").val() && $("#search").val() !== "Search for an item")
      $('#request').click();

  	  if (!($("#search").val()) || $("#search").val() == "Search for an item")
    	$('#request').prop('disabled', true);
      else
    	$('#request').prop('disabled', false);
    });

	$('#request').prop('disabled', true);

    $("#search").focus( function() {
        if ( $(this).val()=="Search for an item") {
            $(this).val('');
        } 
    });

    $("#search").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Search for an item');
        } 
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
	var findIt = rightSide.split("query")[1];
	var maybe = findIt.split("=")[1];
	return maybe;
}