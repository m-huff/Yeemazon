var user = new (require("./User")) ();
function Users()
{
	this.allUsers = [];

	this.addUser = function(username, password) {
		this.allUsers[this.allUsers.length] = new user(username, password);
		return true;
	};
	this.findReturnUser = function(username) {
		for(let i=0;i<allUsers.length;i++)
			if(allUsers[i].getName() === username)
				return allUsers[i];
		return null;
	};

	return this;
}

module.exports = User;