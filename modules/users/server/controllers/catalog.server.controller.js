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

/* Create a student */
exports.create = function (req, res) {
  var student = new Student(req.body);

  student.save(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(student);
    }
  });
};

/* Show the current student */
exports.read = function (req, res) {
  /* send back the student as json from the request */
  res.json(req.student);
};

/* Update a student */
exports.update = function (req, res) {
  var student = req.student;

  /* Replace the article's properties with the new properties found in req.body */
  if (req.body) {
    student.displayName = req.body.displayName;
    student.bio = req.body.bio;
    student.major = req.body.major;
    student.availabilityStatus = req.body.availabilityStatus;
    student.profileImageURL = req.body.profileImageURL;
  }

  /* Save the article */
  student.save(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(student);
    }

  });

};

/* Delete a student */
exports.delete = function (req, res) {
  var student = req.student;

  /* Remove the article */
  student.remove(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.end();
    }

  });
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
