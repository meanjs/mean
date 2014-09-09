'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var vendors = require('../../app/controllers/vendors');

	// Vendors Routes
	app.route('/vendors')
		.get(vendors.list)
		.post(users.requiresLogin, vendors.create);

	app.route('/vendors/:vendorId')
		.get(vendors.read)
		.put(users.requiresLogin, vendors.hasAuthorization, vendors.update)
		.delete(users.requiresLogin, vendors.hasAuthorization, vendors.delete);

	// Finish by binding the Vendor middleware
	app.param('vendorId', vendors.vendorByID);
};