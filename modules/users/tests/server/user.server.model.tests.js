'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user1, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
  before(function () {
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

  describe('Method Save', function () {
    it('should begin with no users', function (done) {
      User.find({}, function (err, users) {
        users.should.have.length(0);
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.remove(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should fail to save an existing user again', function (done) {
      var _user1 = new User(user1);
      var _user2 = new User(user2);

      _user1.save(function () {
        _user2.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to save without first name', function (done) {
      var _user1 = new User(user1);

      _user1.firstName = '';
      _user1.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to update an existing user with valid roles without problems', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = ['user', 'admin'];
        _user1.save(function (err) {
          should.not.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user without a role', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = [];
        _user1.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user with a invalid role', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        _user1.roles = ['invalid-user-role-enum'];
        _user1.save(function (err) {
          should.exist(err);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should confirm that saving user model doesnt change the password', function (done) {
      var _user1 = new User(user1);

      _user1.save(function (err) {
        should.not.exist(err);
        var passwordBefore = _user1.password;
        _user1.firstName = 'test';
        _user1.save(function (err) {
          var passwordAfter = _user1.password;
          passwordBefore.should.equal(passwordAfter);
          _user1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to save 2 different users', function (done) {
      var _user1 = new User(user1);
      var _user3 = new User(user3);

      _user1.save(function (err) {
        should.not.exist(err);
        _user3.save(function (err) {
          should.not.exist(err);
          _user3.remove(function (err) {
            should.not.exist(err);
            _user1.remove(function (err) {
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

      _user1.save(function (err) {
        should.not.exist(err);
        _user3.email = _user1.email;
        _user3.save(function (err) {
          should.exist(err);
          _user1.remove(function(err) {
            should.not.exist(err);
            done();
          });
        });
      });

    });

    it('should not save the password in plain text', function (done) {
      var _user1 = new User(user1);
      var passwordBeforeSave = _user1.password;
      _user1.save(function (err) {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should not save the passphrase in plain text', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution for MEAN';
      var passwordBeforeSave = _user1.password;
      _user1.save(function (err) {
        should.not.exist(err);
        _user1.password.should.not.equal(passwordBeforeSave);
        _user1.remove(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('User Password Validation Tests', function() {
    it('should validate when the password strength passes - "P@$$w0rd!!"', function () {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!';

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('should validate when the password is undefined', function () {
      var _user1 = new User(user1);
      _user1.password = undefined;

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('should validate when the passphrase strength passes - "Open-Source Full-Stack Solution For MEAN Applications"', function () {
      var _user1 = new User(user1);
      _user1.password = 'Open-Source Full-Stack Solution For MEAN Applications';

      _user1.validate(function (err) {
        should.not.exist(err);
      });
    });

    it('should not allow a less than 10 characters long - "P@$$w0rd!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password must be at least 10 characters long.');
        done();
      });
    });

    it('should not allow a greater than 128 characters long.', function (done) {
      var _user1 = new User(user1);
      _user1.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password must be fewer than 128 characters.');
        done();
      });
    });

    it('should not allow more than 3 or more repeating characters - "P@$$w0rd!!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$w0rd!!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password may not contain sequences of three or more repeated characters.');
        done();
      });
    });

    it('should not allow a password with no uppercase letters - "p@$$w0rd!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'p@$$w0rd!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password must contain at least one uppercase letter.');
        done();
      });
    });

    it('should not allow a password with less than one number - "P@$$word!!"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'P@$$word!!';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password must contain at least one number.');
        done();
      });
    });

    it('should not allow a password with less than one special character - "Passw0rdss"', function (done) {
      var _user1 = new User(user1);
      _user1.password = 'Passw0rdss';

      _user1.validate(function (err) {
        err.errors.password.message.should.equal('The password must contain at least one special character.');
        done();
      });
    });
  });

  describe('User E-mail Validation Tests', function() {
    it('should not allow invalid email address - "123"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow invalid email address - "123@123"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123@123';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow invalid email address - "123.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '123.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow invalid email address - "@123.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = '@123.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow invalid email address - "abc@abc@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow invalid characters in email address - "abc~@#$%^&*()ef=@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc~@#$%^&*()ef=@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow space characters in email address - "abc def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow doudble quote characters in email address - "abc\"def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc\"def@abc.com';
      _user1.save(function (err) {
        if (err) {
          _user1.remove(function (err_remove) {
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

    it('should not allow double dotted characters in email address - "abcdef@abc..com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abcdef@abc..com';
      _user1.save(function (err) {
        if (err) {
          _user1.remove(function (err_remove) {
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

    it('should allow single quote characters in email address - "abc\'def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc\'def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should allow valid email address - "abc@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should allow valid email address - "abc+def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc+def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should allow valid email address - "abc.def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should allow valid email address - "abc.def@abc.def.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc.def@abc.def.com';
      _user1.save(function (err) {
        if (!err) {
          _user1.remove(function (err_remove) {
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

    it('should allow valid email address - "abc-def@abc.com"', function (done) {
      var _user1 = new User(user1);

      _user1.email = 'abc-def@abc.com';
      _user1.save(function (err) {
        should.not.exist(err);
        if (!err) {
          _user1.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          done();
        }
      });
    });

  });

  after(function (done) {
    User.remove().exec(done);
  });
});
