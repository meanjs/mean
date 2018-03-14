((() => {
  angular
    .module('users')
    .directive('passwordVerify', passwordVerify);

  function passwordVerify() {
    var directive = {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      var status = true;
      scope.$watch(() => {
        var combined;
        if (scope.passwordVerify || ngModel) {
          combined = scope.passwordVerify + '_' + ngModel;
        }
        return combined;
      }, value => {
        if (value) {
          ngModel.$validators.passwordVerify = password => {
            var origin = scope.passwordVerify;
            return (origin === password);
          };
        }
      });
    }
  }
})());
