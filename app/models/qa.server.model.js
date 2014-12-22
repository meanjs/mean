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
	selectedAnswer: {
		type: Boolean,
		default: false
	}});

var qaQuizSchema = new mongoose.Schema({
	name: String,
	id: Number,
	selected: {
		type: Boolean,
		default: false
	}});
/**
 * Qa Schema
 */
var QaSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	selected: {
		type: Boolean,
		default: false
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
	
	},
    qaQuizId: {
        type: String,
        default: 999
    },
    qaQuizName: {
        type: String,
        default: 'Quiz'
    },
	qaQuiz: [qaQuizSchema],
    quiz: {
        type: Schema.ObjectId,
        ref: 'Quiz'
    }
});

//console.log(AnswerSchema);

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
