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
	if(data.error)
		$("#message").val(data.error);
	else
		window.location.replace("http://localhost:3000/session");
}
$(document).ready(function(){ 
	$("#request").click(sendLogin);
});