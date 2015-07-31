'use strict';

/**
 * Chat client controller tests
 */
(function () {
  describe('ChatController', function () {
    //Initialize global variables
    var scope,
      Socket,
      ChatController,
      $timeout,
      $location,
      Authentication;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$location_) {
      scope = $rootScope.$new();
      Socket = _Socket_;
      $timeout = _$timeout_;
      $location = _$location_;
      Authentication = _Authentication_;
    }));

    describe('when user logged out', function () {
      beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$location_) {
        Authentication.user = undefined;
        spyOn($location, 'path');
        ChatController = $controller('ChatController', {
          $scope: scope,
        });
      }));

      it('should redirect logged out user to /', function () {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });

    describe('when user logged in', function () {
      beforeEach(inject(function ($controller, $rootScope, _Socket_, _Authentication_, _$timeout_, _$location_) {
        Authentication.user = {
          name: 'user',
          roles: ['user']
        };

        ChatController = $controller('ChatController', {
          $scope: scope,
        });
      }));

      it('should make sure socket is connected', function () {
        expect(Socket.socket).toBeTruthy();
      });

      it('should define messages array', function () {
        expect(scope.messages).toBeDefined();
        expect(scope.messages.length).toBe(0);
      });

      describe('sendMessage', function () {
        var text = 'hello world!';
        beforeEach(function () {
          scope.messageText = text;
          scope.sendMessage();
          $timeout.flush();
        });

        it('should add message to messages', function () {
          expect(scope.messages.length).toBe(1);
        });

        it('should add message with proper text attribute set', function () {
          expect(scope.messages[0].text).toBe(text);
        });

        it('should clear messageText', function () {
          expect(scope.messageText).toBe('');
        });
      });

      describe('$destroy()', function () {
        beforeEach(function () {
          scope.$destroy();
        });

        it('should remove chatMessage listener', function () {
          expect(Socket.socket.cbs.chatMessage).toBeUndefined();
        });
      });
    });
  });
}());
