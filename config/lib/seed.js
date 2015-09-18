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
  User.find({username: seedAdmin.username}, function (err, users) {
    if (users.length === 0) {
      var user = new User(seedAdmin);

      // generate a random password and save 
      User.generateRandomPassphrase()
      .then(saveUser(user))
      .catch(reportError);

    } else {
      console.log(seedAdmin.username + ' user exists');
    }
  });
} else {

  //Add Local User
  User.find({username: seedUser.username}).remove(function () {
    var user = new User(seedUser);

    // generate a random password and save
    User.generateRandomPassphrase()
    .then(saveUser(user))
    .catch(reportError);
  });

  //Add Local Admin
  User.find({username: seedAdmin.username}).remove(function () {
    var user = new User(seedAdmin);

    // generate a random password and save
    User.generateRandomPassphrase()
    .then(saveUser(user))
    .catch(reportError);
  });
}

// save the specified user with the password provided from the resolved promise
function saveUser(user) {
  return function (password) {
    // set the new password
    user.password = password;

    // Then save the user
    user.save(function (err) {
      if (err) {
        console.log('Database Seeding:\t\t\tFailed to add local ' + user.username);        
      } else {
        console.log(chalk.bold.red('Database Seeding:\t\t\tLocal ' + user.username + ' added with password set to ' + password));
      }
    });
  };
}

// report the error
function reportError(err) {
  console.log();
  console.log('Database Seeding:\t\t\t Failed to generate random password');
  console.log(err);
  console.log();
}
