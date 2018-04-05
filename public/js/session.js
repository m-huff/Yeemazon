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