'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.submit = function() {
			var success = function(response) {
				$location.path('articles/' + response._id);
				$scope.article.title = '';
				$scope.article.content = '';
			}
			var error = function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}

			if ($scope.article._id) {
				$scope.article.$update(success, error);
			} else {
				$scope.article.$save(success, error);
			}
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			if($stateParams.articleId) {
				$scope.article = Articles.get({
					articleId: $stateParams.articleId
				});
			} else {
				$scope.article = new Articles();
			}
		};
	}
]);
