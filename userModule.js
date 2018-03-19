function User(username, password)
{
	if(isNaN(username)&&isNaN(password))
		return this;
	this.username = username;
	this.password = password;

	this.getName = function(){
		return this.username;
	};
	this.setName = function(newUsername){
		return (this.username = newUsername);
	};
	this.getPassword = function(){
		return this.password;
	};
	this.setPassword = function(newPassword){
		return (this.password = newPassword);
	};

	return this;
}
module.exports = User;