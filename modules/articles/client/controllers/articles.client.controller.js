(function () {
    'use strict';

    angular
        .module('articles')
        .controller('ArticlesController', ArticlesController);

    ArticlesController.$inject = ['$scope', 'articleResolve', 'Authentication'];

    function ArticlesController($scope, article, Authentication) {
        var vm = this;

        vm.article = article;
        vm.authentication = Authentication;

        // Save Comment
        function saveComment(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.commentForm');
                return false;
            }

            // Create a new article, or update the current instance
            vm.article.createOrUpdate()
                .then(successCallback)
                .catch(errorCallback);

            function successCallback(res) {
                $state.go('admin.articles.list'); // should we send the User to the list or the updated Article's view?
                Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!'});
            }

            function errorCallback(res) {
                Notification.error({
                    message: res.data.message,
                    title: '<i class="glyphicon glyphicon-remove"></i> Article save error!'
                });
            }
        }
    }
}());
