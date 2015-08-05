var nodemailer = require('nodemailer'),
  mongoose = require('mongoose'),
  config = require('../config/config'),
  mg = require('../config/lib/mongoose');

var transporter = nodemailer.createTransport(config.mailer.options);
var link = 'reset link here'; // PUT reset link here

mg.loadModels();

mg.connect(function (db) {
  var User = mongoose.model('User');

  User.find().exec(function (err, users) {
    if (err) {
      throw err;
    }

    var email = {
      from: 'noreply@xyz.com',
      subject: 'Security update'
    };

    for (var i = 0; i < users.length; i++) {
      var text = [
        'Dear ' + users[i].displayName,
        '\n',
        'We have updated our password storage systems to be more secure and more efficient, please click the link below to reset your password so you can login in the future.',
        link,
        '\n',
        'Thanks,',
        'The Team'
      ].join('\n');

      email.to = users[i].primaryEmail;
      email.text = text;
      email.html = text;

      transporter.sendMail(email, function (err, info) {
        if (err) {
          console.log('Error: ', err);
          console.log('Could not send email for ', users[i].displayName);
        } else {
          console.log('Sent reset password email for ', users[i].displayName);
        }
      });
    }

    console.log('Sent all emails');
    process.exit(0);
  });
});
