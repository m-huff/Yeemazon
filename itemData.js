function ItemData()
{
	this.items = [];
	this.addItem = function(name, description, price, category, keywords){
		this.items[this.items.length] = new (require('./item')) (name, description, price, this.items.length, category, keywords);
	};
	this.findItemByID = function(itemID){
		for(let i=0;i<this.items.length;i++)
			if(this.items[i].itemID === +itemID)
				return this.items[i];
		return null;
	};
	this.searchName = function(name){
		var name = name.toLowerCase();

		for(let i =0;i<this.items.length;i++)
		{
			if(this.items[i].getName().toLowerCase() === name)
				return this.items[i];
		}
		return null;
	};
	this.find = function(keywords){
		var toRet = [];

		for(let i = 0;i<this.items.length;i++)
			for(let i2=0;i2<keywords.length;i2++)
				if(this.items[i] === keywords[i2])
					toRet[toRet.length] = this.items[i];
				
		return toRet;
	};

	return this;
}

module.exports = ItemData;