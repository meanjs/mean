'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/fullcalendar/dist/fullcalendar.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/fullcalendar/dist/gcal.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
