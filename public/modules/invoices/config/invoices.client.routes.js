'use strict';

//Setting up route
angular.module('invoices').config(['$stateProvider',
	function($stateProvider) {
		// Invoices state routing
		$stateProvider.
		state('listInvoices', {
			url: '/invoices',
			templateUrl: 'modules/invoices/views/list-invoices.client.view.html'
		}).
		state('createInvoice', {
			url: '/invoices/create',
			templateUrl: 'modules/invoices/views/create-invoice.client.view.html'
		}).
		state('viewInvoice', {
			url: '/invoices/:invoiceId',
			templateUrl: 'modules/invoices/views/view-invoice.client.view.html'
		}).
		state('editInvoice', {
			url: '/invoices/:invoiceId/edit',
			templateUrl: 'modules/invoices/views/edit-invoice.client.view.html'
		});
	}
]);