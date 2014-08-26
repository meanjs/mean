'use strict';

var swig  = require('swig'),
    nodemailer = require('nodemailer'),
    config = require('../../config/config');

/**
 * Send Email Service
 * @param options - {Object} with the properties :
 *          {
 *              template : {
 *                  path - {String} - Path to the template to render
 *                  renderOptions : {Object} - Template Rendering
 *              },
 *              email : {
 *                  to : {String} email to send to
 *                  subject : {String} email Subject
 *              }
 *          }
 * @param callback - {Function} in the form of callback(err)
 */
exports.sendTemplate = function(options, callback){
    if (!options ||
        !options.template ||
        !options.email){
        return callback(new Error('Error in sendTemplate parameters'), null);
    }

    swig.renderFile(options.template.path, options, function(err, output){
        if (err){
            return callback(err, null);
        }

        var smtpTransport = nodemailer.createTransport(config.mailer.options);
        var mailOptions = {
            to: options.email.to,
            from: config.mailer.from,
            subject: options.email.subject,
            html: output
        };

        smtpTransport.sendMail(mailOptions, function(err) {
            callback(err);
        });
    });
};