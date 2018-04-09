module.exports = {
  client: {
    css: 'public/dist/bundle.min.css',
    js: 'public/dist/bundle.min.js',
    vendor: {
      css: 'public/dist/vendor.min.css',
      js: 'public/dist/vendor.min.js'
    }
  },
  tests: {
    client: ['modules/*/tests/client/**/*.js'],
    server: ['modules/*/tests/server/**/*.js'],
    e2e: ['modules/*/tests/e2e/**/*.js']
  }
};
