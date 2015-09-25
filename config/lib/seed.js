'use strict';

var mongoose = require('mongoose'),
  chalk = require('chalk'),
  crypto = require('crypto');

function removeUser (user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({username: user.username}).remove(function (err) {
        if (err) {
          reject(new Error('Database Seeding:\t\t\tFailed to remove local ' + user.username));
        }
        resolve();
    });
  });
}

function saveUser (user) {
  return function() {
    return new Promise(function (resolve, reject) {
      // Then save the user
      user.save(function (err, theuser) {
        if (err) {
          reject(new Error('Database Seeding:\t\t\tFailed to add local ' + user.username));
        } else {
          resolve(theuser);
        }
      });
    });
  };
}

function checkUserNotExists (user) {
  return new Promise(function (resolve, reject) {
    var User = mongoose.model('User');
    User.find({username: user.username}, function (err, users) {
        if (err) {
          reject(new Error('Database Seeding:\t\t\tFailed to find local account ' + user.username));
        }

        if (users.length === 0) {
          resolve();
        } else {
          reject(new Error('Database Seeding:\t\t\tFailed due to local account already exists: ' + user.username));
        }
    });
  });
}

function reportSuccess (password) {
  return function (user) {
    return new Promise(function (resolve, reject) {
      console.log(chalk.bold.red('Database Seeding:\t\t\tLocal ' + user.username + ' added with password set to ' + password));
      resolve();
    });
  };
}

// save the specified user with the password provided from the resolved promise
function seedTheUser (user) {
  return function (password) {
    return new Promise(function (resolve, reject) {

      var User = mongoose.model('User');
      // set the new password
      user.password = password;

      if (user.username === 'admin' && process.env.NODE_ENV === 'production') {
        checkUserNotExists(user)
        .then(saveUser(user))
        .then(reportSuccess(password))
        .then(function () {
          resolve();
        })
        .catch(reportError);
      } else {
        removeUser(user)
        .then(saveUser(user))
        .then(reportSuccess(password))
        .then(function () {
          resolve();
        })
        .catch(reportError);
      }
    });
  };
}

// report the error
function reportError (err) {
  console.log();
  console.log(err);
  console.log();
}

module.exports.start = function start() {
  var User = mongoose.model('User');
  return new Promise(function (resolve, reject) {
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

    var user = null;
    var adminAccount = new User(seedAdmin);
    var userAccount = new User(seedUser);

    //If production only seed admin if it does not exist
    if (process.env.NODE_ENV === 'production') {
      User.generateRandomPassphrase()
      .then(seedTheUser(adminAccount))
      .then(function () {
          resolve();
        })
      .catch(reportError);
    } else {
      // Add both Admin and User account

      User.generateRandomPassphrase()
      .then(seedTheUser(userAccount))
      .then(User.generateRandomPassphrase)
      .then(seedTheUser(adminAccount))
      .then(function () {
          resolve();
        })
      .catch(reportError);
    }
  });
};
