'use strict';

angular.module('replies')
  .directive('showReplies', ['RecursionHelper', 
    function (RecursionHelper) {
      return {
        restrict: 'E',
        scope: false,
        templateUrl: '/modules/replies/client/views/show-replies.client.view.html',
        compile: function(element) {
          return RecursionHelper.compile(element);
        }
      };
    }]);