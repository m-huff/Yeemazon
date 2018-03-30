function Item(name, description, price, itemID, category, keywords)
{
	this.name = name;
	this.description = description;
	this.price = price;
	this.itemID = itemID;
	this.category = category;
	this.keywords = keywords;


	this.getName = function(){
		return this.name;
	};
	this.setName = function(newName){
		return (this.name = newName);
	};

	this.getDescription = function(){
		return this.description;
	};
	this.setDescription = function(newDescription){
		return (this.description = description);
	};

	this.getPrice = function(){
		return this.price;
	};
	this.setPrice = function(newPrice){
		return (this.price = newPrice);
	};

	this.getItemID = function(){
		return this.itemID;
	};
	this.setItemID = function(newID){
		return (this.itemID = newID);
	};

	this.getImage = function(){
		return this.image;
	};
	this.setImage = function(newImage){
		return (this.image = newImage);
	};

	this.getCategory= function(){
		return this.category;
	};
	this.setCategory = function(newCat){
		return (this.category = newCat);
	};

	this.getKeywords = function(){
		return this.keywords;
	};
	this.setKeywords = function(newWords){
		return (this.keywords = newWords);
	};

	
	return this;
}
module.exports = Item;