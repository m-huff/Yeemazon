function sendLogin()
{
	$.ajax({
            url:"/signup", 
            type:"POST", 
            data: {username:$("#username").val(), password:$("#password").val(), captcha:$("#g-recaptcha-response").val()}, 
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
	//$("#former").on('submit', submitForm);
});
function submitForm(e)
{
	e.preventDefault();

}