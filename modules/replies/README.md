# mean-replies
Comments system for MEANJS


This is a nested comment system for Mean JS that can work with any object but in this case has been integrated in with the Article object on the default MeanJS project setup. I called it "replies" because "comment" is a javascript reserved word.

This is by no means complete, but it seems to work reasonably well. I welcome all feedback and improvements.

## Installation

cd (your-project)/modules
git clone https://github.com/tutley/mean-replies.git replies

There is a little bit of integration work to get this integrated with an existing MEAN.JS app. You can see what I've done to make it work at https://github.com/tutley/mean.git

* Note: I made this with the latest mean repo, which is using updated versions of bootstrap and other things. So if you're using the yeoman generator to start your mean stack, you may have to edit some things (uib-collapse for example)

### Changes to Existing MEANJS template
#### 1 - Edit the Article model to have a reply count and an array of replies
#### 2 - bower install moment and angular-moment, include them in your assets, add 'angularMoment' to core app config dependencies
#### 3 - bower install angular-sanitize, include it in your assets, add 'ngSanitize' to core app config dependencies
#### 4 - Edit the Article client router to have the following articles.view

      .state('articles.view', {
        url: '/:articleId',
        views: {
          '@' : {
            templateUrl: 'modules/articles/client/views/view-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm',
            resolve: {
              articleResolve: getArticle
            }
          },
          'replies@articles.view' : {
            templateUrl: 'modules/replies/client/views/list-replies.client.view.html',
            controller: 'RepliesController',
            controllerAs: 'vm'
          }
        }
      }) 

#### 5 - Add something like this to the bottom of the article page:
      <div class="container">
        <div class="row" ui-view="replies"></div>
      </div>




Yeah, I didn't include a tests folder. I'm a bad bad boy.