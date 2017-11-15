# ui-calendar directive [![Build Status](https://travis-ci.org/angular-ui/ui-calendar.svg?branch=master)](https://travis-ci.org/angular-ui/ui-calendar)

[![Join the chat at https://gitter.im/angular-ui/ui-calendar](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular-ui/ui-calendar?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A complete AngularJS directive for the Arshaw FullCalendar.

# Requirements

- ([AngularJS](http://code.angularjs.org/1.2.1/angular.js))
- ([fullcalendar.js 2.0 and it's dependencies](http://arshaw.com/fullcalendar/download/))
- optional - ([gcal-plugin](http://arshaw.com/js/fullcalendar-1.5.3/fullcalendar/gcal.js))

# Usage

Using [bower](http://bower.io) run:

    bower install --save angular-ui-calendar

Alternatively you can add it to your `bower.json` like this:

    dependencies: {
        "angular-ui-calendar": "latest"
    }

And then run

    bower install

This will copy the ui-calendar files into your `components` folder, along with its dependencies. Load the script and style files in your application:

    <link rel="stylesheet" href="bower_components/fullcalendar/dist/fullcalendar.css"/>
    <!-- jquery, moment, and angular have to get included before fullcalendar -->
    <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="bower_components/moment/min/moment.min.js"></script>
    <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
    <script type="text/javascript" src="bower_components/angular-ui-calendar/src/calendar.js"></script>
    <script type="text/javascript" src="bower_components/fullcalendar/dist/fullcalendar.min.js"></script>
    <script type="text/javascript" src="bower_components/fullcalendar/dist/gcal.js"></script>

Add the calendar module as a dependency to your application module:

    var app = angular.module('App', ['ui.calendar'])

Apply the directive to your div elements. The calendar must be supplied an array of documented event sources to render itself:

    <div ui-calendar ng-model="eventSources"></div>

Define your model in a scope e.g.

    $scope.eventSources = [];

## Options

All the Arshaw Fullcalendar options can be passed through the directive. This even means function objects that are declared on the scope.

    myAppModule.controller('MyController', function($scope) {
        /* config object */
        $scope.uiConfig = {
          calendar:{
            height: 450,
            editable: true,
            header:{
              left: 'month basicWeek basicDay agendaWeek agendaDay',
              center: 'title',
              right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
          }
        };
    });

    <div ui-calendar="uiConfig.calendar" ng-model="eventSources">

## Working with ng-model

The ui-calendar directive plays nicely with ng-model.

An Event Sources object needs to be created to pass into ng-model. This object's values will be watched for changes. If a change occurs, then that specific calendar will call the appropriate fullCalendar method.

The ui-calendar directive expects the eventSources object to be any type allowed in the documentation for the fullcalendar. [docs](http://arshaw.com/fullcalendar/docs/event_data/Event_Source_Object/)
Note that all calendar options which are functions that are passed into the calendar are wrapped in an apply automatically.

## Accessing the calendar object

It is possible to access a specific calendar object by declaring a name for it on the uiCalendar directive. In this next line we are naming the calendar 'myCalendar'. This will be attached to the uiCalendarConfig constant object, that can be accessed via DI.

    <div ui-calendar="calendarOptions" ng-model="eventSources" calendar="myCalendar">

Now the calendar object is available in uiCalendarConfig.calendars:

    uiCalendarConfig.calendars.myCalendar

This allows you to declare any number of calendar objects with distinct names.

## Custom event rendering

You can use fullcalendar's `eventRender` option to customize how events are rendered in the calendar.
However, only certain event attributes are watched for changes (they are `id`, `title`, `url`, `start`, `end`, `allDay`, and `className`).

If you need to automatically re-render other event data, you can use `calendar-watch-event`.
`calendar-watch-event` expression must return a function that is passed `event` as argument and returns a string or a number, for example:

    $scope.extraEventSignature = function(event) {
       returns "" + event.price;
    }

    <ui-calendar calendar-watch-event="extraEventSignature(event)" ... >
    // will now watch for price

### Adding new events issue

When adding new events to the calendar they can disappear when switching months. To solve this add `stick: true` to the event object being added to the scope.

## Watching the displayed date range of the calendar

There is no mechanism to $watch the displayed date range on the calendar due to the JQuery nature of fullCalendar.  If you want
to track the dates displayed on the calendar so you can fetch events outside the scope of fullCalendar (Say from a caching store
in a service, instead of letting fullCalendar pull them via AJAX), you can add the viewRender callback to the calendar config.

    $scope.calendarConfig = {
        calendar:{
            height: "100%",
            ...
            viewRender: function(view, element) {
                $log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
            }
        }
    };

# Minify

    grunt minify

# Local Server to test demo

    grunt serve


## Documentation for the Calendar

The calendar works alongside of all the documentation represented [here](http://arshaw.com/fullcalendar/docs)

## PR's R always Welcome
Make sure that if a new feature is added, that the proper tests are created.

# Testing

We use karma and grunt to ensure the quality of the code.

    npm install -g grunt-cli
    npm install
    bower install
    grunt
