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

	//check that all text fields are filled out and send info to routes to add item
	$("#add").click(() => {
		if ($("#name").val() && $("#id").val() && $("#desc").val() && $("#price").val() && $("#link").val() && 
		$("#name").val()!=="Item Name" && $("#id").val()!=="Item ID" && $("#desc").val()!=="Item Description" &&
        $("#link").val()!=="Item Picture Link" && $("#price").val()!=="Item Price") {
        	//TODO -- add /addItem to routes
			$.post("/addItem", {name:$("#name").val(),_id:$("#id").val(),price:$("#price").val(),link:$("#link").val(),desc:$("#desc").val()}
			,function(data){if(data.error)alert("ERROR: Item not added, please try again"); else alert("Item successfully added")});
		} else {
			alert("Form filled out incorrectly, please check your data");
		}
	});

	//check that all text fields are filled out and send info to routes to change item
	$("#change").click(() => {
		if($("#name").val() && $("#id").val() && $("#desc").val() && $("#price").val() && $("#link").val() && 
		$("#name").val()!=="Item Name" && $("#id").val()!=="Item ID" && $("#desc").val()!=="Item Description" &&
        $("#link").val()!=="Item Picture Link" && $("#price").val()!=="Item Price") {
			//TODO -- add /addItem to routes
			$.post("/changeItem", {name:$("#name").val(),_id:$("#id").val(),price:$("#price").val(),link:$("#link").val(),desc:$("#desc").val()},
			function(data){if(data.error)alert("ERROR: Item not changed, please check data and try again"); else alert("Item successfully changed")});
		} else {
			alert("Form filled out incorrectly, please check your data");
		}
	});

	//check that ID is filled in and send to routes to delete item
	$("#remove").click(() => {
		if($("#id").val() && $("#id").val()!=="Item ID")
			$.post("/deleteItem", {_id:$("#id").val()}, 
			function(data){if(data.error)alert("ERROR: Item not removed, please check ID try again"); else alert("Item successfully removed")});
		else
			alert("ID not inputted correctly, please check your data");
	});

	$(".loginInput").focus( function() {
        if ( $(this).val()=="Item Name" || $(this).val()=="Item ID" || $(this).val()=="Item Description" ||
        $(this).val()=="Item Picture Link" || $(this).val()=="Item Price") {
            $(this).val('');
        } 
    });
    $("#name").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Item Name');
        } 
    });

    $("#id").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Item ID');
        } 
    });

    $("#desc").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Item Description');
        } 
    });

    $("#link").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Item Picture Link');
        } 
    });

    $("#price").blur( function() {
        if ( $(this).val()=="") {
            $(this).val('Item Price');
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
	$("#username").html("Username: " + data.user.username);
	$("#email").html("Email: " + data.user.email); 
}