function Item(name, description, price, itemID, category, keywords)
{
	this.name = name;
	this.description = description;
	this.price = price;
	this.itemID = itemID;
	this.category = category;
	this.keywords = keywords;
	
	return this;
}
module.exports = Item;