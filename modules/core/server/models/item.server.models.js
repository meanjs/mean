var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;
//Item schema: name, uniqueID,, comment, categories, 

var itemSchema = new Schema({
	name : {
		type: String,
    	trim: true,
    	default: '',
    	validate: [validateLocalStrategyProperty, 'Please fill in your first name!']
	},
	workingStatus : {
		//TODO enforce enum possibilities (in controller??)
		type: String, //Needs to function as enum.
   		//Enum options: functional (green), needs inspection (yellow), needs service (orange), broken (red)
    	validate: [validateLocalStrategyProperty, 'Please fill in a starting status!']
	},
	comment : {
		type: String, //Needs to function as enum.
   		trim: true
    }
});

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};