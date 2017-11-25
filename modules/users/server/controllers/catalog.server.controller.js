'use strict';

var path = require('path');
var mongoose = require('mongoose');
var Student = mongoose.model('User');

/* Retreive all the directory students, sorted alphabetically by student last name */
exports.students = function (req, res) {
  Student.find({ type: 'student' }).sort('lastName').exec(function (err, students) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.send(students);
    }
  });
};

/* Retreive all the directory sponsors, sorted alphabetically by student last name */
exports.sponsors = function (req, res) {
  Student.find({ type: 'sponsor' }).sort('lastName').exec(function (err, sponsors) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.send(sponsors);
    }
  });
};

/* Show the current student */
exports.read = function (req, res) {
  /* send back the student as json from the request */
  res.json(req.student);
};

/*
  Middleware: find a student by its ID, then pass it to the next request handler.
 */
exports.studentByID = function (req, res, next, id) {
  Student.findById(id).exec(function (err, student) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      req.student = student;
      next();
    }
  });
};
