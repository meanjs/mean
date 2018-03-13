const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('../config/config');
const mg = require('../config/lib/mongoose');

const transporter = nodemailer.createTransport(config.mailer.options);
const link = 'reset link here'; // PUT reset link here
const email = {
  from: config.mailer.from,
  subject: 'Security update'
};
const text = [
  'Dear {{name}},',
  '\n',
  'We have updated our password storage systems to be more secure and more efficient, please click the link below to reset your password so you can login in the future.',
  link,
  '\n',
  'Thanks,',
  'The Team'
].join('\n');

mg.loadModels();

mg.connect(db => {
  const User = mongoose.model('User');

  User.find().exec((err, users) => {
    if (err) {
      throw err;
    }

    let processedCount = 0;
    let errorCount = 0;

    // report and exit if no users were found
    if (users.length === 0) {
      return reportAndExit(processedCount, errorCount);
    }

    for (let i = 0; i < users.length; i++) {
      sendEmail(users[i]);
    }

    function sendEmail(user) {
      email.to = user.email;
      email.text = email.html = text.replace('{{name}}', user.displayName);

      transporter.sendMail(email, emailCallback(user));
    }

    function emailCallback(user) {
      return (err, info) => {
        processedCount++;

        if (err) {
          errorCount++;

          if (config.mailer.options.debug) {
            console.log('Error: ', err);
          }
          console.error('[' + processedCount + '/' + users.length + '] ' + chalk.red('Could not send email for ' + user.displayName));
        } else {
          console.log('[' + processedCount + '/' + users.length + '] Sent reset password email for ' + user.displayName);
        }

        if (processedCount === users.length) {
          return reportAndExit(processedCount, errorCount);
        }
      };
    }

    // report the processing results and exit
    function reportAndExit(processedCount, errorCount) {
      const successCount = processedCount - errorCount;

      console.log();

      if (processedCount === 0) {
        console.log(chalk.yellow('No users were found.'));
      } else {
        let alert;
        if (!errorCount) {
          alert = chalk.green;
        } else if ((successCount / processedCount) < 0.8) {
          alert = chalk.red;
        } else {
          alert = chalk.yellow;
        }

        console.log(alert('Sent ' + successCount + ' of ' + processedCount + ' emails successfully.'));
      }

      process.exit(0);
    }
  });
});
