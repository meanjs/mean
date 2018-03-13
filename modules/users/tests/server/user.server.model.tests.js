/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Globals
 */
var user1,
  user2,
  user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', () => {

  before(() => {
    user1 = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    };
    // user2 is a clone of user1
    user2 = user1;
    user3 = {
      firstName: 'Different',
      lastName: 'User',
      displayName: 'Full Different Name',
      email: 'test3@test.com',
      username: 'different_username',
      password: 'Different_Password1!',
      provider: 'local'
    };
  });

  describe('Method Save', () => {
    it('should begin with no users', done => {
      User.find({}, (err, users) => {
        users.should.have.length(0);
        done();
      });
    });

    it('should be able to save without problems', done => {
      var _user1 = new User(user1);

      _user1.save(err => {
        should.not.exist(err);
        _user1.remove(err => {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should fail to save an existing user again', done => {
      var _user1 = new User(user1);
      var _user2 = new User(user2);

      _user1.save(() => {
        _user2.save(err => {
          should.exist(err);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to save without first name', done => {
      var _user1 = new User(user1);

      _user1.firstName = '';
      _user1.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should be able to update an existing user with valid roles without problems', done => {
      var _user1 = new User(user1);

      _user1.save(err => {
        should.not.exist(err);
        _user1.roles = ['user', 'admin'];
        _user1.save(err => {
          should.not.exist(err);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user without a role', done => {
      var _user1 = new User(user1);

      _user1.save(err => {
        should.not.exist(err);
        _user1.roles = [];
        _user1.save(err => {
          should.exist(err);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user with a invalid role', done => {
      var _user1 = new User(user1);

      _user1.save(err => {
        should.not.exist(err);
        _user1.roles = ['invalid-user-role-enum'];
        _user1.save(err => {
          should.exist(err);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should confirm that saving user model doesnt change the password', done => {
      var _user1 = new User(user1);

      _user1.save(err => {
        should.not.exist(err);
        var passwordBefore = _user1.password;
        _user1.firstName = 'test';
        _user1.save(err => {
          var passwordAfter = _user1.password;
          passwordBefore.should.equal(passwordAfter);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to save 2 different users', done => {
      var _user1 = new User(user1);
      var _user3 = new User(user3);

      _user1.save(err => {
        should.not.exist(err);
        _user3.save(err => {
          should.not.exist(err);
          _user3.remove(err => {
            should.not.exist(err);
            _user1.remove(err => {
              should.not.exist(err);
              done();
            });
          });
        });
      });
    });

    it('should not be able to save another user with the same email address', function (done) {
      // Test may take some time to complete due to db operations
      this.timeout(10000);

      var _user1 = new User(user1);
      var _user3 = new User(user3);

      _user1.save(err => {
        should.not.exist(err);
        _user3.email = _user1.email;
        _user3.save(err => {
          should.exist(err);
          _user1.remove(err => {
            should.not.exist(err);
            done();
          });
        });
      });

    });

    it('should not index missing email field, thus not enforce the model\'s unique index', done => {
      var _user1 = new User(user1);
      _user1.email = undefined;

      var _user3 = new User(user3);
      _user3.email = undefined;

      _user1.save(err => {
        should.not.exist(err);
        _user3.save(err => {
          should.not.exist(err);
          _user3.remove(err => {
            should.not.exist(err);
            _user1.remove(err => {
              should.not.exist(err);
              done();
            });
          });
        });
      });

    });

    it('should not save the password in plain text', done => {
      var _user1 = new User(user1);
      var passwordBeforeSave = _user1.password;
      _user1.save(err => {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(err => {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should not save the passphrase in plain text', done => {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution for MEAN';
      var passwordBeforeSave = _user1.password;
      _user1.save(err => {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(err => {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('User Password Validation Tests', () => {
    it('should validate when the password strength passes - "P@$$w0rd!!"', () => {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!';

      _user1.validate(err => {
        should.not.exist(err);
      });
    });

    it('should validate a randomly generated passphrase from the static schema method', () => {
      var _user1 = new User(user1);

      User.generateRandomPassphrase()
      .then(password => {
        _user1.password = password;
        _user1.validate(err => {
          should.not.exist(err);
        });
      })
      .catch(err => {
        should.not.exist(err);
      });

    });

    it('should validate when the password is undefined', () => {
      var _user1 = new User(user1);
      _user1.password = undefined;

      _user1.validate(err => {
        should.not.exist(err);
      });
    });

    it('should validate when the passphrase strength passes - "Open-Source Full-Stack Solution For MEAN Applications"', () => {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution For MEAN Applications';

      _user1.validate(err => {
        should.not.exist(err);
      });
    });

    it('should not allow a password less than 10 characters long - "P@$$w0rd!"', done => {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password must be at least 10 characters long.');
        done();
      });
    });

    it('should not allow a password greater than 128 characters long.', done => {
      var _user1 = new User(user1);
      _user1.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password must be fewer than 128 characters.');
        done();
      });
    });

    it('should not allow a password with 3 or more repeating characters - "P@$$w0rd!!!"', done => {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!!';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password may not contain sequences of three or more repeated characters.');
        done();
      });
    });

    it('should not allow a password with no uppercase letters - "p@$$w0rd!!"', done => {
      var _user1 = new User(user1);
      _user1.password = 'p@$$w0rd!!';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password must contain at least one uppercase letter.');
        done();
      });
    });

    it('should not allow a password with less than one number - "P@$$word!!"', done => {
      var _user1 = new User(user1);
      _user1.password = 'P@$$word!!';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password must contain at least one number.');
        done();
      });
    });

    it('should not allow a password with less than one special character - "Passw0rdss"', done => {
      var _user1 = new User(user1);
      _user1.password = 'Passw0rdss';

      _user1.validate(err => {
        err.errors.password.message.should.equal('The password must contain at least one special character.');
        done();
      });
    });
  });

  describe('User E-mail Validation Tests', () => {
    it('should not allow invalid email address - "123"', done => {
      var _user1 = new User(user1);

      _user1.email = '123';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('should not allow invalid email address - "123@123@123"', done => {
      var _user1 = new User(user1);

      _user1.email = '123@123@123';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('should allow email address - "123@123"', done => {
      var _user1 = new User(user1);

      _user1.email = '123@123';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });

    });

    it('should not allow invalid email address - "123.com"', done => {
      var _user1 = new User(user1);

      _user1.email = '123.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });

    });

    it('should not allow invalid email address - "@123.com"', done => {
      var _user1 = new User(user1);

      _user1.email = '@123.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should not allow invalid email address - "abc@abc@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should not allow invalid characters in email address - "abc~@#$%^&*()ef=@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc~@#$%^&*()ef=@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should not allow space characters in email address - "abc def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc def@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should not allow doudble quote characters in email address - "abc\"def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc\"def@abc.com';
      _user1.save(err => {
        if (err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should not allow double dotted characters in email address - "abcdef@abc..com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abcdef@abc..com';
      _user1.save(err => {
        if (err) {
          _user1.remove(err_remove => {
            should.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
    });

    it('should allow single quote characters in email address - "abc\'def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc\'def@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('should allow valid email address - "abc@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('should allow valid email address - "abc+def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc+def@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('should allow valid email address - "abc.def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('should allow valid email address - "abc.def@abc.def.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.def.com';
      _user1.save(err => {
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err);
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.not.exist(err);
          done();
        }
      });
    });

    it('should allow valid email address - "abc-def@abc.com"', done => {
      var _user1 = new User(user1);

      _user1.email = 'abc-def@abc.com';
      _user1.save(err => {
        should.not.exist(err);
        if (!err) {
          _user1.remove(err_remove => {
            should.not.exist(err_remove);
            done();
          });
        } else {
          done();
        }
      });
    });

  });

  describe('Username Validation', () => {
    it('should show error to save username beginning with .', done => {
      var _user = new User(user1);

      _user.username = '.login';
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save with not allowed username', done => {
      var _user = new User(user1);

      _user.username = config.illegalUsernames[Math.floor(Math.random() * config.illegalUsernames.length)];
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should show error to save username end with .', done => {
      var _user = new User(user1);

      _user.username = 'login.';
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should show error to save username with ..', done => {
      var _user = new User(user1);

      _user.username = 'log..in';
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should show error to save username shorter than 3 character', done => {
      var _user = new User(user1);

      _user.username = 'lo';
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should show error saving a username without at least one alphanumeric character', done => {
      var _user = new User(user1);

      _user.username = '-_-';
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should show error saving a username longer than 34 characters', done => {
      var _user = new User(user1);

      _user.username = 'l'.repeat(35);
      _user.save(err => {
        should.exist(err);
        done();
      });
    });

    it('should save username with dot', done => {
      var _user = new User(user1);

      _user.username = 'log.in';
      _user.save(err => {
        should.not.exist(err);
        done();
      });
    });

  });

  after(done => {
    User.remove().exec(done);
  });
});
