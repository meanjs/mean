'use strict';

//Setting up route
angular.module('expenses').config(['$stateProvider',
	function($stateProvider) {
		// Expenses state routing
		$stateProvider.
		state('listExpenses', {
			url: '/expenses',
			templateUrl: 'modules/expenses/views/list-expenses.client.view.html'
		}).
		state('createExpense', {
			url: '/expenses/create',
			templateUrl: 'modules/expenses/views/create-expense.client.view.html'
		}).
		state('viewExpense', {
			url: '/expenses/:expenseId',
			templateUrl: 'modules/expenses/views/view-expense.client.view.html'
		}).
		state('editExpense', {
			url: '/expenses/:expenseId/edit',
			templateUrl: 'modules/expenses/views/edit-expense.client.view.html'
		});
	}
]);