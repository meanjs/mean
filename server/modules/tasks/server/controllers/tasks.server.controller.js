'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  orm = require(path.resolve('./config/lib/sequelize'));


exports.getAllTasks = function (req, res) {

  orm.Task.findAll().then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.addTask = function (req, res) {

  // Reject the request if no title field is provided
  if (!req.body.title) {
    return res.status(400).send({
      message: 'Missing title field'
    });
  }

  // Coerce the title field to string
  let title = '' + req.body.title;

  let username = req.session.user.username;

  orm.Task.create({
    title: title,
    username: username
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.updateTask = function (req, res) {

  orm.Task.update(req.body, {
    where: {
      id: req.body.id
    }
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.deleteTask = function (req, res) {

  orm.Task.destroy({
    where: {
      id: req.body.id
    }
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.getMyTasks = function (req, res) {

  orm.Task.findAll({
    where: {
      username: req.session.user.username
    }
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};


// Helper method to validate a valid session for dependent APIs
exports.validateSessionUser = function (req, res, next) {
  // Reject the request if no user exists on the session
  if (!res.session || !req.session.user) {
    return res.status(401).send({
      message: 'No session user'
    });
  }

  return next();
};
