$(document).ready(function(){
	$.get("/userInfo", success);
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
		if ($("#search").val() && $("#search").val() !== "Search for an item")
			window.location = window.location.href.split("/")[1] + "/search?query=" + $("#search").val().toLowerCase();
	});

	//grab first 6 "popular items"
	$.get("/findItems", {keywords:"popular"}, function(data){
		for(var i = 0; i < 6; i++) {

			let id = data.items[i]._id;
			var divCreator = "<div id=\"" + id + "\" class=\"itemBox\"><img src=\"" + data.items[i].link + "\" style=\"width:140px;height:140px;margin-top:5px\"></img><br><label>" + data.items[i].name + "</label><br><label>$" + data.items[i].price + "</label></div>";
			$("#items1").append(divCreator);
			$("#" + id).click(function(){window.location = window.location.href.split("/")[1] + "/item?id=" + id});

		}
	});

	//grab first 6 "under $20" items
	$.get("/findItems", {keywords:"under20"}, function(data){
		for(var i = 0; i < 6; i++) {

			let id = data.items[i]._id;
			var divCreator = "<div id=\"" + id+ "\" class=\"itemBox\"><img src=\"" + data.items[i].link + "\" style=\"width:140px;height:140px;margin-top:5px\"></img><br><label>" + data.items[i].name + "</label><br><label>$" + data.items[i].price + "</label></div>";
			$("#items2").append(divCreator);
			$("#" + id).click(function(){window.location = window.location.href.split("/")[1] + "/item?id=" + id});

		}
	});

	//grab first 6 "yee's picks" items
	$.get("/findItems", {keywords:"yee"}, function(data){
		for(var i = 0; i < 6; i++) {

			let id = data.items[i]._id;
			var divCreator = "<div id=\"" + id + "\" class=\"itemBox\"><img src=\"" + data.items[i].link + "\" style=\"width:140px;height:140px;margin-top:5px\"></img><br><label>" + data.items[i].name + "</label><br><label>$" + data.items[i].price + "</label></div>";
			$("#items3").append(divCreator);
			$("#" + id).click(function(){window.location = window.location.href.split("/")[1] + "/item?id=" + id});

		}
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

	if (data.user.username === "admin") {
		$("#toolbarRight").append("<button id=\"admin\" class=\"toolbarButton\">ADMIN ACTIONS</button>");
		$("#admin").click(function(){window.location = window.location.href.split("/")[1] + "/admin"});
	}
}