angular-ui-notification
=======================

[![Dependency Status](https://david-dm.org/alexcrack/angular-ui-notification.png)](https://david-dm.org/alexcrack/angular-ui-notification)
[![devDependency Status](https://david-dm.org/alexcrack/angular-ui-notification/dev-status.png)](https://david-dm.org/alexcrack/angular-ui-notification#info=devDependencies)
[![Build Status](https://travis-ci.org/alexcrack/angular-ui-notification.svg?branch=master)](https://travis-ci.org/alexcrack/angular-ui-notification)
[![Dependency Status](https://www.versioneye.com/user/projects/54f96af44f3108e7800000e4/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54f96af44f3108e7800000e4)
[![Code Climate](https://codeclimate.com/github/alexcrack/angular-ui-notification/badges/gpa.svg)](https://codeclimate.com/github/alexcrack/angular-ui-notification)

Angular.js service providing simple notifications using Bootstrap 3 styles with css transitions for animations

## Features
* No dependencies except of angular.js.
* CSS3 Animations.
* Small size.
* 5 message types.
* Use HTML in your messages.
* Configure options globally py the provider
* Use custom options by the message
* Use custom template

## Install

To install the package using bower and save as a dependency use...
```bash
bower install angular-ui-notification --save
```  

To install via NPM:
```bash
npm install angular-ui-notification --save
```

## Usage
 [Heres a plunker demo](http://plnkr.co/edit/h08qQF2qlVE3arERpdfi?p=preview)

  
In your html/template add 
```html
...
  <link rel="stylesheet" href="angular-ui-notification.min.css">
...
  <script src="angular-ui-notification.min.js"></script>
...

```

In your application, declare dependency injection like so..

```javascript
  angular.module('notificationTest', ['ui-notification']);
...
```

You can configure module by the provider
```javascript
angular.module('notificationTest', ['ui-notification'])
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    });
...
```


And when you need to show notifications, inject service and call it!

```javascript
angular.module('notificationTest').controller('notificationController', function($scope, Notification) {
 
  Notification.primary('Primary notification');
  // or simply..
  Notification('Primary notification');
  
  // Other Options
  // Success
  Notification.success('Success notification');
  
  // Message with custom type
  Notification({message: 'Warning notification'}, 'warning');

  // With Title
  Notification({message: 'Primary notification', title: 'Primary notification'});
  
  // Message with custom delay
  Notification.error({message: 'Error notification 1s', delay: 1000});
  
  // Embed HTML within your message.....
  Notification.success({message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'Html content'});

  // Change position notification
  Notification.error({message: 'Error Bottom Right', positionY: 'bottom', positionX: 'right'});
  
  // Replace message
  Notification.error({message: 'Error notification 1s', replaceMessage: true});
}
```

## Service

Module name: "ui-notification"

Service: "Notification"

Configuration provider: "NotificationProvider"


## Options

Options can be passed to configuration provider globally or used in the current message.

The options list:

|       Option      |      Possible values      |         Default value          |                               Description                                |
| ----------------- | ------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| delay             | Any integer value         | 5000                           | The time in ms the message is showing before start fading out            |
| startTop          | Any integer value         | 10                             | Vertical padding between messages and vertical border of the browser     |
| startRight        | Any integer value         | 10                             | Horizontal padding between messages and horizontal border of the browser |
| verticalSpacing   | Any integer value         | 10                             | Vertical spacing between messages                                        |
| horizontalSpacing | Any integer value         | 10                             | Horizontal spacing between messages                                      |
| positionX         | "right", "left", "center" | "right"                        | Horizontal position of the message                                       |
| positionY         | "top", "bottom"           | "top"                          | Vertical position of the message                                         |
| replaceMessage    | true, false               | false                          | If true every next appearing message replace old messages                |
| templateUrl       | Any string                | "angular-ui-notification.html" | Custom template filename (URL)                                           |
| onClose           | Any function              | undefined                      | Callback to execute when a notification element is closed. Callback receives the element as its argument. |
| closeOnClick      | true, false               | true                           | If true, messages are closed on click                                    |
| maxCount          | Any integer               | 0                              | Show only [maxCount] last messages. Old messages will be killed. 0 - do not kill |

Also you can pass the "scope" option. This is an angular scope option Notification scope will be inherited from. This option can be passed only in the methods. The default value is $rootScope

## Methods

#### Notification service methods

|              Method name               |                   Description                   |
|----------------------------------------|-------------------------------------------------|
| Notification(), Notification.primary() | Show the message with bootstrap's primary class |
| Notification.info()                    | Show the message with bootstrap's info class    |
| Notification.success()                 | Show the message with bootstrap's success class |
| Notification.warning()                 | Show the message with bootstrap's warn class    |
| Notification.error()                   | Show the message with bootstrap's danger class  |
| Notification.clearAll()                | Remove all shown messages                       |

#### Notification service options

|     Option     |                 Possible values                  |           Default value           |                                              Description                                               |
| -------------- | ------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| title          | *String*                                         | `""`                              | Title to appear at the top of the notification                                                         |
| message        | *String*                                         | `""`                              | Message to appear in the notification                                                                  |
| templateUrl    | *String*                                         | `"angular-ui-notification.html"`  | URL of template to be used for notification                                                            |
| delay          | *Int* (?)                                        | `5000` or configured global delay | Number of ms before notification fades out. If not an integer, notification will persist until killed. |
| type           | "primary", "info", "success", "warning", "error" | `"primary"`                       | Bootstrap flavoring                                                                                    |
| positionY      | "top", "bottom"                                  | `"top"`                           |                                                                                                        |
| positionX      | "right", "left", "center"                        | `"right"                          |                                                                                                        |
| replaceMessage | *Boolean*                                        | `false`                           | If true this message will replace old(er) message(s)                                                   |
| closeOnClick      | true, false               | true                           | If true, the message is closed on click                                  |

#### Returning value

Every "show" method returns a promise that resolves a notification scope with these methods:

|          Method name           |                                                   Description                                                    |
|--------------------------------|------------------------------------------------------------------------------------------------------------------|
| notificationScope.kill(isHard) | Remove the specific message<br>isHard - if false or omitted kill message with fadeout effect (default). If true - immediately remove the message|



## Custom Templates

Custom template can be provided.

```html
<div class="ui-notification">
    <h3 ng-show="title" ng-bind-html="title"></h3>
    <div class="message" ng-bind-html="message"></div>
</div>
```
Default existing scope values is "title" - the title of the message and "message".
Also any custom scope's properties can be used.
