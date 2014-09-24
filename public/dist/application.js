'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('qas');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('takers');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      //  console.log(response);
      article.$save(function (response) {
        $location.path('articles/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module.
angular.module('qas').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Qas', 'qas', 'dropdown', '/qas(/create)?');
    Menus.addSubMenuItem('topbar', 'qas', 'List Qas', 'qas');
    Menus.addSubMenuItem('topbar', 'qas', 'New Qa', 'qas/create');
  }
]);'use strict';
//Setting up route...
angular.module('qas').config([
  '$stateProvider',
  function ($stateProvider) {
    // Qas state routing
    $stateProvider.state('listQas', {
      url: '/qas',
      templateUrl: 'modules/qas/views/list-qas.client.view.html'
    }).state('createQa', {
      url: '/qas/create',
      templateUrl: 'modules/qas/views/create-qa.client.view.html'
    }).state('viewQa', {
      url: '/qas/:qaId',
      templateUrl: 'modules/qas/views/view-qa.client.view.html'
    }).state('editQa', {
      url: '/qas/:qaId/edit',
      templateUrl: 'modules/qas/views/edit-qa.client.view.html'
    });
  }
]);'use strict';
// Qas controller...
angular.module('qas').controller('QasController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Qas',
  'CalculatorService',
  'MathService',
  'qasInitService',
  function ($scope, $stateParams, $location, Authentication, Qas, CalculatorService, MathService, qasInitService) {
    $scope.authentication = Authentication;
    //Test of Calculator and Math Service
    $scope.doit = CalculatorService.cce(77);
    // Initialize Dropdown labels
    $scope.typeDropdown = qasInitService.typeDropdown();
    $scope.difficultyDropdown = qasInitService.difficultyDropdown();
    $scope.qa = qasInitService.init();
    // Create and validate qa entries
    $scope.create = function () {
      var qa = new Qas({
          question: this.question,
          imageURL: this.imageURL,
          choices: [
            {
              text: this.text,
              selectedAnswer: false
            },
            {
              text: this.text,
              selectedAnswer: this.correctAnswer
            },
            {
              text: this.text,
              selectedAnswer: this.correctAnswer
            }
          ],
          hint: this.hint,
          type: this.td,
          difficulty: this.difficulty,
          hintOn: this.hintOn,
          timeOn: this.timeOn,
          fifty50On: this.fifty50On,
          randomizeQuestionsOn: this.randomizeQuestionsOn,
          randomizeAnswersOn: this.randomizeAnswersOn
        });
      //  Hack to load these variables.  Not handled above???
      qa.choices = $scope.qa.choices;
      qa.difficulty = $scope.dd.label;
      qa.type = $scope.td.label;
      // Check that question was entered
      if (qa.question.length > 0) {
        var choiceCount = 0;
        //Loop through choices to get at least two
        console.log('qa if', qa);
        for (var i = 0, ln = qa.choices.length; i < ln; i++) {
          var choice = qa.choices[i].text;
          console.log('choice', choice, '   i', i);
          if (choice.length > 0) {
            choiceCount++;
          }
        }
        if (choiceCount > 1) {
        } else {
          alert('You must have at least two choices');
        }
      } else {
        alert('You must have a question');
      }
      console.log('qaFinal', qa);
      qa.$save(function (response) {
        $location.path('qas/' + response._id);
      });
    };
    // Method to add an additional choice option
    $scope.addChoice = function () {
      console.log('qa add', $scope.qa);
      $scope.qa.choices.push({
        text: this.text,
        selectedAnswer: false
      });
    };
    $scope.remove = function (qa) {
      if (qa) {
        qa.$remove();
        for (var i in $scope.qas) {
          if ($scope.qas[i] === qa) {
            $scope.qas.splice(i, 1);
          }
        }
      } else {
        $scope.qa.$remove(function () {
          $location.path('qas');
        });
      }
    };
    $scope.update = function () {
      var qa = $scope.qa;
      console.log('From update', qa);
      if (!qa.updated) {
        qa.updated = [];
      }
      qa.updated.push(new Date().getTime());
      qa.$update(function () {
        $location.path('qas/' + qa._id);
      });
    };
    $scope.find = function () {
      Qas.query(function (qas) {
        $scope.qas = qas;
      });
    };
    $scope.findOne = function () {
      Qas.get({ qaId: $stateParams.qaId }, function (qa) {
        $scope.qa = qa;
      });
    };
    $scope.deleteChoice = function (ev) {
      var ss = ev.target.innerText.toString() - 1;
      console.log(ss);
      var qa = $scope.qa;
      console.log(qa);
      $scope.qa.choices.splice(ss, 1);
    };
  }
]);'use strict';
//Qas service used to communicate Qas REST endpoints
angular.module('qas').factory('Qas', [
  '$resource',
  function ($resource) {
    return $resource('qas/:qaId', { qaId: '@_id' }, { update: { method: 'PUT' } });
  }
]);/**
 * Created by EbyC on 8/24/2014.
 */
