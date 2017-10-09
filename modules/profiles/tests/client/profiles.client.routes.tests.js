(function () {
  'use strict';

  describe('Profiles Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProfilesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProfilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProfilesService = _ProfilesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('profiles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/profiles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ProfilesController,
          mockProfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('profiles.view');
          $templateCache.put('modules/profiles/client/views/view-profile.client.view.html', '');

          // create mock Profile
          mockProfile = new ProfilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Profile Name'
          });

          // Initialize Controller
          ProfilesController = $controller('ProfilesController as vm', {
            $scope: $scope,
            profileResolve: mockProfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:profileId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.profileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            profileId: 1
          })).toEqual('/profiles/1');
        }));

        it('should attach an Profile to the controller scope', function () {
          expect($scope.vm.profile._id).toBe(mockProfile._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/profiles/client/views/view-profile.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProfilesController,
          mockProfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('profiles.create');
          $templateCache.put('modules/profiles/client/views/form-profile.client.view.html', '');

          // create mock Profile
          mockProfile = new ProfilesService();

          // Initialize Controller
          ProfilesController = $controller('ProfilesController as vm', {
            $scope: $scope,
            profileResolve: mockProfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.profileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/profiles/create');
        }));

        it('should attach an Profile to the controller scope', function () {
          expect($scope.vm.profile._id).toBe(mockProfile._id);
          expect($scope.vm.profile._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/profiles/client/views/form-profile.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProfilesController,
          mockProfile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('profiles.edit');
          $templateCache.put('modules/profiles/client/views/form-profile.client.view.html', '');

          // create mock Profile
          mockProfile = new ProfilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Profile Name'
          });

          // Initialize Controller
          ProfilesController = $controller('ProfilesController as vm', {
            $scope: $scope,
            profileResolve: mockProfile
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:profileId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.profileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            profileId: 1
          })).toEqual('/profiles/1/edit');
        }));

        it('should attach an Profile to the controller scope', function () {
          expect($scope.vm.profile._id).toBe(mockProfile._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/profiles/client/views/form-profile.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
