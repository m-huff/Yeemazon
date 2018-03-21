function sendLogin()
{
	$.ajax({
            url:"/signup", 
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
$(document).ready(function(){ 
	$("#request").click(sendLogin);
});