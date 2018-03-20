function sendSignUp()
{
	$.post("/signup", {username:$("username").val(),password:$("password")}, redirect);
}
function redirect(data)
{
	if(data.error)
		$("message").val(data.error);
	else
		$.get(data);
}