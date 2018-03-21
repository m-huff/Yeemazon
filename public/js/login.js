function sendLogin()
{
	$.ajax({
            url:"/login", 
            type:"POST", 
            data: {username:$("#username").val(), password:$("#password").val()}, 
            success: redirect, 
            dataType : "json"
        });
}
function redirect(data)
{
	if(data.status)
		alert(data.status);
	else
		window.location = window.location.href.split("/")[0] + data.redirect;
}
function sendSignup()
{
	window.location = window.location.href.split("/")[0] + "/signup";
}
$(document).ready(function(){ 
	$("#request").click(sendLogin);
	$("#signup").click(sendSignup);
});