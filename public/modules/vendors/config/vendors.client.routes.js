'use strict';

//Setting up route
angular.module('vendors').config(['$stateProvider',
	function($stateProvider) {
		// Vendors state routing
		$stateProvider.
		state('listVendors', {
			url: '/vendors',
			templateUrl: 'modules/vendors/views/list-vendors.client.view.html'
		}).
		state('createVendor', {
			url: '/vendors/create',
			templateUrl: 'modules/vendors/views/create-vendor.client.view.html'
		}).
		state('viewVendor', {
			url: '/vendors/:vendorId',
			templateUrl: 'modules/vendors/views/view-vendor.client.view.html'
		}).
		state('editVendor', {
			url: '/vendors/:vendorId/edit',
			templateUrl: 'modules/vendors/views/edit-vendor.client.view.html'
		});
	}
]);