'use strict';
angular.module('qas').service('MathService', [function () {
    this.add = function (a, b) {
      return a + b;
    };
    this.subtract = function (a, b) {
      return a - b;
    };
    this.multiply = function (a, b) {
      return a * b;
    };
    this.divide = function (a, b) {
      return a / b;
    };
  }]).service('CalculatorService', function (MathService) {
  this.square = function (a) {
    return MathService.multiply(a, a);
  };
  this.cce = function (a) {
    return a + a * 1000;
  };
  this.cube = function (a) {
    return MathService.multiply(a, MathService.multiply(a, a));
  };
});/**
 * Created by EbyC on 8/24/2014.
 */
'use strict';
//Qas service used to communicate Qas REST endpoints
angular.module('qas').service('qasInitService', [function () {
    this.typeDropdown = function () {
      return [
        {
          'label': 'FIB',
          'value': 1
        },
        {
          'label': 'TF',
          'value': 2
        },
        {
          'label': 'MC',
          'value': 3
        },
        {
          'label': 'Matching',
          'value': 4
        }
      ];
    };
    this.difficultyDropdown = function () {
      return [
        {
          'label': 'Easy',
          'value': 1
        },
        {
          'label': 'Medium',
          'value': 2
        },
        {
          'label': 'Hard',
          'value': 3
        },
        {
          'label': 'Impossible',
          'value': 4
        }
      ];
    };
    this.init = function () {
      return {
        choices: [
          {
            text: '',
            correctAnswer: false
          },
          {
            text: '',
            correctAnswer: false
          },
          {
            text: '',
            correctAnswer: false
          }
        ]
      };
    };
  }]);'use strict';
// Configuring the Takers module
angular.module('takers').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Takers', 'takers', 'dropdown', '/takers(/create)?');
    Menus.addSubMenuItem('topbar', 'takers', 'List Takers', 'takers');
    Menus.addSubMenuItem('topbar', 'takers', 'New Taker', 'takers/create');
    Menus.addSubMenuItem('topbar', 'takers', 'Take', 'takers/');
  }
]);'use strict';
//Setting up route
angular.module('takers').config([
  '$stateProvider',
  function ($stateProvider) {
    // Takers state routing
    $stateProvider.state('listTakers', {
      url: '/takers',
      templateUrl: 'modules/takers/views/take.html'
    }).state('createTaker', {
      url: '/takers/create',
      templateUrl: 'modules/takers/views/create-taker.client.view.html'
    }).state('viewTaker', {
      url: '/takers/:takerId',
      templateUrl: 'modules/takers/views/view-taker.client.view.html'
    }).state('editTaker', {
      url: '/takers/:takerId/edit',
      templateUrl: 'modules/takers/views/edit-taker.client.view.html'
    });
  }
]);'use strict';
angular.module('takers').controller('TakersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Qas, Takers) {
    $scope.authentication = Authentication;
    // Takers controller logic
    var taker = new Takers();
    //taker.qa = qas;
    $scope.taker = new Takers({
      quizNumber: '0',
      trialNumber: '0',
      trialOptions: '',
      results: [{
          questionViewed: false,
          questionAnswered: false,
          questionNumber: '',
          answer: [{
              selection: '0',
              answer: '0'
            }]
        }]
    });
    console.log('From ScopeTaker', $scope.taker);
    $scope.find = function () {
      Qas.query(function (qas) {
        $scope.qas = qas;
      });
    };
    console.log('From ScopeTaker', $scope.qas);
    // Create and validate taker entries
    $scope.next = function () {
      $scope.questionIndex++;
      taker.questionViewed = true;
      taker.$save(function (response) {
        $location.path('takers/' + response._id);
      });
      console.log('next', $scope.questionIndex);
    };
    $scope.prev = function () {
      $scope.questionIndex--;
      console.log('prev', $scope.questionIndex);
    };
    $scope.answerToggled = function () {
      //var taker = $scope.taker;
      // Grab data from input boxes
      //console.log(taker);
      //taker.qa.question = qas[questionIndex].question;
      //taker.questionNumber = $scope.questionNumber;
      console.log('toggledtaker', taker);
      for (var i = 0, ln = taker.qa[$scope.questionIndex].choices.length; i < ln; i++) {
        //taker.results.answer.selection[i] = $scope.results.answer.selection[i];
        //console.log(taker.results[$scope.questionIndex].answer.isSelected[i],$scope.choice[i].selectedAnswer)
        taker.results[$scope.questionIndex].answer.isSelected[i] = $scope.choice[i].selectedAnswer;
        taker.updated.push(new Date().getTime());
      }
      ;
      console.log('From taker 1', taker);
      // Check that question was entered
      taker.$save(function (response) {
        $location.path('takers/' + response._id);
      });
      console.log(taker);
    };
    $scope.find = function () {
      Qas.query(function (qas) {
        // $scope.qas = qas;
        taker.qa = qas;
        $scope.taker = taker;
        console.log('From ScopeTaker1', qas[0].questionNumber, taker.qa[0].question, $scope.qas, taker);
      });
      $scope.questionIndex = 0;
    };
    $scope.findOne = function () {
      takers.get({ qasId: $stateParams.qasId }, function (qas) {
        $scope.taker = qas;
      });
    };
  }
]);'use strict';
//Takers service used to communicate Takers REST endpoints
angular.module('takers').factory('Takers', [
  '$resource',
  function ($resource) {
    return $resource('takers/:takerId', { takerId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);