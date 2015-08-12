'use strict';

var mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto'),
  User = mongoose.model('User');

console.log(chalk.bold.red('Warning:  Database seeding is turned on'));

//If production only seed admin if it does not exist
if (process.env.NODE_ENV === 'production') {
  //Add Local Admin
  User.find({username: 'admin'}, function (err, users) {
    if (users.length === 0) {
      var password = crypto.randomBytes(64).toString('hex').slice(1, 20);
      var user = new User({
        username: 'admin',
        password: password,
        provider: 'local',
        email: 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      });
      // Then save the user
      user.save(function (err) {
        if (err) {
          console.log('Failed to add local admin');
        } else {
          console.log(chalk.bold.red('Local admin added with password set to ' + password));
        }
      });
    } else {
      console.log('Admin user exists');
    }
  });
} else {
  //Add Local User
  User.find({username: 'user'}).remove(function () {
    var password = crypto.randomBytes(64).toString('hex').slice(1, 20);
    var user = new User({
      username: 'user',
      password: password,
      provider: 'local',
      email: 'user@localhost.com',
      firstName: 'User',
      lastName: 'Local',
      displayName: 'User Local',
      roles: ['user']
    });
    // Then save the user
    user.save(function (err) {
      if (err) {
        console.log('Failed to add local user');
      } else {
        console.log(chalk.bold.red('Local user added with password set to ' + password));
      }
    });
  });


  //Add Local Admin
  User.find({username: 'admin'}).remove(function () {
    var password = crypto.randomBytes(64).toString('hex').slice(1, 20);
    var user = new User({
      username: 'admin',
      password: password,
      provider: 'local',
      email: 'admin@localhost.com',
      firstName: 'Admin',
      lastName: 'Local',
      displayName: 'Admin Local',
      roles: ['user', 'admin']
    });
    // Then save the user
    user.save(function (err) {
      if (err) {
        console.log('Failed to add local admin');
      } else {
        console.log(chalk.bold.red('Local admin added with password set to ' + password));
      }
    });
  });
}
