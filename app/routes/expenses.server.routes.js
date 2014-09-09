'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var expenses = require('../../app/controllers/expenses');

	// Expenses Routes
	app.route('/expenses')
		.get(expenses.list)
		.post(users.requiresLogin, expenses.create);

	app.route('/expenses/:expenseId')
		.get(expenses.read)
		.put(users.requiresLogin, expenses.hasAuthorization, expenses.update)
		.delete(users.requiresLogin, expenses.hasAuthorization, expenses.delete);

	// Finish by binding the Expense middleware
	app.param('expenseId', expenses.expenseByID);
};