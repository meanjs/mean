var semver = require('semver'),
  should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  credentialsEmail,
  user,
  _user,
  admin;

/**
 * User routes tests
 */
describe('User CRUD tests', () => {

  before(done => {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(done => {
    // Create user credentials with username
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user credentials with email
    credentialsEmail = {
      usernameOrEmail: 'test@test.com',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    _user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    };

    user = new User(_user);

    // Save a user to the test db and create new article
    user.save(err => {
      should.not.exist(err);
      done();
    });
  });

  it('should be able to register a new user', done => {

    _user.username = 'register_new_user';
    _user.email = 'register_new_user_@test.com';

    agent.post('/api/auth/signup')
      .send(_user)
      .expect(200)
      .end((signupErr, signupRes) => {
        // Handle signpu error
        if (signupErr) {
          return done(signupErr);
        }

        signupRes.body.username.should.equal(_user.username);
        signupRes.body.email.should.equal(_user.email);
        // Assert a proper profile image has been set, even if by default
        signupRes.body.profileImageURL.should.not.be.empty();
        // Assert we have just the default 'user' role
        signupRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        signupRes.body.roles.indexOf('user').should.equal(0);
        return done();
      });
  });

  it('should be able to login with username successfully and logout successfully', done => {
    // Login with username
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.get('/api/auth/signout')
          .expect(302)
          .end((signoutErr, signoutRes) => {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            // NodeJS v4 changed the status code representation so we must check
            // before asserting, to be comptabile with all node versions.
            if (semver.satisfies(process.versions.node, '>=4.0.0')) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
            }

            return done();
          });
      });
  });

  it('should be able to login with email successfully and logout successfully', done => {
    // Login with username
    agent.post('/api/auth/signin')
      .send(credentialsEmail)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.get('/api/auth/signout')
          .expect(302)
          .end((signoutErr, signoutRes) => {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            // NodeJS v4 changed the status code representation so we must check
            // before asserting, to be comptabile with all node versions.
            if (semver.satisfies(process.versions.node, '>=4.0.0')) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
            }

            return done();
          });
      });
  });

  it('should not be able to retrieve a list of users if not admin', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Request list of users
        agent.get('/api/users')
          .expect(403)
          .end((usersGetErr, usersGetRes) => {
            if (usersGetErr) {
              return done(usersGetErr);
            }

            return done();
          });
      });
  });

  it('should be able to retrieve a list of users if admin', done => {
    user.roles = ['user', 'admin'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Request list of users
          agent.get('/api/users')
            .expect(200)
            .end((usersGetErr, usersGetRes) => {
              if (usersGetErr) {
                return done(usersGetErr);
              }

              usersGetRes.body.should.be.instanceof(Array).and.have.lengthOf(1);

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should be able to get a single user details if admin', done => {
    user.roles = ['user', 'admin'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database
          agent.get('/api/users/' + user._id)
            .expect(200)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should be able to update a single user details if admin', done => {
    user.roles = ['user', 'admin'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database

          var userUpdate = {
            firstName: 'admin_update_first',
            lastName: 'admin_update_last',
            roles: ['admin']
          };

          agent.put('/api/users/' + user._id)
            .send(userUpdate)
            .expect(200)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.firstName.should.be.equal('admin_update_first');
              userInfoRes.body.lastName.should.be.equal('admin_update_last');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should be able to delete a single user if admin', done => {
    user.roles = ['user', 'admin'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          agent.delete('/api/users/' + user._id)
            .expect(200)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('forgot password should return 400 for non-existent username', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: 'some_username_that_doesnt_exist'
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('No account with that username or email has been found');
          return done();
        });
    });
  });

  it('forgot password should return 400 for empty username/email', done => {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: ''
        })
        .expect(422)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Username/email field must not be blank');
          return done();
        });
    });
  });

  it('forgot password should return 400 for no username or email provided', done => {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({})
        .expect(422)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Username/email field must not be blank');
          return done();
        });
    });
  });

  it('forgot password should return 400 for non-local provider set for the user object', done => {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('It seems like you signed up using your ' + user.provider + ' account, please sign in using that provider.');
          return done();
        });
    });
  });

  it('forgot password should be able to reset password for user password reset request using username', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, (err, userRes) => {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);
            res.body.message.should.be.equal('Failure sending email');
            return done();
          });
        });
    });
  });

  it('forgot password should be able to reset password for user password reset request using email', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.email
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, (err, userRes) => {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);
            res.body.message.should.be.equal('Failure sending email');
            return done();
          });
        });
    });
  });

  it('forgot password should be able to reset the password using reset token', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, (err, userRes) => {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);

            agent.get('/api/auth/reset/' + userRes.resetPasswordToken)
            .expect(302)
            .end((err, res) => {
              // Handle error
              if (err) {
                return done(err);
              }

              res.headers.location.should.be.equal('/password/reset/' + userRes.resetPasswordToken);

              return done();
            });
          });
        });
    });
  });

  it('forgot password should return error when using invalid reset token', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end((err, res) => {
          // Handle error
          if (err) {
            return done(err);
          }

          var invalidToken = 'someTOKEN1234567890';
          agent.get('/api/auth/reset/' + invalidToken)
          .expect(302)
          .end((err, res) => {
            // Handle error
            if (err) {
              return done(err);
            }

            res.headers.location.should.be.equal('/password/reset/invalid');

            return done();
          });
        });
    });
  });

  it('should be able to change user own password successfully', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: credentials.password
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Password changed successfully');
            return done();
          });
      });
  });

  it('should not be able to change user own password if wrong verifyPassword is given', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials.password
          })
          .expect(422)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Passwords do not match');
            return done();
          });
      });
  });

  it('should not be able to change user own password if wrong currentPassword is given', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$'
          })
          .expect(422)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Current password is incorrect');
            return done();
          });
      });
  });

  it('should not be able to change user own password if no new password is at all given', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials.password
          })
          .expect(422)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Please provide a new password');
            return done();
          });
      });
  });

  it('should not be able to change user own password if not signed in', done => {

    // Change password
    agent.post('/api/users/password')
      .send({
        newPassword: '1234567890Aa$',
        verifyPassword: '1234567890Aa$',
        currentPassword: credentials.password
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        res.body.message.should.equal('User is not signed in');
        return done();
      });
  });

  it('should be able to get own user details successfully', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get own user details
        agent.get('/api/users/me')
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            res.body.should.be.instanceof(Object);
            res.body.username.should.equal(user.username);
            res.body.email.should.equal(user.email);
            should.not.exist(res.body.salt);
            should.not.exist(res.body.password);
            return done();
          });
      });
  });

  it('should not be able to get any user details if not logged in', done => {
    // Get own user details
    agent.get('/api/users/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        should.not.exist(res.body);
        return done();
      });
  });

  it('should be able to update own user details', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            firstName: 'user_update_first',
            lastName: 'user_update_last'
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(200)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.firstName.should.be.equal('user_update_first');
              userInfoRes.body.lastName.should.be.equal('user_update_last');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body.roles.indexOf('user').should.equal(0);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should not be able to update own user details and add roles if not admin', done => {
    user.roles = ['user'];

    user.save(err => {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            firstName: 'user_update_first',
            lastName: 'user_update_last',
            roles: ['user', 'admin']
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(200)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.firstName.should.be.equal('user_update_first');
              userInfoRes.body.lastName.should.be.equal('user_update_last');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body.roles.indexOf('user').should.equal(0);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should not be able to update own user details with existing username', done => {

    var _user2 = _user;

    _user2.username = 'user2_username';
    _user2.email = 'user2_email@test.com';

    var credentials2 = {
      usernameOrEmail: 'username2',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    _user2.username = credentials2.usernameOrEmail;
    _user2.password = credentials2.password;

    var user2 = new User(_user2);

    user2.save(err => {
      should.not.exist(err);

      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            firstName: 'user_update_first',
            lastName: 'user_update_last',
            username: user.username
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(422)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              // Call the assertion callback
              userInfoRes.body.message.should.equal('Username already exists');

              return done();
            });
        });
    });
  });

  it('should not be able to update own user details with existing email', done => {

    var _user2 = _user;

    _user2.username = 'user2_username';
    _user2.email = 'user2_email@test.com';

    var credentials2 = {
      usernameOrEmail: 'username2',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    _user2.username = credentials2.usernameOrEmail;
    _user2.password = credentials2.password;

    var user2 = new User(_user2);

    user2.save(err => {
      should.not.exist(err);

      agent.post('/api/auth/signin')
        .send(credentials2)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          var userUpdate = {
            firstName: 'user_update_first',
            lastName: 'user_update_last',
            email: user.email
          };

          agent.put('/api/users')
            .send(userUpdate)
            .expect(422)
            .end((userInfoErr, userInfoRes) => {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              // Call the assertion callback
              userInfoRes.body.message.should.equal('Email already exists');

              return done();
            });
        });
    });
  });

  it('should not be able to update secure fields', done => {
    var resetPasswordToken = 'password-reset-token';
    user.resetPasswordToken = resetPasswordToken;

    user.save(saveErr => {
      if (saveErr) {
        return done(saveErr);
      }
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end((signinErr, signinRes) => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          var userUpdate = {
            password: 'Aw3$0m3P@ssWord',
            salt: 'newsaltphrase',
            created: new Date(2000, 9, 9),
            resetPasswordToken: 'tweeked-reset-token'
          };

          // Get own user details
          agent.put('/api/users')
            .send(userUpdate)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              User.findById(user._id, (dbErr, updatedUser) => {
                if (dbErr) {
                  return done(dbErr);
                }

                updatedUser.password.should.be.equal(user.password);
                updatedUser.salt.should.be.equal(user.salt);
                updatedUser.created.getTime().should.be.equal(user.created.getTime());
                updatedUser.resetPasswordToken.should.be.equal(resetPasswordToken);
                done();
              });
            });
        });
    });
  });

  it('should not be able to update own user details if not logged-in', done => {
    user.roles = ['user'];

    user.save(err => {

      should.not.exist(err);

      var userUpdate = {
        firstName: 'user_update_first',
        lastName: 'user_update_last'
      };

      agent.put('/api/users')
        .send(userUpdate)
        .expect(401)
        .end((userInfoErr, userInfoRes) => {
          if (userInfoErr) {
            return done(userInfoErr);
          }

          userInfoRes.body.message.should.equal('User is not signed in');

          // Call the assertion callback
          return done();
        });
    });
  });

  it('should not be able to update own user profile picture without being logged-in', done => {

    agent.post('/api/users/picture')
      .send({})
      .expect(401)
      .end((userInfoErr, userInfoRes) => {
        if (userInfoErr) {
          return done(userInfoErr);
        }

        userInfoRes.body.message.should.equal('User is not signed in');

        // Call the assertion callback
        return done();
      });
  });

  it('should be able to change profile picture if signed in', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/client/img/profile/default.png')
          .expect(200)
          .end((userInfoErr, userInfoRes) => {
            // Handle change profile picture error
            if (userInfoErr) {
              return done(userInfoErr);
            }

            userInfoRes.body.should.be.instanceof(Object);
            userInfoRes.body.profileImageURL.should.be.a.String();
            userInfoRes.body._id.should.be.equal(String(user._id));

            return done();
          });
      });
  });

  it('should not be able to change profile picture if attach a picture with a different field name', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('fieldThatDoesntWork', './modules/users/client/img/profile/default.png')
          .send(credentials)
          .expect(422)
          .end((userInfoErr, userInfoRes) => {
            done(userInfoErr);
          });
      });
  });

  it('should not be able to upload a non-image file as a profile picture', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end((signinErr, signinRes) => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/server/img/text-file.txt')
          .send(credentials)
          .expect(422)
          .end((userInfoErr, userInfoRes) => {
            done(userInfoErr);
          });
      });
  });

  it('should not be able to change profile picture to too big of a file', done => {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(signinErr => {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/server/img/too-big-file.png')
          .send(credentials)
          .expect(422)
          .end((userInfoErr, userInfoRes) => {
            done(userInfoErr);
          });
      });
  });

  it('should be able to change profile picture and not fail if existing picture file does not exist', done => {

    user.profileImageURL = config.uploads.profile.image.dest + 'non-existing.png';

    user.save(saveErr => {
      // Handle error
      if (saveErr) {
        return done(saveErr);
      }

      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(signinErr => {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          agent.post('/api/users/picture')
            .attach('newProfilePicture', './modules/users/client/img/profile/default.png')
            .expect(200)
            .end(userInfoErr => {

              should.not.exist(userInfoErr);

              return done();
            });
        });

    });
  });

  afterEach(done => {
    User.remove().exec(done);
  });
});
