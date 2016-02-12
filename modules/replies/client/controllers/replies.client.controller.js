'use strict';

// Replies controller

//old
// angular.module('replies').controller('RepliesController', 
//   ['vm', '$stateParams', '$location', 'Authentication', 'Replies', 'RecursionHelper', 
//   function (vm, $stateParams, $location, Authentication, Replies, RecursionHelper) {

angular
.module('replies')
.controller('RepliesController', RepliesController);

RepliesController.$inject = ['$scope', '$state', 'Authentication', 'Replies', 'RecursionHelper'];
function RepliesController($scope, $state, Authentication, Replies, RecursionHelper) {

  var vm = this;
  vm.authentication = Authentication;
  vm.articleId = $state.params.articleId;

  // Init the new top level reply Form
  vm.topReply = {};
  vm.topReplyCollapsed = true;
  vm.topReplyAvailable = (Authentication.user);


  // There is probably a better way to do this. I'm using these helper functions
  // in conjunction with the ui.bootsrap "collapse" tag to show/hide things
  vm.showReplyForm = function(replyId) {
    vm.currentReplyId = replyId;  
  };
  vm.cancelReply = function() {
    vm.currentReplyId = null;
  };

  vm.prepareDelete = function(replyId) {
    vm.replyToDelete = replyId;  
  };
  vm.cancelDelete = function() {
    vm.replyToDelete = null;
  };

  vm.prepareEdit = function(reply) {
    reply.newContent = reply.content;
    vm.replyToEdit = reply._id;  
  };
  vm.cancelEdit = function() {
    vm.replyToEdit = null;
  };

  vm.cancelTopReply = function() {
    vm.topReply.content = '';
  };

  // vm.prepareReport = function(replyId) {
  //   vm.replyToReport = replyId;  
  // };
  // End show/hide stuff

  // CRUD Operations
  // Create a new top level reply
  vm.createTop = function() {
    var articleId = vm.articleId;
    vm.topReply.error = null;
    var newTopReply = vm.topReply;

    var reply = new Replies(newTopReply);
    reply.article = articleId;
    reply.nestedLevel = 1;

    reply.$save(function(response) {
      vm.replies.unshift(response);
      vm.topReply = {};
      vm.topReplyAvailable = false;
    }, function(errorResponse) {
      vm.topReply.error = errorResponse.data.message;
    });
  };

  // Create new Reply where replyId is the _id of the reply we're replying to
  vm.create = function (currentReply) {
    currentReply.error = null;
    // First make sure there's actually something in the reply
    if (!currentReply.newReply) {
      currentReply.error = 'The reply was empty!';
      return false;
    }
    // Now check that they haven't somehow replied to a level 9 reply
    var newReplyLevel = currentReply.nestedLevel + 1;
    if (newReplyLevel > 9) {
      currentReply.error = 'how the hell did you do that?';
      return false;
    }

    // Construct a new reply to send to the api
    var reply = new Replies({
      content: currentReply.newReply,
      article: currentReply.article,
      replyTo: currentReply._id,
      nestedLevel: newReplyLevel
    });

    // Use resource to hit the server api, then push the reply into the current view
    reply.$save(function (response) {
      currentReply.replies.unshift(response); 
      currentReply.newReply='';
      vm.currentReplyId = null;
    }, function (errorResponse) {
      currentReply.error = errorResponse.data.message;
    });
  };

  // Remove existing Reply
  vm.remove = function (reply) {
    if (reply) {
      var deadManWalking = new Replies(reply);
      deadManWalking.$remove({},
        //success
        function(value){
          // brute force method of removing the reply from view
          // vm.find();

          // TODO: find a way to remove this one directive rather than just collapsing it
          reply.isDeleted = true;
        },
        //error
        function(error){
          reply.error = error.data.message;
        }
      );
    }
  };

  // Update existing Reply
  vm.update = function (currentReply) {
    currentReply.error = null;

    if (!currentReply.newContent) {
      currentReply.error = 'The reply was empty!';
      return false;
    }
    if (currentReply.newContent === currentReply.content) {
      currentReply.error = 'You did not change anything!';
      return false;
    }

    var reply = new Replies(currentReply);
    reply.content = currentReply.newContent;

    reply.$update(function (response) {
      currentReply.content = response.content;
      currentReply.edited = response.edited;
      vm.replyToEdit = null;
    }, function (errorResponse) {
      currentReply.error = errorResponse.data.message;
    });
  };

  // Find a list of Replies
  vm.find = function () {
    var articleId = $state.params.articleId;


    Replies.query({ 'article' : articleId }, function(response) {  
      vm.replies = response;
      // Init Toggles 
      // TODO: do this reply toggle init better
      vm.isCollapsed = {};
      angular.forEach(vm.replies, function(reply){
        vm.isCollapsed[reply._id] = false;
        angular.forEach(reply.replies, function(reply){
          vm.isCollapsed[reply._id] = true;
          angular.forEach(reply.replies, function(reply){
            vm.isCollapsed[reply._id] = false;
            angular.forEach(reply.replies, function(reply){
              vm.isCollapsed[reply._id] = false;
              angular.forEach(reply.replies, function(reply){
                vm.isCollapsed[reply._id] = false;
                angular.forEach(reply.replies, function(reply){
                  vm.isCollapsed[reply._id] = false;
                  angular.forEach(reply.replies, function(reply){
                    vm.isCollapsed[reply._id] = false;
                    angular.forEach(reply.replies, function(reply){
                      vm.isCollapsed[reply._id] = false;
                      angular.forEach(reply.replies, function(reply){
                        vm.isCollapsed[reply._id] = false;
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });    
  };
}

