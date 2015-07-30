'use strict';

//Pagination Directive
angular.module('core').directive('meanPagination', function () {
    return {
        restrict: 'AEC',
        scope: {
            meanPaginationData: '=meanPaginationData',
            meanPaginationItemCount: '=meanPaginationItemCount',
            meanPaginationUrl: '@meanPaginationUrl',
            meanPaginationSearch: '@meanPaginationSearch'
        },
        controller: ['$scope', '$filter', function($scope, $filter) {

            $scope.buildPager = function () {
                $scope.pagedItems = [];
                $scope.itemsPerPage = $scope.meanPaginationItemCount;
                $scope.currentPage = 1;
                $scope.figureOutItemsToDisplay();
            };

            $scope.figureOutItemsToDisplay = function () {
                $scope.filteredItems = $filter('filter')($scope.meanPaginationData, {
                    $: $scope.search
                });
                $scope.filterLength = $scope.filteredItems.length;
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.pagedItems = $scope.filteredItems.slice(begin, end);
            };

            $scope.pageChanged = function () {
                $scope.figureOutItemsToDisplay();
            };

            $scope.$watch('meanPaginationData', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.buildPager();
                }
            });
        }],
        templateUrl: '/modules/core/directives/pagination.client.directive.html'
    };
});
