(function () {
  'use strict';

  describe('Settings Route Tests', function () {
    // Initialize global variables
    var $scope,
      SettingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SettingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SettingsService = _SettingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('settings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/settings');
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
          SettingsController,
          mockSetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('settings.view');
          $templateCache.put('modules/settings/client/views/view-setting.client.view.html', '');

          // create mock Setting
          mockSetting = new SettingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Setting Name'
          });

          // Initialize Controller
          SettingsController = $controller('SettingsController as vm', {
            $scope: $scope,
            settingResolve: mockSetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:settingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.settingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            settingId: 1
          })).toEqual('/settings/1');
        }));

        it('should attach an Setting to the controller scope', function () {
          expect($scope.vm.setting._id).toBe(mockSetting._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/settings/client/views/view-setting.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SettingsController,
          mockSetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('settings.create');
          $templateCache.put('modules/settings/client/views/form-setting.client.view.html', '');

          // create mock Setting
          mockSetting = new SettingsService();

          // Initialize Controller
          SettingsController = $controller('SettingsController as vm', {
            $scope: $scope,
            settingResolve: mockSetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.settingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/settings/create');
        }));

        it('should attach an Setting to the controller scope', function () {
          expect($scope.vm.setting._id).toBe(mockSetting._id);
          expect($scope.vm.setting._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/settings/client/views/form-setting.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SettingsController,
          mockSetting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('settings.edit');
          $templateCache.put('modules/settings/client/views/form-setting.client.view.html', '');

          // create mock Setting
          mockSetting = new SettingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Setting Name'
          });

          // Initialize Controller
          SettingsController = $controller('SettingsController as vm', {
            $scope: $scope,
            settingResolve: mockSetting
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:settingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.settingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            settingId: 1
          })).toEqual('/settings/1/edit');
        }));

        it('should attach an Setting to the controller scope', function () {
          expect($scope.vm.setting._id).toBe(mockSetting._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/settings/client/views/form-setting.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
