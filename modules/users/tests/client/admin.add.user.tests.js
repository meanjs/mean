(function () {
	'use strict';

	describe('AddUserController', function() {
		var AuthenticationController,
			$scope,
			$httpBackend,
			$stateParams,
			$state,
			$location,
			mockUser1,
			mockUser2,
			Notification,
			ApplicantsService,
			Authentication,
			AddUserController;

		beforeEach(function () {
			jasmine.addMatchers({
				toEqualData: function (util, customEqualityTesters) {
					return {
						compare: function (actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ApplicantsService_, _Notification_) {
			$scope = $rootScope.$new();

			$httpBackend = _$httpBackend_;
			$state = _$state_;
			Authentication = _Authentication_;
			ApplicantsService = _ApplicantsService_;

			// Spy on Notification
			spyOn(Notification, 'error');
			spyOn(Notification, 'success');

			// Ignore parent template get on state transitions
			$httpBackend.whenGET('/modules/users/client/views/admin/add-user.client.view.html').respond(200);


			mockUser1 = new ApplicantsService({
				firstName: 'Bo',
				lastName: 'track',
				roles: ['ta'],
				email: 'bojack@gmail.com',
				username: 'bojack',
				approvedStatus: true
			});

			mockUser2 = new ApplicantsService({});

			Authentication.user = {
				roles: ['admin'],
				approvedStatus: true
			};


			AddUserController = $controller('AddUserController as vm', {
				$scope: $scope
			});

			// Spy on state go
			spyOn($state, 'go');
		}));

		describe('vm.signup() as signup', function () {

			it('Should not signup with no credentials', inject(function (ApplicantsService) {
				$httpBackend.when('POST', '/api/users/add').respond(400, {message: 'Missing credentials'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing credentials', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with missing first name', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					lastName: 'bo',
					roles: ['superta'],
					email: 'bojack@gmail.com',
					username: 'bojack',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Missing first name'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing first name', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with missing last name', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					roles: ['superta'],
					email: 'bojack@gmail.com',
					username: 'bojack',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Missing last name'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing last name', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with missing email', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					lastName: 'track',
					roles: ['superta'],
					username: 'bojack',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Missing email'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing email', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with incorrect email', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					lastName: 'track',
					roles: ['superta'],
					email: 'bojackgmailcom',
					username: 'bojack',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Incorrect email'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Incorrect email', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));


			it('Should not signup with missing roles', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					lastName: 'track',
					email: 'bojack@gmail.com',
					username: 'bojack',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Missing roles'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing roles', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with missing username', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					lastName: 'track',
					roles: ['superta'],
					email: 'bojack@gmail.com',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Missing username'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing username', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should not signup with incorrect username credential', inject(function (ApplicantsService) {
				mockUser2 = new ApplicantsService({
					firstName: 'bo',
					lastName: 'track',
					roles: ['superta'],
					email: 'bojackgmailcom',
					username: 'b',
					approvedStatus: true
				});

				$httpBackend.expectPOST('/api/users/add').respond(400, {message: 'Username not valid'});
				$httpBackend.flush();
				expect(Notification.error).toHaveBeenCalledWith({ message: 'Username not valid', title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
				expect($location.url()).toEqual('/admin/add');
			}));

			it('Should signup with correct credentials', inject(function (ApplicantsService) {
				$httpBackend.when('POST', '/api/users/add').respond(200, mockUser1);
				expect($location.url().toEqual('/admin/users'));
			}));

		});
	});
});
