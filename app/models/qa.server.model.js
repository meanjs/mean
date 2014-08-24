'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//
// Answer Schema
//
var AnswerSchema = new mongoose.Schema({
	text: String,
	selectedAnswer: Boolean});
/**
 * Qa Schema
 */
var QaSchema = new Schema({
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
	choices: [AnswerSchema],
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

//console.log(AnswerSchema);
var QuizSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
	    type: String,
	    default: '',
	    trim: true
	},
	quizNumber: {
		type: String,
		default: '',
		trim: true
	},
	category: {
		type: String,
		default: '',
		trim: true
	},
	keyWords: {
	    type: String,
	    default: '',
	    trim: true
	},
	qas: [QaSchema]
	});
/**
 * Validations
 */
QaSchema.path('question').validate(function(question) {
	return question.length;
}, 'Question cannot be blank');

/**
 * Statics
 */
QaSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('user', 'displayName').exec(cb);
	}
};
//console.log(QaSchema);
mongoose.model('Qa', QaSchema);
mongoose.model('Answer', AnswerSchema);