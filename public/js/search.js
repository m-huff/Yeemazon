$(document).ready(function(){
	$.get("/userInfo", success);
	$.get("/findItems", {keywords:retID(window.location.href)}, function(data){
		for(var item in data.items) {

		//DUMMY ITEM BOX
		//TODO - have it display the actual item and its attributes
		var divCreator = "<div onclick=\"goToItemPage\" class=\"itemBox\"><img src=\"views/kingkong.gif\" style=\"width:260;height:260px;margin-top:5px\"></img><br><label>YODA</label><br><label>$19.99</label></div>";
		$(".searchHolder").append(divCreator);

		}

		//scale the back of the page to compensate for number of items
		$(".searchHolder").css("height", 360 * ((data.items.length/4) + 1));
		$("#searchBack").css("height", 490 * ((data.items.length/4) + 1));

		//DUMMY ITEMS FOR TESTING PURPOSES
		// var divCreator = "<div onclick=\"goToItemPage\" class=\"itemBox\"><img src=\"views/kingkong.gif\" style=\"width:260;height:260px;margin-top:5px\"></img><br><label>YODA</label><br><label>$19.99</label></div>";
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
		// $(".searchHolder").append(divCreator);
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
			window.location = window.location.href.split("/")[1] + "/search?query=" + $("#search").val();
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
	$(".itemLabel").html("Search Results for " + "\"" + retID(window.location.href) + "\"");
}
function retID(WINDOWURL)
{
	var rightSide = WINDOWURL.split("?")[1];
	var findIt = rightSide.split("query")[1];
	var maybe = findIt.split("=")[1];
	return maybe;
}
function goToItemPage() {
	//TODO - take the data from the item that was clicked and redirect the user to that specific page
	//have to wait for mongoose to be ready to use it
}