'use strict';
// Set the Node ENV
process.env.NODE_ENV = 'development';

var chalk = require('chalk'),
  mongoose = require('../config/lib/mongoose');

mongoose.loadModels();

var _indexToRemove = 'email_1',
  errors = [],
  processedCount = 0;

mongoose.connect(function (db) {
  // get a reference to the User collection
  var userCollection = db.connections[0].collections.users;

  console.log();
  console.log(chalk.yellow('Removing index "' +
    _indexToRemove + '" from the User collection.'));
  console.log();

  // Remove the index
  userCollection.dropIndex(_indexToRemove, function (err, result) {
    var message = 'Successfully removed the index "' + _indexToRemove + '".';

    if (err) {
      errors.push(err);
      message = 'An error occured while removing the index "' + _indexToRemove + '".';

      if (err.message.indexOf('index not found with name') !== -1) {
        message = 'Index "' + _indexToRemove + '" could not be found.' +
          '\r\nPlease double check the index name in your ' +
          'mongodb User collection.';
      }

      reportAndExit(message);
    } else {
      reportAndExit(message);
    }
  });
});

function reportAndExit(message) {
  if (errors.length) {
    console.log(chalk.red(message));
    console.log();

    console.log(chalk.yellow('Errors:'));
    for (var i = 0; i < errors.length; i++) {
      console.log(chalk.red(errors[i]));

      if (i === (errors.length -1) ) {
        process.exit(0);
      }
    }
  } else {
    console.log(chalk.green(message));
    console.log(chalk.green('The next time your application starts, ' +
      'Mongoose will rebuild the index "' + _indexToRemove + '".'));
    process.exit(0);
  }
}
