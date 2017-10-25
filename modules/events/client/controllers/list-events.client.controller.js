(function () {
  'use strict';

  angular
    .module('events')
    .controller('EventsListController', EventsListController);

  EventsListController.$inject = ['EventsService'];

  function EventsListController(EventsService) {
    var vm = this;

    vm.events = EventsService.query();
  }
}());
