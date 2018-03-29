function Item(name, description, price, itemID)
{
	this.name = name;
	this.description = description;
	this.price = price;
	this.itemID = itemID;


	this.getName = function(){
		return this.name;
	};
	this.setName = function(newUsername){
		return (this.name = name);
	};
	this.getDescription = function(){
		return this.description;
	};
	this.setDescription = function(newDescription){
		return (this.description = description);
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
module.exports = Item;