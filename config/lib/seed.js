'use strict';

var mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto'),
  User = mongoose.model('User');

console.log(chalk.bold.red('Warning:  Database seeding is turned on'));

var seedUser = {
  username: 'user',
  password: 'User_Password1!',
  provider: 'local',
  email: 'user@localhost.com',
  firstName: 'User',
  lastName: 'Local',
  displayName: 'User Local',
  roles: ['user']
};

var seedAdmin = {
  username: 'admin',
  password: 'Admin_Password1!',
  provider: 'local',
  email: 'admin@localhost.com',
  firstName: 'Admin',
  lastName: 'Local',
  displayName: 'Admin Local',
  roles: ['user', 'admin']
};


//If production only seed admin if it does not exist
if (process.env.NODE_ENV === 'production') {
  //Add Local Admin
  User.find({username: 'admin'}, function (err, users) {
    if (users.length === 0) {
      var password = crypto.randomBytes(64).toString('hex').slice(1, 20);
      seedAdmin.password = password;
      var user = new User(seedAdmin);
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
    seedUser.password = password;
    var user = new User(seedUser);
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
    seedAdmin.password = password;
    var user = new User(seedAdmin);
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
