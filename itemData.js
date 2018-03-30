function ItemData()
{
	this.items = [];
	var item = 
	this.addItem = function(name, description, price, category, keywords){
		this.items[this.items.length] = new (require('./item')) (name, description, price, this.items.length, category, keywords);
	};
	this.findItemByID = function(itemID){
		for(let i=0;i<this.items.length;i++)
			if(this.items[i].getItemID() === itemID)
				return this.items[i];
		return null;
	};
	this.find = function(category, keywords){
		var toRet = [];
		for(let i =0;i<this.items.length;i++)
		{
			if(this.items[i].getCategory() === category)
			{
				toRet[toRet.length] = this.items[i];
			}
		}
		return toRet;
	};
	return this;
}

module.exports = ItemData;