function sendLogin()
{
	$.ajax({
            url:"/login", 
            type:"POST", 
            data: {username:$("#username").val(), password:$("#password").val(), ref:(window.location.href.split("/")[2])}, 
            success: redirect,
            dataType : "json"
        });
}
function redirect(data)
{
	if(data.status)
		alert(data.status);
	else
		window.location = window.location.href.split("/")[1] + data.redirect;
}
function sendSignup()
{
	window.location = window.location.href.split("/")[1] + "/signup";
}
$(document).ready(function(){ 
	$("#request").click(sendLogin);
	$("#signup").click(sendSignup);

	$('.loginInput').keypress(function(e){
      if(e.keyCode==13)
      $('#request').click();
    });
});