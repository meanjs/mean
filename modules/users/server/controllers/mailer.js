'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	pool: false,
	auth: {
		user: 'labinventorywebapp@gmail.com',
		pass: '1234qwer!@#$QWER'
	},
	tls: {
                rejectUnauthorized: false
    }
});

let Mailer = new function() {
	this.sendAcceptance = function(email, firstname) {
		console.log('message sending in process');
		let mailOptions = {
			from: '"Dmitry Kopelevich" <XXXX@ufl.edu>',
			to: email,
			subject: 'Accepted Application for Laboratory Inventory Web App',
			text: firstname + ', the admin has approved your account. You may now sign in.'
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message %s sent: %s', info.messageId, info.response);
		});
	};
	this.sendCreation = function(email, firstname, username, tempPWord) {
		console.log('message sending in process');
		let mailOptions = {
			from: '"Lab Inventory Web App" <XXXX@ufl.edu>',
			to: email,
			subject: 'Login Information for Laboratory Inventory',
			text: firstname + ', here are your credentials for the Laboratory Inventory web app. ' +
						'Please change your password as soon as possible. \n\n' +
						'Username: ' + username + '\n' +
						'Password: ' + tempPWord + '\n'
		};
		tempPWord = "";//Infosec reasons
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message %s sent: %s', info.messageId, info.response);
		});
	};
};

module.exports = Mailer;
