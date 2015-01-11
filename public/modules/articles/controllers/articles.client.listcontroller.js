'use strict';

angular.module('articles').controller('ArticlesListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;
		
		$scope.find = function() {
			$scope.articles = Articles.query();
		};
		
		$scope.find();
	}
]);