'use strict';
var express = require('express');
var bodyParser = require('body-parser');

app.use( bodyParser.urlencoded({expented: true } ) );
var mongoose = require('mongoose');


var app = express();
var username = require('username');
var db;

MongoClient.connect('mongodb://localhost:27017/', function (err, database) {
  if (err) {
    return console.lod(err);
  }
  db = database;
});

app.get('/comment', function (req, res) {
  res.send('comment.html');
});

app.post('/comment', function (req, res){
  var comments {
    comment: req.body.comment,
    username: username.sync() };
    db.collection('comments').insert(comments, function (err, result) {
      if (err) {
        console.log(err);
      return res.sendStatus(500);
    }
    //console.log(result);
  });
  res.redirect('/');
});
app.get('/change_comment:id', function (req, res) {
  res.send('change_comment.html')
}

app.post('/change_comment:id', function (req, res){
  var comments {
    comment: req.body.comment,
    username: username.sync() };
    db.collection('comments').findOneAndUpdate(
      { username: comments.username,
      _id: ObjectId(get.params.id) },
      { $set: {comment: comments.comment }},
       function (err, result) {
      if (err) {
        console.log(err);
      return res.sendStatus(500);
    }
    //console.log(result);
  });
  res.redirect('/');
});

app.delete('/delete_comment', function (req, res){

    db.collection('comments').findOneAndUpdate(
      { username: comments.username },
       function (err, result) {
      if (err) {
        console.log(err);
      return res.sendStatus(500);
    }
    //console.log(result);
  });
  res.redirect('/');
});
