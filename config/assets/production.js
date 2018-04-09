/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // yarn:css
        'node_modules/angular-ui-notification/dist/angular-ui-notification.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
        // endyarn
      ],
      js: [
        // yarn:js
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
        'node_modules/angular-messages/angular-messages.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-resource/angular-resource.min.js',
        'node_modules/angular-ui-notification/dist/angular-ui-notification.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/owasp-password-strength-test/owasp-password-strength-test.js'
        // endyarn
      ]
    },
    css: 'public/dist/bundle-*.min.css',
    js: 'public/dist/bundle-*.min.js',
    vendor: {
      css: 'public/dist/vendor-*.min.css',
      js: 'public/dist/vendor-*.min.js'
    }
  }
};
