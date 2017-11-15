'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://InventoryApp:InventoryApp@ds157614.mlab.com:57614/cen3101-mean-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'Dmitry Kopelevich',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'smtp.gmail.com',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'labinventorywebapp@gmail.com',
        pass: process.env.MAILER_PASSWORD || '1234qwer!@#$QWER'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    // Order of collections in configuration will determine order of seeding.
    // i.e. given these settings, the User seeds will be complete before
    // Item seed is performed.
    collections: [{
      model: 'User',
      docs: [{
        data: {
          username: 'local-admin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        // Set to true to overwrite this document
        // when it already exists in the collection.
        // If set to false, or missing, the seed operation
        // will skip this document to avoid overwriting it.
        overwrite: true,
        data: {
          username: 'local-user',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }, {
      model: 'Item',
      options: {
        // Override log results setting at the
        // collection level.
        logResults: true
      },
      skip: {
        // Skip collection when this query returns results.
        // e.g. {}: Only seeds collection when it is empty.
        when: {} // Mongoose qualified query
      },
      docs: [{
        data: {
          title: 'First Item',
          content: 'This is a seeded Item for the development environment'
        }
      }]
    }]
  }
};
