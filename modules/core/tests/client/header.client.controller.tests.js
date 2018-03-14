((() => {
  describe('HeaderController', () => {
    // Initialize global variables
    let scope;

    let HeaderController;
    let $state;
    let Authentication;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(($controller, $rootScope, _$state_, _Authentication_) => {
      scope = $rootScope.$new();
      $state = _$state_;
      Authentication = _Authentication_;

      HeaderController = $controller('HeaderController as vm', {
        $scope: scope
      });
    }));

    it('should expose the authentication service', () => {
      expect(scope.vm.authentication).toBe(Authentication);
    });

    it('should default menu to collapsed', () => {
      expect(scope.vm.isCollapsed).toBeFalsy();
    });

    describe('when toggleCollapsibleMenu', () => {
      let defaultCollapse;
      beforeEach(() => {
        defaultCollapse = scope.vm.isCollapsed;

        scope.vm.isCollapsed = !scope.vm.isCollapsed;
      });

      it('should toggle isCollapsed to non default value', () => {
        expect(scope.vm.isCollapsed).not.toBe(defaultCollapse);
      });

      it('should then toggle isCollapsed back to default value', () => {
        scope.vm.isCollapsed = !scope.vm.isCollapsed;
        expect(scope.vm.isCollapsed).toBe(defaultCollapse);
      });
    });

    describe('when view state changes', () => {
      beforeEach(() => {
        scope.vm.isCollapsed = true;
        scope.$broadcast('$stateChangeSuccess');
      });

      it('should set isCollapsed to false', () => {
        expect(scope.vm.isCollapsed).toBeFalsy();
      });
    });
  });
})());
