(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state'];

  function CatalogController($scope, $state) {
    var vm = this;
  }
}());

// angular.module('users').controller('CatalogController', ['$scope', '$location', '$stateParams', '$state', 'Students',
//   function ($scope, $location, $stateParams, $state, Students) {
//     $scope.find = function () {
//       /* set loader*/
//       $scope.loading = true;
//
//       /* Get all the students, then bind it to the scope */
//       Students.getAll().then(function (response) {
//         $scope.loading = false;
//         $scope.students = response.data;
//       }, function (error) {
//         $scope.loading = false;
//         $scope.error = 'Unable to retrieve students!\n' + error;
//       });
//     };
//
//     $scope.findOne = function () {
//       debugger;
//       $scope.loading = true;
//
//       /*
//         Take a look at 'list-students.client.view', and find the ui-sref attribute that switches the state to the view
//         for a single student. Take note of how the state is switched:
//
//           ui-sref="students.view({ studentId: student._id })"
//
//         Passing in a parameter to the state allows us to access specific properties in the controller.
//
//         Now take a look at 'view-student.client.view'. The view is initialized by calling "findOne()".
//         $stateParams holds all the parameters passed to the state, so we are able to access the id for the
//         specific student we want to find in order to display it to the user.
//        */
//
//       var id = $stateParams.studentId;
//
//       Students.read(id)
//               .then(function (response) {
//                 $scope.student = response.data;
//                 $scope.loading = false;
//               }, function (error) {
//                 $scope.error = 'Unable to retrieve student with id "' + id + '"\n' + error;
//                 $scope.loading = false;
//               });
//     };
//
//     $scope.create = function (isValid) {
//       $scope.error = null;
//
//       /*
//         Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
//        */
//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'articleForm');
//
//         return false;
//       }
//
//       /* Create the student object */
//       var student = {
//         name: $scope.name,
//         bio: $scope.bio,
//         major: $scope.major,
//         availabilityStatus: $scope.availabilityStatus,
//         displayName: $scope.displayName,
//         profileImageURL: $scope.profileImageURL
//       };
//
//       /* Save the article using the students factory */
//       Students.create(student)
//               .then(function (response) {
//                 // if the object is successfully saved redirect back to the list page
//                 $state.go('students.list', { successMessage: 'student succesfully created!' });
//               }, function (error) {
//                 // otherwise display the error
//                 $scope.error = 'Unable to save student!\n' + error;
//               });
//     };
//
//     $scope.update = function (isValid) {
//       /*
//         Fill in this function that should update a student if the form is valid. Once the update has
//         successfully finished, navigate back to the 'student.list' state using $state.go(). If an error
//         occurs, pass it to $scope.error.
//        */
//       $scope.error = null;
//
//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'articleForm');
//         return false;
//       }
//
//       var student = {
//         name: $scope.name,
//         bio: $scope.bio,
//         major: $scope.major,
//         availabilityStatus: $scope.availabilityStatus,
//         displayName: $scope.displayName,
//         profileImageURL: $scope.profileImageURL
//       };
//
//     //  Update student
//       Students.update($stateParams.studentId, student).then(function (response) {
//         $state.go('students.list', { successMessage: 'Student updated!' });
//       }, function (error) {
//         $scope.error = 'Unable to update student\n' + error;
//       }
//       );
//
//     };
//
//     $scope.remove = function () {
//       /*
//         Implement the remove function. If the removal is successful, navigate back to 'student.list'. Otherwise,
//         display the error.
//        */
//       $scope.error = null;
//
//       Students.remove($stateParams.studentId).then(function (response) {
//         $state.go('students.list', { successMessage: 'Student deleted!' });
//       }, function (error) {
//         $scope.error = 'Unable to update student\n' + error;
//       }
//      );
//     };
//
//     /* Bind the success message to the scope if it exists as part of the current state */
//     if ($stateParams.successMessage) {
//       $scope.success = $stateParams.successMessage;
//     }
//   }
// ]);
