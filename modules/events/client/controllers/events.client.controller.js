(function () {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'eventResolve'];

  function EventsController ($scope, $state, $window, Authentication, event) {
    var vm = this;

    vm.authentication = Authentication;
    vm.event = event;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Event
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.event.$remove($state.go('home.bizDash.eventList'));
      }
    }

    // Save Event
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.event._id) {
        vm.event.$update(successCallback, errorCallback);
      } else {
        vm.event.$save(successCallback, errorCallback);
      }

      // On success creation of an event, route back to the event list page
      function successCallback(res) {
        $state.go('home.bizDash.eventList', {
          eventId: res._id
        });
      }

      // if there is an error, send the message !!
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
