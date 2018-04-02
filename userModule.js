function User(username, email, password)
{
	this.username = username;
	this.email = email;
	this.password = password;

	this.getName = function(){
		return this.username;
	};
	this.setName = function(newUsername){
		return (this.username = newUsername);
	};

	this.getEmail = function(){
		return this.email;
	};
	this.setEmail = function(newEmail){
		return (this.email = newEmail);
	};

	this.getPassword = function(){
		return this.password;
	};
	this.setPassword = function(newPassword){
		return (this.password = newPassword);
	};

	this.myIPs = [];
	this.getmyIPs = function() {
		return this.myIPs;
	};
	this.addIP = function(ip) {
		this.myIPs[this.myIPs.length] = ip;
	};
	this.IPExists = function(ip) {
		for(let i=0;i<this.myIPs.length;i++)
			if(ip === this.myIPs[i])
				return true;
		return false;
	};
	return this;
}
module.exports = User;