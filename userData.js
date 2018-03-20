
function Users(username, password)
{
	var user = new (require("./UserModule")) ();
	this.allUsers = [];

	this.addUser = function(username, password) {
		this.allUsers[this.allUsers.length] = new (require("./UserModule")) (username, password);
		return true;
	};
	this.addUser(username, password);
	this.findReturnUser = function(username) {
		for(let i=0;i<this.allUsers.length;i++)
			if(this.allUsers[i].getName() === username)
				return this.allUsers[i];
		return null;
	};
	this.findUserIndex = function(username){
		for(let i=0;i<this.allUsers.length;i++)
			if(this.allUsers[i].getName() === username)
				return i;
	};
	this.deleteUser = function(username, password) {
		this.allUsers.splice(this.findUserIndex(username), 1);
	};
	this.changePassword = function(username,  newPassword){
		var user = this.findReturnUser(username);
		user.setPassword( (user.getPassword() === oldPassword) ? newPassword : oldPassword);
	};

	return this;
}

module.exports = Users;