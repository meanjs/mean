((() => {
  describe('HomeController', () => {
    // Initialize global variables
    var scope;

    var HomeController;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(($controller, $rootScope) => {
      scope = $rootScope.$new();

      HomeController = $controller('HomeController as vm', {
        $scope: scope
      });
    }));
  });
})());
