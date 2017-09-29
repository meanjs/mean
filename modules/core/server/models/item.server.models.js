var mongoose = require('mongoose'),
	validator = require('validator'), 
    Schema = mongoose.Schema;
//Item schema: name, uniqueID,, comment, categories, 

var itemSchema = new Schema({
	name : {
		type: String,
    	trim: true,
    	default: '',
   	},
	workingStatus : {
		//TODO enforce enum possibilities (in controller??)
		type: String, //Needs to function as enum.
   		//Enum options: functional (green), needs inspection (yellow), needs service (orange), broken (red)
   	},
	comment : {
		type: String, //Needs to function as enum.
   		trim: true
    }
});