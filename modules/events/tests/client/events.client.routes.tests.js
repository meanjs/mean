(function () {
  'use strict';

  describe('Events Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventsService = _EventsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('events');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/events');
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
          EventsController,
          mockEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('events.view');
          $templateCache.put('modules/events/client/views/view-event.client.view.html', '');

          // create mock Event
          mockEvent = new EventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Event Name'
          });

          // Initialize Controller
          EventsController = $controller('EventsController as vm', {
            $scope: $scope,
            eventResolve: mockEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventId: 1
          })).toEqual('/events/1');
        }));

        it('should attach an Event to the controller scope', function () {
          expect($scope.vm.event._id).toBe(mockEvent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/events/client/views/view-event.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventsController,
          mockEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('events.create');
          $templateCache.put('modules/events/client/views/form-event.client.view.html', '');

          // create mock Event
          mockEvent = new EventsService();

          // Initialize Controller
          EventsController = $controller('EventsController as vm', {
            $scope: $scope,
            eventResolve: mockEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/events/create');
        }));

        it('should attach an Event to the controller scope', function () {
          expect($scope.vm.event._id).toBe(mockEvent._id);
          expect($scope.vm.event._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/events/client/views/form-event.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventsController,
          mockEvent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('events.edit');
          $templateCache.put('modules/events/client/views/form-event.client.view.html', '');

          // create mock Event
          mockEvent = new EventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Event Name'
          });

          // Initialize Controller
          EventsController = $controller('EventsController as vm', {
            $scope: $scope,
            eventResolve: mockEvent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventId: 1
          })).toEqual('/events/1/edit');
        }));

        it('should attach an Event to the controller scope', function () {
          expect($scope.vm.event._id).toBe(mockEvent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/events/client/views/form-event.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
