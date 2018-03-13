/**
 * Module dependencies.
 */
const _ = require('lodash');

const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const config = require(path.resolve('./config/config'));
const logger = require(path.resolve('./config/lib/logger'));
const seed = require(path.resolve('./config/lib/mongo-seed'));
const express = require(path.resolve('./config/lib/express'));
const Article = mongoose.model('Article');

/**
 * Globals
 */
let app;

let agent;
let user1;
let admin1;
let userFromSeedConfig;
let adminFromSeedConfig;
let originalLogConfig;

describe('Configuration Tests:', () => {

  describe('Testing Mongo Seed', () => {
    const _seedConfig = _.clone(config.seedDB, true);
    let articleSeedConfig;
    let userSeedConfig;
    let _admin;
    let _user;
    let _article;

    before(done => {
      _admin = {
        username: 'test-seed-admin',
        email: 'test-admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Test',
        roles: ['admin', 'user']
      };

      _user = {
        username: 'test-seed-user',
        email: 'test-user@localhost.com',
        firstName: 'User',
        lastName: 'Test',
        roles: ['user']
      };

      _article = {
        title: 'Testing Database Seed Article',
        content: 'Testing Article Seed right now!'
      };

      const articleCollections = _.filter(_seedConfig.collections, collection => collection.model === 'Article');

      // articleCollections.should.be.instanceof(Array).and.have.lengthOf(1);
      articleSeedConfig = articleCollections[0];

      const userCollections = _.filter(_seedConfig.collections, collection => collection.model === 'User');

      // userCollections.should.be.instanceof(Array).and.have.lengthOf(1);
      userSeedConfig = userCollections[0];

      return done();
    });

    afterEach(done => {
      Article.remove().exec()
        .then(() => User.remove().exec())
        .then(() => done())
        .catch(err => done(err));
    });

    it('should have default seed configuration set for articles', done => {
      articleSeedConfig.should.be.instanceof(Object);
      articleSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(1);
      should.exist(articleSeedConfig.docs[0].data.title);
      should.exist(articleSeedConfig.docs[0].data.content);

      return done();
    });

    it('should have default seed configuration set for users', done => {
      userSeedConfig.should.be.instanceof(Object);
      userSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(2);

      should.exist(userSeedConfig.docs[0].data.username);
      should.exist(userSeedConfig.docs[0].data.email);
      should.exist(userSeedConfig.docs[0].data.firstName);
      should.exist(userSeedConfig.docs[0].data.lastName);
      should.exist(userSeedConfig.docs[0].data.roles);

      should.exist(userSeedConfig.docs[1].data.username);
      should.exist(userSeedConfig.docs[1].data.email);
      should.exist(userSeedConfig.docs[1].data.firstName);
      should.exist(userSeedConfig.docs[1].data.lastName);
      should.exist(userSeedConfig.docs[1].data.roles);

      return done();
    });

    it('should seed data from default config', done => {

      seed.start()
        .then(() => // Check Articles Seed
      Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(articleSeedConfig.docs.length);
          // Check Users Seed
          return User.find().exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(userSeedConfig.docs.length);
          return done();
        })
        .catch(done);
    });

    it('should overwrite existing article by default', done => {
      articleSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(1);

      const article = new Article(articleSeedConfig.docs[0].data);
      article.content = '_temp_test_article_';

      // save temp article
      article.save()
        .then(() => seed.start())
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          articleSeedConfig.docs[0].data.title.should.equal(newArticle.title);
          articleSeedConfig.docs[0].data.content.should.equal(newArticle.content);

          return done();
        })
        .catch(done);
    });

    it('should overwrite existing users by default', done => {
      userSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(2);

      const admin = new User(userSeedConfig.docs[0].data);
      admin.email = 'temp-admin@localhost.com';
      admin.provider = 'local';

      const user = new User(userSeedConfig.docs[1].data);
      user.email = 'temp-user@localhost.com';
      user.provider = 'local';

      admin.save()
        .then(() => user.save())
        .then(() => User.find().exec())
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(2);
          // Start Seed
          return seed.start();
        })
        .then(() => User.find().exec())
        .then(users => {
          // Should still only be two users, since we removed
          // the existing users before seeding again.
          users.should.be.instanceof(Array).and.have.lengthOf(2);

          return User.find({ username: admin.username }).exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          const newAdmin = users.pop();
          userSeedConfig.docs[0].data.username.should.equal(newAdmin.username);
          userSeedConfig.docs[0].data.email.should.equal(newAdmin.email);

          return User.find({ username: user.username }).exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          const newUser = users.pop();
          userSeedConfig.docs[1].data.username.should.equal(newUser.username);
          userSeedConfig.docs[1].data.email.should.equal(newUser.email);

          return done();
        })
        .catch(done);
    });

    it('should seed single article with custom options', done => {
      seed
        .start({
          collections: [{
            model: 'Article',
            docs: [{
              overwrite: true,
              data: _article
            }]
          }]
        })
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          _article.title.should.equal(newArticle.title);
          _article.content.should.equal(newArticle.content);

          return done();
        })
        .catch(done);
    });

    it('should seed single article with user set to custom seeded admin user', done => {
      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: _admin
            }]
          }, {
            model: 'Article',
            docs: [{
              overwrite: true,
              data: _article
            }]
          }]
        })
        .then(() => User.find().exec())
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          return Article
            .find()
            .populate('user', 'firstName lastName username email roles')
            .exec();
        })
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          _article.title.should.equal(newArticle.title);
          _article.content.should.equal(newArticle.content);

          should.exist(newArticle.user);
          should.exist(newArticle.user._id);

          _admin.username.should.equal(newArticle.user.username);
          _admin.email.should.equal(newArticle.user.email);
          _admin.firstName.should.equal(newArticle.user.firstName);
          _admin.lastName.should.equal(newArticle.user.lastName);

          should.exist(newArticle.user.roles);
          newArticle.user.roles.indexOf('admin').should.equal(_admin.roles.indexOf('admin'));

          return done();
        })
        .catch(done);
    });

    it('should seed single article with NO user set due to seed order', done => {
      seed
        .start({
          collections: [{
            model: 'Article',
            docs: [{
              overwrite: true,
              data: _article
            }]
          }, {
            model: 'User',
            docs: [{
              data: _admin
            }]
          }]
        })
        .then(() => User.find().exec())
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          return Article
            .find()
            .populate('user', 'firstName lastName username email roles')
            .exec();
        })
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          _article.title.should.equal(newArticle.title);
          _article.content.should.equal(newArticle.content);

          should.not.exist(newArticle.user);

          return done();
        })
        .catch(done);
    });

    it('should seed admin and user accounts with custom options', done => {
      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: _admin
            }, {
              data: _user
            }]
          }]
        })
        .then(() => User.find().exec())
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(2);
          return User.find({ username: _admin.username }).exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          const newAdmin = users.pop();
          _admin.username.should.equal(newAdmin.username);
          _admin.email.should.equal(newAdmin.email);

          return User.find({ username: _user.username }).exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          const newUser = users.pop();
          _user.username.should.equal(newUser.username);
          _user.email.should.equal(newUser.email);

          return done();
        })
        .catch(done);
    });

    it('should NOT overwrite existing article with custom options', done => {

      const article = new Article(_article);
      article.content = '_temp_article_content_';

      article.save()
        .then(() => seed.start({
        collections: [{
          model: 'Article',
          docs: [{
            overwrite: false,
            data: _article
          }]
        }]
      }))
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const existingArticle = articles.pop();
          article.title.should.equal(existingArticle.title);
          article.content.should.equal(existingArticle.content);

          return done();
        })
        .catch(done);
    });

    it('should NOT overwrite existing user with custom options', done => {
      const user = new User(_user);
      user.provider = 'local';
      user.email = 'temp-test-user@localhost.com';

      user.save()
        .then(() => seed.start({
        collections: [{
          model: 'User',
          docs: [{
            overwrite: false,
            data: _user
          }]
        }]
      }))
        .then(() => User.find().exec())
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          const existingUser = users.pop();
          user.username.should.equal(existingUser.username);
          user.email.should.equal(existingUser.email);

          return done();
        })
        .catch(done);
    });

    it('should NOT seed article when missing title with custom options', done => {
      const invalid = {
        content: '_temp_article_content_'
      };

      seed
        .start({
          collections: [{
            model: 'Article',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(() => {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(err => {
          should.exist(err);
          err.message.should.equal('Article validation failed: title: Title cannot be blank');

          return done();
        });
    });

    it('should NOT seed user when missing username with custom options', done => {
      const invalid = _.clone(_user, true);
      invalid.username = undefined;

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(() => {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(err => {
          should.exist(err);
          err.message.should.equal('User validation failed: username: Please fill in a username');

          return done();
        });
    });

    it('should NOT seed user when missing email with custom options', done => {
      const invalid = _.clone(_user, true);
      invalid.email = undefined;

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(() => {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(err => {
          should.exist(err);
          err.message.should.equal('User validation failed: email: Please fill a valid email address');

          return done();
        });
    });

    it('should NOT seed user with invalid email with custom options', done => {
      const invalid = _.clone(_user, true);
      invalid.email = '...invalid-email...';

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(() => {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(err => {
          should.exist(err);
          err.message.should.equal('User validation failed: email: Please fill a valid email address');

          return done();
        });
    });

    it('should NOT continue seed when empty collections config', done => {
      seed
        .start({
          collections: []
        })
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(0);

          return User.find().exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(0);

          return done();
        })
        .catch(done);
    });

    it('should NOT seed any data when empty docs config', done => {
      seed
        .start({
          collections: [{
            model: 'Article',
            docs: []
          }]
        })
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(0);

          return User.find().exec();
        })
        .then(users => {
          users.should.be.instanceof(Array).and.have.lengthOf(0);

          return done();
        })
        .catch(done);
    });

    it('should seed article with custom options & skip.when results are empty', done => {
      seed
        .start({
          collections: [{
            model: 'Article',
            skip: {
              when: { title: 'should-not-find-this-title' }
            },
            docs: [{
              data: _article
            }]
          }]
        })
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          _article.title.should.be.equal(newArticle.title);
          _article.content.should.be.equal(newArticle.content);

          return done();
        })
        .catch(done);
    });

    it('should skip seed on collection with custom options & skip.when has results', done => {
      const article = new Article({
        title: 'temp-article-title',
        content: 'temp-article-content'
      });

      article
        .save()
        .then(() => Article.find().exec())
        .then(articles => {
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const newArticle = articles.pop();
          article.title.should.equal(newArticle.title);
          article.content.should.equal(newArticle.content);

          return seed.start({
            collections: [{
              model: 'Article',
              skip: {
                when: { title: newArticle.title }
              },
              docs: [{
                data: _article
              }]
            }]
          });
        })
        .then(() => Article.find().exec())
        .then(articles => {
          // We should have the same article added at start of this unit test.
          articles.should.be.instanceof(Array).and.have.lengthOf(1);

          const existingArticle = articles.pop();
          article.title.should.equal(existingArticle.title);
          article.content.should.equal(existingArticle.content);

          return done();
        })
        .catch(done);
    });

    it('should fail seed with custom options & invalid skip.when query', done => {
      seed
        .start({
          collections: [{
            model: 'Article',
            skip: {
              when: { created: 'not-a-valid-date' }
            },
            docs: [{
              data: _article
            }]
          }]
        })
        .then(() => {
          // We should not get here
          should.exist(undefined);
          return done();
        })
        .catch(err => {
          should.exist(err);
          // We expect the error message to include
          err.message.indexOf('Cast to date failed').should.equal(0);

          return done();
        });
    });
  });

  describe('Testing Session Secret Configuration', () => {
    it('should warn if using default session secret when running in production', done => {
      const conf = { sessionSecret: 'MEAN' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(false);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept non-default session secret when running in production', () => {
      const conf = { sessionSecret: 'super amazing secret' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in development', () => {
      const conf = { sessionSecret: 'MEAN' };
      // set env to development for this test
      process.env.NODE_ENV = 'development';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in test', () => {
      const conf = { sessionSecret: 'MEAN' };
      config.utils.validateSessionSecret(conf, true).should.equal(true);
    });
  });

  describe('Testing Logger Configuration', () => {

    beforeEach(() => {
      originalLogConfig = _.clone(config.log, true);
    });

    afterEach(() => {
      config.log = originalLogConfig;
    });

    it('should retrieve the log format from the logger configuration', () => {

      config.log = {
        format: 'tiny'
      };

      const format = logger.getLogFormat();
      format.should.be.equal('tiny');
    });

    it('should retrieve the log options from the logger configuration for a valid stream object', () => {

      const options = logger.getMorganOptions();

      options.should.be.instanceof(Object);
      options.should.have.property('stream');

    });

    it('should verify that a file logger object was created using the logger configuration', () => {
      const _dir = process.cwd();
      const _filename = 'unit-test-access.log';

      config.log = {
        fileLogger: {
          directoryPath: _dir,
          fileName: _filename
        }
      };

      const fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.instanceof(Object);
      fileTransport.filename.should.equal(_dir + '/' + _filename);
    });

    it('should use the default log format of "combined" when an invalid format was provided', () => {

      const _logger = require(path.resolve('./config/lib/logger'));

      // manually set the config log format to be invalid
      config.log = {
        format: '_some_invalid_format_'
      };

      const format = _logger.getLogFormat();
      format.should.be.equal('combined');
    });

    it('should not create a file transport object if critical options are missing: filename', () => {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: process.cwd(),
            fileName: ''
          }
        }
      };

      const fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });

    it('should not create a file transport object if critical options are missing: directory', () => {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: '',
            fileName: 'app.log'
          }
        }
      };

      const fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });
  });

  describe('Testing exposing environment as a variable to layout', () => {

    ['development', 'production', 'test'].forEach(env => {
      it('should expose environment set to ' + env, done => {
        // Set env to development for this test
        process.env.NODE_ENV = env;

        // Gget application
        app = express.init(mongoose.connection.db);
        agent = request.agent(app);

        // Get rendered layout
        agent.get('/')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .end((err, res) => {
            // Set env back to test
            process.env.NODE_ENV = 'test';
            // Handle errors
            if (err) {
              return done(err);
            }
            res.text.should.containEql('env = "' + env + '"');
            return done();
          });
      });
    });

  });

});
