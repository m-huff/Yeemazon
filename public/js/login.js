function sendLogin()
{
	$.post("/login", {username:$("username").val(),password:$("password")}, redirect);
}
function redirect(data)
{
	if(data.error)
		$("message").val(data.error);
	else
		$.get(data);
}
