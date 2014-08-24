'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	var takerAnswerSchema = new mongoose.Schema({
	text: String,
	correctAnswer: Boolean});
/**
 * QA Schema
 */
var takerQASchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	question: {
	    type: String,
	    default: '',
	    trim: true
	},
	questionNumber: {
		type: String,
		default: '',
		trim: true
	},
	imageURL: {
	    type: String,
	    default: '',
	    trim: true
	},
	choices: [takerAnswerSchema],
	hint: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	difficulty: {
		type: String,
		default: 'Easy',
		trim: true
	},
	type: {
		type: String,
		default: 'FIB',
		trim: true
	},
	hintOn: {
		type: Boolean,
		default: false,
		trim: true
	},
	timeOn: {
		type: Boolean,
		default: false,
		trim: true
	},
	fifty50On: {
		type: Boolean,
		default: false,
		trim: true
	},
	randomizeQuestionsOn: {
		type: Boolean,
		default: false,
		trim: true
	},
	randomizeAnswersOn: {
		type: Boolean,
		default: false,
		trim: true
	
	}
});


/**
 * Statics
 */
takerQASchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('user', 'displayName').exec(cb);
	}
};
//
// AnswerCorrect Schema
//
var AnswerSelectedSchema = new mongoose.Schema({
	text: String,
	isSelected: Number});



var TakerAnswersSchema = new Schema({
	updated: {
		type: Date,
		default: Date.now
	},
	questionViewed: {
	    type: Boolean,
	    default: false
	},
	questionAnswered: {
	    type: Boolean,
	    default: false
	},
	questionNumber: {
		type: String,
		default: '',
		trim: true
	},
	answer: [AnswerSelectedSchema]
	
});

//console.log(TakerResultsSchema);


var TakerSchema = new Schema({
	updated: {
		type: Date,
		default: Date.now
	},
	
	quizNumber: {
	    type: Number,
	    default: 0
	},
	trialNumber: {
	    type: Number,
	    default: 0
	},
	trialOptions: {
		type: String,
		default: '',
		trim: true
	},
	results: [TakerAnswersSchema],
	qa:[takerQASchema]
	
});

 //Validations

//QASchema.path('question').validate(function(question) {
//	return question.length;
//}, 'Question cannot be blank');


 // Statics

	TakerSchema.statics = {
		load: function(id, cb) {
			this.findOne({
			_id: id
		}).populate('user', 'displayName').exec(cb);
	}
};

mongoose.model('takerQA', takerQASchema);
mongoose.model('takerAnswer', takerAnswerSchema);
mongoose.model('AnswerSelected', AnswerSelectedSchema);
mongoose.model('TakerAnswers', TakerAnswersSchema);
mongoose.model('Taker', TakerSchema);


