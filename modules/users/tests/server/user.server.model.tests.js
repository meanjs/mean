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
var user, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
  before(function () {
    user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    };
    user2 = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    };
    user3 = {
      firstName: 'Different',
      lastName: 'User',
      displayName: 'Full Different Name',
      email: 'test3@test.com',
      username: 'different_username',
      password: 'different_password',
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
      var _user = new User(user);
      
      _user.save(function (err) {
        should.not.exist(err);
        _user.remove(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should fail to save an existing user again', function (done) {
      var _user = new User(user);
      var _user2 = new User(user2);
      
      _user.save(function () {
        _user2.save(function (err) {
          should.exist(err);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when try to save without first name', function (done) {
      var _user = new User(user);

      _user.firstName = '';
      _user.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to update an existing user with valid roles without problems', function (done) {
      var _user = new User(user);

      _user.save(function (err) {
        should.not.exist(err);
        _user.roles = ['user', 'admin'];
        _user.save(function (err) {
          should.not.exist(err);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user without a role', function (done) {
      var _user = new User(user);

      _user.save(function (err) {
        should.not.exist(err);
        _user.roles = [];
        _user.save(function (err) {
          should.exist(err);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to update an existing user with a invalid role', function (done) {
      var _user = new User(user);

      _user.save(function (err) {
        should.not.exist(err);
        _user.roles = ['invalid-user-role-enum'];
        _user.save(function (err) {
          should.exist(err);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should confirm that saving user model doesnt change the password', function (done) {
      var _user = new User(user);

      _user.save(function (err) {
        should.not.exist(err);
        var passwordBefore = _user.password;
        _user.firstName = 'test';
        _user.save(function (err) {
          var passwordAfter = _user.password;
          passwordBefore.should.equal(passwordAfter);
          _user.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to save 2 different users', function (done) {
      var _user = new User(user);
      var _user3 = new User(user3);

      _user.save(function (err) {
        should.not.exist(err);
        _user3.save(function (err) {
          should.not.exist(err);
          _user3.remove(function (err) {
            should.not.exist(err);
            _user.remove(function (err) {
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

      var _user = new User(user);
      var _user3 = new User(user3);

      _user.remove(function (err) {
        should.not.exist(err);
        _user.save(function (err) {
          should.not.exist(err);
          _user3.email = _user.email;
          _user3.save(function (err) {
            should.exist(err);
            _user.remove(function(err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });

    });

  });

  it('should not save the password in plain text', function (done) {
    var _user = new User(user);
    var passwordBeforeSave = _user.password;
    _user.save(function (err) {
      should.not.exist(err);
      _user.password.should.not.equal(passwordBeforeSave);
      _user.remove(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  it('should not save the password in plain text (6 char password)', function (done) {
    var _user = new User(user);
    _user.password = '123456';
    var passwordBeforeSave = _user.password;
    _user.save(function (err) {
      should.not.exist(err);
      _user.password.should.not.equal(passwordBeforeSave);
      _user.remove(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe("User E-mail Validation Tests", function() {
    it('should not allow invalid email address - "123"', function (done) {
      var _user = new User(user);

      _user.email = '123';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = '123@123';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = '123.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = '@123.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = 'abc@abc@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = 'abc~@#$%^&*()ef=@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = 'abc def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should not allow single quote characters in email address - "abc\'def@abc.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc\'def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = 'abc\"def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
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
      var _user = new User(user);

      _user.email = 'abcdef@abc..com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should allow valid email address - "abc@abc.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should allow valid email address - "abc+def@abc.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc+def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should allow valid email address - "abc.def@abc.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc.def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should allow valid email address - "abc.def@abc.def.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc.def@abc.def.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

    it('should allow valid email address - "abc-def@abc.com"', function (done) {
      var _user = new User(user);

      _user.email = 'abc-def@abc.com';
      _user.save(function (err) {
        if (!err) {
          _user.remove(function (err_remove) {
            should.not.exist(err_remove);
            done();
          });
        } else {
          should.exist(err);
          done();
        }
      });
      
    });

  });

  after(function (done) {
    User.remove().exec(done);
  });
});
