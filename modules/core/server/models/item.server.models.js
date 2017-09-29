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
		type: [{
      		type: String,
      		enum: ['functional', 'needs inspection', 'needs service', 'broken']
    	}],
    	default: ['functional'],
    	required: 'Please provide at least one role'
   		//Enum options: functional (green), needs inspection (yellow), needs service (orange), broken (red)
   	},
	comment : {
		type: String, //Needs to function as enum.
   		trim: true
    }
});