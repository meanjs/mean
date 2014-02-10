'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('../../app/controllers/core');
    app.get('/', core.index);
};